const { pool } = require('../config/config.js');

// universal query function: both types of connections acceptable
module.exports.execute = ({ connection, query, params, single}) => {
    // if outer connection isn't declared
    if (typeof connection === 'undefined') {
        return new Promise(async (resolve, reject) => {
            // let connection = undefined;
            try {
                let connection = await pool.promise().getConnection();
                let result = await connection.execute(query, params);
                // pool.releaseConnection(connection);
                connection.release();
                resolve(single ? result[0][0] : result[0]);
            } catch (error) {
                reject(new Error('Query cannot be executed'));
            };
        });
    }

    // otherwise
    return new Promise(async (resolve, reject) => {
        try {
            result = await connection.execute(query, params);
            resolve(single ? result[0][0] : result[0]);
        } catch (error) {
            reject(new Error('Query cannot be executed'));
        };
    });   
}

// call this function for queries which doesn't need external connection
module.exports.executeNoConnection = ({ query, params, single }) => {
    return new Promise(async (resolve, reject) => {
        try {
            let connection = await pool.promise().getConnection();
            result = await connection.execute(query, params);
            connection.release();
            resolve(single ? rs[0][0] : rs[0]);
        } catch (error) {
            console.error(error);
            reject(new Error('Query cannot be executed'));
        };
    });
};

// call this function for queries which do need external connection
// (e.g. transactions)
module.exports.executeConnection = ({ connection, query, params, single}) => {
    return new Promise(async (resolve, reject) => {
        try {
            result = await connection.execute(query, params);
            resolve(single ? result[0][0] : result[0]);
        } catch (error) {
            console.error(error);
            reject(new Error('Query cannot be executed'));
        };
    });
}

// module.exports.executeResulting = ({ query, params, single }) => {
//     return new Promise(async (resolve, reject) => {
//         let connection = undefined;
//         try {
//             connection = await pool.promise().getConnection();
//             rs = await connection.execute(query, params);
//             pool.releaseConnection(connection);
//             resolve(single ? rs[0][0] : rs[0]);
//         } catch (err) {
//             if (typeof connection !== "undefined") {
//                 pool.releaseConnection(connection);
//             }
//             reject(err);
//         }
//     });
// };
