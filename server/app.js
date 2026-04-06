require("dotenv").config({ override: true });
const express = require('express');
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
require('dotenv').config({ override: true });

const atsRoutes = require('./routes/atsRoutes');

const app = express();

app.set('trust proxy', 1); // Required for deployment on Render
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use('/api/ats', atsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/resume", resumeRoutes);
app.get('/', (req, res) => {
    res.send("AI Resume Builder Backend Running 🚀");
});

module.exports = app;
