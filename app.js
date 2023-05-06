const express = require('express');
const AppError = require('./utils/AppError')
const globalErrorControler = require('./controllers/globalErrorController')
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();
const cors = require('cors')

const corsOption = {
    origin: ['http://localhost:3000'],
};

app.use(cors())
app.options('*', cors())
app.use(express.json())
app.get('/', (req, res) => res.status(200).json({
    working: 'working'
}))

app.use('/api', authRouter)
app.use('/api', userRouter)
app.use("*", (req, _, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`, 400));
})
app.use(globalErrorControler)

module.exports = app