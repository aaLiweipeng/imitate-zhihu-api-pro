const Router = require("koa-router"); // 引入的是构造函数
const usersRouter = new Router({ prefix: "/users" });
const { find, findById, create, update, delete: del } = require('../controllers/users');

// ----------------------
// 模拟用户校验  添加了这个实例的中间件，
// 访问了 被添加了 本中间件的 中间件时，
// 对应路由的url，只能是users，不能有其他url子字符串
const userAuth = async (ctx, next) => {
  if (ctx.url !== "/users") {
    ctx.throw(401);
  }
  await next();
};
// ----------------------


// --------------重构后
// 处理get接口
usersRouter.get("/", find);

// 处理post接口
usersRouter.post("/", create);

// 处理get接口带参数【获取特定用户】
usersRouter.get("/:id", findById);

usersRouter.put("/:id", update);

usersRouter.delete("/:id", del);
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