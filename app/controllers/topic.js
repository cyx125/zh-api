const User = require('../modules/users');
const Topic = require('../modules/topic');
const config = require('../config');

class TopicCtl {
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
    //  async
}

module.exports = new TopicCtl()
