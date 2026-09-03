import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import resourceRoutes from './routes/resource.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim().replace(/^\[|\]\(.*\)$/g, '').replace(/\/$/, ''))
  : ['https://semexam.vercel.app', 'http://localhost:5173', 'http://localhost:3000'];

//make a cors function to check if there is no origin or it is in the allowedorigins, if not then return error. give them authority to access credentials like secret passwords, tokens etc.
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);


//middleware to put the incoming data into json format and prevent large and heavy unnecessary uploads by putitng 16kb limit
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
app.use("/temp", express.static("public/temp"));

app.use((err, req, res, next) => {
  console.error(err && (err.stack || err));

  let statusCode = err?.statusCode || err?.http_code || 500;

  if (err && err.name === 'MulterError') statusCode = 400;

  const message = err?.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: err?.errors || []
  });
});


export default app;
