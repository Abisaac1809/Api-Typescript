import winston, { Logger } from 'winston';
import ILogger from '../../interfaces/IUtils/ILogger';

const { combine, timestamp, json, errors } = winston.format;

export default class ConsoleLogger implements ILogger {
    private logger: Logger; 

    constructor() {
        this.logger = winston.createLogger({
            levels: winston.config.syslog.levels,
            level: "info",
            format: combine(errors({stack:true}), timestamp(), json()),
            transports: [
                new winston.transports.Console()
            ],
            exceptionHandlers: [
                new winston.transports.Console()
            ],
            rejectionHandlers: [
                new winston.transports.Console()
            ]
        })
    }

    async log(level: string, message: string, meta?: Record<string, any>): Promise<void> {
        this.log(level, message, meta);
    }
    async error(message: string, meta?: Record<string, any>): Promise<void> {
        this.logger.error(message, meta);
    }
    async warn(message: string, meta?: Record<string, any>): Promise<void> {
        this.logger.warn(message, meta);
    }
    async info(message: string, meta?: Record<string, any>): Promise<void> {
        this.logger.info(message, meta);
    }
    async debug(message: string, meta?: Record<string, any>): Promise<void> {
        this.logger.debug(message, meta)
    }
}