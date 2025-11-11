import express from 'express';
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser';

import userRoute from './routes/user.route.js';
import messageRoute from './routes/message.route.js'
import {app, server} from './SocketiO/server.js'
// const app=express();
dotenv.config()

//middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
   origin:["http://localhost:5173","http://localhost:5174" ],
   credentials: true }));

const PORT=process.env.PORT || 5000;
const URI=process.env.MONGODB_URI

app.get('/',(req,res)=>{
    res.send("hlo welcome")
})

mongoose.connect(URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error(" MongoDB connection error:", error));

// routes define=====
app.use('/api/user',userRoute)
app.use("/api/message",messageRoute)


server.listen(PORT,()=>{
console.log(`Server is running on ${PORT}`);
})


