const catchAsync = require('../utils/catchAsync');
const Auth = require('../models/auth');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');

const protect = catchAsync(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1];
    if (!token) return next(new AppError('Not authorized to access this route', 401))
    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY)
    const auth = await Auth.findById(decode.userId).select('accessToken')
    if (auth.accessToken !== token) return next(new AppError('unauthorized', 400))
    req.userId = decode.userId
    next()
})

module.exports = protect