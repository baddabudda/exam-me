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

// GET-request for getting all questions from list
module.exports.getAllQuestions_get = async (req, res) => {
    try {
        if (!await listModel.checkListAccess({ group_id: req.user.group_id, user_id: req.user.user_id, list_id: req.params.listid })) {
            throw new Error ("Access denied: no membership to view questions");
        }

        let questions = await questionModel.getAllQuestionsByListId({ list_id: req.params.listid });
        res.status(200).json(questions);
    } catch (error) {
        errorHandler({ res: res, code: 403, error: error.message });
    }
}

// GET-request for getting info about one specific question
module.exports.getQuestion_get = async (req, res) => {
    try {
        // check access to list
        if (!await listModel.checkListAccess({ group_id: req.user.group_id, user_id: req.user.user_id, list_id: req.params.listid })) {
            throw new Error ("Access denied: no membership to view question");
        }

        let question = await questionModel.getQuestionById({ question_id: req.params.questionid });
        if (!question) {
            throw new Error ("Couldn't get question: question doesn't belong to given list");
        }

        res.status(200).json(question);
    } catch (error) {
        errorHandler({ res: res, code: 500, error: error.message });
    }
}

// POST-request for creating question
module.exports.createQuestion_post = async (req, res) => {
    try {
        // check user access
        if (!await listModel.checkListAccess({ group_id: req.user.group_id, user_id: req.user.user_id, list_id: req.params.listid })) {
            throw new Error ("Access denied: no membership to view questions");
        }
        // check whether question with such order exists
        let orderCheck = await questionModel.checkOrder({
            listId: req.params.listid,
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
                    listId: req.params.listid,
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
                    listId: req.params.listid,
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
        errorHandler({ res: res, code: 500, error: error.message });
    };

    // if there were no error, redirect
    res.status(200).json();
}

// POST-request for editing question
module.exports.editQuestion_post = async (req, res) => {
    try {
        // check user access
        if (!await listModel.checkListAccess({ group_id: req.user.group_id, user_id: req.user.user_id, list_id: req.params.listid })) {
            throw new Error ("Access denied: no membership to view questions");
        }
        // check whether question with passed id exits in database
        let checkExistence = await questionModel.checkInDatabase({
            questId: req.params.questionid,
            listId: req.params.listid
        });
        if (!checkExistence){
            res.status(204).json({ success: true, message: 'Question with such id not found' });
            return;
        }

        // check whether question with such order exists
        let orderCheck = await questionModel.checkOrder({
            listId: req.params.listid,
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

        // try to establish connection + make transaction
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
                    questId: req.params.questionid
                });

                await questionModel.updateQuestion({
                    connection: connection,
                    questId: req.params.questionid,
                    date: date,
                    order: req.body.order,
                    title: req.body.title,
                    body: req.body.body
                });

                // place current question record to versioned
                await questionModel.createVersion({ 
                    connection: connection, 
                    date: date, 
                    listId: req.params.listid,
                    userId: req.user.id, 
                    questId: req.params.questionid, 
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
        errorHandler({ res: res, code: 500, message: error.message });
    };

    // if there were no errors, redirect
    res.status(200).json();
}

// DELETE-request for deleting question
module.exports.deleteQuestion_delete = async (req, res) => {
    try {
        // check user access
        if (!await listModel.checkListPrivilege({ group_id: req.user.group_id, user_id: req.user.user_id, list_id: req.params.listid })) {
            throw new Error ("Access denied: no membership to view questions");
        }
        // check whether requested record belongs to the list 
        let checkExistence = await questionModel.checkInDatabase({
            questId: req.params.questionid,
            listId: req.params.listid
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
                    questId: req.params.questionid
                });

                // mark record as deleted
                await questionModel.markDeleted({
                    connection: connection,
                    listId: req.params.listid,
                    questId: req.params.questionid
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
        errorHandler({ res: res, code: 500, message: error.message });
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
        if (ids.length !== await listModel.getListLengthById({listId: req.params.listid })){
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
                if (await questionModel.checkInDatabase({ questId: ids[i], listId: req.params.listid })){
                    await questionModel.updateOrder({
                        connection: connection,
                        listId: req.params.listid,
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
        errorHandler({ res: res, code: 500, error: error.message });
    }
}

// module.exports.showVersions_get = async (req, res) => {
//     try {
//         if (!await userModel.checkPrivilege({ group_id: req.body.group_id, user_id: req.user.user_id })) {
//             throw new Error ("Access denied: no privilege to preview versions");
//         }

//         let versions = await questionModel.getVersionsByQuestionId({ questId: req.params.questionid });
//         res.status(200).json(versions);
//     } catch (error) {
//         errorHandler({ res: res, code: 500, error: error.message });
//     }
// }