const moogoose = require('mongoose');

const connectDB = async(key) => {
    try {
        const conn = await moogoose.connect(key)
        console.log(`mongodb connected----> ${conn.connection.host}`)
    } catch (error) {
        console.error(`Error ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDB