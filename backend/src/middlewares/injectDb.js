const {db} = require('../database/db');

module.exports = (req, res, next) => {
    req.db = db;
    next();
}

module.exports.db = db;