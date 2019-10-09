const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  pwd: { type: String, required: true, select: false },
  avatar_url: { type: String, default: ''}, // 头像
  gender: { type: Number, enum: [0, 1, 2], default: 0, required: true }, // 0 未知 1 男 2 女
  headline: { type: String }, // 签名
  locations: { type: [{type:String}], select: false }, // 居住地 对象数组
  business: {type: Schema.Types.ObjectId, ref: 'Topic', select: false},
  employments: { // 雇佣情况
    type: [{
      company: {type: Schema.Types.ObjectId, ref: 'Topic' },// 公司
      job: {type: Schema.Types.ObjectId, ref: 'Topic' } // 职位
    }],
    select: false,
  },
  educations: {
    type: [{
      school: {type: Schema.Types.ObjectId, ref: 'Topic' }, // 学校
      major: {type: Schema.Types.ObjectId, ref: 'Topic' }, // 专业
      diploma: { type: Number, enum: [1, 2, 3, 4, 5] }, // 文凭 1 高中 2 大专 3 本科 4 硕士 5 博士
      entrance_year: { type: Number }, // 入学年份
      graduation_year: { type: Number }, // 毕业年份
    }],
    select: false,
  },
  following: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    select: false,
  },
  followingTopics: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    select: false,
  },
  likingAnswers: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    select: false,
  },
  dislikingAnswers: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    select: false,
  },
  collectingAnswers: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    select: false,
  },
}, { timestamps: true });

module.exports = model('User', userSchema);
