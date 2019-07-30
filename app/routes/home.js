const Router = require('koa-router');
const router = new Router();
const {index} = require('../controllers/home')

router.get('/', (ctx) => {
    index(ctx)
})

module.exports = router;
