export abstract class ExternalError extends Error {
    public abstract readonly name: string;
    public abstract readonly statusCode: number;

    constructor(message: string) {
        super(message);
    }
}


export class UserAlreadyExistsError extends ExternalError {
    public readonly name: string = "UserAlreadyExists";
    public readonly statusCode: number = 409;

    constructor(message: string) {
        super(message);
    }
}

export class InvalidCredentialsError extends ExternalError {
    public readonly name: string = "InvalidCredentials";
    public readonly statusCode: number = 401;

    constructor(message: string) {
        super(message);
    }
}

export class UnauthorizedRequestError extends ExternalError {
    public readonly name: string = "UnauthorizedRequestError";
    public readonly statusCode: number = 401;

    constructor(message: string) {
        super(message);
    }
}

export class InvalidSessionError extends ExternalError {
    public readonly name: string = "InvalidSessionError";
    public readonly statusCode: number = 401;

    constructor(message: string) {
        super(message);
    }
}

export class ValidationError extends ExternalError {
    public readonly name: string = "ValidationError"
    public readonly statusCode: number = 400;
    
    constructor(message: string) {
        super(message)
    }
}

export class AccountLockedError extends ExternalError {
    public readonly name: string = "AccountLockedError";
    public readonly statusCode: number = 403;

    constructor(message: string) {
        super(message);
    }
}