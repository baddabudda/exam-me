// library dependencies
const { pool } = require('../config/config.js');
// local dependencies
const questionModel = require('../models/questionModel.js');
const listModel = require('../models/listModel.js');
const userModel = require('../models/userModel.js');
const errorHandler = require('../utils/errorHandler.js');
const groupModel = require('../models/groupModel.js');

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
    try {
        let baseUrl = req.baseUrl.split('/')
        listid = baseUrl[baseUrl.length-1]
        if (!await listModel.checkListAccess({ group_id: req.user.group_id, user_id: req.user.user_id, list_id: listid  })) {
            throw new Error ("403 Access denied: no membership to view questions");
        }

        let questions = await questionModel.getAllQuestionsByListId({ list_id: listid  });
        res.status(200).json(questions);
    } catch (error) {
        errorHandler({ res: res, error: error });
    }
}

// GET-request for getting all questions from public list
module.exports.getPublicQuestions_get = async (req, res) => {
    try {
        if (!await listModel.checkPublic({ list_id: parseInt(req.params.listid) })) {
            throw new Error("406 List with such id not found or isn't public");
        }

        let questions = await questionModel.getAllQuestionsByListId({ list_id: parseInt(req.params.listid) });
        res.status(200).json(questions);
    } catch (error) {
        errorHandler({ res: res, error: error });
    }
}

// GET-request for getting info about one specific question
module.exports.getQuestion_get = async (req, res) => {
    try {
        let baseUrl = req.baseUrl.split('/')
        listid = baseUrl[baseUrl.length-1]
        
        // check access to list
        if (!(await listModel.checkListAccess({ group_id: req.user.group_id, user_id: req.user.user_id, list_id: listid }))) {
            throw new Error ("403 Access denied: no membership to view question");
        }
        
        let question = await questionModel.getQuestionById({ question_id: req.params.questionid, list_id: listid });
        if (!question) {
            throw new Error ("406 Couldn't get question: question doesn't belong to given list");
        }

        res.status(200).json(question);
    } catch (error) {
        errorHandler({ res: res, error: error });
    }
}

