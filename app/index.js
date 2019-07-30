const Koa = require('koa');
const config = require('./config');
const bodyparser = require('koa-bodyparser');
const error = require('koa-json-error');
const paramenter = require('koa-parameter');
const mongoose = require('mongoose');
const app = new Koa();
const routing = require('./routes');
mongoose.connect(config.mongoDBConnectionStr, {
    useNewUrlParser: true
}, () => {
    console.log('mongoDB connect success!');
})
mongoose.connection.on('error', console.error);

app.use(error({
    postFormat: (e,{stack, ...rest}) => {
        return process.env.NODE_ENV === 'production' ? rest :{stack, ...rest}
    }
}));

app.use((bodyparser()));
paramenter(app);
routing(app);

app.listen(3000, () => {
    console.log('server run in port 3000');
});

