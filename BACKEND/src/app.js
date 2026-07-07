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
// Add this line among your other app.use() declarations:
app.use("/temp", express.static("public/temp"));

app.use((err, req, res, next) => {
  // Log full error for server-side debugging
  console.error(err && (err.stack || err));

  // Determine status code from known error shapes
  let statusCode = err?.statusCode || err?.http_code || 500;

  // Multer file upload errors should return 400
  if (err && err.name === 'MulterError') statusCode = 400;

  const message = err?.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: err?.errors || []
  });
});

export default app;
