/**
 * 配置模块  用来统一存储配置字段相关
 * 
 * @注意！
 * 这里因为是demo，密码直接写在这里，如是生产环境，密码需要用 环境变量 维护！！
 */
module.exports = {
  mytokensecret: "i-zhihu-pro-jwt",
  connectionStr:
    "mongodb+srv://liweipeng:123456789aaa@mzhihu.sfy8sih.mongodb.net/?retryWrites=true&w=majority",
};