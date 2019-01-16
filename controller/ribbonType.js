'use strict';

const ribbonTypeModel = require('../models/ribbonType');

class RibbonType {
  constructor() {

  }

  async queryData(req, res, next) {
    try {
      const list = await ribbonTypeModel.find({});
      
      res.send({
        status: 0,
        message: '操作成功',
        data: {
          list
        }
      });
    } catch (err) {
      console.log('查询材质列表失败', err);
      res.send({
        status: -1,
        message: '查询材质列表失败'
      });
    }
  }

  async createData(req, res, next) {
    const { ribbonTypeName } = req.body;
    try{
      if (!ribbonTypeName) {
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
      const data = await ribbonTypeModel.findOne({ ribbonTypeName });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error('材质名称重复');
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
        ribbonTypeName
      };
      await ribbonTypeModel.create(newData);
      res.send({
        status: 0,
        message: '新增带材材质成功'
      });
    } catch (err) {
      console.log('新增带材材质失败', err);
      res.send({
        status: -1,
        message: `新增带材材质失败, ${err.message}`
      });
    }
  }
  
  async updateData(req, res, next) {
    const { ribbonTypeId, ribbonTypeName } = req.body;
    try{
      if (!ribbonTypeId || !ribbonTypeName) {
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
        ribbonTypeName
      };
      const { n } = await ribbonTypeModel.updateOne({ _id: ribbonTypeId }, { $set: newData });
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
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }
    try {
      const { n } = await ribbonTypeModel.deleteOne({ _id: ribbonTypeId } );
      if (n !== 0) {
        res.send({
          status: 0,
          message: '删除材质成功'
        });
      } else {
        throw new Error('删除材质失败');
      }
    } catch (err) {
      res.send({
        status: -1,
        message: err.message
      });
    }
  }
}

module.exports = new RibbonType();