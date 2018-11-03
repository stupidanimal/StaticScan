const path = require('path');
const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);



module.exports = async function (req, res, filePath) {
    try {
        const stats = await stat(filePath);
        // console.log(chalk.red(stats.isFile()), chalk.blue(stats.isDirectory()));
        if (stats.isFile()) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            //fs.readFile(filePath,(err,data)=>{
            //     res.end(data);//全读了再放
            // });
            fs.createReadStream(filePath).pipe(res);//读一点放一点


        } else if (stats.isDirectory()) {
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(files.join(','));
        }
        return;
    } catch (e) {
        console.error(e);
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end(`Path:<strong style='color:red;'>"${filePath}"</strong>  is not directory or file<br/>error:${e}`);
    }
}