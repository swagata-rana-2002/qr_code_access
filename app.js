const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ✅ Fix CORS Issue
app.use(cors({
    origin: "http://localhost:63342", // Allow requests from WebStorm preview
    methods: "GET, POST",
    allowedHeaders: "Content-Type"
}));

app.use(express.json());

// ✅ Connect to MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/qr_database";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Define Schema & Model
const qrSchema = new mongoose.Schema({ status: String });
const QR = mongoose.model("QR", qrSchema);

// ✅ Initialize QR Code Status
async function initializeQR() {
    const existingQR = await QR.findOne();
    if (!existingQR) {
        await new QR({ status: "enabled" }).save();
        console.log("ℹ️ Initialized QR status in database.");
    }
}
initializeQR();

// ✅ API: Get QR Code Status
app.get('/status', async (req, res) => {
    try {
        const qr = await QR.findOne();
        res.json({ status: qr.status });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ API: Toggle QR Code Status
app.post('/toggle', async (req, res) => {
    try {
        const qr = await QR.findOne();
        qr.status = qr.status === "enabled" ? "disabled" : "enabled";
        await qr.save();
        res.json({ status: qr.status });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});




