import { Router } from "express"; 

import { UserToCreate, UserToLogin } from "../schemas/users.schemas";
import validateSchema from "../middlewares/validateSchema.middleware";
import UserRepositoryLocal from "../Repositories/Local/UserRepositoryLocal";
import AuthService from "../services/auth.service";
import AuthController from "../controllers/auth.controller";
import { checkAuth } from "../middlewares/auth.middleware";
import IUserRepository from "../interfaces/IRepositories/IUserRepository";
import IAuthService from "../interfaces/IServices/IAuthService";
import ISessionRepository from "../interfaces/IRepositories/ISessionRepository";
import SessionRepositoryLocal from "../Repositories/Local/SessionRepositoryLocal";
import FailedLoginAttemptsRepositoryLocal from "../Repositories/Local/FailedLoginAttemptsRepositoryLocal";


const authRouter = Router();

const userRepository: IUserRepository = new UserRepositoryLocal();
const sessionRepository: ISessionRepository = new SessionRepositoryLocal();
const failedLoginAttemptsRepository = new FailedLoginAttemptsRepositoryLocal();
const authService: IAuthService = new AuthService(userRepository, sessionRepository, failedLoginAttemptsRepository);
const authController: AuthController = new AuthController(authService);

authRouter.post("/register", validateSchema(UserToCreate), authController.register);
authRouter.post("/login", validateSchema(UserToLogin), authController.login);
authRouter.post("/logout", checkAuth, authController.logout);
authRouter.post("/refresh-token", authController.refreshToken);


export default authRouter;