const mongoose = require('mongoose');
const Router = require('koa-router');
const User = require('../modules/users');
const router = new Router({ prefix: '/users' });
const jwt = require('koa-jwt');
const config = require('../config');
const { find, findById, create, update, delete: del, login, listFollowing, listFollower, follow, unfollow } = require('../controllers/users');
/** 中间件： 验证用户身份 将用户信息存储到ctx.state */
const jwtAuth = jwt({secret: config.jwtPwd})
/** 中间件： 确认用户身份统一 */
const userCheck = async (ctx, next) => {
    if(ctx.params.id !== ctx.state.user.id) { ctx.throw(401, '没有权限')};
    await next();
}
/** 中间件： 判断id是否正确以及对应用户存在 */
const checkUserExist = async (ctx, next) => {
    if(!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
        ctx.throw('500', 'ID不合法');
    };
    const user = await User.findById(ctx.params.id);
    if(!user){
        ctx.throw('404', '用户不存在');
    }
    await next()
}
/** 获取用户列表 */
router.get('/', find);
/** 创建用户 */
router.post('/create', create);
/** 用户详情 */
router.get('/:id', findById);
/** 编辑用户 */
router.put('/:id',jwtAuth,userCheck, update);
/** 删除用户 */
router.delete('/:id', del);
/** 用户登陆 */
router.post('/login', login);
/** 关注列表 */
router.get('/:id/following', checkUserExist, listFollowing);
/** 粉丝列表 */
router.get('/:id/follower', checkUserExist, listFollower);
/** 关注 */
router.put('/follow/:id',jwtAuth, checkUserExist, follow);
/** 取消关注 */
router.put('/unfollow/:id',jwtAuth, checkUserExist, unfollow);

module.exports = router;
