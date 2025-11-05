import { User } from "../schemas/UserCreation";
import PublicUser from "../types/publicUser";

export default interface IAuthService {
    register(user: User): Promise<PublicUser>;
}