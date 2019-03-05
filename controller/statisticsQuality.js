'use strict';

const castModel = require('../models/cast');
const planModel = require('../models/plan');

class StatisticsQuality {
  constructor() {

  }

  async queryData(req, res, next) {
    const { castId, furnace, caster, ribbonTypeName, ribbonWidthJson,  current = 1, limit = 10 } = req.query;
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
      let queryCondition = {};
      if (castId) {
        queryCondition.castId = castId;
      }
      if (caster) {
        queryCondition.caster = caster;
      }
      if (furnace) {
        queryCondition.furnace = furnace;
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
      const count = await castModel.countDocuments(queryCondition);
      const totalPage = Math.ceil(count / limit);
      const list = await castModel.find(queryCondition).skip((current - 1) * limit).limit(limit).sort({'furnace': 'desc'});
      list && list.forEach(item => {
        
      });
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
}

module.exports = new StatisticsQuality();