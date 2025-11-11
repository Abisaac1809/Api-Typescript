import { UserToCreateType, UserToLoginType } from "../../schemas/users.schemas";
import { RefreshTokenPayloadType } from "../../schemas/authTokens";
import PublicUser from "../../types/publicUser";

export default interface IAuthService {
    register(userToRegister: UserToCreateType): Promise<PublicUser>;
    login(userToLogin: UserToLoginType): Promise<PublicUser>;
    refreshAndGetNewAccessToken(refreshTokenPayload: RefreshTokenPayloadType): Promise<string>;
    getAccessToken(user: PublicUser): string,
    getRefreshToken(user: PublicUser): string
}