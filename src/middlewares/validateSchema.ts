import {Request, Response, NextFunction} from "express";
import { ZodObject, ZodError, z } from "zod";

export const validateSchema = (schema: ZodObject) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req.body);
			next();
		}
		catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({ 
					message: "The data is invalid",
					detailsOfEachInvalidData: error.issues.map((error)=> {
						return {
							code: error.code,
							message: error.message,
							path: error.path
						}
					})
				})
			}
			next(error);
		}
	}
}