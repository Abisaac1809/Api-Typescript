import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

import IAuthService from "../interfaces/IServices/IAuthService";
import PublicUser from "../types/publicUser";

import { InvalidCredentialsError, UserAlreadyExistsError } from "../errors/ExternalErrors";
import { MissingEnvironmentVariableError } from "../errors/internalServerErrors";
import { RefreshTokenPayload, RefreshTokenPayloadType } from "../schemas/authTokens";

export default class AuthController {
    private authService: IAuthService;

    constructor(authService: IAuthService) {
        this.authService = authService;
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let response: Response = res;

            // Clear previous session cookies if user is already logged in
            if (this.userIsAlreadyLogged(req)) {
                response = await this.getResponseWithoutSessionCookies(res);
            }

            const newPublicUser: PublicUser = await this.authService.register(req.body);
            const accessToken: string = this.authService.getAccessToken(newPublicUser);
            const refeshToken: string = this.authService.getRefreshToken(newPublicUser);
            const responseWithSessionCookies: Response = await this.getResponseWithSessionCookies(response, accessToken, refeshToken);

            return responseWithSessionCookies
                    .status(201)
                    .json({
                        message: "New user created", 
                        newUser: newPublicUser
                    });
        }
        catch (error) {
            next(error);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction) => {        
        try {
            let response: Response = res;

            // Clear previous session cookies if user is already logged in
            if (this.userIsAlreadyLogged(req)) {
                response = await this.getResponseWithoutSessionCookies(res);
            }

            const publicUser: PublicUser = await this.authService.login(req.body);
            const accessToken: string = this.authService.getAccessToken(publicUser);
            const refeshToken: string = this.authService.getRefreshToken(publicUser);
            const responseWithSessionCookies: Response = await this.getResponseWithSessionCookies(response, accessToken, refeshToken);

            return responseWithSessionCookies
                    .status(200)
                    .json({
                        message: "OK", 
                        user: publicUser
                    });
        }
        catch (error) {
            next(error);
        }
    }    

    private userIsAlreadyLogged = (req: Request): boolean => {
        const token: string = req.cookies.access_token;
        return !!token;
    }

    logout = async (req: Request, res: Response) => {
        const responseWithoutCookies: Response = await this.getResponseWithoutSessionCookies(res);
        return responseWithoutCookies
                .status(200)
                .json({
                    message: "Logged out successfully"
                });
    };

    private getResponseWithSessionCookies = async (res: Response, accessToken: string, refeshToken: string): Promise<Response> => {
        return res
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
                maxAge: 604800
            })
    }


    private getResponseWithoutSessionCookies = async (res: Response): Promise<Response> => {
        return res
            .clearCookie("access_token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 3600
            })
            .clearCookie("refresh_token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 604800
            });
    }

    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        if (!process.env.JWT_SECRET_KEY) {
            throw new MissingEnvironmentVariableError("JWT_SECRET_KEY was not implemented as a enviromental variable");            
        }

        const token = req.cookies.refresh_token;
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

        if (!token) {
            return res
                .status(401)
                .json({
                    message: "Acceso Denegado"
                })
        }

        try {
            const payload: (string | JwtPayload)  = jwt.verify(token, JWT_SECRET_KEY);
            const refreshTokenPayload: RefreshTokenPayloadType = RefreshTokenPayload.parse(payload);
            const newAccessToken: string = await this.authService.refreshAndGetNewAccessToken(refreshTokenPayload);
            return res
                    .status(200)
                    .cookie("access_token", newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                        maxAge: 3600
                    })
                    .end();
        }
        catch (error) {
            next(error);
        }
    }
}