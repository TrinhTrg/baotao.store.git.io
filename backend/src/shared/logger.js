// src/shared/logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Tạo array transports mặc định chỉ có Console (An toàn cho Vercel)
const logTransports = [
    new transports.Console({ format: combine(colorize(), myFormat) })
];

// === [FIX LOGIC] ===
// Chỉ thêm File log khi môi trường CHÍNH XÁC là 'development' (chạy ở máy local)
// Cách này an toàn hơn: nếu NODE_ENV bị thiếu trên Vercel, nó cũng sẽ không chạy vào đây -> Không crash.
if (process.env.NODE_ENV === 'development') {
    logTransports.push(
        new transports.File({ filename: 'logs/combined.log' }),
        new transports.File({ filename: 'logs/error.log', level: 'error' })
    );
}

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        myFormat
    ),
    transports: logTransports,
});

module.exports = logger;