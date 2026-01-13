const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Healify_db');
        console.log('MongoDB connected');    
    } catch (err) {
        console.error('Database connection error : ', err);
        process.exit(1);
    }
};

module.exports = connectToDatabase;
