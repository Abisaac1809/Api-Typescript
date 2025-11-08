import { Router } from "express"; 

import { UserToCreate, UserToLogin } from "../schemas/users.schemas";
import validateSchema from "../middlewares/validateSchema.middleware";
import UserRepositoryLocal from "../Repositories/UserRepositoryLocal";
import AuthService from "../services/auth.service";
import AuthController from "../controllers/auth.controller";
import { checkAuth } from "../middlewares/auth.middleware";
import IUserRepository from "../interfaces/IRepositories/IUserRepository";
import IAuthService from "../interfaces/IServices/IAuthService";


const authRouter = Router();

const userRepository: IUserRepository = new UserRepositoryLocal();
const authService: IAuthService = new AuthService(userRepository);
const authController: AuthController = new AuthController(authService);

authRouter.post("/register", validateSchema(UserToCreate), authController.register);
authRouter.post("/login", validateSchema(UserToLogin), authController.login);
authRouter.post("/logout", checkAuth, authController.logout);


export default authRouter;