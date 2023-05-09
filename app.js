const express = require('express');
const cors = require('cors')
const AppError = require('./utils/AppError')
const globalErrorControler = require('./controllers/globalErrorController')
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

const corsOptions = {
    credentials: true,
    origin: "http://localhost:3000", // Add your frontend origin here (Don't add '/' at the end)
    optionsSuccessStatus: 200,
};


app.use(cors())
app.use("*", cors(corsOptions)); // npm i cors
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