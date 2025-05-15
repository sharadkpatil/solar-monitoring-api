// Filename: server.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "YOUR_MONGODB_ATLAS_URI";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Schema (Flexible)
const SolarLogSchema = new mongoose.Schema({}, { strict: false });
const SolarLog = mongoose.model("SolarLog", SolarLogSchema);

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// POST /api/log - Save incoming solar data
app.post("/api/log", async (req, res) => {
  try {
    const log = new SolarLog(req.body);
    await log.save();
    res.status(201).json({ message: "Data saved successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/logs - Retrieve all data
app.get("/api/logs", async (req, res) => {
  try {
    const logs = await SolarLog.find().sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// To deploy:
// 1. Add .env file with MONGO_URI=<your_atlas_connection_string>
// 2. Push to GitHub
// 3. Deploy using Render or Cyclic
// 4. Use endpoints /api/log (POST) and /api/logs (GET)
