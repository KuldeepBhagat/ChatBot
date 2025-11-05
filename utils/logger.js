import path from 'path'
import fs from 'fs'

const logDir = path.join(process.cwd(), "logs")

if(!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, 'app.log');

export function logEvent(type, message, meta = {}) {
    const log = {
        timeStamp: new Date().toISOString(),
        type,
        message,
        ...meta
    }

    const logLine = JSON.stringify(log) + "\n";
    fs.appendFile(logFile, logLine, (err) => {
        if(err) console.log("failed to log: ", err)
    });
}
