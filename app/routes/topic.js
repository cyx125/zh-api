const mongoose = require('mongoose');
const Router = require('koa-router');
const Topic = require('../modules/topic');
const router = new Router({ prefix: '/topic' });
const config = require('../config');
const { find, findById, create, update, listFollower} = require('../controllers/topic');
const jwt = require('koa-jwt');
/** 中间件： 验证用户身份 将用户信息存储到ctx.state */
const jwtAuth = jwt({secret: config.jwtPwd})
/** 中间件： 判断id是否正确以及对应话题存在 */
const checkTopicExist = async (ctx, next) => {
    if(!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
        ctx.throw('500', 'ID不合法');
    };
    const topic = await Topic.findById(ctx.params.id);
    if(!topic){
        ctx.throw('404', '话题不存在');
    }
    await next()
}
/** 获取列表 */
router.get('/', find);
/** 创建 */
router.post('/create',jwtAuth, create);
/** 详情 */
router.get('/:id',checkTopicExist,  findById);
/** 更新 */
router.put('/:id',jwtAuth, checkTopicExist, update);

router.get('/:id/listFollower', checkTopicExist, listFollower);

module.exports = router;
