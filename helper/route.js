const path = require('path');
const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const Handlebars = require('handlebars');


const tplPath = path.join(__dirname, '../templates/dir.tpl');
const source = fs.readFileSync(tplPath); //不写utf8 ，返回的是buffer
const template = Handlebars.compile(source.toString());
const mime = require('./mime');
const range = require('./range.js')
const isFresh = require('./cache');

const compress = require('./compress');

module.exports = async function (req, res, filePath, config) {
    try {
        const stats = await stat(filePath);
        // console.log(chalk.red(stats.isFile()), chalk.blue(stats.isDirectory()));
        if (stats.isFile()) {
            const contentType = mime(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', contentType);
            //fs.readFile(filePath,(err,data)=>{
            //     res.end(data);//全读了再放
            // });
            //fs.createReadStream(filePath).pipe(res);//读一点放一点

            if (isFresh(stats, req, res)) {
                res.statusCode = 304;
                res.end();
                return;
            }


            let rs;
            const { code, start, end } = range(stats.size, req, res);
            if (code === 200) {
                res.statusCode = 200;
                rs = fs.createReadStream(filePath);
            } else {
                res.statusCode = 206;
                rs = fs.createReadStream(filePath, { start, end });
            }
            // let rs = fs.createReadStream(filePath);
            if (filePath.match(config.compress)) { //进行文件压缩
                rs = compress(rs, req, res);
            }
            return rs.pipe(res);

        } else if (stats.isDirectory()) {
            const files = await readdir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            const dir = path.relative(config.root, filePath)
            const data = {
                title: path.basename(filePath),
                dir: dir ? `/${dir}` : '',
                files
            };



            res.end(template(data));
        }
        return;
    } catch (e) {
        console.error(e);
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end(`Path:<strong style='color:red;'>"${filePath}"</strong>  is not directory or file<br/>error:${e}`);
    }
}