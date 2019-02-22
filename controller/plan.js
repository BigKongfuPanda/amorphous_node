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
      const list = await planModel.find({date, castId}).sort({'furnace': 'asc'});
      // const list = await planModel.find({date, castId})
      // .populate({
      //   path: 'rawWeight',
      //   select: {rawWeight: 1, _id: 0}
      // })
      // .sort({'furnace': 'desc'});
      
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
    const { date, castId, remark = '', fileNumber = '', team, taskOrder = '', ribbonTypeId, ribbonTypeName, ribbonWidth, client = '', thickness, laminationFactor, furnace, alloyWeight = 0, castTime = '' } = req.body;
    try{
      if (!date || !castId || !team || !ribbonTypeId || !ribbonTypeName || !ribbonWidth || !thickness || !furnace || !laminationFactor) {
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
        ribbonTypeId, ribbonTypeName, ribbonWidth, client,
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
    const { _id, date, castId, remark = '', fileNumber = '', team, taskOrder = '', ribbonTypeId, ribbonTypeName, ribbonWidth, client = '', thickness, laminationFactor, furnace, alloyWeight = 0, castTime = '', roleId } = req.body;
    try{
      if (!date || !castId) {
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
      if (Number(roleId) === 1) { // 角色：厂长，操作：审批，将 isApproved 设置为 1  
        const { m } = await planModel.updateMany({ date, castId }, { $set: {approved: 1} });
  
        if (m !== 0) {
          res.send({
            status: 0,
            message: '审批生产计划成功'
          });
        } else {
          throw new Error('审批生产计划失败')
        }
      } else { // 角色：生产计划，操作：更新数据
        const newData = {
          _id, date, remark, fileNumber,
          castId, team, taskOrder,
          ribbonTypeId, ribbonTypeName, ribbonWidth, client,
          thickness, laminationFactor, furnace,
          alloyWeight, castTime
        };
        
        const { n } = await planModel.updateOne({ _id }, { $set: newData });
  
        if (n !== 0) {
          res.send({
            status: 0,
            message: '更新生产计划成功'
          });
        } else {
          throw new Error('更新生产计划失败')
        }
      }
      
    } catch (err) {
      console.log(err.message, err);
      res.send({
        status: -1,
        message: err.message
      });
    }
  }

  // 删除
  async delData(req, res, next) {
    const { _id } = req.body;
    try{
      if (!_id) {
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
      const { n } = await planModel.deleteOne({ _id } );
      if (n !== 0) {
        res.send({
          status: 0,
          message: '删除生产计划成功'
        });
      } else {
        throw new Error('删除生产计划失败');
      }
    } catch (err) {
      res.send({
        status: -1,
        message: err.message
      });
    }
  }
}

module.exports = new Plan();