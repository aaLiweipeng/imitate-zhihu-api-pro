const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// 定义用户 文档“Schema”【面向文档的Schema，不是MySQL的关系型Schema】
const usesrSchema = new Schema({
  // 存入数据库时，会自动把数据 转成 type指定的类型；required 为 true，则存数据没这个键会报错
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false },
});

// 定义 Schema文档 对应的【文档集合标识】
module.exports = model('User', usesrSchema);
