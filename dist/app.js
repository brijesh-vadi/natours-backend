import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import pool from './db/postgres-pool';
import tourRouter from './routes/tourRoute';
import userRouter from './routes/userRoute';
dotenv.config();
export const app = express();
// MIDDLEWARES
if (process.env.MODE === 'DEVELOPMENT') {
    app.use(morgan('dev'));
}
app.use(express.json());
app.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM tours');
    console.log(result.rows);
});
// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
