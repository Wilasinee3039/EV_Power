import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './src/routes/auth.js';
import leadsRoutes from './src/routes/leads.js';
import dashboardRoutes from './src/routes/dashboard.js';
import activityRoutes from './src/routes/activity.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EV Power CRM Backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/activity', activityRoutes);

// Serve frontend build files (supports both Vite: dist and CRA: build)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
const frontendBuildPath = path.join(__dirname, '../frontend/build');
const frontendStaticPath = fs.existsSync(frontendDistPath)
  ? frontendDistPath
  : fs.existsSync(frontendBuildPath)
  ? frontendBuildPath
  : null;

if (frontendStaticPath) {
  app.use(express.static(frontendStaticPath));
}

// For all non-API routes, return React index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }

  if (!frontendStaticPath) {
    return res.status(404).json({ error: 'Frontend build not found. Run frontend build first.' });
  }

  return res.sendFile(path.join(frontendStaticPath, 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 EV Power CRM Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`API Health Check: http://localhost:${PORT}/api/health`);
});
