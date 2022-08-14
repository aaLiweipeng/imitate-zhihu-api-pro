const Koa = require("koa"); // 引入的是构造函数
const bodyParser = require("koa-bodyparser");
const Router = require("koa-router"); // 引入的是构造函数
const app = new Koa();
const router = new Router();
const usersRouter = new Router({ prefix: '/users' });

// ----------------------
// 模拟用户校验  添加了这个实例的中间件，
// 访问了 被添加了 本中间件的 中间件时，
// 对应路由的url，只能是users，不能有其他url子字符串
const userAuth = async (ctx, next) => {
  if(ctx.url !== '/users'){
    ctx.throw(401);
  }
  await next();
};
// ----------------------


// ----------------------  koa 返回响应实践   START
const dbStorage = [ { name:"李雷" } ];  // 内存模拟数据库

// 处理默认url
router.get('/', (ctx) => {
  ctx.body = 'koa-router: 这是主页';
})

// 处理get接口
usersRouter.get("/", (ctx) => {
  // 直接返回 整个数据对象
  ctx.body = dbStorage;
});

// 处理post接口
usersRouter.post("/", (ctx) => {
  ctx.request.body.map((item) => {
    dbStorage.push(item);
  })
  ctx.body = ctx.request.body;
});

// 处理get接口带参数【获取特定用户】
usersRouter.get("/:id", (ctx) => {
  // ctx.params.id * 1  是为了把 String类型 转换成 Number类型
  // 以id为索引取数据
  ctx.body = dbStorage[ctx.params.id * 1];
});

usersRouter.put("/:id", (ctx) => {
  //直接用新的数据 覆盖 旧数据
  dbStorage[ctx.params.id * 1] = ctx.request.body;
  ctx.body = ctx.request.body;
});

usersRouter.delete("/:id", (ctx) => {
  dbStorage.splice(ctx.params.id * 1 , 1);
  ctx.status = 204;
});
// ----------------------  koa 返回响应实践   END


// -------------------------------- Koa增删改查、获取请求参数 最佳实践
// 处理默认url
// router.get('/', (ctx) => {
//   ctx.body = 'koa-router: 这是主页';
// })

// // 处理get接口
// usersRouter.get("/", (ctx) => {
//   // ctx.body = "koa-router: 这是用户列表";
//   ctx.body = [{ name: '李雷' }, { name: '马冬梅' }];
// });

// // 处理post接口
// usersRouter.post("/", (ctx) => {
//   // ctx.body = "koa-router: 创建用户";
//   ctx.body = { name: '李雷' };
// });

// // 处理get接口带参数【获取特定用户】
// usersRouter.get("/:id", (ctx) => {
//   // ctx.body = `koa-router: 这是用户${ctx.params.id}`;
//   ctx.body = { name: `${ctx.params.id}` };
// });

// usersRouter.put("/:id", (ctx) => {
//   ctx.body = { name: "李雷" + `${ctx.params.id}` };
// });

// usersRouter.delete("/:id", (ctx) => {
//   ctx.status = 204;
// });
// --------------------------------



// ---------------------- 多中间件demo ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// // 处理get接口
// usersRouter.get("/", userAuth, (ctx) => {
//   ctx.body = "koa-router: 这是用户列表";
// });

// // 处理post接口
// usersRouter.post("/", userAuth, (ctx) => {
//   ctx.body = "koa-router: 创建用户";
// });

// // 处理get接口带参数
// usersRouter.get("/:id", userAuth, (ctx) => {
//   ctx.body = `koa-router: 这是用户${ctx.params.id}`;
// });
// ---------------------- 多中间件demo



// ---------------------- 基本demo ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
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
// ----------------------

// 把中间件注册上去
app.use(bodyParser());
app.use(router.routes());
app.use(usersRouter.routes());
app.use(usersRouter.allowedMethods());

app.listen(3000);
