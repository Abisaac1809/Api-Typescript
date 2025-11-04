import { IUserRepository } from "../interfaces/IUserRepository";
import { User } from "../schemas/UserCreation";
import { PublicUser } from "../types/publicUser";
import {v4 as uuidv4} from "uuid";
import { hash } from "bcrypt";

export default class AuthService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async register(user: User): Promise<PublicUser> {
        const userInDB: (PublicUser | undefined)= await this.userRepository.findUserByEmail(user.email);

        if (userInDB) {
            throw new Error("El usuario ya existe");
        }

        const SALT_ROUNDS: number = 4;

        try {
            const userID  = uuidv4();
            const hashedPassword = await hash(user.password, SALT_ROUNDS);

            const newUserToCreate: User = {
                ...user,
                id: userID,
                password: hashedPassword
            }
            
            const newUser: PublicUser = await this.userRepository.createUser(newUserToCreate);
            return newUser
        }   
        catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }
}