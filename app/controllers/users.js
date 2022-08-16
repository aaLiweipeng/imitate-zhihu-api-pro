/**
 * 用户模块控制器类
 */

const dbStorage = [{ name: "李雷" }]; // 内存模拟数据库

class UsersCtl {
  find(ctx) {
    // 模拟一个运行时错误【undefined.undefined】(语法没问题，运行时错误)
    a.b

    // 直接返回 整个数据对象
    ctx.body = dbStorage;
  }

  findById(ctx) {
    // ctx.params.id * 1  是为了把 String类型 转换成 Number类型
    // 以id为索引取数据
    if (ctx.params.id * 1 > dbStorage.length - 1) {
      // ctx.throw(412);
      ctx.throw(412, '先决条件失败：id参数 大于数组长度-1，索引越界了！');
    }
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
