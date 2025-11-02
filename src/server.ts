import {config} from "dotenv";
import express from "express";

config();
const PORT = process.env.PORT || 5000;

const app = express();

app.listen(PORT, () => console.log(`Server is listening on Port: ${PORT}`));
