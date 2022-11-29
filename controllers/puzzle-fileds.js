const empty = require("is-empty");



// required fields
exports.requiredFields = (data) => (req, res, next) => {
    if (req.body[data] && !empty(req.body[data]))
        next();
    else
        res.status(200).json({ error: 'Required field missing' });
}
