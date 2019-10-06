const path = require('path');
class HomeCtl {
    index(ctx) {
        ctx.body = 'index'
    }

    /** 图片上传 */
    upload(ctx) {
        const file = ctx.request.files.file;
        const basename = path.basename(file.path);
        return ctx.body = {url: `${ctx.origin}/upload/${basename}`};
    }
}

module.exports = new HomeCtl()
