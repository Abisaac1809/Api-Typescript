import { User, UserLoginRequest } from "../../schemas/users.schemas";
import PublicUser from "../../types/publicUser";

export default interface IAuthService {
    register(userToRegister: User): Promise<PublicUser>;
    login(userToLogin: UserLoginRequest): Promise<PublicUser>;
}