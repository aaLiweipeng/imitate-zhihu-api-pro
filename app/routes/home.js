const Router = require("koa-router"); // 引入的是构造函数
const router = new Router();
const { index, upload } = require("../controllers/home"); // 别忘了，结构可以结构函数！！ 

// 处理默认url
router.get("/", index);

// 文件上传接口
router.post("/upload", upload);

module.exports = router;
