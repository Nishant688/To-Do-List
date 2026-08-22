import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectDB } from './src/config/db.js';

connectDB().catch((err) => {
  console.warn(`[Database Warning] Could not connect to MongoDB on startup: ${err.message}`);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[TaskFlow API] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Error] ${err.message}`);
  server.close(() => process.exit(1));
});
