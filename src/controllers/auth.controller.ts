import {Request, Response} from "express";
import AuthService from "../services/auth.service";
import { UserRepositoryLocal } from "../Repositories/UserRepositoryLocal";
import { PublicUser } from "../types/publicUser";

const userRepository = new UserRepositoryLocal();
const authService = new AuthService(userRepository);

async function register (req: Request, res: Response) {
    try {
        const newPublicUser:PublicUser = await authService.register(req.body);
        return res.status(201).json({message: "User created successfully", newUser: newPublicUser});
    }
    catch (error) {
        return res.status(500).json({message: "Internal Server Error", error: error instanceof Error ? error.message : error});
    }
}

export const authController = {
    "register" : register
}
