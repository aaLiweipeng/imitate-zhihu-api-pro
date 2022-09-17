/**
 * 用户模块控制器类
 */

const jsonwebtoken = require('jsonwebtoken');
// const dbStorage = [{ name: "李雷" }]; // 内存模拟数据库
const User = require('../models/users');// 引入 user Schema
const { mytokensecret } = require("../config");

class UsersCtl {

  // 进行权限判断 当前登录用户 只能 修改用户自身的信息
  async checkOwner(ctx, next) {
    // app\routes\users.js 中，认证成功的用户会存到 ctx.state.user 中
    // 比较 post传上来的id 与 ctx.state.user认证时 缓存的 当前登录用户id
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, "没有访问权限！");
    }
    await next();
  }

  async find(ctx) {
    // 模拟一个运行时错误【undefined.undefined】(语法没问题，运行时错误)
    // a.b

    // 直接返回 整个数据对象
    // ctx.body = dbStorage;

    // 分页处理
    const { per_page = 10 } = ctx.query;
    const skipPage = Math.max(ctx.query.page * 1, 1) - 1; 
    const perPage = Math.max(per_page * 1, 1);
    // find 返回 usersSchema 整个列表的查询结果
    ctx.body = await User.find({ name: new RegExp(ctx.query.q) })
      .limit(perPage)
      .skip(skipPage * perPage);
  }

  async findById(ctx) {
    // 配置默认值为空字符串，避免用户没传该属性，导致空指针
    const { fields = '' } = ctx.query;

    // filter(field => field)  过滤有实值的field元素 避免;;之间隔着空字符串
    const fieldsReal = fields.split(";").filter((field) => field);

    const selectFieldsStr = fieldsReal.map((field) => " +" + field).join("");
    const populateStr = fieldsReal.map(field => {
      if(field === 'employments'){
        return "employments.company employments.job";
      }
      if(field === 'educations'){
        return "educations.school educations.major";
      }
      return field;
    }).join(' ')

    // findById 根据id 查询数据
    const user = await User.findById(ctx.params.id)
      .select(selectFieldsStr)
      .populate(populateStr);
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
      avatar_url: { type: "string", required: false },
      gender: { type: "string", required: false },
      headline: { type: "string", required: false },
      locations: { type: "array", itemType: "string", required: false },
      business: { type: "string", required: false },
      employments: { type: "array", itemType: "object", required: false },
      educations: { type: "array", itemType: "object", required: false },
    });

    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!user) {
      ctx.throw(404, "抱歉，您要更新的用户不存在！");
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

  // 获取指定用户的 关注列表
  async listFollowing(ctx){
    const user = await User.findById(ctx.params.id)
      .select("+ following") // 获取当前用户信息，带上 following数组属性
      .populate("following");// 将following数组属性中的所有id元素，映射成User实体

    if (!user) { ctx.throw(404); }
    ctx.body = user.following;
  }

  // 获取指定用户的 粉丝
  async listFollowers(ctx) {
    // 从用户表中 查询那些 following包含我的，即关注我的，那就是我的粉丝
    const follower = await User.find({ following: ctx.params.id });
    ctx.body = follower;
  }

  // 校验中间件，校验用户是否存在
  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id);
    if (!user) { ctx.throw(404, '用户不存在'); }
    await next();
  }

  // 为 当前操作用户，添加【:id 对应的用户为】关注者
  // auth可以得知是哪个用户在操作，这里就不需要再加操作者id了
  async follow(ctx) {
    // 获取当前用户信息，带上 following数组属性
    const currentUser = await User.findById(ctx.state.user._id).select('+following');

    // 当前用户未关注这个id时，将关注者id加进去
    // 因为following的类型是 koa提供的，需要用koa提供的toString转成基本String类型，才能进行对比
    if (!currentUser.following.map(id => id.toString()).includes(ctx.params.id)) {
      currentUser.following.push(ctx.params.id);
      currentUser.save(); // 存进数据库！
    }
    ctx.status = 204;
  }

  //取消关注
  async unfollow(ctx) {
    // 获取当前用户信息，带上 following数组属性
    const currentUser = await User.findById(ctx.state.user._id).select('+following');

    // 找到对应request参数id 在 当前用户的 关注者id列表中 的索引
    const index = currentUser.following.map(id => id.toString()).indexOf(ctx.params.id);

    // 如果 索引有意义，证明有关注这个人，现在取关
    if (index > -1) {
      currentUser.following.splice(index, 1);
      currentUser.save();
    }
    ctx.status = 204;
  }
}

module.exports = new UsersCtl();
