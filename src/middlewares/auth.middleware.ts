import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { MissingEnvironmentVariableError } from "../errors/internalServerErrors";
import { UnauthorizedRequestError } from "../errors/conflictErrors";

export function checkAuth(req: Request, res: Response, next: NextFunction) {
    if (!process.env.JWT_SECRET_KEY) {
        throw new MissingEnvironmentVariableError("JWT_SECRET_KEY was not implemented as a enviromental variable");
    }

    const token: string = req.cookies.access_token;
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

    if (!token) {
        return res
            .status(401)
            .json({
                message: "Acceso Denegado"
            });
    }

    try {
        jwt.verify(token, JWT_SECRET_KEY);
        next();
    }
    catch (error) {
        if ((error instanceof JsonWebTokenError) || (error instanceof TokenExpiredError)) {
            res
            .status(401)
            .json({
                message: "Acceso Denegado"
            });
        }
    }
}