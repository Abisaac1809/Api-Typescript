import { RefreshTokenPayloadType } from "../schemas/authTokens";

export default class Session {
    private _userId: string;
    private _jti: string;

    constructor(dataOfTheSession: RefreshTokenPayloadType) {
        this._userId = dataOfTheSession.userId;
        this._jti = dataOfTheSession.jti;
    }

    get userId(): string {
        return this._userId;
    }

    get jti(): string {
        return this._jti;
    }   
}