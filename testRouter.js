const Koa = require("koa");
const app = new Koa();

// next用于执行 下一个中间件
app.use(async (ctx) => {
  if(ctx.url === '/') {
    ctx.body = '这是主页';

  } else if (ctx.url === '/users') {
    // 区分method
    if (ctx.method === 'GET') {
      ctx.body = '这是用户列表';
    } else if (ctx.method === 'POST') {
      ctx.body = '创建用户';
    } else {
      ctx.status = 405;
    }
  } else if (ctx.url.match(/\/users\/\w+/)) {
    const userId = ctx.url.match(/\/users\/(\w+)/)[1];
    ctx.body = `这是用户Id:   ${userId}`;
  } else {
    ctx.status = 404;
  }
});

app.listen(3000);
