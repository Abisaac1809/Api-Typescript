import { Request } from "express";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { MissingEnvironmentVariableError } from "../errors/internalServerErrors";
import { UnauthorizedRequestError } from "../errors/conflictErrors";

export class JWTParser {
    static getPayload(req: Request): (string | JwtPayload) {
        if ( !process.env.JWT_SECRET_KEY) {
            throw new MissingEnvironmentVariableError("JWT_SECRET_KEY was not implemented as a enviromental variable");
        }

        const token: string = req.cookies.access_token;
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

        if (!token){
            throw new UnauthorizedRequestError("Acceso Denegado");
        }

        try {
            const payload: (string | JwtPayload) = jwt.verify(token, JWT_SECRET_KEY);
            return payload;
        }
        catch (error) {
            if ((error instanceof JsonWebTokenError) || (error instanceof TokenExpiredError)) {
                throw new UnauthorizedRequestError("Acceso Denegado");
            }
            throw error;
        }
    }
}