require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');
const jobsRouter = require('./routes/jobs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (req, res) => {
  res.send('Resume Screener Backend Running ');
});
app.use('/api/jobs', jobsRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const start = async () => {
  await initDB();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

start();
