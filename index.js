const app = require('./app');
const dotEnv = require('dotenv')
dotEnv.config({ path:"./config.env"})
const connectDB  = require('./db/db')

const dbKey = process.env.DATABASE.replace("<password>", process.env.PASSWORD)

connectDB(dbKey)

const PORT = process.env.PORT || 8000
console.log(process.env.NODE_ENV)
app.listen(PORT, () => console.log(`app listening on ${PORT}`));