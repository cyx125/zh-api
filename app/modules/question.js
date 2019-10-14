const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const topicSchema = new Schema({
  __v: { type: Number, select: false },
  title: { type: String, required: true },
  description: { type: String, default: ''}, // 描述
  questioner: {  type: Schema.Types.ObjectId, ref:'User', select: false}, // 简介
  topics: {
      type: [{type: Schema.Types.ObjectId, ref: 'Topic'}], select: false
  }
}, { timestamps: true });

module.exports = model('Question', topicSchema);
