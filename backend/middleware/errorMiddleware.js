const constants = {
    VALIDATION_ERROR: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
}

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({ title: 'Validation failed', message: err.message });
            break;
        case constants.UNAUTHORIZED:
            res.json({ title: 'Un authorized', message: err.message });
            break;
        case constants.FORBIDDEN:
            res.json({ title: 'Forbidden', message: err.message });
            break;
        case constants.NOT_FOUND:
            res.json({ title: 'Not found', message: err.message });
            break;
        case constants.SERVER_ERROR:
            res.json({ title: 'Server error', message: err.message });
            break;
        default:
            console.log("No error all good");
            break
    }
}

module.exports = errorHandler;