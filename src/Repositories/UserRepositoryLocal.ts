import { User } from "../schemas/users.schemas";
import IUserRepository from "../interfaces/IRepositories/IUserRepository";

export default class UserRepositoryLocal implements IUserRepository {
    private users: User[];

    constructor() {
        this.users = [];
    }

    async createUser(user: User): Promise<User> {
        this.users.push(user);
        return user;
        ;
    }

    async findUserByEmail(email: string): Promise<User | undefined> {
        const user = this.users.find((user) => user.email === email);
        
        if ( !user ) {
            return undefined;
        }
        
        return user;
    }

    async findUserByIdentificationNumber(identificationNumber: number): Promise<User | undefined> {
        const user = this.users.find((user) => identificationNumber == user.identificationNumber);

        if ( !user ) {
            return undefined;
        }

        return user;
    }
}