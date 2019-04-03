'use strict';

const ribbonToughnessLevelModel = require('../models/ribbonToughnessLevel');
const log = require('log4js').getLogger("ribbonToughnessLevel");

class RibbonToughnessLevel {
  constructor() {

  }

  async queryData(req, res, next) {
    try {
      const list = await ribbonToughnessLevelModel.find({}).sort({'ribbonToughnessLevel': 'asc'});
      
      res.send({
        status: 0,
        message: '操作成功',
        data: {
          list
        }
      });
    } catch (err) {
      console.log('查询带材韧性失败', err);
      log.error('查询带材韧性失败', err);
      res.send({
        status: -1,
        message: '查询带材韧性失败'
      });
    }
  }

  async createData(req, res, next) {
    const { ribbonToughness, ribbonToughnessLevel } = req.body;
    try{
      if (!ribbonToughnessLevel || !ribbonToughness) {
        throw new Error('参数错误')
      }
    }catch(err){
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }

    try {
      const data = await ribbonToughnessLevelModel.findOne({ $or: [{ ribbonToughness }, { ribbonToughnessLevel }] });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error('韧性描述或等级重复');
      }
    } catch (err) {
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }

    try {
      const newData = {
        ribbonToughnessLevel, ribbonToughness
      };
      await ribbonToughnessLevelModel.create(newData);
      res.send({
        status: 0,
        message: '新增带材韧性成功'
      });
    } catch (err) {
      console.log('新增带材韧性失败', err);
      log.error('新增带材韧性失败', err);
      res.send({
        status: -1,
        message: `新增带材韧性失败, ${err.message}`
      });
    }
  }
  
  async updateData(req, res, next) {
    const { _id, ribbonToughnessLevel, ribbonToughness } = req.body;
    try{
      if (!_id || !ribbonToughnessLevel || !ribbonToughness) {
        throw new Error('参数错误')
      }
    }catch(err){
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }
    try {
      const newData = {
        ribbonToughnessLevel, ribbonToughness
      };
      const { n } = await ribbonToughnessLevelModel.updateOne({ _id }, { $set: newData });
      if (n !== 0) {
        res.send({
          status: 0,
          message: '更新带材韧性成功'
        });
      } else {
        throw new Error('更新带材韧性失败')
      }
    } catch (err) {
      console.log(err.message, err);
      log.error(err.message, err);
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
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }
    try {
      const { n } = await ribbonToughnessLevelModel.deleteOne({ _id } );
      if (n !== 0) {
        res.send({
          status: 0,
          message: '删除带材韧性成功'
        });
      } else {
        throw new Error('删除带材韧性失败');
      }
    } catch (err) {
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
      });
    }
  }
}

module.exports = new RibbonToughnessLevel();