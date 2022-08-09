const Koa = require('koa');
const app = new Koa();

// next用于执行 下一个中间件
app.use(async (ctx, next) => {
    console.log(11111111);
    await next(); 
    console.log(22222222);
    ctx.body = 'Hello World!!!';
});

app.use(async (ctx, next) => {
  console.log(333333333);
  await next();
  console.log(444444444);
});

app.use(async (ctx, next) => {
  console.log(55555555);
});

app.listen(3000);