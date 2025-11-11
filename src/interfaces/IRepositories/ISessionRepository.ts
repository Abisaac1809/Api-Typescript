import Session from "../../entities/Session.entity";
import { RefreshTokenPayloadType } from "../../schemas/authTokens";

export default interface ISessionRepository {
    createSession(dataOfTheSession: RefreshTokenPayloadType): Promise<void>;
    findSessionByToken(token: string): Promise<Session | undefined>;
    deleteSessionByJTI(token: string): Promise<void>;
}