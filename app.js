require('./core/_global');
const fs = require('fs');
const cluster = require('cluster');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const path = require('path');
const formidable = require('formidable');
const app = express();
const server = http.createServer(app);
const socket = socketIO(server);
module.exports = {app, socket};

const Config = require('./config');
const Elastic = require('./core/elastic');
const Db = require('./model');
const Route = require('./core/route');
const Types = require('./core/types');
const Swagger = require('./core/swagger');
const moment = require('moment');
const My_queue = require('./core/queue');

async function setup() {
    // load route
    require(`./route/_init_`);

    // load elastic
    await Elastic.indicesSetup('session', {
        mappings: {
            'session': {
                'properties': {
                    user: {type: 'long'},
                    expired: {type: 'long'},
                    token: {type: 'text', analyzer: 'keyword'},
                }
            }
        }
    });

    // swagger
    if (Config.isDevelopment) {
        app.use('/swagger', express.static(path.join(__dirname, 'swagger')));

        Route.get({
            url: '/_swagger',
            swagger: false,
            rawResponse: true,
            response: Types.raw(),
            handle: (control, route) => {
                return Swagger.document()
            }
        });
    }

    // ckeditor upload
    app.post(`${Config.apiPath}/ckeditor/upload`, (req, res) => {
        let form = new formidable.IncomingForm();

        form.parse(req);

        form.on('file', function (name, file) {
            let bitmap = fs.readFileSync(file.path);
            let fileData = new Buffer(bitmap).toString('base64');

            let data = {
                name: name,
                image_type: 'editor',
                image: fileData,
                priority: 0,
            };
        });
    });

    // default route
    if (Config.isDevelopment) {
        app.use((req, res) => {
            res.redirect('/swagger');
        });
    } else {
        app.use('/', express.static(path.join(__dirname, 'site')));
        app.use((req, res) => {
            res.sendFile(path.join(__dirname, 'site', 'index.html'));
        });
    }

    My_queue.init();

    return server;
}

if (cluster.isMaster) {
    // let cpuCount = require('os').cpus().length;
    let cpuCount = 2;

    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    app.use(cors());
    app.use(bodyParser.json({limit: '100mb'}));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(compression());

    console.log(`Worker ${process.pid} started`);

    // start server
    setup()
        .then((server) => server.listen(Config.server.port))
        .catch(e => console.log(e));
}

