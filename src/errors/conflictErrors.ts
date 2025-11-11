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

export class UnauthorizedRequestError extends Error {
    public readonly name: string = "UnauthorizedRequestError";
    public readonly statusCode: number = 401;

    constructor(message: string) {
        super(message);
    }
}

export class InvalidSessionError extends Error {
    public readonly name: string = "InvalidSessionError";
    public readonly status:number = 401;

    constructor(message: string) {
        super(message);
    }
}

export class ValidationError extends Error {
    public readonly name: string = "ValidationError"
    public readonly statusCode: number = 400;
    
    constructor(message: string) {
        super(message)
    }
}
