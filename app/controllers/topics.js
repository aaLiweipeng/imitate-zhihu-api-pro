/**
 * 话题模块控制器类
 */

const Topic = require('../models/topics');

class TopicsCtl {
  async find(ctx) {
    const { per_page = 10 } = ctx.query; // 默认每页返回10
    // *1 将字符串转为Number类型，max则用于处理离谱参数，保证结果最小为 1
    // skipPage 需要跳过的页数
    const skipPage = Math.max(ctx.query.page * 1, 1) - 1; 
    const perPage = Math.max(per_page * 1, 1);
    ctx.body = await Topic.find().limit(perPage).skip(skipPage * perPage);
  }

  async findById(ctx) {
    // 配置默认值为空字符串，避免用户没传该属性，导致空指针
    const { fields = '' } = ctx.query;

    // filter(field => field)  过滤有实值的field元素 避免;;之间隔着空字符串
    const selectFields = fields
      .split(";")
      .filter((field) => field)
      .map((field) => " +" + field)
      .join("");

    // findById 根据id 查询数据
    const topic = await Topic.findById(ctx.params.id).select(selectFields);
    if (!topic) {
      ctx.throw(404, "抱歉，您查询的话题不存在！");
    }
    ctx.body = topic; // 返回 查询到的 特定话题文档
  }

  async create(ctx) {
    // 用 koa-parameters 校验参数
    ctx.verifyParams({
      name: { type: "string", required: true },
      avatar_url: { type: "string", required: false },
      introduction: { type: "string", required: false },
    });

    // 数据唯一性处理
    const { name } = ctx.request.body; // 取到请求数据中的name
    const repeatedTopic = await Topic.findOne({ name });
    if (repeatedTopic) {
      ctx.throw(409, "话题已存在，请重新定义话题！");
    }

    // MongoDB存储
    // 直接把 client传过来的post数据 赋值到TopicSchema类，
    // 再调用save()即可存储数据
    const topic = await new Topic(ctx.request.body).save();
    ctx.body = topic; // 返回存进去的数据
  }

  async update(ctx) {
    // 用 koa-parameters 校验参数
    ctx.verifyParams({
      name: { type: "string", required: false },
      avatar_url: { type: "string", required: false },
      introduction: { type: "string", required: false },
    });

    const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!topic) {
      ctx.throw(404, "抱歉，您要更新的话题不存在！");
    }
    ctx.body = topic; // 返回修改前的数据
  }
}

module.exports = new TopicsCtl();
