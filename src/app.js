import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static("public"));


//import router

import userRouter from './routes/user.routes.js'


//routes

app.use("/users",userRouter);


export {app};