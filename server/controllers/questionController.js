// library dependencies
const { pool } = require('../config/config.js');
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

    if (isNaN(parseInt(contents.order))){
        errors.order = 'Enter correct value!';
        pass = false;
    }
    if (!contents.title) {
        errors.title = 'Enter question title!';
        pass = false;
    }
    if (!contents.body) {
        errors.body = 'Enter question body!';
        pass = false;
    }

    return { pass, errors };
}

// GET-request for getting all questions from list
module.exports.getAllQuestions_get = async (req, res) => {
    console.log(nen)
    try {
        if (!await listModel.checkListAccess({ group_id: req.user.group_id, user_id: req.user.user_id, list_id: req.params.list_id })) {
            throw new Error ("Access denied: no membership to view questions");
        }

        let questions = await questionModel.getAllQuestionsByListId({ list_id: req.params.list_id });
        res.status(200).json(questions);
    } catch (error) {
        errorHandler({ res: res, code: 403, error: error.message });
    }
}

// GET-request for getting all questions from public list
module.exports.getPublicQuestions_get = async (req, res) => {
    console.log('туть')
    try {
        console.log(parseInt(req.params.listid));
        if (!await listModel.checkPublic({ list_id: parseInt(req.params.listid) })) {
            throw new Error("List with such id not found or isn't public");
        }

        let questions = await questionModel.getAllQuestionsByListId({ list_id: parseInt(req.params.listid) });
        res.status(200).json(questions);
    } catch (error) {
        errorHandler({ res: res, code: 500, error: error.message });
    }
}

