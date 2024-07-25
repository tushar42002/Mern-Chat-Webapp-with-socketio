const mongoose = require("mongoose");
// Connecting to database


const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
    } catch (error) {
        process.exit();
    }
};

module.exports = connectDB;

