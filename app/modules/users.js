const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
    __v: {type: Number, required: false, select: false},
    name: { type:String, require: true },
    pwd: {type: String, require: true, select: false}
})

module.exports = model('User', userSchema);
