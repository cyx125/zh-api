const mongoose = require('mongoose');
const Answer = require('../modules/answers');
const config = require('../config');

class AnswerCtl {
    /** 检查回答是否存在 */
    async checkAnswerExist(ctx, next) {
        if(!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
            ctx.throw('500', 'ID不合法');
        };
        const answer = await Answer.findById(ctx.params.id).select('+answerer');
        if(!answer){
            ctx.throw(404, '答案不存在');
        }
        if(ctx.params.questionId && answer.questionId !== ctx.params.questionId){
            ctx.throw(404, '该问题下不存在该答案');
        }
        ctx.state.answer = answer;
        await next()
    }
    async checkAnswerer(ctx, next) {
        if(ctx.state.answer.answerer.toString() !== ctx.state.user.id){
            ctx.throw(404, '该答案不属于本用户');
        }
        await next()
    }
    async find(ctx,next) {
        const limit = parseInt(ctx.query.limit) || 10;
        const offset = parseInt(ctx.query.offset) || 0;
        let reg = new RegExp(ctx.query.kw, "i");
        ctx.body = await Answer.find({content: reg, questionId: ctx.params.questionId}).limit(limit).skip(offset);
    }

    async findById(ctx,next) {
        const { id } = ctx.params;
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const info = await Answer.findById(id).select(selectFields).populate('answerer');
        if(!info){
            ctx.throw(404, '回答不存在');
        }
        ctx.body = info;
    }
    async create(ctx, next) {
        ctx.verifyParams({
            content: {type: 'string', required: true},
        });
        const answer =  await new Answer({
            ...ctx.request.body,
            answerer: ctx.state.user.id,
            questionId: ctx.params.questionId}).save();
        ctx.body = answer
    }
    async update(ctx, next) {
        ctx.verifyParams({
            content: {type: 'string', required: false},
        })
        const answer = await Answer.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        ctx.body = answer;
    }
      /** 单个用户的全部问题列表 */
      async userAnswersList(ctx) {
        const list = await Answer.find({answerer: ctx.params.id});
        ctx.body = list;
    }
}

module.exports = new AnswerCtl()
