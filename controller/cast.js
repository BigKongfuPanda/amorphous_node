'use strict';

const castModel = require('../models/cast');
const planModel = require('../models/plan');

class Cast {
  constructor() {

  }

  async queryData(req, res, next) {
    const { castId, startTime, endTime, caster, current = 1, limit = 10 } = req.query;
    try{
      if (!castId) {
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
      let queryCondition = {castId};
      if (caster) {
        queryCondition.caster = caster;
      }
      if (startTime && endTime) {
        queryCondition.createdAt = { $gt: startTime, $lt: endTime };
      }
      const count = await castModel.countDocuments(queryCondition);
      const totalPage = Math.ceil(count / limit);
      const list = await castModel.find(queryCondition).skip((current - 1) * limit).limit(limit).sort({'furnace': 'desc'});
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
      console.log('查询喷带记录失败', err);
      res.send({
        status: -1,
        message: '查询喷带记录失败'
      });
    }
  }

  async createData(req, res, next) {
    const { castId, furnace, caster, ribbonWidth, ribbonTypeId, ribbonTypeName, tundishCar, tundish, isChangeTundish, meltOutWeight = 0, rawWeight, remark, record } = req.body;
    const _record = JSON.parse(record);
    try{
      if (!castId && !furnace && !caster && !ribbonWidth && !ribbonTypeId && !ribbonTypeName   && !tundishCar && !tundish && !isChangeTundish && !rawWeight && !_record) {
        throw new Error('参数错误');
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
        castId, furnace, caster, ribbonWidth,
        ribbonTypeId, ribbonTypeName,
        tundishCar, tundish, isChangeTundish, 
        meltOutWeight, rawWeight,
        remark,
        record: _record
      };
      await castModel.create(newData);
      // 将喷带记录表中的 rawWeight 进行更新。 生产计划中的 furname 为 06-20190111-02，而制带过程中的炉号是带有桶号: 06-20190111-02/08
      const planFurnace = furnace.substr(0, 14);
      await planModel.updateOne({furnace: planFurnace}, {$set: {rawWeight}});
      res.send({
        status: 0,
        message: '新增喷带记录成功'
      });
    } catch (err) {
      console.log('新增喷带记录失败', err);
      res.send({
        status: -1,
        message: `新增喷带记录失败, ${err.message}`
      });
    }
  }

  async updateData(req, res, next) {
    const { castId, furnace, caster, ribbonWidth, ribbonTypeId, ribbonTypeName, tundishCar, tundish, isChangeTundish, meltOutWeight = 0, rawWeight, remark, record } = req.body;
    const _record = JSON.parse(record);
    try{
      if (!castId && !furnace && !caster && !ribbonWidth && !ribbonTypeId && !ribbonTypeName   && !tundishCar && !tundish && !isChangeTundish && !rawWeight && !_record) {
        throw new Error('参数错误');
      }
    }catch(err){
      console.log(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }

    // 校验炉号是否存在，不存在则返回错误
    try {
      const data = await castModel.findOne({ furnace });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (!data) {
        throw new Error('炉号不存在');
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
        castId, furnace, caster, ribbonWidth,
        ribbonTypeId, ribbonTypeName,
        tundishCar, tundish, isChangeTundish, 
        meltOutWeight, rawWeight,
        remark,
        record: _record
      };
      await castModel.updateOne({ furnace }, { $set: newData });
      // 将喷带记录表中的 rawWeight 进行更新
      await planModel.updateOne({furnace}, {$set: {rawWeight}});
      res.send({
        status: 0,
        message: '更新喷带记录成功'
      });
    } catch (err) {
      console.log('更新喷带记录失败', err);
      res.send({
        status: -1,
        message: `更新喷带记录失败, ${err.message}`
      });
    }
  }

  async delData(req, res, next) {
    const { _id } = req.body;
    try {
      if (!_id) {
        throw new Error('参数错误');
      }
    } catch (error) {
      console.log(err.message, err);
      res.send({
        status: -1,
        message: error.message
      });
      return;
    }

    try {
      const { n } = await meltModel.deleteOne({ _id });
      if (n != 0) {
        res.send({
          status: 0,
          message: '删除喷带记录成功'
        });
      } else {
        throw new Error('删除喷带记录失败');
      }
    } catch (error) {
      res.send({
        status: -1,
        message: '删除喷带记录失败'
      });
    }
  }
}

module.exports = new Cast();