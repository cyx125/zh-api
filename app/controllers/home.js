class HomeCtl {
    index(ctx) {
        ctx.body = 'index'
    }
}

module.exports = new HomeCtl()
