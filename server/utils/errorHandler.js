module.exports = ({ res, code, error }) => {
    res.status(code).json({
        success: false,
        message: error.message ? error.message : error
    })
}