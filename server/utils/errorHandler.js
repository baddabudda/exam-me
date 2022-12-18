module.exports = (res, error) => {
    res.status(error.code).json({
            success: false,
            message: error.message ? error.message : error
        })}
