'use strict';

const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  roleId: Number,// 1- 超级管理员 super, 2-普通管理员 admin, 3-重卷 roller，4-检测 checker，5-库房 storeman， 6- 6号机组 cast6，7-七号机组 cast7，8-8好几组 cast8，9-九号机组 cast9
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