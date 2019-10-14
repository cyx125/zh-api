const mongoose = require('mongoose');
const User = require('../modules/users');
const Answer = require('../modules/answers');
const josnwebtoken = require('jsonwebtoken');
const config = require('../config');

class UsersCtl {
    /** 中间件： 确认用户身份统一 */
    async userCheck (ctx, next) {
        if(ctx.params.id !== ctx.state.user.id) { ctx.throw(401, '没有权限')};
        await next();
    }
    /** 中间件： 判断id是否正确以及对应用户存在 */
    async checkUserExist (ctx, next) {
        if(!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
            ctx.throw('500', 'ID不合法');
        };
        const user = await User.findById(ctx.params.id);
        if(!user){
            ctx.throw('404', '用户不存在');
        }
        await next()
    }
    /**  查询用户列表 */
    async find(ctx) {
        const limit = parseInt(ctx.query.limit) || 10;
        const offset = parseInt(ctx.query.offset) || 0;
        ctx.body = await User.find({
            name: new RegExp(ctx.query.kw, "i") // 支持模糊搜索
        }).limit(limit).skip(offset);
    }
    /** 查询单个用户详情 */
    async findById(ctx) {
        const { fields = '' } = ctx.query;
        let populates = '';
        // 添加自定义获取数据
        const selectFields = fields.split(';').filter(f => f).map(f => {
            // 添加索引数据详情
            if(f === 'educations') {
                populates += ' educations.school educations.major';
            } else if (f === 'employments') {
                populates+=' employments.company employments.job';
            } else if(f === 'followingTopics') {
                populates+=' followingTopics followingTopics.introduction';
            }
            // 过滤密码
            if(f==='pwd') {
                return ''
            }
            return ' +' + f
        }).join('');// ' +locations +business +employments +educations'
        const user= await User.findById(ctx.params.id).select(selectFields).populate(populates);
        if(!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.body = user;
    }
    /** 创建用户 */
    async create(ctx) {
        ctx.verifyParams({
            name:{  type: 'string', required: true},
            pwd:{  type: 'string', required: true},
            avatar_url: { type: 'string', required: false },
            gender: { type: 'number', required: false },
            headline: { type: 'string', required: false },
            locations: { type: 'array', itemType: String, required: false },
            business: { type: 'array', itemType: Object, required: false },
            employments: { type: 'array', itemType: Object, required: false },
            educations: { type: 'array', itemType: Object, required: false },
        })
        const { name } = ctx.request.body;
        const findUser = await User.findOne({name: name});
        if( findUser ) { ctx.throw(409, '用户名已存在');}
        const user =  await new User(ctx.request.body).save();
        ctx.body = user
    }
    /** 更新用户信息 */
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
    /** 删除用户信息 */
    async delete(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id);
        if (!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user;
    }
    /** 登陆 */
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
    /** 关注列表 */
    async listFollowing(ctx) {
        const list = await User.findById(ctx.params.id).select('following').populate('following')
        if(!list) {
            ctx.throw(404, '用户不存在');
        }
        ctx.body = list.following;
    }
    /** 粉丝列表 */
    async listFollower(ctx) {
        const list = await User.find({following: ctx.params.id}); //select('following').populate('following');
        ctx.body = list;
    }
    /** 关注操作 */
    async follow(ctx) {
        const currentUser = await User.findById(ctx.state.user.id).select('following');
        if(!currentUser.following.map(id=>id.toString()).includes(ctx.params.id)){
            currentUser.following.push(ctx.params.id);
            currentUser.save();
            ctx.body= {state: 1}
        }else{
            ctx.throw(403, '已关注该用户');
        }
    }
    /** 取消关注 */
    async unfollow(ctx) {
        const currentUser = await User.findById(ctx.state.user.id).select('following');
        let index = currentUser.following.map(id=>id.toString()).indexOf(ctx.params.id);
        if(index>-1){
            currentUser.following.splice(index,1);
            currentUser.save();
            ctx.body= {state: 1}
        }else{
            ctx.throw(403, '已取消关注该用户');
        }
    }
    /** 关注话题操作 */
    async followTopic(ctx) {
        const currentUser = await User.findById(ctx.state.user.id).select('followingTopics');
        if(!currentUser.followingTopics.map(id=>id.toString()).includes(ctx.params.id)){
            currentUser.followingTopics.push(ctx.params.id);
            currentUser.save();
            ctx.body= {state: 1}
        }else{
            ctx.throw(403, '已关注');
        }
    }
    /** 取消关注话题 */
    async unfollowTopic(ctx) {
        const currentUser = await User.findById(ctx.state.user.id).select('followingTopics');
        let index = currentUser.followingTopics.map(id=>id.toString()).indexOf(ctx.params.id);
        if(index>-1){
            currentUser.followingTopics.splice(index,1);
            currentUser.save();
            ctx.body= {state: 1}
        }else{
            ctx.throw(403, '未关注该话题');
        }
    }
    /** 点赞的回答列表 */
    async listLikesAnswer(ctx) {
        const user = await User.findById(ctx.params.id).select('likingAnswers').populate('likingAnswers');
        ctx.body = user.likingAnswers;
    }
    /** 对答案点赞 */
    async likesAnswer(ctx, next) {
        const currentUser = await User.findById(ctx.state.user.id).select('likingAnswers');
        if(!currentUser.likingAnswers.map(id=>id.toString()).includes(ctx.params.id)){
            currentUser.likingAnswers.push(ctx.params.id);
            currentUser.save();
            await Answer.findByIdAndUpdate(ctx.params.id, {$inc: {likesCount: 1}});
            ctx.body= {state: 1}
        }else{
            ctx.throw(403, '已点赞');
        }
        await next()
    }
    /** 取消对答案点赞 */
    async unlikesAnswer(ctx) {
        const currentUser = await User.findById(ctx.state.user.id).select('likingAnswers');
        let index = currentUser.likingAnswers.map(id=>id.toString()).indexOf(ctx.params.id);
        if(index>-1){
            currentUser.likingAnswers.splice(index,1);
            currentUser.save();
            await Answer.findByIdAndUpdate(ctx.params.id, {$inc: {likesCount: -1}});
            ctx.body= {state: 1}
        }
        // else{
        //     ctx.throw(403, '未点赞该问题');
        // }
        ctx.status = 204;
    }
    /** 对答案踩 */
    async dislikesAnswer(ctx, next) {
        const currentUser = await User.findById(ctx.state.user.id).select('dislikingAnswers');
        if(!currentUser.dislikingAnswers.map(id=>id.toString()).includes(ctx.params.id)){
            currentUser.dislikingAnswers.push(ctx.params.id);
            currentUser.save();
            ctx.body= {state: 1}
        }else{
            ctx.throw(403, '已踩');
        }
        await next()
    }
    /** 取消对答案踩 */
    async undislikesAnswer(ctx) {
        const currentUser = await User.findById(ctx.state.user.id).select('dislikingAnswers');
        let index = currentUser.dislikingAnswers.map(id=>id.toString()).indexOf(ctx.params.id);
        if(index>-1){
            currentUser.dislikingAnswers.splice(index,1);
            currentUser.save();
            ctx.body= {state: 1}
        }
        ctx.status = 204;
    }
    /** 收藏的回答列表 */
    async listCollectedAnswers(ctx) {
        const user = await User.findById(ctx.params.id).select('collectingAnswers').populate('collectingAnswers');
        ctx.body = user.collectingAnswers;
    }
    /** 收藏答案 */
    async collectAnswer(ctx, next) {
        const currentUser = await User.findById(ctx.state.user.id).select('collectingAnswers');
        if(!currentUser.collectingAnswers.map(id=>id.toString()).includes(ctx.params.id)){
            currentUser.collectingAnswers.push(ctx.params.id);
            currentUser.save();
            ctx.body= {state: 1}
        }else{
            ctx.throw(403, '已收藏');
        }
        await next()
    }
    /** 取消收藏答案 */
    async uncollectAnswer(ctx) {
        const currentUser = await User.findById(ctx.state.user.id).select('collectingAnswers');
        let index = currentUser.collectingAnswers.map(id=>id.toString()).indexOf(ctx.params.id);
        if(index>-1){
            currentUser.collectingAnswers.splice(index,1);
            currentUser.save();
            ctx.body= {state: 1}
        }
        ctx.status = 204;
    }
}

module.exports = new UsersCtl()
