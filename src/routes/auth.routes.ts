import { Router } from "express"; 

import { UserSchema } from "../schemas/UserCreation";
import validateSchema from "../middlewares/validateSchema";
import UserRepositoryLocal from "../Repositories/UserRepositoryLocal";
import AuthService from "../services/auth.service";
import AuthController from "../controllers/auth.controller";


const authRouter = Router();

const userRepository = new UserRepositoryLocal();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

authRouter.post("/register", validateSchema(UserSchema), authController.register);

export default authRouter;