// GET-request for getting info about one specific question
module.exports.getQuestion_get = async (req, res) => {
    try {
        // check access to list
        if (!(await listModel.checkListAccess({ group_id: req.user.group_id, user_id: req.user.user_id, list_id: req.params.list_id }))) {
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
        const access = await listModel.checkListAccess({ group_id: req.user.group_id, user_id: req.user.user_id, list_id: req.body.list_id })
        if (!access) {
            throw new Error ("Access denied: no membership to view questions");
        }
        // check whether question with such order exists
        console.log(req.body.question_order)
        let orderCheck = await questionModel.checkOrder({
            listId: req.body.list_id,
            order: req.body.question_order
        });
        if (orderCheck && orderCheck.length) {
            res.status(204).json({ success: true, message: 'Question with such order already exists' });
            return;
        }
        // check contents of question: order, title, body whether they are not empty and order is number
        let content = checkContents({order: req.body.question_order, title: req.body.question_title , body: req.body.question_body});
        if (!content.pass) {
            res.status(204).json({ success: true, message: content.errors });
            return;
        }
        console.log('hi')
        let connection = undefined;

            try {
                console.log('hi')
                // get connection
                connection = await pool.promise().getConnection();
                // if we have connection, then make queries
                // set isolation level and begin transaction
                await connection.query("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
                await connection.beginTransaction();
                // console.log('hi')
                // lock tables: WRITE = only current connection can read & write data to (question, versioned) tables
                await connection.query("LOCK TABLES question WRITE, versioned WRITE");
                // console.log('hi')
                // make queries
                let timeElapsed = Date.now();
                let date = new Date(timeElapsed);
                console.log(date.toISOString().slice(0, 19).replace('T', ' '));
                // insert new row into question table
                console.log('hi')
                await questionModel.createQuestion({ 
                    connection: connection, 
                    listId: parseInt(req.body.list_id),
                    userId: req.user.user_id, 
                    date: date.toISOString().slice(0, 19).replace('T', ' '), 
                    order: req.body.question_order,
                    title: req.body.question_title, 
                    body: req.body.question_body 
                });
                console.log('hi')
                // get id of recently created question (for that connection)
                let [rows, fields] = await connection.query("SELECT last_insert_id()");
                let quest_id = Object.values(rows[0])[0];
                // insert new version into versioned table
                console.log('hi')
                await questionModel.createVersion({ 
                    connection: connection, 
                    date: date.toISOString().slice(0, 19).replace('T', ' '), 
                    listId: req.body.list_id,
                    userId: req.user.user_id, 
                    questId: quest_id, 
                    title: req.body.question_title, 
                    body: req.body.question_body
                });
                console.log('hi')
                // unlock tables after writing data
                await connection.query("UNLOCK TABLES");

                // the end of transaction: commit changes and release connection
                await connection.commit();
                console.log('hi')
                connection.release()
            } catch (error) {
                // cancel transaction results and release connection
                connection.rollback();
                console.error(error);
                connection.release()
                throw new Error('Cannot create new question');
            }
        res.status(200).json({status: 'OK', message: 'Question created'});
    } catch (error) {
        errorHandler({ res: res, code: 500, error: error.message });
    };

    // if there were no error, redirect
    res.status(200).json();
}

// POST-request for editing question
module.exports.editQuestion_put = async (req, res) => {
    try {
        // check user access
        if (!await listModel.checkListAccess({ group_id: req.user.group_id, user_id: req.user.user_id, list_id: req.params.list_id })) {
            throw new Error ("Access denied: no membership to view questions");
        }
        // check whether question with passed id exits in database
        let checkExistence = await questionModel.checkInDatabase({
            questId: req.params.questionid,
            listId: req.params.list_id
        });
        if (!checkExistence){
            res.status(204).json({ success: true, message: 'Question with such id not found' });
            return;
        }

        // check whether question with such order exists
        let orderCheck = await questionModel.checkOrder({
            listId: req.params.list_id,
            order: req.body.order
        });
        if (orderCheck && orderCheck.question_id !== parseInt(req.params.questionid)) {
            console.log('Question with such order already exists');
        }
        // if (orderCheck) {
        //     res.status(204).json({ success: true, message: 'Question with such order already exists' });
        //     return;
        // }

        // check contents of question: order, title, body whether they are not empty and order is number
        let checkContent = checkContents(req.body);
        if (!checkContent.pass) {
            res.status(204).json({ success: true, message: checkContent.errors });
            return;
        }

        // try to establish connection + make transaction
        let connection = undefined;

            try {
                // get connection
                connection = await pool.promise().getConnection();
                // if we have connection, then make queries
                // set isolation level and begin transaction
                await connection.query("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
                await connection.beginTransaction();

                // make queries
                let timeElapsed = Date.now();
                let date = new Date(timeElapsed);

                // lock record's editing for other connections in question table
                await questionModel.selectQuestionForUpdate({
                    connection: connection,
                    questId: req.params.questionid
                });

                await questionModel.updateQuestion({
                    connection: connection,
                    user_id: req.user.user_id,
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
                    userId: req.user.user_id, 
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
        if (!await listModel.checkListPrivilege({ group_id: req.user.group_id, user_id: req.user.user_id, list_id: req.params.list_id })) {
            throw new Error ("Access denied: no membership to view questions");
        }
        // check whether requested record belongs to the list 
        let checkExistence = await questionModel.checkInDatabase({
            questId: req.params.questionid,
            listId: req.params.list_id
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
                await connection.query("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
                await connection.beginTransaction();

                // lock record's editing for other connections in question table
                await questionModel.selectQuestionForUpdate({
                    connection: connection,
                    questId: req.params.questionid
                });

                // mark record as deleted
                await questionModel.markDeleted({
                    connection: connection,
                    listId: req.params.list_id,
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
        if (ids.length !== await listModel.getListLengthById({listId: req.params.list_id })){
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
                if (await questionModel.checkInDatabase({ questId: ids[i], listId: req.params.list_id })){
                    await questionModel.updateOrder({
                        connection: connection,
                        listId: req.params.list_id,
                        questId: ids[i],
                        order: newOrders[i]
                    });
                }
                throw new Error('Question with such id is not found');
            }

            await connection.query("UNLOCK TABLES");
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