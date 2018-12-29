'use strict';

const userModel = require('../models/user');

class User {
  constructor() {

  }

  // 创建账户
  async createUser(req, res, next) {
    const { username, userId } = req.body;
    try{
      if (!username || !userId) {
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
        userId
      };
      await castModel.create(newData);
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
    const { username, password } = req.body;
    try{
      if (!username && !password) {
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
      const data = await userModel.findOne({ username });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (!data) {
        throw new Error('用户名不存在');
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
      await userModel.updateOne({ username }, { password });
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
      if (!username && !password) {
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
      const data = await userModel.findOne({ username });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (!data) {
        throw new Error('用户名不存在');
      } else if (data.password !== password) {
        throw new Error('密码错误');
      } else {
        res.send({
          status: 0,
          message: '登录成功'
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
}

module.exports = new User();