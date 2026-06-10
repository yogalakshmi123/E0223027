import express from 'express';
import { getUserNotifications } from '../controllers/notification.controller.js';

const router = express.Router();

// Route mapping for local frontend dashboard consumption
router.get('/', getUserNotifications);

export default router;
