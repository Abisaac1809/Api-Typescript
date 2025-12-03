import FailedLoginAttempts from "../../entities/FailedLoginAttempts.entity";

export default interface IFailedLoginAttemptsRepositoy {
    createFailedLoginAttempts(userId: string): Promise<FailedLoginAttempts>;
    findFailedLoginAttemptsByUserId(userId: string): Promise<FailedLoginAttempts | undefined>;
    save(failedAttempts: FailedLoginAttempts): Promise<void>; 
    deleteFailedLoginAttempts(userId: string): Promise<void>;
}