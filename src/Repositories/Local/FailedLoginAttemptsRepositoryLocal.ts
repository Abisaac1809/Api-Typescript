import FailedLoginAttempts from "../../entities/FailedLoginAttempts.entity";
import IFailedLoginAttemptsRepositoy from "../../interfaces/IRepositories/IFailedLoginAttemptsRepository";

export default class FailedLoginAttemptsRepositoryLocal implements IFailedLoginAttemptsRepositoy {
    private failedLoginAttempts: FailedLoginAttempts[];

    constructor() {
        this.failedLoginAttempts = []
    }

    async createFailedLoginAttempts(userId: string): Promise<FailedLoginAttempts> {
        const newFailedLoginAttempt: FailedLoginAttempts = new FailedLoginAttempts(userId);
        this.failedLoginAttempts.push(newFailedLoginAttempt);
        return newFailedLoginAttempt;
    }

    async findFailedLoginAttemptsByUserId(userId: string): Promise<FailedLoginAttempts | undefined> {
        const failedLoginAttempt: (FailedLoginAttempts | undefined) = this.failedLoginAttempts.find((attempts)=> attempts.userId === userId);
        return failedLoginAttempt;
    }

    async save(failedAttempts: FailedLoginAttempts): Promise<void> {
        const indexOfAttempt: number = this.failedLoginAttempts.findIndex((attempt)=> attempt.userId === failedAttempts.userId);

        if (indexOfAttempt === -1) {
            throw Error("THe login attempt doesn't exist");
        }

        this.failedLoginAttempts[indexOfAttempt];
    }

    async deleteFailedLoginAttempts(userId: string): Promise<void> {
        const indexOfAttempt: number = this.failedLoginAttempts.findIndex((attempt)=> attempt.userId === userId);

        if (indexOfAttempt === -1) {
            throw Error("THe login attempt doesn't exist");
        }

        this.failedLoginAttempts.splice(indexOfAttempt, 1);
    }
}