'use strict';

const ribbonTypeModel = require('../models/ribbonType');
const log = require('log4js').getLogger("ribbonType");

class RibbonType {
  constructor() {

  }

  async queryData(req, res, next) {
    try {
      const list = await ribbonTypeModel.findAll();
      
      res.send({
        status: 0,
        message: '操作成功',
        data: {
          list
        }
      });
    } catch (err) {
      console.log('查询材质列表失败', err);
      log.error('查询材质列表失败', err);
      res.send({
        status: -1,
        message: '查询材质列表失败'
      });
    }
  }

  async createData(req, res, next) {
    const { ribbonTypeName, NCode } = req.body;
    try{
      if (!ribbonTypeName || !NCode) {
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
      const data = await ribbonTypeModel.findOne({ 
        where: {
          $or: [ { ribbonTypeName }, { NCode } ]
        }
      });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error('材质名称或NC编码重复');
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
        ribbonTypeName, NCode
      };
      await ribbonTypeModel.create(newData);
      res.send({
        status: 0,
        message: '新增带材材质成功'
      });
    } catch (err) {
      console.log('新增带材材质失败', err);
      log.error('新增带材材质失败', err);
      res.send({
        status: -1,
        message: `新增带材材质失败, ${err.message}`
      });
    }
  }
  
  async updateData(req, res, next) {
    const { ribbonTypeId, ribbonTypeName, NCode } = req.body;
    try{
      if (!ribbonTypeId || !ribbonTypeName || !NCode) {
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
        ribbonTypeName, NCode
      };
      // const { n } = await ribbonTypeModel.updateOne({ _id: ribbonTypeId }, { $set: newData });
      const [ n ] = await ribbonTypeModel.update(newData, {
        where: { ribbonTypeId } 
      });
      // 当更新失败的时候，返回 [0]，更新成功 n 条数据的时候，返回[n]
      if (n !== 0) {
        res.send({
          status: 0,
          message: '更新材质名称成功'
        });
      } else {
        throw new Error('更新材质名称失败')
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
    const { ribbonTypeId } = req.body;
    try{
      if (!ribbonTypeId) {
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
      // const { n } = await ribbonTypeModel.deleteOne({ _id: ribbonTypeId } );
      const n = await ribbonTypeModel.destroy({ 
        where: { ribbonTypeId: 313432 } 
      });
      // destroy 返回值：删除失败的时候，返回数字0，删除 n 条成功的时候，返回数字 n
      if (n !== 0) {
        res.send({
          status: 0,
          message: '删除材质成功'
        });
      } else {
        throw new Error('删除材质失败');
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

module.exports = new RibbonType();