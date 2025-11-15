import {Request, Response, RequestHandler } from "express"; 
import morgan, { TokenIndexer } from "morgan";
import { logger } from "../server";

// traceID custom type
morgan.token("traceId", (req:Request, res: Response): string => {
    return res.locals.traceId;
})

const httpLogger: RequestHandler = morgan(
        function (tokens: TokenIndexer<Request, Response>, req: Request, res: Response) {
            return JSON.stringify({
                method: tokens.method?.(req, res),
                url: tokens.url?.(req, res),
                status: tokens.status?.(req, res),
                content_length: tokens.res?.(req, res, "content-lenght"),
                response_time: tokens["response-time"]?.(req, res) || "",
                traceId: tokens.traceId?.(req, res)
            });
    }, {
        stream: {
            write: (message: string) => {
                const data = JSON.parse(message);
                logger.info(`incoming-request`, data);
            }
        }
    }
);

export default httpLogger;
