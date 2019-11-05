const Router = require('koa-router');
const router = new Router({ prefix: '/question/:questionId/answers' });
const config = require('../config');
const { checkAnswerExist, checkAnswerer, find, findById, create, update, userAnswersList} = require('../controllers/answers');
const jwt = require('koa-jwt');
/** 中间件： 验证用户身份 将用户信息存储到ctx.state */
const jwtAuth = jwt({secret: config.jwtPwd});

/** 获取列表 */
router.get('/', find);
/** 创建 */
router.post('/create',jwtAuth, create);
/** 详情 */
router.get('/:id',checkAnswerExist,  findById);
/** 更新 */
router.put('/:id',jwtAuth,checkAnswerExist, checkAnswerer, update);

router.get('/:id/userAnswersList', userAnswersList);

module.exports = router;
