'use strict';

const ribbonWidthModel = require('../models/ribbonWidth');

class ribbonWidth {
  constructor() {

  }

  async queryData(req, res, next) {
    try {
      const list = await ribbonWidthModel.find({});
      
      res.send({
        status: 0,
        message: '操作成功',
        data: {
          list
        }
      });
    } catch (err) {
      console.log('查询带材规格失败', err);
      res.send({
        status: -1,
        message: '查询带材规格失败'
      });
    }
  }

  async createData(req, res, next) {
    const { ribbonWidth } = req.body;
    try{
      if (!ribbonWidth) {
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
      const data = await ribbonWidthModel.findOne({ ribbonWidth });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error('材质规格重复');
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
        ribbonWidth
      };
      await ribbonWidthModel.create(newData);
      res.send({
        status: 0,
        message: '新增带材规格成功'
      });
    } catch (err) {
      console.log('新增带材规格失败', err);
      res.send({
        status: -1,
        message: `新增带材规格失败, ${err.message}`
      });
    }
  }
  
  async updateData(req, res, next) {
    const { ribbonWidthId, ribbonWidth } = req.body;
    try{
      if (!ribbonWidthId || !ribbonWidth) {
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
        ribbonWidth
      };
      const { n } = await ribbonWidthModel.updateOne({ _id: ribbonWidthId }, { $set: newData });
      if (n !== 0) {
        res.send({
          status: 0,
          message: '更新带材规格成功'
        });
      } else {
        throw new Error('更新带材规格失败')
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
    const { ribbonWidthId } = req.body;
    try{
      if (!ribbonWidthId) {
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
      const { n } = await ribbonWidthModel.deleteOne({ _id: ribbonWidthId } );
      if (n !== 0) {
        res.send({
          status: 0,
          message: '删除带材规格成功'
        });
      } else {
        throw new Error('删除带材规格失败');
      }
    } catch (err) {
      res.send({
        status: -1,
        message: err.message
      });
    }
  }
}

module.exports = new ribbonWidth();