import { Request, Response, NextFunction } from 'express';
import {v4 as uuidv4} from "uuid";

export default function traceLogger(req: Request, res: Response, next: NextFunction) {
    const traceId: string = uuidv4();
    res.locals.traceId = traceId;
    next();
}