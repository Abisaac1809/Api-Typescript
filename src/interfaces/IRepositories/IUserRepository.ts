import { User, UserToCreateType } from "../../schemas/users.schemas";

export default interface IUserRepository {
    createUser(user: UserToCreateType): Promise<User>;
    findUserByEmail(email: string): Promise<User | undefined>;
    findUserByIdentificationNumber(identificationNumber: number): Promise<User | undefined>;
    findUserById(id: string): Promise<User | undefined>;
    save(user: User): Promise<void>;
}