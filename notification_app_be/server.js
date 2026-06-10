import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Log } from './src/utils/logger.js';
import notificationRoutes from './src/routes/notification.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Global Logging Middleware
app.use((req, res, next) => {
    // FIXED: Changed package name from "api" to "middleware" to respect constraints
    Log("backend", "info", "middleware", `Incoming network call: ${req.method} ${req.url}`);
    next();
});

app.use('/api/notifications', notificationRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: "Online" });
});

app.listen(PORT, () => {
    console.log(`🚀 Express API listening on http://localhost:${PORT}`);
});
