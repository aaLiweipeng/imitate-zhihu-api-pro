const Koa = require("koa");
// const bodyParser = require("koa-bodyparser");
const bodyParser = require("koa-body");
const app = new Koa();

const routing = require('./routes'); // routes整体注册模块

const path = require('path')

// 错误处理模块的引入、注册
// const { test500 } = require("./controllers/error");
// app.use(test500);

const error = require('koa-json-error'); // 引入koa-json-error
const parameter = require('koa-parameter');// 引入koa-parameter

const mongoose = require('mongoose');// 引入mongoose
const { connectionStr } = require("./config");
const koaBody = require("koa-body");
mongoose.connect(connectionStr, () => console.log("MongoDB 连接成功!!!"));
mongoose.connection.on('error', console.error);
mongoose.connection.on("error", () => {
  console.error;
  console.log("MongoDB 连接失败!!!");
});

// app.use(error());// 默认配置注册
app.use(
  error({
    postFormat: (e, { stack, ...rest }) => 
      // 如果是生产环境，返回除了堆栈的其他内容；
      // 其他环境，堆栈和其他内容 都一起返回
      process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
  })
);

// 设置 multipart true即可启用文件解析；
// 因为文件的 content-type 就是 multipart-formdata 
// formidable 是 koa-body 引用的一个 node npm包，相关的选项跟 原包是一样的！
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'), // 上传文件路径
    keepExtensions: true, // 保留文件前缀
  },
}));
// 注册 koa-parameter
app.use(parameter(app));
routing(app);

app.listen(3000, () => console.log('程序启动在 3000 端口了'));
