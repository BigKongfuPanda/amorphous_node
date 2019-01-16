'use strict';

const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  roleId: Number,// 1- 超级管理员 super, 2-普通管理员 admin, 3-重卷 chongjuan，4-检测 jiance，5-库房 kufang， 6- 6号机组 liuhaojizu，7-七号机组 qihaojizu，8-8号机组 bahaojizu，9-九号机组 jiuhaojizu
  username: String,
  password: { type: Number, default: 123456 },
  loginTime: String, //登陆时间
  createTime: String // 创建时间
}, {
	collection: 'User',
	timestamps: true,
	autoIndex: false
});

UserSchema.index({username: 1});

const User = mongoose.model('User', UserSchema);

module.exports = User;