'use strict';

const meltModel = require('../models/melt');

class Melt {
  constructor() {
    super();
    this.queryData = this.queryData.bind(this);
    this.createData = this.createData.bind(this);
    this.updateData = this.updateData.bind(this);
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
        status: 1,
        message: err.message
      })
      return;
    }
    try {
      // let count = await meltModel.count({castId});
      const count = await meltModel.estimatedDocumentCount({castId});
      const totalPage = Math.ceil(count / limit);
      const list = await meltModel.find({castId}).skip((current - 1) * limit).limit(limit).sort({'furnace': 'desc'});
      // 要考虑分页
      res.send({
        status: 0,
        message: '操作成功',
        data: {
          count,
          current,
          totalPage, 
          list
        }
      });
    } catch (error) {
      
    }
  }
  async createData(req, res, next) {
    
  }
  async updateData(req, res, next) {
    
  }
}

module.exports = new Melt();