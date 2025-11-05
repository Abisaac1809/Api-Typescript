import { EnviromentalVariableNotImplemented } from "../errors/internalServerErrors";
import { UserAlreadyExists } from "../errors/conflictErrors";
import {Request, Response} from "express";
import IAuthService from "../interfaces/IAuthService";
import PublicUser from "../types/publicUser";
import jwt from "jsonwebtoken";

export default class AuthController {
    private authService: IAuthService;

    constructor(authService: IAuthService) {
        this.authService = authService;
    }

    register = async (req: Request, res: Response) => {
        if (!process.env.JWT_SECRET_KEY) {
            throw new EnviromentalVariableNotImplemented("JWT_SECRET_KEY was not implemented as a enviromental variable");
        }
    
        try {
            const newPublicUser:PublicUser = await this.authService.register(req.body);
            const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
            const token = jwt.sign(newPublicUser, JWT_SECRET_KEY, {expiresIn: "1h"});

            return res
                    .status(201)
                    .cookie("access_token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                        maxAge: 3600
                    })
                    .json({
                        message: "New user created", 
                        newUser: newPublicUser
                    });
        }
        catch (error) {
            return res
                    .status(500)
                    .json({
                        message: "Internal Server Error", 
                    });
        }
    }
}

