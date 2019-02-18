'use strict';

const ribbonThicknessLevelModel = require('../models/ribbonThicknessLevel');

class RibbonThicknessLevel {
  constructor() {

  }

  async queryData(req, res, next) {
    try {
      const list = await ribbonThicknessLevelModel.find({});
      
      res.send({
        status: 0,
        message: '操作成功',
        data: {
          list
        }
      });
    } catch (err) {
      console.log('查询带材厚度级别列表失败', err);
      res.send({
        status: -1,
        message: '查询带材厚度级别列表失败'
      });
    }
  }

  async createData(req, res, next) {
    const { ribbonThicknessLevel, ribbonThicknessRange } = req.body;
    try{
      if (!ribbonThicknessLevel || !ribbonThicknessRange) {
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
      const data = await ribbonThicknessLevelModel.findOne({ ribbonThicknessLevel });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error('带材厚度值重复');
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
        ribbonThicknessLevel, ribbonThicknessRange
      };
      await ribbonThicknessLevelModel.create(newData);
      res.send({
        status: 0,
        message: '新增带材厚度级别成功'
      });
    } catch (err) {
      console.log('新增带材厚度级别失败', err);
      res.send({
        status: -1,
        message: `新增带材厚度级别失败, ${err.message}`
      });
    }
  }
  
  async updateData(req, res, next) {
    const { ribbonThicknessLevelId, ribbonThicknessLevel, ribbonThicknessRange } = req.body;
    try{
      if (!ribbonThicknessLevelId || !ribbonThicknessLevel || !ribbonThicknessRange) {
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
        ribbonThicknessLevel, ribbonThicknessRange
      };
      const { n } = await ribbonThicknessLevelModel.updateOne({ _id: ribbonThicknessLevelId }, { $set: newData });
      if (n !== 0) {
        res.send({
          status: 0,
          message: '更新带材厚度级别成功'
        });
      } else {
        throw new Error('更新带材厚度级别失败')
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
    const { ribbonThicknessLevelId } = req.body;
    try{
      if (!ribbonThicknessLevelId) {
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
      const { n } = await ribbonThicknessLevelModel.deleteOne({ _id: ribbonThicknessLevelId } );
      if (n !== 0) {
        res.send({
          status: 0,
          message: '删除带材厚度级别成功'
        });
      } else {
        throw new Error('删除带材厚度级别失败');
      }
    } catch (err) {
      res.send({
        status: -1,
        message: err.message
      });
    }
  }
}

module.exports = new RibbonThicknessLevel();