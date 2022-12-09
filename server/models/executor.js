const pool = require('../config/config.js');

module.exports.queryExecute = ({ query, params, single }) => {
    return new Promise(async (resolve, reject) => {
        let connection = undefined;
        try {
            connection = await pool.promise().getConnection();
            rs = await connection.execute(query, params);
            pool.releaseConnection(connection);
            resolve(single ? rs[0][0] : rs[0]);
        } catch (err) {
            if (typeof connection !== "undefined") {
                pool.releaseConnection(connection);
            }
            reject(err);
        }
    });
};