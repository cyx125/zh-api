const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const topicSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  avatar_url: { type: String, default: ''}, // 头像
  introduction: { type: String, default: '', select: false}, // 简介

}, { timestamps: true });

module.exports = model('Topic', topicSchema);
