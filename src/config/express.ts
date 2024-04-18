'use strict';
import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import bodyParser from 'body-parser';
import errorhandler from 'errorhandler';
import useragent from 'express-useragent';

// auth purpose
import helmet from 'helmet';
import session from 'express-session';
import cookieParser from "cookie-parser";
import flash from 'connect-flash';
import favicon from 'serve-favicon';
import passport from 'passport';

import mongoose from 'mongoose';
import mongoStore from 'connect-mongo';
// const mongoStore = require('connect-mongo')(session);



// const mongoStore = require('connect-mongo')(session);

import config from "./environment";
const hour = 3600000;

const logger = require("../logger")(module);



function logErrors(err, req, res, next) {
  logger.error(err.stack);
  next(err);
}



function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: err });
  } else {
    next(err);
  }
}


const { I18n } = require('i18n');
const i18n = new I18n({
  locales: ['fr', 'en', 'de'],
  defaultLocale: 'en',
  directory: path.join(__dirname, "..", 'locales'),

  // sets a custom cookie name to parse locale settings from - defaults to NULL
  cookie: 'lang',

  // sets a custom header name to read the language preference from - accept-language header by default
  header: 'accept-language',

  // query parameter to switch locale (ie. /home?lang=ch) - defaults to NULL
  queryParameter: 'lang',

  // watch for changes in JSON files to reload locale on updates - defaults to false
  autoReload: false,

  // whether to write new locale information to disk - defaults to true
  updateFiles: false,

  // sync locale information across all files - defaults to false
  syncFiles: true,

  // setting extension of json files - defaults to '.json' (you might want to set this to '.js' according to webtranslateit)
  extension: '.json',

  // enable object notation
  objectNotation: true,

  // object or [obj1, obj2] to bind the i18n api and current locale to - defaults to null
  register: global,

  // hash to specify different aliases for i18n's internal methods to apply on the request/response objects (method -> alias).
  // note that this will *not* overwrite existing properties with the same name
  api: {
    __: '__', // now req.__ becomes req.__
    __n: '__n' // and req.__n can be called as req.__n
  },

/*  // setting of log level DEBUG - default to require('debug')('i18n:debug')
  logDebugFn: function (msg) {
    console.log('debug', msg)
  },

  // setting of log level WARN - default to require('debug')('i18n:warn')
  logWarnFn: function (msg) {
    console.log('warn', msg)
  },

  // setting of log level ERROR - default to require('debug')('i18n:error')
  logErrorFn: function (msg) {
    console.log('error', msg)
  },

  // used to alter the behaviour of missing keys
  missingKeyFn: function (locale, value) {
    return value
  },*/
});



export function configExpress(app) {

  const env = config.env;

  app.set('views', path.join(config.root, 'views'));
  app.set('view engine', 'jade');

  // sécurité
  app.use(helmet());
  app.disable('x-powered-by');


  // gestion erreurs
  app.use(logErrors);
  app.use(clientErrorHandler);

  // config & optimisation
  app.disable('etag');
  // app.use(require('connect').bodyParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());    // to support JSON-encoded bodies
  app.use(express.json());       // to support JSON-encoded bodies
  app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

  app.use(compression());


  app.use(useragent.express());  // check user agent


  // Logger for HTTP Request
  if(env!=="test"){
    if(env=="development")
      app.use(morgan('[:date[clf]] :method :url :status :res[content-length] - :response-time ms'));      // Concise output colored by response status for development use
    else
      app.use(morgan("short"))     // Shorter than default, also including response time.
  }
  app.use(passport.initialize());
  app.use(express.static(path.join(config.root, 'public')));
/*  app.use("/images", express.static(path.join(config.root, 'public','images')));
  app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
*/
/*  app.use('/admin', express.static(path.join(config.root, 'admin')));
  app.set('adminPath', 'admin');
*/  app.set('uploadsPath', path.join(config.root, 'public', 'images'));

  app.use(function(req, res, next){
    res.locals._ = require('underscore');
    next();
  });

  // default: using 'accept-language' header to guess language settings
  app.use(i18n.init);

  // app.set('trust proxy', 1);
  app.use(cookieParser());
  app.use(session({
    secret: config.secrets.session,
    resave: true,
    saveUninitialized: true,
    cookie: {
      expires:new Date(Date.now() + hour),
      maxAge:hour },
    store: mongoStore.create(config.mongoSession)
  }));

  //toaster
  app.use(flash());

  if (env === 'development' || env === 'test') {
    app.use(errorhandler());
  }

};
