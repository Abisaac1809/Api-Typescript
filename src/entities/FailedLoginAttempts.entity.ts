export default class FailedLoginAttempts {
    private readonly _userId: string;
    public failedAttepmts: number;
    public lockedUntilMs: number;

    constructor(userId: string) {
        this._userId = userId
        this.failedAttepmts = 0;
        this.lockedUntilMs = 0;
    }

    get userId(): string {
        return this._userId;
    }
}