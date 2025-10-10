import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';
import productsRoutes from './routes/productsRoutes.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
const app = express();
const PORT = process.env.PORT ?? 3030;

app.use(logger);
app.use(
  express.json({
    type: ['application/json', 'application/vnd.api+json'],
    limit: '100kb',
  }),
);
app.use(cors());

app.use(cookieParser());

app.use(authRoutes);
app.use(productsRoutes);
app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
