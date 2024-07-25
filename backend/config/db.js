const mongoose = require("mongoose");
// Connecting to database


const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.log('error:', error);
        process.exit();
    }
};

module.exports = connectDB;

