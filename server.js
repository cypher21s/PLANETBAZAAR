import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js'
import mongoose from 'mongoose';
import cors from "cors";
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import path from 'path'
import {fileURLToPath} from  'url';


// configure env
dotenv.config();
// databse config
connectDB();
// esfix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// rest object
const app = express()

// middleware
app.use(cors({
    origin: 'http://localhost:3000'  // Make sure this matches your frontend URL
}));

app.use(morgan('dev'))
app.use(express.json())
app.use(express.static(path.join(__dirname,'./client/build')))
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);



// PORT
const PORT = process.env.PORT || 8080;

// run listen
app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`.bgGreen.bgWhite)
    // console.log('Connected to database:', mongoose.connection.db.databaseName);

})
