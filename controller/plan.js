'use strict';

const planModel = require('../models/plan');

class Plan {
  constructor() {

  }

  async queryData(req, res, next) {
    const { castId, date } = req.query;
    try{
      if (!castId) {
        throw new Error('机组编号错误')
      }
      if (!date) {
        throw new Error('排产日期错误')
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
      const list = await planModel.find({date, castId}).sort({'furnace': 'desc'});
      // 当前炉次的大盘毛重，从各个机组的喷带记录表中查询

      // rawWeight

      res.send({
        status: 0,
        message: '操作成功',
        data: {
          list
        }
      });
    } catch (err) {
      console.log('查询生产计划失败', err);
      res.send({
        status: -1,
        message: '查询生产计划失败'
      });
    }
  }

  async createData(req, res, next) {
    const { date, castId, remark = '', fileNumber = '', team, taskOrder = '', ribbonTypeId, ribbonTypeName, client = '', thickness, laminationFactor, furnace, alloyWeight = 0, castTime = '' } = req.body;
    try{
      if (!date || !castId || !team || !ribbonTypeId || !ribbonTypeName || !thickness || !furnace || !laminationFactor) {
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
      const data = await planModel.findOne({ furnace });
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
        date, remark, fileNumber,
        castId, team, taskOrder,
        ribbonTypeId, ribbonTypeName, client,
        thickness, laminationFactor, furnace,
        alloyWeight, castTime
      };
      await planModel.create(newData);
      res.send({
        status: 0,
        message: '新增生产记录成功'
      });
    } catch (err) {
      console.log('新增生产记录失败', err);
      res.send({
        status: -1,
        message: `新增生产记录失败, ${err.message}`
      });
    }
  }
  async updateData(req, res, next) {
    const { date, castId, remark = '', fileNumber = '', team, taskOrder = '', ribbonTypeId, ribbonTypeName, client = '', thickness, laminationFactor, furnace, alloyWeight = 0, castTime = '' } = req.body;
    try{
      if (!date || !castId || !team || !ribbonTypeId || !ribbonTypeName || !thickness || !furnace || !laminationFactor) {
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
        date, remark, fileNumber,
        castId, team, taskOrder,
        ribbonTypeId, ribbonTypeName, client,
        thickness, laminationFactor, furnace,
        alloyWeight, castTime
      };
      await planModel.updateOne({ furnace }, { $set: newData });
      res.send({
        status: 0,
        message: '更新生产计划成功'
      });
    } catch (err) {
      console.log('更新生产计划失败', err);
      res.send({
        status: -1,
        message: `更新生产计划失败, ${err.message}`
      });
    }
  }
}

module.exports = new Plan();