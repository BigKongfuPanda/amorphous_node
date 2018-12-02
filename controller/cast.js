'use strict';

const castModel = require('../models/cast');
const dtime = require('time-formater');

class Cast {
  constructor() {

  }

  async queryData(req, res, next) {
    const { castId, current = 1, limit = 20 } = req.query;
    try{
      if (!castId) {
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
      const count = await castModel.estimatedDocumentCount({castId});
      const totalPage = Math.ceil(count / limit);
      const list = await castModel.find({castId}).skip((current - 1) * limit).limit(limit).sort({'furnace': 'desc'});
      // 要考虑分页
      res.send({
        status: 0,
        message: '操作成功',
        data: {
          count,
          current,
          totalPage,
          limit,
          list
        }
      });
    } catch (err) {
      console.log('查询喷带记录失败', err);
      res.send({
        status: -1,
        message: '查询喷带记录失败'
      });
    }
  }

  async createData(req, res, next) {
    const { castId, furnace, ribbonTypeId, ribbonTypeName, ribbonWidth, record } = req.body;
    try{
      if (!castId || !furnace || !ribbonTypeId || !ribbonTypeName || !ribbonWidth) {
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
      const data = await castModel.findOne({ furnace });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error('炉号重复');
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
        castId, furnace,
        ribbonTypeId, ribbonTypeName, ribbonWidth,
        record,
        createTime: dtime().format('YYYY-MM-DD HH:mm:ss')
      };
      await castModel.create(newData);
      res.send({
        status: 0,
        message: '新增喷带记录成功'
      });
    } catch (err) {
      console.log('新增喷带记录失败', err);
      res.send({
        status: -1,
        message: `新增喷带记录失败, ${err.message}`
      });
    }
  }

  async updateData(req, res, next) {
    const { castId, furnace, ribbonTypeId, ribbonTypeName, ribbonWidth, record } = req.body;
    try{
      if (!castId || !furnace || !ribbonTypeId || !ribbonTypeName || !ribbonWidth) {
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
      const newData = {
        castId, furnace,
        ribbonTypeId, ribbonTypeName, ribbonWidth,
        record,
        createTime: dtime().format('YYYY-MM-DD HH:mm:ss')
      };
      await castModel.updateOne({ furnace }, { $set: newData });
      res.send({
        status: 0,
        message: '更新喷带记录成功'
      });
    } catch (err) {
      console.log('更新喷带记录失败', err);
      res.send({
        status: -1,
        message: `更新喷带记录失败, ${err.message}`
      });
    }
  }
}

module.exports = new Cast();