'use strict';

const userModel = require('../models/user');
const moment = require('moment')

class User {
  constructor() {

  }

  async queryUser(req, res, next) {
    const { roleId } = req.query;
    try{
      if (!roleId && roleId != 1) {
        throw new Error('参数错误')
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
      const list = await userModel.find({});
      res.send({
        status: 0,
        message: '查询成功',
        data: {
          list
        }
      });
    } catch (err) {
      console.log('查询用户列表失败', err);
      res.send({
        status: -1,
        message: '查询用户列表失败'
      });
    }
  }

  // 创建账户
  async createUser(req, res, next) {
    const { username, roleId, adminname } = req.body;
    try{
      if (!username) {
        throw new Error('账号不能为空');
      } else if(!roleId) {
        throw new Error('用户类别不能为空');
      } else if(!adminname) {
        throw new Error('姓名不能为空');
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
      const data = await userModel.findOne({$or: [{ username }, { adminname }]});
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error('账号或者姓名重复');
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
        adminname,
        roleId,
        createTime: moment().format('YYYY-MM-DD HH:mm:ss')
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

  // 删除
  async delUser(req, res, next) {
    const { username } = req.body;
    try{
      if (!username) {
        throw new Error('参数错误')
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
      const { n } = await userModel.deleteOne({ username } );
      if (n !== 0) {
        res.send({
          status: 0,
          message: '删除账号成功'
        });
      } else {
        throw new Error('删除账号失败');
      }
    } catch (err) {
      res.send({
        status: -1,
        message: err.message
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
        throw new Error('用户不存在');
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
        status: 302,
        message: err.message
      })
      return;
    }
    
    try {
      const data = await userModel.findOne({ username });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (!data) {
        throw new Error('用户不存在');
      } else if (data.password !== Number(password)) {
        throw new Error('密码错误');
      } else {
        // 将当前用户的 _id 作为 存入 session 中，作为登录态
        req.session.userId = data._id;
        // 登陆时间
        const time = moment().format('YYYY-MM-DD HH:mm:ss');
        await userModel.updateOne({username}, { $set: {loginTime: time}});
        res.send({
          status: 0,
          message: '登录成功',
          data: {
            roleId: data.roleId,
            adminname: data.adminname
          }
        });
      }
    } catch (err) {
      console.log(err.message, err);
      res.send({
        status: 302,
        message: err.message
      })
    }
  }
  async signout(req, res, next){
		try{
			delete req.session.userId;
			res.send({
				status: 0,
				message: '退出成功'
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