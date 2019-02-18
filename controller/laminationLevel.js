'use strict';

const laminationLevelModel = require('../models/laminationLevel');

class LaminationLevel {
  constructor() {

  }

  async queryData(req, res, next) {
    try {
      const list = await laminationLevelModel.find({});
      
      res.send({
        status: 0,
        message: '操作成功',
        data: {
          list
        }
      });
    } catch (err) {
      console.log('查询带材叠片级别列表失败', err);
      res.send({
        status: -1,
        message: '查询带材叠片级别列表失败'
      });
    }
  }

  async createData(req, res, next) {
    const { laminationLevel, laminationFactorRange } = req.body;
    try{
      // laminationLevel 可以为 0
      if ((!laminationLevel && laminationLevel !== 0) || !laminationFactorRange) {
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
      const data = await laminationLevelModel.findOne({$or: [{ laminationLevel }, { laminationFactorRange }]});
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error('带材叠片值重复');
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
        laminationLevel, laminationFactorRange
      };
      await laminationLevelModel.create(newData);
      res.send({
        status: 0,
        message: '新增带材叠片级别成功'
      });
    } catch (err) {
      console.log('新增带材叠片级别失败', err);
      res.send({
        status: -1,
        message: `新增带材叠片级别失败, ${err.message}`
      });
    }
  }
  
  async updateData(req, res, next) {
    const { laminationLevelId, laminationLevel, laminationFactorRange } = req.body;
    try{
      if (!laminationLevelId || !laminationLevel || !laminationFactorRange) {
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
        laminationLevel, laminationFactorRange
      };
      const { n } = await laminationLevelModel.updateOne({ _id: laminationLevelId }, { $set: newData });
      if (n !== 0) {
        res.send({
          status: 0,
          message: '更新带材叠片级别成功'
        });
      } else {
        throw new Error('更新带材叠片级别失败')
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
    const { laminationLevelId } = req.body;
    try{
      if (!laminationLevelId) {
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
      const { n } = await laminationLevelModel.deleteOne({ _id: laminationLevelId } );
      if (n !== 0) {
        res.send({
          status: 0,
          message: '删除带材叠片级别成功'
        });
      } else {
        throw new Error('删除带材叠片级别失败');
      }
    } catch (err) {
      res.send({
        status: -1,
        message: err.message
      });
    }
  }
}

module.exports = new LaminationLevel();