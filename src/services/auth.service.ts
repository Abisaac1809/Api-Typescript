import { hash, compare } from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import jwt from "jsonwebtoken";

import { User } from "../entities/User.entity";
import { UserType, UserToCreateType, UserToLoginType } from "../schemas/users.schemas";
import Session from "../entities/Session.entity";
import { AccessTokenPayloadType, RefreshTokenPayloadType } from "../schemas/authTokens";
import PublicUser from "../types/publicUser";
import ISessionRepository from "../interfaces/IRepositories/ISessionRepository";
import IUserRepository from "../interfaces/IRepositories/IUserRepository";

import { logger } from "../server";
import { MissingEnvironmentVariableError,} from "../errors/internalServerErrors";
import { AccountLockedError, InvalidCredentialsError, InvalidSessionError, UserAlreadyExistsError } from "../errors/ExternalErrors";
import IAuthService from "../interfaces/IServices/IAuthService";
import FailedLoginAttempts from "../entities/FailedLoginAttempts.entity";
import IFailedLoginAttemptsRepositoy from "../interfaces/IRepositories/IFailedLoginAttemptsRepository";

export default class AuthService implements IAuthService{
    private userRepository: IUserRepository;
    private sessionRepository: ISessionRepository;
    private failedLoginAttemptsRepository: IFailedLoginAttemptsRepositoy;

    constructor(userRepository: IUserRepository, sessionRepository: ISessionRepository, failedAttempts: IFailedLoginAttemptsRepositoy) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.failedLoginAttemptsRepository = failedAttempts;
    }

    async register(user: UserToCreateType): Promise<PublicUser> {
        const userInDB: (User | undefined)= await this.userRepository.findUserByEmail(user.email);
        if (userInDB) {
            throw new UserAlreadyExistsError("El usuario ya existe");
        }
        if (!process.env.SALT_ROUNDS) {
            throw new MissingEnvironmentVariableError("SALT_ROUNDS was not implemented as a enviromental variable");
        }

        const SALT_ROUNDS: number = parseInt(process.env.SALT_ROUNDS);

        try {
            const userID: string  = uuidv4();
            const hashedPassword: string = await hash(user.password, SALT_ROUNDS);
            
            const newUserToCreate: UserType = {
                ...user,
                id: userID,
                password: hashedPassword
            };
            
            const newUser: User = await this.userRepository.createUser(newUserToCreate);
            const newPublicUser: PublicUser = this.toPublicUser(newUser);
            return newPublicUser;
        }   
        catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }

    async login(userToLogin: UserToLoginType): Promise<PublicUser> {
        const emailFormatValidator = z.email();
        const attemptToValidateEmail = emailFormatValidator.safeParse(userToLogin.identifier);

        let user: User | undefined;

        if (attemptToValidateEmail.success) {
            const userEmail: string = userToLogin.identifier;
            user = await this.userRepository.findUserByEmail(userEmail);
        }
        else {
            const identificationNumber: number = parseInt(userToLogin.identifier);
            user = await this.userRepository.findUserByIdentificationNumber(identificationNumber);
        }

        if (!user) {
            throw new InvalidCredentialsError("Credenciales inválidas");
        }

        let failedLoginAttemptsLog: (FailedLoginAttempts | undefined) = await this.failedLoginAttemptsRepository.findFailedLoginAttemptsByUserId(user.id);
        
        const passwordIsValid: boolean = await compare(userToLogin.password, user.password);

        if (!passwordIsValid && !failedLoginAttemptsLog) {
            failedLoginAttemptsLog = await this.failedLoginAttemptsRepository.createFailedLoginAttempts(user.id);
            failedLoginAttemptsLog.failedAttepmts++;
            this.failedLoginAttemptsRepository.save(failedLoginAttemptsLog)
        }

        const nowInMs: number = Date.now();
        if (nowInMs < failedLoginAttemptsLog?.lockedUntilMs!) {
            throw new AccountLockedError("The account is temporarily blocked");
        }

        if (!passwordIsValid && failedLoginAttemptsLog) {
            if(failedLoginAttemptsLog.failedAttepmts === 5) {
                failedLoginAttemptsLog.lockedUntilMs = nowInMs + 5 * 60 * 1000;
                failedLoginAttemptsLog.failedAttepmts = 0;
                this.failedLoginAttemptsRepository.save(failedLoginAttemptsLog)
            }
            else {
                const milisecondsToSleep: number = this.getDelayForAttempt(failedLoginAttemptsLog.failedAttepmts);
                await this.sleep(milisecondsToSleep);
                failedLoginAttemptsLog.failedAttepmts++;
            }
            throw new InvalidCredentialsError("Credenciales inválidas");
        }

        const publicUser: PublicUser = this.toPublicUser(user);
        return publicUser;
    }
    
    async refreshAndGetNewAccessToken(refreshTokenPayload: RefreshTokenPayloadType): Promise<string> {
        const session: (Session | undefined) = await this.sessionRepository.findSessionByToken(refreshTokenPayload.jti);

        if (!session) {
            throw new InvalidSessionError("La sesión es inválida");
        }
        if (refreshTokenPayload.userId !== session.userId) {
            throw new InvalidSessionError("La sesión es inválida");
        }

        const user: (User | undefined) = await this.userRepository.findUserById(session.userId);

        if (!user) {
            throw new InvalidSessionError("El usuario no existe");
        }

        const publicUser: PublicUser = this.toPublicUser(user);
        const token: string = this.getAccessToken(publicUser);
        return token;
    }

    private getDelayForAttempt(failedAttempts: number): number {
        if (failedAttempts <= 1) return 0;
        else if (failedAttempts === 2) return 500;
        else if (failedAttempts === 3) return 1000;
        return 3000;
    }

    private async sleep(milisecondsToSleep: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, milisecondsToSleep));
    }

    private toPublicUser(user: User): PublicUser {
        return {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            age: user.age,
            identificationNumber: user.identificationNumber,
            phoneNumber: user.phoneNumber,
            email: user.email
        }
    }

    public getAccessToken(user: PublicUser): string {
        if (!process.env.JWT_SECRET_KEY) {
            throw new MissingEnvironmentVariableError("JWT_SECRET_KEY was not implemented as a enviromental variable");
        }

        const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY;
        const access_token_payload: AccessTokenPayloadType = this.getAccessTokenPayload(user);
        const token: string = jwt.sign(access_token_payload, JWT_SECRET_KEY, {"expiresIn": "1h"});
        return token;
    }

    private getAccessTokenPayload(user: PublicUser): AccessTokenPayloadType {
        return {
            userId: user.id,
        };
    }

    public getRefreshToken(publicUser: PublicUser): string {
        if (!process.env.JWT_SECRET_KEY) {
            throw new MissingEnvironmentVariableError("JWT_SECRET_KEY was not implemented as a enviromental variable");
        }

        const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY;
        const refreshTokenPayload: RefreshTokenPayloadType = this.getRefreshTokenPayload(publicUser);
        const token: string = jwt.sign(refreshTokenPayload, JWT_SECRET_KEY, {"expiresIn": "7d"});
        this.sessionRepository.createSession(refreshTokenPayload);
        return token;
    }

    private getRefreshTokenPayload(user: PublicUser): RefreshTokenPayloadType {
        return {
            jti: uuidv4(),
            userId: user.id,
        };
    }

}