import {config} from "dotenv";
import express from "express";
import cookieParser  from "cookie-parser";

import traceLogger from "./middlewares/traceLogger.middleware";
import authRouter from "./routes/auth.routes";
import ILogger from "./interfaces/IUtils/ILogger";
import ConsoleLogger from "./utils/loggers/ConsoleLogger";
import httpLogger from "./middlewares/httpLogger.middleware";
import errorHandler from "./middlewares/errorHandler.middleware";

config();
const PORT = process.env.PORT || 5000;

const app = express();
export const logger: ILogger = new ConsoleLogger();

app.use(express.json());
app.use(cookieParser());

app.use(traceLogger);
app.use(httpLogger);

app.use("/auth", authRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is listening on Port: ${PORT}`);
})