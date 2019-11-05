const Router = require('koa-router');
const router = new Router({ prefix: '/question/:questionId/answers/:answerId/comments' });
const config = require('../config');
const { checkCommentExist, checkCommentator, find, findById, create, update, userCommentsList} = require('../controllers/comments');
const jwt = require('koa-jwt');
/** 中间件： 验证用户身份 将用户信息存储到ctx.state */
const jwtAuth = jwt({secret: config.jwtPwd});

/** 获取列表 */
router.get('/', find);
/** 创建 */
router.post('/create',jwtAuth, create);
/** 详情 */
router.get('/:id',checkCommentExist,  findById);
/** 更新 */
router.put('/:id',jwtAuth,checkCommentExist, checkCommentator, update);
/** 用户评论列表 */
router.get('/:id/userCommentsList', userCommentsList);

module.exports = router;
