'use strict';

const castModel = require('../models/cast');
const planModel = require('../models/plan');
const log = require('log4js').getLogger("cast");

class Cast {
  constructor() {

  }

  async queryData(req, res, next) {
    const { castId, team, furnace, startTime, endTime, caster, ribbonTypeName, ribbonWidthJson,  current = 1, limit = 20 } = req.query;
    try{
      if (!castId) {
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
      let queryCondition = {castId};
      if (caster) {
        queryCondition.caster = caster;
      }
      if (team) {
        queryCondition.team = team;
      }
      if (furnace) {
        queryCondition.furnace = furnace;
      }
      if (startTime && endTime) {
        queryCondition.createdAt = { $gt: startTime, $lt: endTime };
      }
      if (ribbonTypeName) {
        queryCondition.ribbonTypeName = ribbonTypeName;
      }
      if (ribbonWidthJson) {
        const ribbonWidthList = JSON.parse(ribbonWidthJson);
        if (ribbonWidthList.length > 0) {
          queryCondition.ribbonWidth = { $in: ribbonWidthList };
        }
      }
      // const count = await castModel.countDocuments(queryCondition);
      // const totalPage = Math.ceil(count / limit);
      // const list = await castModel.find(queryCondition).skip((current - 1) * limit).limit(limit).sort({'furnace': 'asc'});
      const pageData = await castModel.findAndCountAll({
        where: queryCondition,
        offset: (current - 1) * limit,
        limit: limit,
        order: [
          ['furnace', 'ASC']
        ]
      });
      const list = pageData.rows;
      const count = pageData.count;
      const totalPage = Math.ceil(count / limit);
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
      log.error(err.message, err);
      res.send({
        status: -1,
        message: '查询喷带记录失败'
      });
    }
  }

  async createData(req, res, next) {
    const { castId, furnace, team, caster, ribbonWidth, ribbonTypeName, nozzleNum, heatCupNum, tundishCar, tundish, isChangeTundish, meltOutWeight = 0, rawWeight, uselessRibbonWeight, remark, castTimes = 1, recordJson, createdAt, adminname } = req.body;
    // const _record = JSON.parse(recordJson);
    try{
      if (!castId || !furnace || !team || !caster || !ribbonWidth || !ribbonTypeName   || !tundishCar || !tundish || !isChangeTundish || !rawWeight || !uselessRibbonWeight || !recordJson || !castTimes) {
        throw new Error('参数错误');
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
      // const data = await castModel.findOne({ furnace });
      const data = await castModel.findOne({ where: {furnace} });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error('炉号重复');
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
    
    // 夜班12点后填入的数据不能自动生成第二天的日期，还得是第一天的。早上八点之前生产的数据都算是昨天的，需要把当前时间减去8小时
    const timestamp = new Date().getTime() - 8 * 60 * 60 * 1000;
    const createTime = new Date(timestamp).toISOString();

    try {
      const newData = {
        castId, furnace, caster, team,
        ribbonWidth, ribbonTypeName,
        nozzleNum, heatCupNum,
        tundishCar, tundish, isChangeTundish, 
        meltOutWeight, rawWeight, uselessRibbonWeight,
        remark, castTimes,
        createPerson: adminname,
        record: recordJson,
        createTime
      };
      await castModel.create(newData);
      // 将喷带记录表中的 rawWeight 进行更新。 生产计划中的 furname 为 06-20190111-02，而制带过程中的炉号是带有桶号: 06-20190111-02/08
      const planFurnace = furnace.substr(0, 14);
      // await planModel.updateOne({furnace: planFurnace}, {$set: {rawWeight, realRibbonWidth: ribbonWidth}});
      await planModel.update({
        rawWeight, 
        realRibbonWidth: ribbonWidth
      }, {
        where: {
          furnace: planFurnace
        }
      });
      res.send({
        status: 0,
        message: '新增喷带记录成功'
      });
    } catch (err) {
      console.log('新增喷带记录失败', err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: `新增喷带记录失败, ${err.message}`
      });
    }
  }

  async updateData(req, res, next) {
    const { castId, _id, furnace, team, caster, ribbonWidth, ribbonTypeName, nozzleNum, heatCupNum, tundishCar, tundish, isChangeTundish, meltOutWeight = 0, rawWeight, uselessRibbonWeight, remark, castTimes, recordJson, createdAt, roleId, adminname } = req.body;
    // const _record = JSON.parse(recordJson);
    try{
      if (!castId || !_id || !furnace || !team || !caster || !ribbonWidth || !ribbonTypeName || !tundishCar || !tundish || !isChangeTundish || !rawWeight || !uselessRibbonWeight || !recordJson || !castTimes || !roleId) {
        throw new Error('参数错误');
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

    // 校验炉号是否存在，不存在则返回错误
    // try {
    //   const data = await castModel.findOne({ furnace });
    //   // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
    //   if (!data) {
    //     throw new Error('炉号不存在');
    //   }
    // } catch (err) {
    //   console.log(err.message, err);
    //   res.send({
    //     status: -1,
    //     message: err.message
    //   })
    //   return;
    // }

    // 如果修改时间相比创建时间，已经过了24小时，则除了超级管理员以外不能修改。
    if (roleId != 1 && roleId != 3) {
      try {
        const createTime = new Date(createdAt);
        const period = Date.now() - createTime;
        if (period > 24*60*60*1000) {
          throw new Error('已过24小时，您无操作权限！');
        }
      } catch (err) {
        console.log(err.message, err);
        log.error(err.message, err);
        res.send({
          status: -1,
          message: err.message
        });
        return;
      }
    }

    try {
      const newData = {
        furnace, caster, team,
        ribbonWidth, ribbonTypeName,
        nozzleNum, heatCupNum,
        tundishCar, tundish, isChangeTundish, 
        meltOutWeight, rawWeight, uselessRibbonWeight,
        remark, castTimes,
        updatePerson: adminname,
        record: recordJson
      };
      // await castModel.update({ _id }, { $set: newData });
      await castModel.update(newData, {
        where: { _id }
      });
      // 将喷带记录表中的 rawWeight 进行更新。 生产计划中的 furname 为 06-20190111-02，而制带过程中的炉号是带有桶号: 06-20190111-02/08
      const planFurnace = furnace.substr(0, 14);
      // await planModel.updateOne({furnace: planFurnace}, {$set: {rawWeight, realRibbonWidth: ribbonWidth}});
      await planModel.update({
        rawWeight, 
        realRibbonWidth: ribbonWidth
      }, {
        where: {
          furnace: planFurnace
        }
      });
      res.send({
        status: 0,
        message: '更新喷带记录成功'
      });
    } catch (err) {
      console.log('更新喷带记录失败', err);
      log.error(err.message, err);
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
    } catch (err) {
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
      });
      return;
    }

    try {
      const n = await castModel.destroy({where: { _id }});
      if (n != 0) {
        res.send({
          status: 0,
          message: '删除喷带记录成功'
        });
      } else {
        throw new Error('删除喷带记录失败');
      }
    } catch (error) {
      log.error(err.message, err);
      res.send({
        status: -1,
        message: '删除喷带记录失败'
      });
    }
  }
}

module.exports = new Cast();