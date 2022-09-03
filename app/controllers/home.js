const path = require("path");
/**
 * 主页模块 控制器类
 */

class HomeCtl {
  index(ctx) {
    ctx.body = "<h1>HomeCtl  这是主页</h1>";
  }
  upload(ctx) {
    const file = ctx.request.files.file; // 取上传过来的file
    const basename = path.basename(file.filepath);
    ctx.body = { url: `${ctx.origin}/uploads/${basename}` }; // 返回 路径给 客户端 用于前端页面渲染
  }
}

// 导出去一个实例，外面用的时候 就可以直接用这个实例了， 不用自己new一下再用
module.exports = new HomeCtl();
