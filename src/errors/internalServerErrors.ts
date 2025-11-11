export class MissingEnvironmentVariableError extends Error {
    public readonly name: string = "EnviromentalVariableNotImplemented"
    public readonly statusCode: number = 500;
    
    constructor(message: string) {
        super(message)
    }
}
