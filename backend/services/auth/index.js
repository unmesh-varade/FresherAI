import dotenv from "dotenv"
import express from "express";
import { connectDB } from "./configs/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config()

const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 6001;

app.get("/",(req,res)=>{
    res.send("Hello from Auth service");
})

app.use("/",authRouter)

app.listen(PORT, ()=>{
    console.log(`Auth service started on ${PORT}`);
    connectDB();
})