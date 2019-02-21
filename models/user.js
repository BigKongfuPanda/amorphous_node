'use strict';

const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  roleId: Number,// 1- 厂长 super, 2-生产计划 admin, 3-普通管理员 admin, 4-重卷 chongjuan，5-检测 jiance，6-库房 kufang，7-六号机组-喷带, 8-六号机组-化钢， 9-七个号机组-喷带, 10-七号机组-化钢，11-八号机组-喷带, 12-八号机组-化钢，13-九号机组-喷带, 14-九号机组-化钢
  username: String, // 登录名
  adminname: String, // 真实姓名
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