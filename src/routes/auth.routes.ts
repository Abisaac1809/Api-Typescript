import { Router } from "express"; 
import { authController } from "../controllers/auth.controller";
import { validateSchema } from "../middlewares/validateSchema";
import { UserSchema } from "../schemas/UserCreation";

const authRouter = Router();

authRouter.post("/register", validateSchema(UserSchema), authController.register);

export default authRouter;