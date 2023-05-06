const jwt = require('jsonwebtoken');
const generateToken = (userId, expires) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: expires })
}
module.exports = generateToken