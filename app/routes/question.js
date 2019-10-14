const Router = require('koa-router');
const router = new Router({ prefix: '/question' });
const config = require('../config');
const { checkQuestionExist, find, findById, create, update, userQuestionList} = require('../controllers/question');
const jwt = require('koa-jwt');
/** 中间件： 验证用户身份 将用户信息存储到ctx.state */
const jwtAuth = jwt({secret: config.jwtPwd});

/** 获取列表 */
router.get('/', find);
/** 创建 */
router.post('/create',jwtAuth, create);
/** 详情 */
router.get('/:id',checkQuestionExist,  findById);
/** 更新 */
router.put('/:id',jwtAuth, checkQuestionExist, update);

router.get('/:id/userQuestionList', userQuestionList);

module.exports = router;
