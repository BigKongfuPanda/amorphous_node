'use strict';

const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  roleId: Number,// 1- 超级管理员, 2-普通管理员, 3-重卷，4-检测，5-库房， 6- 6号机组，7-七号机组，8-8好几组，9-九号机组
  username: String,
  password: { type: Number, default: 123456 }
}, {
	collection: 'User',
	timestamps: true,
	autoIndex: false
});

UserSchema.index({username: 1});

const User = mongoose.model('User', UserSchema);

module.exports = User;