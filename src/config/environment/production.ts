'use strict';

export default {
  seed: false,
  ip: process.env.IP || undefined,
  mongoSession:{
    mongoUrl: 'mongodb://localhost/nftcrypto-production',
    uri: 'mongodb://localhost/nftcrypto-production',
    autoRemove: 'disabled'
  },

  mongo: {
    uri: 'mongodb://localhost/nftcrypto-production'
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
  port: 8083
};
