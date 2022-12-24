module.exports = ({ res, error }) => {
    let default_code = 500;
    let custom_code = undefined;
    if (error?.message) {
        custom_code = parseInt(error.message.slice(0,3))
    }
    
    if (isNaN(custom_code)) {
        res.status(default_code).json({
            success: false,
            message: error?.message ? (error.message) : error
        })
    } else {
        res.status(custom_code).json({
            success: false,
            message: error?.message ? error.message.slice(4) : error
        })
    }

    
}
