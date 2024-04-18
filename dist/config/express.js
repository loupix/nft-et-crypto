'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configExpress = void 0;
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const errorhandler_1 = __importDefault(require("errorhandler"));
const express_useragent_1 = __importDefault(require("express-useragent"));
// auth purpose
const helmet_1 = __importDefault(require("helmet"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const passport_1 = __importDefault(require("passport"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
// const mongoStore = require('connect-mongo')(session);
// const mongoStore = require('connect-mongo')(session);
const environment_1 = __importDefault(require("./environment"));
const hour = 3600000;
const logger = require("../logger")(module);
function logErrors(err, req, res, next) {
    logger.error(err.stack);
    next(err);
}
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: err });
    }
    else {
        next(err);
    }
}
const { I18n } = require('i18n');
const i18n = new I18n({
    locales: ['fr', 'en', 'de'],
    defaultLocale: 'en',
    directory: path_1.default.join(__dirname, "..", 'locales'),
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
        __: '__',
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
function configExpress(app) {
    const env = environment_1.default.env;
    app.set('views', path_1.default.join(environment_1.default.root, 'views'));
    app.set('view engine', 'jade');
    // sécurité
    app.use((0, helmet_1.default)());
    app.disable('x-powered-by');
    // gestion erreurs
    app.use(logErrors);
    app.use(clientErrorHandler);
    // config & optimisation
    app.disable('etag');
    // app.use(require('connect').bodyParser());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(body_parser_1.default.json()); // to support JSON-encoded bodies
    app.use(express_1.default.json()); // to support JSON-encoded bodies
    app.use(express_1.default.urlencoded({ extended: true })); // to support URL-encoded bodies
    app.use((0, compression_1.default)());
    app.use(express_useragent_1.default.express()); // check user agent
    // Logger for HTTP Request
    if (env !== "test") {
        if (env == "development")
            app.use((0, morgan_1.default)('[:date[clf]] :method :url :status :res[content-length] - :response-time ms')); // Concise output colored by response status for development use
        else
            app.use((0, morgan_1.default)("short")); // Shorter than default, also including response time.
    }
    app.use(passport_1.default.initialize());
    app.use(express_1.default.static(path_1.default.join(environment_1.default.root, 'public')));
    /*  app.use("/images", express.static(path.join(config.root, 'public','images')));
      app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    */
    /*  app.use('/admin', express.static(path.join(config.root, 'admin')));
      app.set('adminPath', 'admin');
    */ app.set('uploadsPath', path_1.default.join(environment_1.default.root, 'public', 'images'));
    app.use(function (req, res, next) {
        res.locals._ = require('underscore');
        next();
    });
    // default: using 'accept-language' header to guess language settings
    app.use(i18n.init);
    // app.set('trust proxy', 1);
    app.use((0, cookie_parser_1.default)());
    app.use((0, express_session_1.default)({
        secret: environment_1.default.secrets.session,
        resave: true,
        saveUninitialized: true,
        cookie: {
            expires: new Date(Date.now() + hour),
            maxAge: hour
        },
        store: connect_mongo_1.default.create(environment_1.default.mongoSession)
    }));
    //toaster
    app.use((0, connect_flash_1.default)());
    if (env === 'development' || env === 'test') {
        app.use((0, errorhandler_1.default)());
    }
}
exports.configExpress = configExpress;
;
//# sourceMappingURL=express.js.map