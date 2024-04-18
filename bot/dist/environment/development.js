'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    seed: true,
    ip: process.env.IP || undefined,
    mongoSession: {
        mongoUrl: 'mongodb://localhost/nftcrypto-bot-development',
        uri: 'mongodb://localhost/nftcrypto-bot-development',
        crypto: {
            secret: 'squirrel'
        },
        autoRemove: 'native' // Default
    },
    mongo: {
        mongoUrl: 'mongodb://localhost/nftcrypto-bot-development',
        uri: 'mongodb://localhost/nftcrypto-bot-development'
    },
    mail: {
        sender: "monalbumphotosnet@gmail.com",
        server: {
            /*      host: "smtp.gmail.com",
                  port: 465,
                  secure: true,*/
            service: "gmail",
            tls: { rejectUnauthorized: false },
            auth: {
                user: "monalbumphotosnet@gmail.com",
                pass: "albumphotos"
            }
        }
    },
    port: 9000
};
//# sourceMappingURL=development.js.map