// POST-request for creating question
module.exports.createQuestion_post = async (req, res) => {
    try {
        console.log(req.body);
        const listOwner_id = await listModel.getListOwner({ list_id: req.body.list_id });
        // check is_closed
        if (listOwner_id.is_closed) {
            throw new Error("403 Access denied: group has been closed")
        }
        // check user access
        const access = await listModel.checkListAccess({ group_id: req.user.group_id, user_id: req.user.user_id, list_id: req.body.list_id })
        if (!access) {
            throw new Error ("Access denied: no membership to view questions");
        }
        // check user blacklist status
        let block_level = await userModel.checkInBlackList({ group_id: listOwner_id.group_id, user_id: req.user.user_id });
        if (block_level?.block_level === 1) {
            throw new Error ("403 Blacklist level 1: can't create question");
        }
        // check whether question with such order exists
        // console.log(req.body.question_order)
        // let orderCheck = await questionModel.checkOrder({
        //     listId: req.body.list_id,
        //     order: req.body.question_order
        // });
        // if (orderCheck && orderCheck.length) {
        //     res.status(204).json({ success: true, message: 'Question with such order already exists' });
        //     return;
        // }
        // check contents of question: order, title, body whether they are not empty and order is number
        let content = checkContents({order: req.body.question_order, title: req.body.question_title , body: req.body.question_body});
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

                await connection.query("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
                await connection.beginTransaction();
                await connection.query("LOCK TABLES question WRITE, versioned WRITE");

                // console.log('hi')
                // make queries
                let timeElapsed = Date.now();
                let date = new Date(timeElapsed);
                
                // insert new row into question table
                
                await questionModel.createQuestion({ 
                    connection: connection, 
                    listId: parseInt(req.body.list_id),
                    // userId: req.user.user_id, 
                    date: date.toISOString().slice(0, 19).replace('T', ' '), 
                    order: req.body.question_order,
                    title: req.body.question_title, 
                    body: req.body.question_body 
                });
                // get id of recently created question (for that connection)
                let [rows, fields] = await connection.query("SELECT last_insert_id()");
                let quest_id = Object.values(rows[0])[0];
                // insert new version into versioned table
                
                await questionModel.createVersion({ 
                    connection: connection, 
                    date: date.toISOString().slice(0, 19).replace('T', ' '), 
                    listId: req.body.list_id,
                    userId: req.user.user_id, 
                    questId: quest_id, 
                    title: req.body.question_title, 
                    body: req.body.question_body
                });
                
                // unlock tables after writing data
                await connection.query("UNLOCK TABLES");

                // the end of transaction: commit changes and release connection
                await connection.commit();
                
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
        const listOwner_id = await listModel.getListOwner({ list_id: req.body.list_id });
        // check is_closed
        if (listOwner_id.is_closed) {
            throw new Error("403 Access denied: group has been closed")
        }
        console.log({
            user_group_id: req.user.group_id,
            user_id: req.user.user_id,
            group_host_id: listOwner_id.group_id,
            list_id: req.body.list_id
        });
        // check user access
        let access = undefined;
        access = await questionModel.checkAccess({
            user_group_id: req.user.group_id,
            user_id: req.user.user_id,
            group_host_id: listOwner_id.group_id,
            list_id: req.body.list_id
        });
        if (!access) {
            throw new Error ("403 Access denied: no membership to edit question");
        }

        // check user blacklist status
        let block_level = await userModel.checkInBlackList({ group_id: listOwner_id.group_id, user_id: req.user.user_id });
        if (block_level && block_level.block_level === 1) {
            throw new Error ("403 Blacklist level 1: can't edit question");
        }
        // check whether question with passed id exits in database
        let checkExistence = await questionModel.checkInDatabase({
            
            questId: req.body.question_id,
            listId: req.body.list_id
        });
        if (!checkExistence){
            res.status(204).json({ success: true, message: 'Question with such id not found' });
            return;
        }
        console.log('nen');

        // check whether question with such order exists
        // let orderCheck = await questionModel.checkOrder({
        //     listId: req.body.list_id,
        //     order: req.body.question_order
        // });
        // if (orderCheck && orderCheck.question_id !== parseInt(req.body.question_id)) {
        //     console.log('Question with such order already exists');
        // }
        // if (orderCheck) {
        //     res.status(204).json({ success: true, message: 'Question with such order already exists' });
        //     return;
        // }

        // check contents of question: order, title, body whether they are not empty and order is number
        
        let checkContent = checkContents({order: req.body.question_order, title: req.body.question_title , body: req.body.question_body});
        if (!checkContent.pass) {
            res.status(204).json({ success: true, message: checkContent.errors });
            return;
        }
        console.log('nen');
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
                    questId: req.body.question_id
                });

                await questionModel.updateQuestion({
                    connection: connection,
                    // user_id: req.user.user_id,
                    questId: req.body.question_id,
                    date: date.toISOString().slice(0, 19).replace('T', ' '),
                    order: req.body.question_order,
                    title: req.body.question_title,
                    body: req.body.question_body
                });
                
                // place current question record to versioned
                await questionModel.createVersion({ 
                    connection: connection, 
                    date: date.toISOString().slice(0, 19).replace('T', ' '), 
                    listId: req.body.list_id,
                    userId: req.user.user_id, 
                    questId: req.params.questionid, 
                    title: req.body.question_title, 
                    body: req.body.question_body
                });
                // the end of transaction: commit changes and release connection
                await connection.commit();
                connection.release();
            } catch (error) {
                // cancel transaction results and release connection
                connection.rollback();
                console.error(error);
                connection.release();
                throw new Error('Cannot update question');
            }
        let question = await questionModel.getQuestionById({ question_id:  req.body.question_id, list_id: req.body.list_id});
        if (!question) {
            throw new Error ("Couldn't get question: question doesn't belong to given list");
        }
        res.status(200).json(question);

    } catch (error) {
        errorHandler({ res: res, code: 500, message: error.message });
    };
}

