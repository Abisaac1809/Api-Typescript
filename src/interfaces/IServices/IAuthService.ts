import { UserToCreateType, UserToLoginType } from "../../schemas/users.schemas";
import PublicUser from "../../types/publicUser";

export default interface IAuthService {
    register(userToRegister: UserToCreateType): Promise<PublicUser>;
    login(userToLogin: UserToLoginType): Promise<PublicUser>;
    getAccessToken(user: PublicUser): string,
    getRefreshToken(user: PublicUser): string
}