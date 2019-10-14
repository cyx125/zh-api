const Router = require('koa-router');
const router = new Router({ prefix: '/topic' });
const config = require('../config');
const { checkTopicExist, find, findById, create, update, listFollower, listQuestion} = require('../controllers/topic');
const jwt = require('koa-jwt');
/** 中间件： 验证用户身份 将用户信息存储到ctx.state */
const jwtAuth = jwt({secret: config.jwtPwd})

/** 获取列表 */
router.get('/', find);
/** 创建 */
router.post('/create',jwtAuth, create);
/** 详情 */
router.get('/:id',checkTopicExist,  findById);
/** 更新 */
router.put('/:id',jwtAuth, checkTopicExist, update);

router.get('/:id/listFollower', checkTopicExist, listFollower);

router.get('/:id/listQuestion', checkTopicExist, listQuestion);

module.exports = router;
