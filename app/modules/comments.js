const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const commentsSchema = new Schema({
  __v: { type: Number, select: false },
  content: { type: String, required: true },
  commentator: {  type: Schema.Types.ObjectId, ref:'User',required: true, select: false}, // 回答作者
  questionId: { type: String, required: true }, // 问题id
  answerId: {type: String, required: true}
}, { timestamps: true });

module.exports = model('Comments', commentsSchema);
