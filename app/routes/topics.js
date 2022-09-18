const jsonwebtoken = require('jsonwebtoken');
const koaJwt = require('koa-jwt');
const Router = require("koa-router"); // 引入的是构造函数
const topicsRouter = new Router({ prefix: "/topics" });
const {
  find,
  findById,
  create,
  update,
  checkTopicExist,
  listTopicFollowers
} = require("../controllers/topics");

const { mytokensecret } = require("../config");

// 认证用户token 中间件
const auth = koaJwt({ secret: mytokensecret });// 一行搞定

// 处理get接口
topicsRouter.get("/", find);
// 处理get接口带参数【获取特定话题】
topicsRouter.get("/:id", checkTopicExist, findById);

// 新建和更新 会改变服务器数据库，需要登录后的权限
topicsRouter.post("/", auth, create);
topicsRouter.patch("/:id", auth, checkTopicExist, update);// 需要先登录，然后请求的话题存在，才能做操作
// 获取指定话题的 关注者列表
topicsRouter.get("/:id/followers", checkTopicExist, listTopicFollowers);

module.exports = topicsRouter;