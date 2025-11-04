import {config} from "dotenv";
import express from "express";
import authRouter from "./routes/auth.routes";

config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on Port: ${PORT}`);
})