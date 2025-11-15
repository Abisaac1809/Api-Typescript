import { Request, Response, NextFunction } from "express";
import { logger } from "../server";
import { ExternalError } from "../errors/ExternalErrors";
import { InternalServerError } from "../errors/internalServerErrors";

export default function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
    logger.error(error.toString());
    if (error instanceof ExternalError) {
        res
            .status(error.statusCode)
            .json({
                name: error.name,
                message: error.message
            })
    }
    else if (error instanceof InternalServerError) {
        res
            .status(error.statusCode)
            .json({
                name: "Internal Server Error",
                message: "An error has ocurred on the server. Try again Later"
            })
    }
    else {
        res
            .status(500)
            .json({
                name: "Internal Server Error",
                message: "An error has ocurred on the server. Try again Later"
            })
    }
}