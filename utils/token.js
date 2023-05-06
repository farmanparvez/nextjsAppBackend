const jwt = require('jsonwebtoken');
const token = (userId, expires) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: expires })
}
module.exports = token