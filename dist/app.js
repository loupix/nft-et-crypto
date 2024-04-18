"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Définition des modules
const express_1 = __importDefault(require("express"));
const chalk_1 = __importDefault(require("chalk"));
const environment_1 = __importDefault(require("./config/environment"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_js_1 = require("./config/express.js");
mongoose_1.default.connect(environment_1.default.mongo.uri, environment_1.default.mongo.options);
/*mongoose.set('useUnifiedTopology', true);
*/
if (environment_1.default.seed) {
    require('./config/seed');
}
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const socket = require('socket.io')(server, { serveClient: true });
// require('./config/sockets.js')(socket);
(0, express_js_1.configExpress)(app);
// Routes
const index_1 = __importDefault(require("./routes/index"));
const user_1 = __importDefault(require("./routes/user"));
const category_1 = __importDefault(require("./routes/category"));
const album_1 = __importDefault(require("./routes/album"));
const item_1 = __importDefault(require("./routes/item"));
const enchere_1 = __importDefault(require("./routes/enchere"));
app.use('/', index_1.default);
app.use('/user', user_1.default);
app.use("/category", category_1.default);
app.use("/album", album_1.default);
app.use("/item/enchere", enchere_1.default);
app.use("/item", item_1.default);
module.exports.app = app;
server.listen(environment_1.default.port, environment_1.default.ip, () => {
    console.log(chalk_1.default.red('\nExpress server listening on port ')
        + chalk_1.default.yellow('%d')
        + chalk_1.default.red(', in ')
        + chalk_1.default.yellow('%s')
        + chalk_1.default.red(' mode.\n'), environment_1.default.port, app.get('env'));
});
module.exports.server = server;
//# sourceMappingURL=app.js.map