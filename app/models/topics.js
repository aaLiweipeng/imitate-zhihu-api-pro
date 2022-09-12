const mongoose = require("mongoose");

const { Schema, model } = mongoose;

// 定义话题 文档“Schema”
const topicSchema = new Schema({
  // 存入数据库时，会自动把数据 转成 type指定的类型；required 为 true，则存数据没这个键会报错
  __v: { type: Number, select: false },
  name: { type: String },
  avatar_url: { type: String, select: false },
  introduction: { type: String, select: false },
});

// 定义 Schema文档 对应的【文档集合标识】
module.exports = model("Topic", topicSchema);
