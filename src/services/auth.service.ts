import { hash, compare } from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { email, z } from "zod";

import { User, UserLoginRequest } from "../schemas/users.schemas";
import PublicUser from "../types/publicUser";
import IUserRepository from "../interfaces/IRepositories/IUserRepository";

import { MissingEnvironmentVariableError,} from "../errors/internalServerErrors";
import { InvalidCredentialsError, UserAlreadyExistsError } from "../errors/conflictErrors";

export default class AuthService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async register(user: User): Promise<PublicUser> {
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

    async login(userToLogin: UserLoginRequest): Promise<PublicUser> {
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

        if (! passwordIsValid) {
            throw new InvalidCredentialsError("Credenciales inválidas");
        }

        const publicUser: PublicUser = this.toPublicUser(user);
        return publicUser;
    }

    private toPublicUser(user: User): PublicUser {
        // Falta arreglar que el esquema y el tipo de user sean distintos para evitar este tipo de validaciones
        if (user.id){
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
        else {
            throw new Error("Usuario inválido");
        }
    }
}