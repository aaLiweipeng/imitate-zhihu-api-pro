const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const app = new Koa();

// routes整体注册模块
const routing = require('./routes');

// 错误处理模块的引入、注册
const { test500 } = require("./controllers/error");
app.use(test500);

app.use(bodyParser());
routing(app);

app.listen(3000, () => console.log('程序启动在 3000 端口了'));
