export abstract class InternalServerError extends Error {
    public abstract readonly name: string;
    public abstract readonly statusCode: number;

    constructor(message: string) {
        super(message);
    }
}

export class MissingEnvironmentVariableError extends InternalServerError {
    public readonly name: string = "EnviromentalVariableNotImplemented"
    public readonly statusCode: number = 500;
    
    constructor(message: string) {
        super(message)
    }
}
