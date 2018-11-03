const http = require('http');
const chalk = require('chalk');
const config = require('./config/defaultConfig');
const route = require('./helper/route.js');
const path = require('path');
const fs = require('fs');



const server = http.createServer((req, res) => {
    const filePath = path.join(config.root, req.url);
    route(req, res, filePath);
    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'text/html');
    // res.end(filePath);
});



server.listen(config.port, config.hostname, () => {
    const addr = `http://${config.hostname}:${config.port}`
    console.info(`Server started at ${chalk.green(addr)}`);
})