import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/auth', authRoutes);
app.use('/cars', carRoutes);
app.use('/reservations', reservationRoutes);
app.use('/reviews', reviewRoutes);
app.use('/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
