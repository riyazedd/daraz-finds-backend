const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
        });
        console.log('✅ MongoDB Connected:', conn.connection.host);
    } catch (err) {
        console.error('❌ Error connecting to MongoDB:', err.message);
        process.exit(1); // Exit process if connection fails
    }
};

module.exports = connectDB;
