import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import resourceRoutes from './routes/resource.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true
  })
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'College Resource Hub API is running'
  });
});

app.use('/api/v1/resources', resourceRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || []
  });
});

export default app;
