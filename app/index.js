const Koa = require('koa');
const path = require('path');
const config = require('./config');
// const bodyparser = require('koa-bodyparser');
const error = require('koa-json-error');
const paramenter = require('koa-parameter');
const koaBody = require('koa-body');
const mongoose = require('mongoose');
const koaStatic = require('koa-static')
const app = new Koa();
const routing = require('./routes');
mongoose.connect(config.mongoDBConnectionStr, {
    useNewUrlParser: true
}, () => {
    console.log('mongoDB connect success!');
})
mongoose.connection.on('error', console.error);


/** 配置静态资源目录 */
app.use(koaStatic(path.join(__dirname + '/public/')));

app.use(error({
    postFormat: (e,{stack, ...rest}) => {
        return process.env.NODE_ENV === 'production' ? rest :{stack, ...rest}
    }
}));

// app.use((bodyparser()));

/** 配置图片上传 */
app.use(koaBody({
    multipart:true, // 支持文件上传
    // encoding:'gzip',
    formidable:{
      uploadDir: path.join(__dirname,'/public/upload/'), // 设置文件上传目录
      keepExtensions: true,    // 保持文件的后缀
    //   maxFieldsSize:2 * 1024 * 1024, // 文件上传大小
    //   onFileBegin:(name,file) => { // 文件上传前的设置
    //   },
    }
  }));


app.use(paramenter(app));
routing(app);

app.listen(3000, () => {
    console.log('server run in port 3000');
});

