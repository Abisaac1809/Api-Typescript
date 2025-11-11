import { RefreshTokenPayloadType } from "../schemas/authTokens";

export default class Session {
    private _userId: string;
    private _jti: string;
    private _exp: number;

    constructor(dataOfTheSession: RefreshTokenPayloadType) {
        this._userId = dataOfTheSession.userId;
        this._jti = dataOfTheSession.jti;
        this._exp = dataOfTheSession.exp;
    }

    get userId(): string {
        return this._userId;
    }

    get exp(): number {
        return this._exp;
    }

    get jti(): string {
        return this._jti;
    }   
}