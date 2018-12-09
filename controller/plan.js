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
      const count = await planModel.estimatedDocumentCount({castId});
      const totalPage = Math.ceil(count / limit);
      const list = await planModel.find({castId}).skip((current - 1) * limit).limit(limit).sort({'furnace': 'desc'});
      // 要考虑分页
      res.send({
        status: 0,
        message: '操作成功',
        data: {
          count,
          current,
          totalPage,
          limit,
          list
        }
      });
    } catch (err) {
      console.log('查询化钢记录失败', err);
      res.send({
        status: -1,
        message: '查询化钢记录失败'
      });
    }
  }
  async createData(req, res, next) {
    const { castId, furnace, ribbonTypeId, ribbonTypeName, bucket, melter, meltFurnace, newAlloyNumber = '', newAlloyWeight = 0, oldAlloyNumber = '', oldAlloyWeight = 0, mixAlloyNumber = '', mixAlloyWeight = 0, hignNbNumber = '', hignNbWeight = 0, Si = 0, Ni = 0, Cu = 0, BFe = 0, NbFe = 0, alloyTotalWeight = 0, alloyOutWeight = 0, alloyFixWeight = 0, remark = '' } = req.body;
    try{
      if (!castId || !furnace || !ribbonTypeId || !ribbonTypeName || !bucket || !melter || !meltFurnace) {
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
      const data = await castModel.findOne({ furnace });
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
        castId, furnace,
        ribbonTypeId, ribbonTypeName, bucket, melter, meltFurnace,
        newAlloyNumber, newAlloyWeight,
        oldAlloyNumber, oldAlloyWeight,
        mixAlloyNumber, mixAlloyWeight,
        hignNbNumber, hignNbWeight,
        Si, Ni, Cu, BFe, NbFe, 
        alloyTotalWeight, alloyOutWeight, alloyFixWeight,
        remark
      };
      await planModel.create(newData);
      res.send({
        status: 0,
        message: '新增化钢记录成功'
      });
    } catch (err) {
      console.log('新增化钢记录失败', err);
      res.send({
        status: -1,
        message: `新增化钢记录失败, ${err.message}`
      });
    }
  }
  async updateData(req, res, next) {
    const { castId, furnace, ribbonTypeId, ribbonTypeName, bucket, melter, meltFurnace, newAlloyNumber = '', newAlloyWeight = 0, oldAlloyNumber = '', oldAlloyWeight = 0, mixAlloyNumber = '', mixAlloyWeight = 0, hignNbNumber = '', hignNbWeight = 0, Si = 0, Ni = 0, Cu = 0, BFe = 0, NbFe = 0, alloyTotalWeight = 0, alloyOutWeight = 0, alloyFixWeight = 0, remark = '' } = req.body;
    try{
      if (!castId || !furnace || !ribbonTypeId || !ribbonTypeName || !bucket || !melter || !meltFurnace) {
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
        castId, furnace,
        ribbonTypeId, ribbonTypeName, bucket, melter, meltFurnace,
        newAlloyNumber, newAlloyWeight,
        oldAlloyNumber, oldAlloyWeight,
        mixAlloyNumber, mixAlloyWeight,
        hignNbNumber, hignNbWeight,
        Si, Ni, Cu, BFe, NbFe,
        alloyTotalWeight, alloyOutWeight, alloyFixWeight,
        remark
      };
      await planModel.updateOne({ furnace }, { $set: newData });
      res.send({
        status: 0,
        message: '更新化钢记录成功'
      });
    } catch (err) {
      console.log('更新化钢记录失败', err);
      res.send({
        status: -1,
        message: `更新化钢记录失败, ${err.message}`
      });
    }
  }
}

module.exports = new Plan();