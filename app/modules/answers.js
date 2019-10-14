const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const answerSchema = new Schema({
  __v: { type: Number, select: false },
  content: { type: String, required: true },
  answerer: {  type: Schema.Types.ObjectId, ref:'User',required: true, select: false}, // 回答作者
  questionId: { type: String, required: true }, // 问题id
  likesCount: {type: Number, default: 0, select: false}
}, { timestamps: true });

module.exports = model('Answer', answerSchema);
