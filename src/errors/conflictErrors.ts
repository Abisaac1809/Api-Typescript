export class UserAlreadyExistsError extends Error {
    public readonly name: string = "UserAlreadyExists";
    public readonly statusCode: number = 409;

    constructor(message: string) {
        super(message);
    }
}

export class InvalidCredentialsError extends Error {
    public readonly name: string = "InvalidCredentials";
    public readonly statusCode: number = 401;

    constructor(message: string) {
        super(message);
    }
}
