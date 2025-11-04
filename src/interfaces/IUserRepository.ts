import {PublicUser} from "../types/publicUser";
import { User } from "../schemas/UserCreation";

export interface IUserRepository {
    createUser(user: User): Promise<PublicUser>;
    findUserByEmail(email: string): Promise<PublicUser | undefined>;
}