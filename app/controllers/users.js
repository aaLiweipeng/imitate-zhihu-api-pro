const dbStorage = [{ name: "李雷" }]; // 内存模拟数据库

class UsersCtl {
  find(ctx) {
    // 直接返回 整个数据对象
    ctx.body = dbStorage;
  }
  
  findById(ctx) {
    // ctx.params.id * 1  是为了把 String类型 转换成 Number类型
    // 以id为索引取数据
    ctx.body = dbStorage[ctx.params.id * 1];
  }

  create(ctx) {
    ctx.request.body.map((item) => {
      dbStorage.push(item);
    });
    ctx.body = ctx.request.body;
  }

  update(ctx) {
    //直接用新的数据 覆盖 旧数据
    dbStorage[ctx.params.id * 1] = ctx.request.body;
    ctx.body = ctx.request.body;
  }

  delete(ctx) {
    dbStorage.splice(ctx.params.id * 1, 1);
    ctx.status = 204;
  }
}

module.exports = new UsersCtl();