// DELETE-request for deleting question
module.exports.deleteQuestion_delete = async (req, res) => {
    try {
        const baseUrl=req.baseUrl.split('/')
        listid = parseInt( baseUrl[baseUrl.length-1])
       // check user access
        let checkListPrivilege = await listModel.checkListPrivilege({ group_id: req.user.group_id, user_id: req.user.user_id, list_id: listid });
        if (!checkListPrivilege) {
            throw new Error ("Access denied: no membership to view questions");
        }
        // check whether requested record belongs to the list 
        let checkExistence = await questionModel.checkInDatabase({
            questId: req.params.questionid,
            listId: listid
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
                    listId: listid,
                    questId: req.params.questionid
                })

                // the end of transaction: commit changes and release connection
                await connection.commit();
                pool.releaseConnection(connection);
                res.status(200).json();
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
        for(const order_ of req.body.orders) {
            if (newOrders.includes(order_.order) && ids.includes(order_.question_id)){
                pass = false;
                break;
            }
            ids.push(order_.question_id);
            newOrders.push(order_.order);
        }
        if (!pass){
            throw new Error('Reordering list contains repeating values');
        }
        // check if orders' length matches list's length
        let chec = await listModel.getListLengthById({listId: req.body.list_id })
        if (ids.length !== chec.length){
            throw new Error('Requested arrays size does not match lists size');
        }

        // if passed
        let connection = undefined;

        try {
            // get connection
            connection = await pool.promise().getConnection();
            // if we have connection, then make queries
            // set isolation level and begin transaction
            await connection.query("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
            await connection.beginTransaction();
            await connection.query("SELECT * FROM question FOR UPDATE");
            for(let i = 0; i < ids.length; i++){
                // check whether question with such id belongs to that list; if yes then update order
                let check =await questionModel.checkInDatabase({ questId: ids[i], listId: parseInt(req.body.list_id) });
                if (check.length){
                    await questionModel.updateOrder({
                        connection: connection,
                        listId: req.body.list_id,
                        questId: ids[i],
                        order: newOrders[i]
                    });
                }
                else{
                    throw new Error('Question with such id is not found');
                }
            }
            console.log('neen');

            // await connection.query("UNLOCK TABLES");
            // the end of transaction: commit changes and release connection {id: order, id: order, id: order}
            await connection.commit();
            connection.release();
            res.status(200).json();

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

module.exports.getVersions_get = async (req, res) => {
    try {
        // check whether question is not deleted
        let baseUrl = req.baseUrl.split('/')
        listid = baseUrl[baseUrl.length-1]
        
        // console.log(req.params.listid);
        if (!(await questionModel.checkInDatabase({ questId: req.params.questionid, listId: listid }))) {
            throw new Error ("500 Question not found");
        }
        console.log('checked in')
        // check admin privilege
        if (!(await listModel.checkListPrivilege({ group_id: req.user.group_id, user_id: req.user.user_id, list_id: listid }))) {
            throw new Error ("403 Access denied: no membership to view versions");
        }

        // if ok, then show
        let versions = await questionModel.getVersionsByQuestionId({ questId: req.params.questionid });
        res.status(200).json(versions);
    } catch (error) {
        errorHandler({ res: res, error: error});
    }
}

module.exports.chooseVersion_put = async (req, res) => {
    try {
        // check whether question is not deleted - ?
        if (!await questionModel.checkInDatabase({ questId: req.body.question_id, listId: req.body.list_id })) {
            throw new Error ("500 Question not found");
        }
        // check admin privilege
        if (!await listModel.checkListPrivilege({ group_id: req.user.group_id, user_id: req.user.user_id, list_id: req.body.list_id })) {
            throw new Error ("403 Access denied: no admin to view versions");
        }
        // check version id and check it in list
        if (!await questionModel.checkVersion({ list_id: req.body.list_id, question_id: req.body.question_id, version_id: req.body.version_id })) {
            throw new Error("500 Version either not found or doesn't belong to given list");
        }

        // if everything is ok, update: begin transaction
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
                    questId: req.body.question_id
                });

                // update row in question table
                await questionModel.updateFromVersion({
                    connection: connection,
                    edit_date: date.toISOString().slice(0, 19).replace('T', ' '),
                    version_id: req.body.version_id
                });

                // place current question record to versioned
                await questionModel.exportToVersion({
                    connection: connection,
                    question_id: req.body.question_id,
                    user_id: req.user.user_id
                });
                
                console.log('checkExistence')
                // the end of transaction: commit changes and release connection
                await connection.commit();
                connection.release();
                res.status(200).json({status: 'OK', message: 'New version has been chosen'});
            } catch (error) {
                // cancel transaction results and release connection
                connection.rollback();
                console.error(error);
                connection.release();
                throw new Error('500 Cannot update question');
            }
    } catch (error) {
        errorHandler({ res: res, error: error });
    }
}