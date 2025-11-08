import { hash, compare } from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import jwt from "jsonwebtoken";

import { User, UserToCreateType, UserToLoginType } from "../schemas/users.schemas";
import { AccessTokenPayload, RefreshTokenPayload } from "../types/authTokensPayload";
import PublicUser from "../types/publicUser";
import IUserRepository from "../interfaces/IRepositories/IUserRepository";

import { MissingEnvironmentVariableError,} from "../errors/internalServerErrors";
import { InvalidCredentialsError, UserAlreadyExistsError } from "../errors/conflictErrors";

export default class AuthService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
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
            
            const newUserToCreate: User = {
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

        if ( !user ) {
            throw new InvalidCredentialsError("Credenciales inválidas");
        }

        const passwordIsValid: boolean = await compare(userToLogin.password, user.password);

        if ( !passwordIsValid ) {
            throw new InvalidCredentialsError("Credenciales inválidas");
        }

        const publicUser: PublicUser = this.toPublicUser(user);
        return publicUser;
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
        if ( !process.env.JWT_SECRET_KEY) {
            throw new MissingEnvironmentVariableError("JWT_SECRET_KEY was not implemented as a enviromental variable");
        }

        const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY;
        const access_token_payload: AccessTokenPayload = this.getAccessTokenPayload(user);
        const token: string = jwt.sign(access_token_payload, JWT_SECRET_KEY, {"expiresIn": "1h"})
        return token;
    }

    private getAccessTokenPayload(user: PublicUser): AccessTokenPayload {
        const minutesUntilJwtExpires: number = 15;
        const secondsUntilJwtExpires: number = minutesUntilJwtExpires * 60;
        const nowInMs: number = Date.now();
        const expirationTimeInSeconds = Math.floor(nowInMs / 1000) + secondsUntilJwtExpires;

        return {
            userId: user.id,
            iat: new Date().toISOString(),
            exp: expirationTimeInSeconds
        }
    }

    public getRefreshToken(publicUser: PublicUser): string {
        if ( !process.env.JWT_SECRET_KEY) {
            throw new MissingEnvironmentVariableError("JWT_SECRET_KEY was not implemented as a enviromental variable");
        }

        const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY;
        const refresh_token_payload: RefreshTokenPayload = this.getRefreshTokenPayload(publicUser);
        const token: string = jwt.sign(refresh_token_payload, JWT_SECRET_KEY, {"expiresIn": "7d"})
        return token;
    }

    private getRefreshTokenPayload(user: PublicUser): RefreshTokenPayload {
        const minutesUntilJwtExpires: number = 10080;
        const secondsUntilJwtExpires: number = minutesUntilJwtExpires * 60;
        const nowInMs: number = Date.now();
        const expirationTimeInSeconds = Math.floor(nowInMs / 1000) + secondsUntilJwtExpires;

        return {
            jti: uuidv4(),
            userId: user.id,
            exp: expirationTimeInSeconds
        }
    }

}