export default interface ILogger {
    log(level: string, message: string, meta?: Record <string, any>): Promise<void>;
    error(message: string, meta?: Record<string, any>): Promise<void>;
    warn(message: string, meta?: Record<string, any>): Promise <void>;
    info(message: string, meta?: Record<string, any>): Promise <void>;
    debug(message: string, meta?: Record<string, any>): Promise <void>;
}