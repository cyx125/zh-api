const Router = require('koa-router');
const router = new Router({ prefix: '/users' });
const jwt = require('koa-jwt');
const config = require('../config');
const { checkUserExist, userCheck, find, findById, create, update, delete: del,
    login, listFollowing, listFollower, follow,
    unfollow, followTopic, unfollowTopic, listLikesAnswer,
    likesAnswer, unlikesAnswer, dislikesAnswer, undislikesAnswer,
    listCollectedAnswers, collectAnswer, uncollectAnswer, listComments } = require('../controllers/users');
const {checkTopicExist} = require('../controllers/topic');
const {checkAnswerExist} = require('../controllers/answers');

/** 中间件： 验证用户身份 将用户信息存储到ctx.state */
const jwtAuth = jwt({secret: config.jwtPwd})

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
/** 关注话题 */
router.put('/followTopic/:id',jwtAuth, checkTopicExist, followTopic);
/** 取消关注话题 */
router.put('/unfollowTopic/:id',jwtAuth, checkTopicExist, unfollowTopic);
/** 用户点赞的问题列表 */
router.get('/:id/listLikesAnswer', checkUserExist, listLikesAnswer);
/** 对答案点赞 */
router.put('/likesAnswer/:id',jwtAuth, checkAnswerExist, likesAnswer, undislikesAnswer);
/** 取消对答案点赞 */
router.put('/unlikesAnswer/:id',jwtAuth, checkAnswerExist, unlikesAnswer);
/** 踩答案 */
router.put('/dislikesAnswer/:id',jwtAuth, checkAnswerExist, dislikesAnswer, unlikesAnswer);
/** 取消踩答案 */
router.put('/undislikesAnswer/:id',jwtAuth, checkAnswerExist, undislikesAnswer);
/** 用户收藏的答案列表 */
router.get('/:id/listCollectedAnswers', checkUserExist, listCollectedAnswers);
/** 答案收藏 */
router.put('/collectAnswer/:id',jwtAuth, checkAnswerExist, collectAnswer);
/** 取消对答案的收藏 */
router.put('/uncollectAnswer/:id',jwtAuth, checkAnswerExist, uncollectAnswer);
/** 获取用户评论 */
router.get('/:id/listComments', checkUserExist, listComments);



module.exports = router;
