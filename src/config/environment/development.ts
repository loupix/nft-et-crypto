'use strict';

export default {
  seed: true,
  ip: process.env.IP || undefined,
  mongoSession:{
    mongoUrl: 'mongodb://localhost/nftcrypto-development',
    uri: 'mongodb://localhost/nftcrypto-development',
    crypto: {
      secret: 'squirrel'
    },
    autoRemove: 'native' // Default
  },

  mongo: {
    uri: 'mongodb://localhost/nftcrypto-development'
  },

  mail: {
    sender:"monalbumphotosnet@gmail.com",
    server:{
/*      host: "smtp.gmail.com",
      port: 465,
      secure: true,*/
      service:"gmail",
      tls: {rejectUnauthorized: false},
      auth:{
        user: "monalbumphotosnet@gmail.com",
        pass: "albumphotos"
      }
    }
  },

  port:9000

};
