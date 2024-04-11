const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB connected : ${connection.connection.host}`.cyan.bold)
    } catch (error) {
        console.log(`Error : ${error.message}`.red.bold);
    }
}

module.exports = connectDB;