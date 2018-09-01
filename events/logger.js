const {createLogger, transports} = require('winston');
const { format } = require('logform');

const alignedWithColorsAndTime = format.combine(
    format.colorize(),
    format.timestamp({
        format: 'HH:mm:ss.SSS'
    }),
    format.printf(info => `[${info.timestamp}] [${info.level}] ${info.message}`)
);

const logger = createLogger({
    level: 'info',
    format: alignedWithColorsAndTime,
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' })
    ]
});

module.exports = logger;