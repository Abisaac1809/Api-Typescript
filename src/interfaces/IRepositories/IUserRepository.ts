import PublicUser from "../../types/publicUser";
import { User } from "../../schemas/users.schemas";

export default interface IUserRepository {
    createUser(user: User): Promise<User>;
    findUserByEmail(email: string): Promise<User | undefined>;
    findUserByIdentificationNumber(identificationNumber: number): Promise<User | undefined>;
}