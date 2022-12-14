const question = require('../models/questionModel.js');
const errorHandler = require('../utils/errorHandler.js');
const pool = require('../config/config.js');

// check whether question with a given order is present in the list
const isOccupied = async(res, req) => {
    try {
        let orderCheck = await question.checkOrder(req.body.list_id, req.body.order);

        if (orderCheck) {
            return true;
        }
    } catch (error) {
        console.error(error);
        throw new Error('Cannot check order');
    };
    
    return false;
}

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

    return {pass, errors};
}

// check whether client has such permission or not
// if OK, show him page for creating
// otherwise throw error
module.exports.createQuestion_get = (req, res) => {
    
}

// after filling form working with post query
module.exports.createQuestion_post = async (req, res) => {
    // various checks required I guess
    try {
        // check whether question with such order exists
        let orderCheck = await question.checkOrder({
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
                await question.createQuestion({ 
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
                await question.createVersion({ 
                    connection: connection, 
                    date: date, 
                    listId: req.body.list_id,
                    userId: req.user.id, 
                    questId: quest_id, 
                    title: req.body.title, 
                    body: req.body.body});
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
        errorHandler(res, { message: error });
    };

    // if there were no error, redirect
    res.status(200).json();
};

// check whether client has such permission or not
// if OK, show him page for creating
// otherwise throw error
module.exports.editQuestion_get = (req, res) => {

};

module.exports.editQuestion_post = async (req, res) => {
    // must check whether we have such question in database
    // if yes, then we copying data to versioned + edit existing item
    try {
        // check whether 
        // check whether question with such order exists
        let orderCheck = await question.checkOrder({
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
                await question.createQuestion({ 
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
                await question.createVersion({ 
                    connection: connection, 
                    date: date, 
                    listId: req.body.list_id,
                    userId: req.user.id, 
                    questId: quest_id, 
                    title: req.body.title, 
                    body: req.body.body});
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
        errorHandler(res, { message: error });
    };

    // if there were no error, redirect
    res.status(200).json();
};
