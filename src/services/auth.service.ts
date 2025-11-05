import { hash } from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { User } from "../schemas/UserCreation";
import PublicUser from "../types/publicUser";
import IUserRepository from "../interfaces/IUserRepository";

import { EnviromentalVariableNotImplemented,} from "../errors/internalServerErrors";
import { UserAlreadyExists } from "../errors/conflictErrors";

export default class AuthService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async register(user: User): Promise<PublicUser> {
        const userInDB: (PublicUser | undefined)= await this.userRepository.findUserByEmail(user.email);
        if (userInDB) {
            throw new UserAlreadyExists("El usuario ya existe");
        }
        if (!process.env.SALT_ROUNDS) {
            throw new EnviromentalVariableNotImplemented("SALT_ROUNDS was not implemented as a enviromental variable");
        }

        const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

        try {
            const userID  = uuidv4();
            const hashedPassword = await hash(user.password, SALT_ROUNDS);
            
            const newUserToCreate: User = {
                ...user,
                id: userID,
                password: hashedPassword
            };
            
            const newUser: PublicUser = await this.userRepository.createUser(newUserToCreate);
            return newUser;
        }   
        catch (error) {
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }
}