const http = require('http');
const chalk = require('chalk');
const conf = require('./config/defaultConfig');
const route = require('./helper/route.js');
const path = require('path');
const fs = require('fs');

class Server {
    constructor(config) {
        this.conf = Object.assign({}, conf, config);
    }
    start() {
        const server = http.createServer((req, res) => {
            const filePath = path.join(this.conf.root, req.url);
            route(req, res, filePath, this.conf);
            // res.statusCode = 200;
            // res.setHeader('Content-Type', 'text/html');
            // res.end(filePath);
        });



        server.listen(this.conf.port, this.conf.hostname, () => {
            const addr = `http://${this.conf.hostname}:${this.conf.port}`
            console.info(`Server started at ${chalk.green(addr)}`);
        })
    }
}

module.exports = Server;