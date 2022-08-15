/**
 * 一个自动化读取 本目录下所有模块并注册的脚本
 */

const fs = require('fs');

module.exports = (app) => {
  console.log("readdirSync --- ", fs.readdirSync(__dirname));
  fs.readdirSync(__dirname).map((file) => {
    // 同步读取当前目录（与index.js本文件 同级的目录）下所有文件,
    // 遍历处理
    if (file === "index.js") {
      return;
    } // 排除自己，index.js无需注册
    const route = require(`./${file}`); // 取到对应模块的 export
    app.use(route.routes()).use(route.allowedMethods()); // 注册上
  });
}