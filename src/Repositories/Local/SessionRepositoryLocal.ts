import Session from "../../entities/Session.entity"
import ISessionRepository from "../../interfaces/IRepositories/ISessionRepository";
import { RefreshTokenPayloadType } from "../../schemas/authTokens";

export default class SessionRepositoryLocal implements ISessionRepository{
    private sessions: Session[];

    constructor() {
        this.sessions = [];
    };

    async createSession(dataOfTheSession: RefreshTokenPayloadType): Promise<void> {
        const newSession: Session = new Session(dataOfTheSession);
        this.sessions.push(newSession);
        return;
    };

    async findSessionByToken(jti: string): Promise<Session | undefined> {
        const session: (Session | undefined) = this.sessions.find((session)=>(jti === session.jti));
        return session
    };

    async deleteSessionByJTI(jti: string): Promise<void> {
        const index: number = this.sessions.findIndex((session) => (jti === session.jti));

        if (index === -1) {
            throw Error("El identificador del token no existe");
        }
        this.sessions.splice(index, 1);    
    };
}