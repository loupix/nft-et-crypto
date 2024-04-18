//Définition des modules
import express from 'express';
import chalk from 'chalk';
import config from './config/environment';
import http from 'http';
import path from 'path';
import mongoose from 'mongoose';
import {configExpress} from './config/express.js';

mongoose.connect(config.mongo.uri, config.mongo.options);
/*mongoose.set('useUnifiedTopology', true);
*/
if (config.seed) {require('./config/seed');}

const app = express();
const server = http.createServer(app);
const socket = require('socket.io')(server, { serveClient: true });
// require('./config/sockets.js')(socket);

configExpress(app);

// Routes
import routeIndex from './routes/index';
import routeUser from './routes/user';
import routeCategory from './routes/category';
import routeAlbum from './routes/album';
import routeItem from './routes/item';
import routeEnchere from './routes/enchere';

app.use('/', routeIndex);
app.use('/user', routeUser);
app.use("/category", routeCategory);
app.use("/album", routeAlbum);

app.use("/item/enchere", routeEnchere)
app.use("/item", routeItem)

module.exports.app = app;

server.listen(config.port, config.ip, () => {

  console.log(
    chalk.red('\nExpress server listening on port ')
    + chalk.yellow('%d')
    + chalk.red(', in ')
    + chalk.yellow('%s')
    + chalk.red(' mode.\n'),
    config.port,
    app.get('env')
  );

});

module.exports.server = server;