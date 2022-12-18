// library dependencies
const pool = require('../config/config.js');
// local dependencies
const questionModel = require('../models/questionModel.js');
const listModel = require('../models/listModel.js');
const userModel = require('../models/userModel.js');
const errorHandler = require('../utils/errorHandler.js');

// check contents from form
const checkContents = (contents) => {
    let errors = {
        order: undefined,
        title: undefined,
        body: undefined
    };
    let pass = true;

    if (isNan(parseInt(contents.order))){
        errors.order = 'Enter correct value!';
        pass = false;
    }
    if (!contents.title) {
        error.title = 'Enter question title!';
        pass = false;
    }
    if (!contents.body) {
        error.body = 'Enter question body!';
        pass = false;
    }

    return { pass, errors };
}

// GET-request for creating question
module.exports.createQuestion_get = (req, res) => {
    
}

// POST-request for creating question
module.exports.createQuestion_post = async (req, res) => {
    // various checks required I guess
    try {
        // check whether question with such order exists
        let orderCheck = await questionModel.checkOrder({
            listId: req.body.list_id,
            order: req.body.order
        });
        if (orderCheck) {
            res.status(204).json({ success: true, message: 'Question with such order already exists' });
            return;
        }
        // check contents of question: order, title, body whether they are not empty and order is number
        let content = checkContents(req.body);
        if (!content.pass) {
            res.status(204).json({ success: true, message: content.errors });
            return;
        }

        let connection = undefined;

            try {
                // get connection
                connection = await pool.promise().getConnection();
                // if we have connection, then make queries
                // set isolation level and begin transaction
                await connection.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
                await connection.beginTransaction();

                // lock tables: WRITE = only current connection can read & write data to (question, versioned) tables
                await connection.execute("LOCK TABLES question WRITE, versioned WRITE");

                // make queries
                let date = Date.now() / 1000;
                // insert new row into question table
                await questionModel.createQuestion({ 
                    connection: connection, 
                    listId: req.body.list_id,
                    userId: req.user.id, 
                    date: date, 
                    order: req.body.order,
                    title: req.body.title, 
                    body: req.body.body 
                });
                // get id of recently created question (for that connection)
                let quest_id = await connection.execute("SELECT LAST_INSERT_ID()");
                // insert new version into versioned table
                await questionModel.createVersion({ 
                    connection: connection, 
                    date: date, 
                    listId: req.body.list_id,
                    userId: req.user.id, 
                    questId: quest_id, 
                    title: req.body.title, 
                    body: req.body.body
                });
                // unlock tables after writing data
                await connection.execute("UNLOCK TABLES");

                // the end of transaction: commit changes and release connection
                await connection.commit();
                pool.releaseConnection(connection);
            } catch (error) {
                // cancel transaction results and release connection
                connection.rollback();
                console.error(error);
                pool.releaseConnection(connection);
                throw new Error('Cannot create new question');
            }
    } catch (error) {
        errorHandler(res, { message: error.message });
    };

    // if there were no error, redirect
    res.status(200).json();
}

// GET-request for editing question
module.exports.editQuestion_get = (req, res) => {

}

// POST-request for editing question
module.exports.editQuestion_post = async (req, res) => {
    try {
        // check whether question with passed id exits in database
        let checkExistence = await questionModel.checkInDatabase({
            questId: req.body.question_id,
            listId: req.body.list_id
        });
        if (!checkExistence){
            res.status(204).json({ success: true, message: 'Question with such id not found' });
            return;
        }

        // check whether question with such order exists
        let orderCheck = await questionModel.checkOrder({
            listId: req.body.list_id,
            order: req.body.order
        });
        if (orderCheck) {
            res.status(204).json({ success: true, message: 'Question with such order already exists' });
            return;
        }

        // check contents of question: order, title, body whether they are not empty and order is number
        let checkContents = checkContents(req.body);
        if (!checkContents.pass) {
            res.status(204).json({ success: true, message: checkContents.errors });
            return;
        }

        // try to establish connection + make tran
        let connection = undefined;

            try {
                // get connection
                connection = await pool.promise().getConnection();
                // if we have connection, then make queries
                // set isolation level and begin transaction
                await connection.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
                await connection.beginTransaction();

                // make queries
                let date = Date.now() / 1000;

                // lock record's editing for other connections in question table
                await questionModel.selectQuestionForUpdate({
                    connection: connection,
                    questId: req.body.question_id
                });

                await questionModel.updateQuestion({
                    connection: connection,
                    questId: req.body.question_id,
                    date: date,
                    order: req.body.order,
                    title: req.body.title,
                    body: req.body.body
                });

                // place current question record to versioned
                await questionModel.createVersion({ 
                    connection: connection, 
                    date: date, 
                    listId: req.body.list_id,
                    userId: req.user.id, 
                    questId: req.body.question_id, 
                    title: req.body.title, 
                    body: req.body.body
                });

                // the end of transaction: commit changes and release connection
                await connection.commit();
                pool.releaseConnection(connection);
            } catch (error) {
                // cancel transaction results and release connection
                connection.rollback();
                console.error(error);
                pool.releaseConnection(connection);
                throw new Error('Cannot update question');
            }
    } catch (error) {
        errorHandler(res, { message: error.message });
    };

    // if there were no errors, redirect
    res.status(200).json();
}

