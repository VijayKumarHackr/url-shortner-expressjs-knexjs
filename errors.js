const createError = require('create-error');

module.exports = {
    NotFoundError: createError("NotFoundError", {
        httpStatusCode: 404
    })
}
