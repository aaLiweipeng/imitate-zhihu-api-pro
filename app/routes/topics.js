const jsonwebtoken = require('jsonwebtoken');
const koaJwt = require('koa-jwt');
const Router = require("koa-router"); // 引入的是构造函数
const topicsRouter = new Router({ prefix: "/topics" });
const {
  find,
  findById,
  create,
  update,
} = require("../controllers/topics");

const { mytokensecret } = require("../config");

// 认证用户token 中间件
const auth = koaJwt({ secret: mytokensecret });// 一行搞定

// 处理get接口
topicsRouter.get("/", find);
// 处理get接口带参数【获取特定话题】
topicsRouter.get("/:id", findById);

// 新建和更新 会改变服务器数据库，需要登录后的权限
topicsRouter.post("/", auth, create);
topicsRouter.patch("/:id", auth, update);

module.exports = topicsRouter;