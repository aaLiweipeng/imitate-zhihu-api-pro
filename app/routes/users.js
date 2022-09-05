const jsonwebtoken = require('jsonwebtoken');
const koaJwt = require('koa-jwt');
const Router = require("koa-router"); // 引入的是构造函数
const usersRouter = new Router({ prefix: "/users" });
const {
  find,
  findById,
  create,
  update,
  delete: del,
  login,
  checkOwner,
  listFollowing,
  follow,
} = require("../controllers/users");

const { mytokensecret } = require("../config");

// 认证用户token 中间件
const auth = koaJwt({ secret: mytokensecret });// 一行搞定
// 因为koa-jwt生成的用户信息，也是放在ctx.state.user上，所以这里不用做过多的调用代码处理

// const auth = async (ctx, next) => {

//   // ---- 获取token
//   // 从客户端请求的header中 获取token，
//   // 注意header会把键都变成小写的;
//   // 且这里设置了默认值，避免用户没传token时 程序运行出错!
//   const { authorization = "" } = ctx.request.header;
//   const token = authorization.replace("Bearer ", "");

//   // ----  判空、后续处理
//   // 如果token为空，或者【token数据】被【篡改】，
//   // verify会直接报错，会导致程序停止运行，直接返回500
//   // 所以这里需要做处理，添加捕获保护!!!
//   // 使得对应场景都统一为401【没有认证】错误
//   try {
//     const user = jsonwebtoken.verify(token, mytokensecret);

//     // 认证成功，把用户信息 放入全局
//     ctx.state.user = user;
//   } catch (err) {
//     ctx.throw(401, err.message);
//   }

//   // 执行后续的中间件
//   await next();
// }

// ----------------------
// 模拟用户校验  添加了这个实例的中间件，
// 访问了 被添加了 本中间件的 中间件时，
// 对应路由的url，只能是users，不能有其他url子字符串
// const userAuth = async (ctx, next) => {
//   if (ctx.url !== "/users") {
//     ctx.throw(401);
//   }
//   await next();
// };
// ----------------------


// --------------重构后
// 处理get接口
usersRouter.get("/", find);

// 处理post接口
usersRouter.post("/", create);

// 处理get接口带参数【获取特定用户】
usersRouter.get("/:id", findById);

usersRouter.patch("/:id", auth, checkOwner, update);

usersRouter.delete("/:id", auth, checkOwner, del);

usersRouter.post("/login", login);

// 获取指定用户的 关注列表
usersRouter.get("/:id/following", listFollowing);

// 为 auth对应的当前操作用户，添加【:id 对应的用户为】关注者
// auth可以得知是哪个用户在操作，这里就不需要再加操作者id了
usersRouter.put("/following/:id", auth, follow);

// --------------


// ----------------------  koa 返回响应实践   START
// const dbStorage = [{ name: "李雷" }]; // 内存模拟数据库

// // 处理默认url
// router.get("/", (ctx) => {
//   ctx.body = "koa-router: 这是主页";
// });

// // 处理get接口
// usersRouter.get("/", (ctx) => {
//   // 直接返回 整个数据对象
//   ctx.body = dbStorage;
// });

// // 处理post接口
// usersRouter.post("/", (ctx) => {
//   ctx.request.body.map((item) => {
//     dbStorage.push(item);
//   });
//   ctx.body = ctx.request.body;
// });

// // 处理get接口带参数【获取特定用户】
// usersRouter.get("/:id", (ctx) => {
//   // ctx.params.id * 1  是为了把 String类型 转换成 Number类型
//   // 以id为索引取数据
//   ctx.body = dbStorage[ctx.params.id * 1];
// });

// usersRouter.put("/:id", (ctx) => {
//   //直接用新的数据 覆盖 旧数据
//   dbStorage[ctx.params.id * 1] = ctx.request.body;
//   ctx.body = ctx.request.body;
// });

// usersRouter.delete("/:id", (ctx) => {
//   dbStorage.splice(ctx.params.id * 1, 1);
//   ctx.status = 204;
// });
// ----------------------  koa 返回响应实践   END


module.exports = usersRouter;