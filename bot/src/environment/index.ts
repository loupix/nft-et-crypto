'use strict';
import path from "path";
import _ from 'lodash';

const all = {

  env: process.env.NODE_ENV || 'development',
  root: path.normalize(__dirname + '/../..'),
  port: process.env.PORT || 7000,
  seed: true,

  mongoSession:{
    user: "loupix",
    pass: "lolo",
    autoIndex: false,
    port: 27017    // default
  },

  mongo: {
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: "loupix",
      pass: "lolo",
      autoIndex: false,
      port: 27017    // default
    }
  },

  web3: {
    http: {
      address: "localhost",
      port: 8545
   },
     ws: {
       address: "localhost",
       port: 3334
   }
  },

  secrets: {
    session: process.env.SESSION_SECRET || 'secretKey'
  }
};

export default _.merge(all, require('./' + all.env).default);
