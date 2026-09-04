import 'dotenv/config';
import app from './app.js';
import connectDB from './db/index.js';

const PORT = process.env.PORT || 8000;

//mongoose connects the backend to the database then we call that function in index.js and it returns a promise so we put then so that when it gets resolved the app starts listening to the port, after database gets connected with mongosoe

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