// DELETE-request for deleting question
module.exports.deleteQuestion_delete = async (req, res) => {
    try {
        // check whether requested record belongs to the list 
        let checkExistence = await questionModel.checkInDatabase({
            questId: req.body.question_id,
            listId: req.body.list_id
        });
        if (!checkExistence){
            res.status(204).json({ success: true, message: 'Question with such id not found' });
            return;
        }

        // start transaction, because according to db structure no question records can be deleted
        let connection = undefined;

            try {
                // get connection
                connection = await pool.promise().getConnection();
                // if we have connection, then make queries
                // set isolation level and begin transaction
                await connection.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
                await connection.beginTransaction();

                // lock record's editing for other connections in question table
                await questionModel.selectQuestionForUpdate({
                    connection: connection,
                    questId: req.body.question_id
                });

                // mark record as deleted
                await questionModel.markDeleted({
                    connection: connection,
                    listId: req.body.list_id,
                    questId: req.body.question_id
                })

                // the end of transaction: commit changes and release connection
                await connection.commit();
                pool.releaseConnection(connection);
            } catch (error) {
                // cancel transaction results and release connection
                connection.rollback();
                console.error(error);
                pool.releaseConnection(connection);
                throw new Error('Cannot delete question');
            }
    } catch (error) {
        errorHandler(res, { message: error.message });
    }
}

// GET-request for editing order?..
// POST-request for editing question order
// напротив каждого вопроса в списке появляется окошечко, в котором можно поменять номер; потом отсылается запрос, который мы обрабатываем
module.exports.changeOrder_post = async (req, res) => {
    try{
        // check incoming object of reordering - body: {list_id: list_id, orders: {question_id: id, order: new order value} }
        let ids = [];
        let newOrders = [];
        let pass = true;
        // check id and order: each id in orders should be unique, same as order value
        for(const [id, order] of Object.entries(req.body.orders)) {
            if (newOrders.includes(order) && ids.includes(id)){
                pass = false;
                break;
            }
            ids.push(id);
            newOrders.push(order);
        }
        if (!pass){
            throw new Error('Reordering list contains repeating values');
        }
        // check if orders' length matches list's length
        if (ids.length !== await listModel.getListLengthById({listId: req.body.list_id })){
            throw new Error('Requested arrays size does not match lists size');
        }

        // if passed
        let connection = undefined;

        try {
            // get connection
            connection = await pool.promise().getConnection();
            // if we have connection, then make queries
            // set isolation level and begin transaction
            await connection.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            await connection.beginTransaction();
            await connection.execute("LOCK TABLES question WRITE");

            for(let i = 0; i < id.length; i++){
                // check whether question with such id belongs to that list; if yes then update order
                if (await questionModel.checkInDatabase({ questId: ids[i], listId: req.body.list_id })){
                    await questionModel.updateOrder({
                        connection: connection,
                        listId: req.body.list_id,
                        questId: ids[i],
                        order: newOrders[i]
                    });
                }
                throw new Error('Question with such id is not found');
            }

            await connection.execute("UNLOCK TABLES");
            // the end of transaction: commit changes and release connection {id: order, id: order, id: order}
            await connection.commit();
            pool.releaseConnection(connection);
        } catch (error) {
            // cancel transaction results and release connection
            connection.rollback();
            console.error(error);
            pool.releaseConnection(connection);
            throw new Error('Cannot update question order');
        }
    } catch (error) {
        errorHandler(res, { message: error.message });
    }
}

module.exports.showVersions_get = async (req, res) => {
    try {
        if (!await userModel.checkPrivilege({ user_id: req.user.user_id })) {
            throw new Error ("Access denied: no privilege to preview versions");
        }

        let versions = await questionModel.getVersionsByQuestionId({ questId: req.body.question_id });
        res.status(200).json(versions);
    } catch (error) {
        errorHandler({ res: res, code: 500, error: error.message });
    }
}

// check whether question with a given order is present in the list
// const isOccupied = async(res, req) => {
//     try {
//         let orderCheck = await question.checkOrder(req.body.list_id, req.body.order);

//         if (orderCheck) {
//             return true;
//         }
//     } catch (error) {
//         console.error(error);
//         throw new Error('Cannot check order');
//     };
    
//     return false;
// }