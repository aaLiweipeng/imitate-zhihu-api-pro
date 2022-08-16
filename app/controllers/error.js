/**
 * 错误处理模块 控制器类
 */

class ErrorHandlerCtrl {
  async test500(ctx, next) {
    try {
      await next();
    } catch(err){
        // ctx.status = 500;
        ctx.status = err.status || err.statusCode || 500;
        ctx.body = {
          errorCode: err.status || err.statusCode || 500,
          message: err.message,
        };
    }
  }
}

module.exports = new ErrorHandlerCtrl();
