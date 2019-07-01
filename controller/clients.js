'use strict';

const clientsModel = require('../models/clients');
const log = require('log4js').getLogger("clients");

class Clients {
  constructor() {

  }

  async queryData(req, res, next) {
    try {
      const list = await clientsModel.findAll();
      
      res.send({
        status: 0,
        message: '操作成功',
        data: {
          list
        }
      });
    } catch (err) {
      console.log('查询客户列表失败', err);
      log.error('查询客户列表失败', err);
      res.send({
        status: -1,
        message: '查询客户列表失败'
      });
    }
  }

  async createData(req, res, next) {
    const { client, isFlat } = req.body;
    console.log('---------------------');
    console.log(client, isFlat);
    try{
      if (!client || !isFlat) {
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
      // const data = await clientsModel.findOne({$or: [{ laminationLevel }, { laminationFactorRange }]});
      const data = await clientsModel.findOne({
        where: {
          $or: [{ client }]
        }
      });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error('客户名称重复');
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
        client, isFlat
      };
      await clientsModel.create(newData);
      res.send({
        status: 0,
        message: '新增客户成功'
      });
    } catch (err) {
      console.log('新增客户失败', err);
      log.error('新增客户失败', err);
      res.send({
        status: -1,
        message: `新增客户失败, ${err.message}`
      });
    }
  }
  
  async updateData(req, res, next) {
    const { clientsId, client, isFlat } = req.body;
    try{
      if (!clientsId || !client || !isFlat) {
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
        client, isFlat
      };
      // const { n } = await clientsModel.updateOne({ _id: laminationLevelId }, { $set: newData });
      const [ n ] = await clientsModel.update(
        newData,
      {
        where: { clientsId } 
      });
      if (n !== 0) {
        res.send({
          status: 0,
          message: '更新客户列表成功'
        });
      } else {
        throw new Error('更新客户列表失败')
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
    const { clientsId } = req.body;
    try{
      if (!clientsId) {
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
      // const { n } = await clientsModel.deleteOne({ _id: clientsId } );
      const n = await clientsModel.destroy({
         where: { clientsId } 
        });
      if (n !== 0) {
        res.send({
          status: 0,
          message: '删除客户成功'
        });
      } else {
        throw new Error('删除客户失败');
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

module.exports = new Clients();