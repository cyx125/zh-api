const User = require('../modules/users');
const josnwebtoken = require('jsonwebtoken');
const config = require('../config');

class UsersCtl {

    async find(ctx) {
        const user = await User.find();
        ctx.body = user;
    }
    async findById(ctx) {
        const user= await User.findById(ctx.params.id)
        if(!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.body = user;
    }
    async create(ctx) {
        ctx.verifyParams({
            name:{  type: 'string', required: true},
            pwd:{  type: 'string', required: true}
        })
        const { name } = ctx.request.body;
        const findUser = await User.findOne({name: name});
        if( findUser ) { ctx.throw(409, '用户名已存在');}
        const user =  await new User(ctx.request.body).save();
        ctx.body = user
    }
    async update(ctx) {
        const { name } = ctx.request.body;
        if(name){
            const findUser = await User.findOne({name: name});
            if( findUser ) { ctx.throw(409, '用户名已存在');}
        }
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user;
    }
    async delete(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id);
        if (!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user;
    }
    async login(ctx) {
        ctx.verifyParams({
            name:{  type: 'string', required: true},
            pwd:{  type: 'string', required: true}
        })
        const findUser = await User.findOne(ctx.request.body);
        if( !findUser ) { ctx.throw(401, '用户名或密码不正确');}
        const token = josnwebtoken.sign({
            name: findUser.name,
            id: findUser._id
        },config.jwtPwd, {
            expiresIn: '1d'
        })
        console.log(token)
        ctx.body = {userinfo: findUser,token};
    }
}

module.exports = new UsersCtl()
