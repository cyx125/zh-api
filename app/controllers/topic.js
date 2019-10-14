const User = require('../modules/users');
const mongoose = require('mongoose');
const Question = require('../modules/question');
const Topic = require('../modules/topic');
const config = require('../config');

class TopicCtl {
    /** 中间件： 判断id是否正确以及对应话题存在 */
    async checkTopicExist (ctx, next) {
        if(!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
            ctx.throw('500', 'ID不合法');
        };
        const user = await Topic.findById(ctx.params.id);
        if(!user){
            ctx.throw('404', '话题不存在');
        }
        await next()
    }
    async find(ctx,next) {
        const limit = parseInt(ctx.query.limit) || 10;
        const offset = parseInt(ctx.query.offset) || 0;
        ctx.body = await Topic.find({
            name: new RegExp(ctx.query.kw, "i") // 支持模糊搜索
        }).limit(limit).skip(offset);
    }
    async findById(ctx,next) {
        const { id } = ctx.params;
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const info = await Topic.findById(id).select(selectFields);
        // if()
        if(!info){
            ctx.throw(404, '话题不存在');
        }
        ctx.body = info;
    }
    async create(ctx, next) {
        ctx.verifyParams({
            name: {type: 'string', required: true},
            avatar_url: {type: 'string', required: false},
            introduction: {type: 'string', required: false}
        });
        const info = await Topic.findOne({name: ctx.request.body.name});
        if( info ) { ctx.throw(409, '话题已存在');}
        const topic =  await new Topic(ctx.request.body).save();
        ctx.body = topic
    }
    async update(ctx, next) {
        ctx.verifyParams({
            name: {type: 'string', required: false},
            avatar_url: {type: 'string', required: false},
            introduction: {type: 'string', required: false}
        })
        const info = await Topic.findOne({name: ctx.request.body.name});
        if( info ) { ctx.throw(409, '用户名已存在');}
        const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        ctx.body = topic;
    }
      /** 粉丝列表 */
    async listFollower(ctx) {
        const list = await User.find({followingTopics: ctx.params.id}); //select('following').populate('following');
        ctx.body = list;
    }
    /** 单个话题的全部问题列表 */
    async listQuestion(ctx) {
        const limit = parseInt(ctx.query.limit) || 10;
        const offset = parseInt(ctx.query.offset) || 0;
        const list = await Question.find({topics: ctx.params.id}).limit(limit).skip(offset);;
        ctx.body = list;
    }
}

module.exports = new TopicCtl()
