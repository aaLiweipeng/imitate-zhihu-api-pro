const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const app = new Koa();

// routes整体注册模块
const routing = require('./routes');

// 错误处理模块的引入、注册
// const { test500 } = require("./controllers/error");
// app.use(test500);

// 引入koa-json-error
const error = require('koa-json-error');
// app.use(error());// 默认配置注册
app.use(
  error({
    postFormat: (e, { stack, ...rest }) => 
      // 如果是生产环境，返回除了堆栈的其他内容；
      // 其他环境，堆栈和其他内容 都一起返回
      process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
  })
);

app.use(bodyParser());
routing(app);

app.listen(3000, () => console.log('程序启动在 3000 端口了'));
