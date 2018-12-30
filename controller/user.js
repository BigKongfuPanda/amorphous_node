'use strict';

const userModel = require('../models/user');

class User {
  constructor() {

  }

  // 创建账户
  async createUser(req, res, next) {
    const { username, roleId } = req.body;
    try{
      if (!username) {
        throw new Error('用户名不能为空');
      } else if(!roleId) {
        throw new Error('用户类别不能为空');
      }
    }catch(err){
      console.log(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }
    
    try {
      const data = await userModel.findOne({ username });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error('用户名重复');
      }
    } catch (err) {
      console.log(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }

    try {
      const newData = {
        username,
        roleId
      };
      await userModel.create(newData);
      res.send({
        status: 0,
        message: '创建账号成功'
      });
    } catch (err) {
      console.log('创建账号失败', err);
      res.send({
        status: -1,
        message: `创建账号失败, ${err.message}`
      });
    }
  }

  // 修改密码
  async updatePassword(req, res, next) {
    const { username, password, newPassword } = req.body;
    try{
      if (!username) {
        throw new Error('用户名不能为空');
      } else if (!password) {
        throw new Error('密码不能为空');
      } else if (!newPassword) {
        throw new Error('新密码不能为空');
      }
    }catch(err){
      console.log(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }
    
    try {
      const data = await userModel.findOne({ username });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (!data) {
        throw new Error('用户名不存在');
      } else if (data.password !== Number(password)) {
        throw new Error('密码错误');
      }
    } catch (err) {
      console.log(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }

    try {
      await userModel.updateOne({ username }, { $set: { password: Number(newPassword) } });
      res.send({
        status: 0,
        message: '密码修改成功'
      });
    } catch (err) {
      console.log('密码修改失败', err);
      res.send({
        status: -1,
        message: `密码修改失败, ${err.message}`
      });
    }
  }

  // 登录
  async login(req, res, next) {
    const { username, password } = req.body;
    try{
      if (!username) {
        throw new Error('用户名不能为空');
      } else if (!password) {
        throw new Error('密码不能为空');
      }
    }catch(err){
      console.log(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }
    
    try {
      const data = await userModel.findOne({ username });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (!data) {
        throw new Error('用户名不存在');
      } else if (data.password !== Number(password)) {
        throw new Error('密码错误');
      } else {
        // 将当前用户的 _id 作为 存入 session 中，作为登录态
        req.session.userId = data._id;
        res.send({
          status: 0,
          message: '登录成功',
          data: {
            roleId: data.roleId
          }
        });
      }
    } catch (err) {
      console.log(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
    }
  }
  async signout(req, res, next){
		try{
			delete req.session.userId;
			res.send({
				status: 0,
				success: '退出成功'
			})
		}catch(err){
			console.log('退出失败', err)
			res.send({
				status: -1,
				message: '退出失败'
			})
		}
	}
}

module.exports = new User();