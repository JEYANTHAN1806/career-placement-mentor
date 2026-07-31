import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import skillGapRouter from './routes/skillGap.js';
import interviewRouter from './routes/interview.js';
import roadmapRouter from './routes/roadmap.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/skill-gap', skillGapRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/roadmap', roadmapRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CareerMentor AI Backend API',
    timestamp: new Date().toISOString()
  });
});

// Fallback error handler (ensures backend never crashes silently)
app.use((err, req, res, next) => {
  console.error('[Express Global Error Handler]:', err.stack || err);
  res.status(500).json({
    error: true,
    message: err.message || 'Internal Server Error'
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(` 🚀 CareerMentor AI Server running on port ${PORT}`);
  console.log(` 🌐 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use.`);
    console.error(`👉 Close the existing process using port ${PORT} or change PORT in server/.env\n`);
  } else {
    console.error('[Server Start Error]:', err);
  }
});

