export class UserAlreadyExists extends Error {
    public readonly name: string = "UserAlreadyExists";
    public readonly statusCode: number = 409;

    constructor(message: string) {
        super(message);
    }
}