import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from './src/config/database.js';
import User from './src/models/User.js';

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

const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2
].filter(Boolean);

const allowedOrigins = configuredOrigins.length > 0
  ? configuredOrigins
  : ['http://localhost:3000'];

const isLocalhostOrigin = (origin) => /^http:\/\/localhost:\d+$/.test(origin);

const allowAllOrigins =
  process.env.CORS_ALLOW_ALL === 'true' ||
  (process.env.NODE_ENV === 'production' && configuredOrigins.length === 0);

const createTablesSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    product_interest TEXT DEFAULT 'Solar',
    budget REAL,
    status TEXT DEFAULT 'New',
    notes TEXT,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY,
    lead_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    action_type TEXT NOT NULL,
    previous_value TEXT,
    new_value TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
  CREATE INDEX IF NOT EXISTS idx_leads_created_by ON leads(created_by);
  CREATE INDEX IF NOT EXISTS idx_activity_logs_lead_id ON activity_logs(lead_id);
  CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
  CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp);
`;

const execSql = (sql) =>
  new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

const initializeDatabase = async () => {
  await execSql(createTablesSQL);

  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'test@evpower.com';
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'password123';
  const adminName = process.env.DEFAULT_ADMIN_NAME || 'Test User';

  const existing = await User.findByEmail(adminEmail);
  if (!existing) {
    await User.create(adminEmail, adminPassword, adminName);
    console.log(`✓ Bootstrap user created: ${adminEmail}`);
  }
};

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools and same-origin requests without Origin header
      if (!origin) return callback(null, true);

      // In local development, allow localhost on any port (3000/3001/3002/...)
      if (process.env.NODE_ENV !== 'production' && isLocalhostOrigin(origin)) {
        return callback(null, true);
      }

      if (allowAllOrigins || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

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
const frontendDistPath = path.join(__dirname, '../frontend/build');
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
const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 EV Power CRM Backend running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`API Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to initialize backend:', error);
    process.exit(1);
  }
};

startServer();
