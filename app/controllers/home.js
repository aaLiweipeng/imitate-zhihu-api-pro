class HomeCtl {
  index(ctx) {
    ctx.body = "<h1>HomeCtl  这是主页</h1>";
  }
}

// 导出去一个实例，外面用的时候 就可以直接用这个实例了， 不用自己new一下再用
module.exports = new HomeCtl();