"use strict";
const path = require("path");
const config = require("./config/environment").default;
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;
const getLabel = function (callingModule) {
    const parts = callingModule.filename.split(path.sep);
    return path.join(parts[parts.length - 2], parts.pop());
};
const myFormat = printf(({ level, label, message, timestamp }) => {
    return `\r\n${timestamp} [${level}] {${label}} ${message}`;
});
var winston = require('winston');
require('winston-mongodb');
module.exports = function (callingModule) {
    const filename = getLabel(callingModule);
    let options = {
        db: config.mongo.uri,
        options: config.mongo.options,
        collection: "logs",
        label: filename
    };
    return createLogger({
        level: 'debug',
        format: combine(colorize({ all: true }), label({ label: filename }), timestamp(), myFormat),
        transports: [
            new transports.Console(),
            new winston.transports.MongoDB(options)
        ]
    });
};
//# sourceMappingURL=logger.js.map