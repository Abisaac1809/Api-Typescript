import PublicUser from "../types/publicUser";
import { User } from "../schemas/UserCreation";
import IUserRepository from "../interfaces/IUserRepository";

export default class UserRepositoryLocal implements IUserRepository {
    private users: User[];

    constructor() {
        this.users = [];
    }

    async createUser(user: User): Promise<PublicUser> {
        if (!user.id) {
            throw new Error("User must have an id");
        }

        this.users.push(user);

        const newPublicUser: PublicUser = {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            age: user.age,
            IdNumber: user.IdNumber,
            phoneNumber: user.phoneNumber,
            email: user.email
        };
        return newPublicUser
        ;
    }

    async findUserByEmail(email: string): Promise<PublicUser | undefined> {
        const user = this.users.find((user) => user.email === email);
        if (!user) {
            return undefined;
        }
        if (!user.id) {
            throw new Error("User must have an id");
        }
        const publicUser: PublicUser = {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            age: user.age,
            IdNumber: user.IdNumber,
            phoneNumber: user.phoneNumber,
            email: user.email
        };
        return publicUser;
    }
}