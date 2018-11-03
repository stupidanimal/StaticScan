const http = require('http');
const chalk = require('chalk');
const config = require('./defaultConfig');
const path = require('path');
const fs = require('fs');


const server = http.createServer((req, res) => {

    const filePath = path.join(config.root, req.url);

    fs.stat(filePath, (err, stats) => {
        if (err) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end(`Path:<strong style='color:red;'>"${filePath}"</strong>  is not directory or file`);
            return;
        }
        if (stats.isFile()) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            //fs.readFile(filePath,(err,data)=>{
            //     res.end(data);//全读了再放
            // });
            fs.createReadStream(filePath).pipe(res);//读一点放一点
            return;

        } else if (stats.isDirectory()) {
            fs.readdir(filePath, (err, files) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(files.join(','));
            });
            return;
        }
    });
    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'text/html');
    // res.end(filePath);
});



server.listen(config.port, config.hostname, () => {
    const addr = `http://${config.hostname}:${config.port}`
    console.info(`Server started at ${addr}`);
})