import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import userRoutes from './routes/users.routes';

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PORT;

app.listen(port, ()=> {
    console.log('Server is running...');
});

app.use('/users', userRoutes());