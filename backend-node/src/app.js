import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}));

app.use(express.json({limit : "16kb"}))
app.use(urlencoded({limit : "16kb" , extended : true}))
app.use(express.static("public"));
app.use(cookieParser())

app.use("/test" , (req , res) => {
    return res.status(200).json({
        message : "Hello World"
    })
})

//Routers
import userRouter from "./routes/user.route.js";

//Routes
app.use("/api/v1/user" , userRouter)

export {app};