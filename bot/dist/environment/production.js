'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    seed: false,
    ip: process.env.IP || undefined,
    mongoSession: {
        mongoUrl: 'mongodb://localhost/nftcrypto-bot-production',
        uri: 'mongodb://localhost/nftcrypto-bot-production',
        autoRemove: 'disabled'
    },
    mongo: {
        mongoUrl: 'mongodb://localhost/nftcrypto-bot-production',
        uri: 'mongodb://localhost/nftcrypto-bot-production'
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
    port: 8083
};
//# sourceMappingURL=production.js.map