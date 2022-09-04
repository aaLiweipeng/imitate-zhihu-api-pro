const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// 定义用户 文档“Schema”【面向文档的Schema，不是MySQL的关系型Schema】
const usesrSchema = new Schema({
  // 存入数据库时，会自动把数据 转成 type指定的类型；required 为 true，则存数据没这个键会报错
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false },
  avatar_url: { type: String },  // 头像
  gender: {                      // 性别 可枚举字符串
    type: String,
    enum: ["male", "female"],
    default: "male",
    required: true,
  },
  headline: { type: String },    // 一句话简介
  locations: {type: [{type: String}] , select: false},  // 居住地 字符串数组
  business: { type: String, select: false },
  employments: {                 // 职业经历  对象数组
    type: [{
      company: { type: String },
      job: { type: String },
    }],
    select: false
  },
  educations: {                 // 教育经历  对象数组
    type: [{
      school: { type: String },
      major: { type: String },  // 专业
      diploma: { type: Number, enum: [1, 2, 3, 4, 5] }, // 高中及一下，大专，本科，硕士，博士及以上
      entrance_year: { type: Number },   // 入学年份
      graduation_year: { type: Number }, // 毕业年份
    }],
    select: false
  },
  following: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }], // 存储着id数组，这些id 可以跟 User表 相关联！
    select : false
  }
});

// 定义 Schema文档 对应的【文档集合标识】
module.exports = model('User', usesrSchema);
