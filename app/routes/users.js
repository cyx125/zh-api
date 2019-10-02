const Router = require('koa-router');
const router = new Router({ prefix: '/users' });
const jwt = require('koa-jwt');
const config = require('../config');
const { find, findById, create, update, delete: del, login } = require('../controllers/users');
/** 验证用户身份 将用户信息存储到ctx.state */
const jwtAuth = jwt({secret: config.jwtPwd})
/** 确认用户身份统一 */
const userCheck = async (ctx, next) => {
    if(ctx.params.id !== ctx.state.user.id) { ctx.throw(401, '没有权限')};
    await next();
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

module.exports = router;
