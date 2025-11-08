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
        return this.users.find((user) => user.email === email);
    }

    async findUserByIdentificationNumber(identificationNumber: number): Promise<User | undefined> {
        return this.users.find((user) => identificationNumber == user.identificationNumber);
    }

    async findUserById(id: string): Promise<User | undefined> {
        return this.users.find((user) => user.id === id);
    }
    
    async save(userToSave: User): Promise<void> {
        const userIndex: number = this.users.findIndex((user) => user.id === userToSave.id);

        if (userIndex === -1) {
            throw Error("No ha sido creado antes el usuario")
        }

        this.users[userIndex] = userToSave;
    }
}