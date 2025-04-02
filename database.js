const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables

const mongoURI = process.env.MONGO_URI;  // Get MongoDB URL from .env

if (!mongoURI) {
    console.error("❌ Error: MONGO_URI is missing in .env file!");
    process.exit(1);
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

