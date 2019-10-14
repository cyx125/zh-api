const mongoose = require('mongoose');
const Question = require('../modules/question');
const config = require('../config');

class QuestionCtl {
    /** 中间件： 判断id是否正确以及对应话题存在 */
    async checkQuestionExist (ctx, next) {
        if(!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
            ctx.throw('500', 'ID不合法');
        };
        const question = await Question.findById(ctx.params.id);
        if(!question){
            ctx.throw('404', '话题不存在');
        }
        await next()
    }
    async find(ctx,next) {
        const limit = parseInt(ctx.query.limit) || 10;
        const offset = parseInt(ctx.query.offset) || 0;
        let reg = new RegExp(ctx.query.kw, "i");
        ctx.body = await Question.find({
            $or:[
                {
                    title: reg, // 支持模糊搜索
                },
                {
                    description: reg, // 支持模糊搜索
                }
            ]
        }).limit(limit).skip(offset);
    }
    async findById(ctx,next) {
        const { id } = ctx.params;
        const { fields = '' } = ctx.query;
        let populates = '';
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const info = await Question.findById(id).select(selectFields).populate('topics questioner');
        if(!info){
            ctx.throw(404, '问题不存在');
        }
        ctx.body = info;
    }
    async create(ctx, next) {
        ctx.verifyParams({
            title: {type: 'string', required: true},
            description: {type: 'string', required: false},
        });
        const question =  await new Question({...ctx.request.body,questioner: ctx.state.user.id}).save();
        ctx.body = question
    }
    async update(ctx, next) {
        ctx.verifyParams({
            title: {type: 'string', required: false},
            description: {type: 'string', required: false},
        })
        const question = await Question.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        ctx.body = question;
    }
      /** 单个用户的全部问题列表 */
      async userQuestionList(ctx) {
        const list = await Question.find({questioner: ctx.params.id});
        ctx.body = list;
    }
}

module.exports = new QuestionCtl()
