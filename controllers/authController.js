const catchAsync = require('../utils/catchAsync');
const Auth = require('../models/auth');
const AppError = require('../utils/AppError');
const generateToken = require('../utils/token');
const jwt = require('jsonwebtoken');

exports.signUp = catchAsync(async (req, res, next) => {
    const { userName, email, password, confirmPassword } = req.body
    const auth = await Auth.findOne({ email })
    if (auth) return next(new AppError('Email already exists', 400))
    await Auth.create({
        userName,
        email,
        password,
        confirmPassword,
        accessToken: '',
        refreshAccessToken: ''
    })

    res.status(200).json({
        status: 'success',
        message: 'User registered successfully',
    })
})

exports.signIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) return next(new AppError('Invalid data', 400))
    const user = await Auth.findOne({ email })
    if (!user) return next(new AppError('User not found', 404))
    const isMatch = await user.comparePassord(password, user.password)
    if (!isMatch) return next(new AppError('Invalid credentials', 401))
    const accessToken = generateToken(user._id, process.env.ACCESSTOKEN_EXPIRESIN)
    // const refreshAccessToken = generateToken(user._id, process.env.REFRESHACCESSTOKEN_EXPIRESIN)
    // const data = await Auth.findByIdAndUpdate(user._id, { $set: { refreshAccessToken, accessToken } }, { new: true, runValidators: true }).select("-password")
    res.status(200).json({
        status: 'success',
        message: 'User logged in successfully',
        // data
        user
    })

})

exports.generateRefreshToken = catchAsync(async function (req, res, next) {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) token = req.headers.authorization.split(" ")[1]
    if (!token) return next(new AppError('Not authorized to access this route', 400))
    const verify = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const auth = await Auth.findById(verify.userId)
    if (auth.refreshAccessToken !== token) return next(new AppError('Your are not authorized to generte token', 400))
    const accessToken = generateToken(verify.userId, process.env.ACCESSTOKEN_EXPIRESIN)
    await Auth.findByIdAndUpdate(verify.userId, { $set: { accessToken } }, { new: true, runValidators: true })
    res.status(200).json({
        status: 'success',
        message: 'User logged in successfully',
        data: {
            accessToken
        }
    })
})