const mongoose = require('mongoose');
const Comments = require('../modules/comments');
const config = require('../config');

class CommentCtl {
    /** 检查评论是否存在 */
    async checkCommentExist(ctx, next) {
        const {id, questionId, answerId } = ctx.params;
        if(!mongoose.Types.ObjectId.isValid(id)) {
            ctx.throw('500', 'ID不合法');
        };
        const comment = await Comments.findById(id);
        if(!comment){
            ctx.throw(404, '评论不存在');
        }
        if(questionId && comment.questionId !== questionId) {
            ctx.throw(404, '该问题下不存在该评论');
        }
        if(answerId && comment.answerId !== answerId) {
            ctx.throw(404, '该回答下不存在该评论');
        }
        ctx.state.comment = comment;
        await next()
    }
    async checkCommentator(ctx, next) {
        if(ctx.state.comment.commentator.toString() !== ctx.state.user.id){
            ctx.throw(404, '该评论不属于本用户');
        }
        await next()
    }
    async find(ctx,next) {
        const limit = parseInt(ctx.query.limit) || 10;
        const offset = parseInt(ctx.query.offset) || 0;
        let reg = new RegExp(ctx.query.kw, "i");
        ctx.body = await Comments.find({content: reg, questionId: ctx.params.questionId,  answerId: ctx.params.answerId}).limit(limit).skip(offset);
    }

    async findById(ctx,next) {
        const { id } = ctx.params;
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const info = await Comments.findById(id).select(selectFields).populate('commentator');
        if(!info) {
            ctx.throw(404, '评论不存在');
        }
        ctx.body = info;
    }

    async create(ctx, next) {
        ctx.verifyParams({
            content: {type: 'string', required: true},
        });
        const comment =  await new Comments({
            ...ctx.request.body,
            commentator: ctx.state.user.id,
            questionId: ctx.params.questionId,
            answerId: ctx.params.answerId}).save();
        ctx.body = comment
    }

    /** 更新单条评论 */
    async update(ctx, next) {
        ctx.verifyParams({
            content: {type: 'string', required: false},
        })
        const comment = await Comments.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        ctx.body = comment;
    }

    /** 单个用户的全部评论列表 */
    async userCommentsList(ctx) {
        const list = await Comments.find({commentator: ctx.params.id});
        ctx.body = list;
    }
}

module.exports = new CommentCtl()
