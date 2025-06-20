import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import courseroute from './routes/course.route.js';
import userroute from './routes/user.route.js';
import adminroute from './routes/admin.route.js';
import orderroute from './routes/order.route.js';
import fileUpload from 'express-fileupload';
import {v2 as cloudinary} from 'cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
const port=process.env.PORT || 3000;
const app = express();
const dburl=process.env.mongo_url;

//cloudinary setup

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir: '/tmp/'
}));
app.use(cors({
  origin:process.env.frontend_url,
  credentials: true, // to handle cookieParser
  methods:["GET","POST","DELETE"]  ,// some status codes that will allow cross-origin requests
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
 //middleware to parse json request
app.use(express.json());
app.use(cookieParser());
try{
  await mongoose.connect(dburl); // time taking
   console.log("connected to mongodb");
}catch(error){
  console.log(error);
}
app.use("/api/v1/courses", courseroute);
app.use("/api/v1/user",userroute);
app.use("/api/v1/admin",adminroute);
app.use("/api/v1/conferm",orderroute);
// cors
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
