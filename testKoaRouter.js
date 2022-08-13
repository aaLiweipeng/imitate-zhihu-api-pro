const Koa = require("koa"); // 引入的是构造函数
const Router = require("koa-router"); // 引入的是构造函数
const app = new Koa();
const router = new Router();
const usersRouter = new Router({ prefix: '/users' });

// 模拟用户校验  添加了这个实例的中间件，
// 访问了 被添加了 本中间件的 中间件时，
// 对应路由的url，只能是users，不能有其他url子字符串
const userAuth = async (ctx, next) => {
  if(ctx.url !== '/users'){
    ctx.throw(401);
  }
  await next();
};

// 处理默认url
router.get('/', (ctx) => {
  ctx.body = 'koa-router: 这是主页';
})

// 处理get接口
usersRouter.get("/", userAuth, (ctx) => {
  ctx.body = "koa-router: 这是用户列表";
});

// 处理post接口
usersRouter.post("/", userAuth, (ctx) => {
  ctx.body = "koa-router: 创建用户";
});

// 处理get接口带参数
usersRouter.get("/:id", userAuth, (ctx) => {
  ctx.body = `koa-router: 这是用户${ctx.params.id}`;
});

// // 处理get接口
// router.get("/users", (ctx) => {
//   ctx.body = "koa-router: 这是用户列表";
// });

// // 处理post接口
// router.post("/users", (ctx) => {
//   ctx.body = "koa-router: 创建用户";
// });

// // 处理get接口带参数
// router.get("/users/:id", (ctx) => {
//   ctx.body = `koa-router: 这是用户${ctx.params.id}`;
// });

// 把中间件注册上去
app.use(router.routes());
app.use(usersRouter.routes());

app.listen(3000);
