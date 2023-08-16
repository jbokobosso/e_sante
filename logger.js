// This is a light weight middleware for logging

function log(request, response, next) {
    console.log("Logging...");
    next();
}

module.exports = log;