const catchAsync = require("../utils/catchAsync")
const Auth = require('../models/auth')
const AppError = require("../utils/AppError")


exports.user = catchAsync(async (req, res, next) => {
    const user = await Auth.findById(req.userId).select("email").select("userName")
    if (!user) return next(new AppError('User not found'), 400)
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})