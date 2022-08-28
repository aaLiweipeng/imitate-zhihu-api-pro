/**
 * 用户模块控制器类
 */

const jsonwebtoken = require('jsonwebtoken');
// const dbStorage = [{ name: "李雷" }]; // 内存模拟数据库
const User = require('../models/users');// 引入 user Schema
const { mytokensecret } = require("../config");

class UsersCtl {
  async find(ctx) {
    // 模拟一个运行时错误【undefined.undefined】(语法没问题，运行时错误)
    // a.b

    // 直接返回 整个数据对象
    // ctx.body = dbStorage;

    // find 返回 usersSchema 整个列表的查询结果
    ctx.body = await User.find();
  }

  async findById(ctx) {
    // findById 根据id 查询数据
    const user = await User.findById(ctx.params.id);
    if (!user) {
      ctx.throw(404, "抱歉，您查询的用户不存在！");
    } // 如果找不到这个用户
    ctx.body = user; // 返回 查询到的 特定用户文档

    // 校验id
    // ctx.params.id * 1  是为了把 String类型 转换成 Number类型
    // 以id为索引取数据
    // if (ctx.params.id * 1 > dbStorage.length - 1) {
    //   // ctx.throw(412);
    //   ctx.throw(412, '先决条件失败：id参数 大于数组长度-1，索引越界了！');
    // }
    // ctx.body = dbStorage[ctx.params.id * 1];
  }

  async create(ctx) {
    // 用 koa-parameters 校验参数
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true },
    });

    // 数据唯一性处理 需要检验要创建的用户名是否已经存在
    const { name } = ctx.request.body; // 取到请求数据中的name
    // findOne 查找数据库，返回符合条件的第一条记录
    const repeatedUser = await User.findOne({ name });
    if (repeatedUser) { ctx.throw(409, '用户已存在，请重新定义用户名！') }

    // MongoDB存储
    // 直接把 client传过来的post数据 赋值到UserSchema类，
    // 再调用save()即可存储数据
    const user = await new User(ctx.request.body).save();
    ctx.body = user; // 返回存进去的数据

    // ctx.request.body.map((item) => {
    //   dbStorage.push(item);
    // });

    // 内存模拟存储
    // dbStorage.push(ctx.request.body);
    // ctx.body = ctx.request.body;
  }

  async update(ctx) {
    // 用 koa-parameters 校验参数
    ctx.verifyParams({
      name: { type: "string", required: false },
      password: { type: "string", required: false },
    });
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!user) {
      ctx.throw(404, "抱歉，您查询的用户不存在！");
    }
    ctx.body = user; // 返回修改前的数据

    // // 校验id
    // if (ctx.params.id * 1 > dbStorage.length - 1) {
    //   ctx.throw(412, "先决条件失败：id参数 大于数组长度-1，索引越界了！");
    // }
    // //直接用新的数据 覆盖 旧数据
    // dbStorage[ctx.params.id * 1] = ctx.request.body;
    // ctx.body = ctx.request.body;
  }

  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id);
    if (!user) {
      ctx.throw(404, "抱歉，您查询的用户不存在！");
    }
    ctx.status = 204;

    // // 校验id
    // if (ctx.params.id * 1 > dbStorage.length - 1) {
    //   ctx.throw(412, "先决条件失败：id参数 大于数组长度-1，索引越界了！");
    // }
    // dbStorage.splice(ctx.params.id * 1, 1);
    // ctx.status = 204;
  }

  async login(ctx) {
    // 用 koa-parameters 校验参数格式
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true },
    });

    // 校验数据内容
    const user = await User.findOne(ctx.request.body)
    if (!user) { ctx.throw(401, '用户名或密码不正确'); }

    // 组装不敏感信息，生成token
    // expiresIn 有效时长【过期时限】
    const { _id, name } = user;
    const token = jsonwebtoken.sign({ _id, name }, mytokensecret, {expiresIn: '1d'});
    // 把 token 返回给客户端
    ctx.body = { token };
  }

}

module.exports = new UsersCtl();
