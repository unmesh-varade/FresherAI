import dotenv from "dotenv"
import express from "express";
import proxy from "express-http-proxy";

dotenv.config()

const app = express();

const PORT = process.env.PORT || 6000;

app.get("/",(req,res)=>{
    res.send("Hello from gateway");
})

app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL))

app.listen(PORT, ()=>{
    console.log(`Gateway started on ${PORT}`);
})