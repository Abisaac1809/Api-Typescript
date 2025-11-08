import {Request, Response} from "express";

import IAuthService from "../interfaces/IServices/IAuthService";
import PublicUser from "../types/publicUser";

import { InvalidCredentialsError, UserAlreadyExistsError } from "../errors/conflictErrors";
import { JWTParser } from "../utils/jwtParser";

export default class AuthController {
    private authService: IAuthService;

    constructor(authService: IAuthService) {
        this.authService = authService;
    }

    register = async (req: Request, res: Response) => {
        try {
            const newPublicUser: PublicUser = await this.authService.register(req.body);
            const accessToken: string = this.authService.getAccessToken(newPublicUser);
            const refeshToken: string = this.authService.getRefreshToken(newPublicUser);

            return res
                    .status(201)
                    .cookie("access_token", accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                        maxAge: 3600
                    })
                    .cookie("refresh_token", refeshToken, {
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
            if (error instanceof UserAlreadyExistsError) {
                return res
                        .status(409)
                        .json({
                            message: error.message
                        });
            }
            return res
                    .status(500)
                    .json({
                        message: "Internal Server Error", 
                    });
        }
    }

    login = async (req: Request, res: Response) => {        
        try {
            const publicUser: PublicUser = await this.authService.login(req.body);
            const accessToken: string = this.authService.getAccessToken(publicUser);
            const refeshToken: string = this.authService.getRefreshToken(publicUser);

            return res
                    .status(200)
                    .cookie("access_token", accessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                        maxAge: 3600
                    })
                    .cookie("refresh_token", refeshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                        maxAge: 3600
                    })
                    .json({
                        message: "OK", 
                        user: publicUser
                    });
        }
        catch (error) {
            if (error instanceof InvalidCredentialsError) {
                return res
                        .status(error.statusCode)
                        .json({
                            message: error.message
                        });
            }
            return res
                    .status(500)
                    .json({
                        message: "Internal Server Error", 
                    });
        }
    }    

    logout = async (req: Request, res: Response) => {
        res
            .clearCookie("access_token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 3600
            })
            .status(204)
            .end();
    };
}

