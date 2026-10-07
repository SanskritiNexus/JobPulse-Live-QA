const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const jobsRoutes = require('./routes/jobs');
const applicationsRoutes = require('./routes/applications');
const analyticsRoutes = require('./routes/analytics');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// API Routes
app.use('/api', jobsRoutes);
app.use('/api', applicationsRoutes);
app.use('/api', analyticsRoutes);

// Fallback route to serve index.html for SPA page loads
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'Endpoint not found.' });
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Global Error Handler
app.use(errorHandler);

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, () => {
  console.log(`====================================================`);
  console.log(`⚡ JobPulse Live Node.js Backend Server Running`);
  console.log(`🌐 Application URL : http://${HOST}:${PORT}`);
  console.log(`====================================================`);
});
