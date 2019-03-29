'use strict';

const castModel = require('../models/cast');
const log = require('log4js').getLogger("statistics");

class Statistics {
  constructor() {

  }

  async queryDataOfQuality(req, res, next) {
    const { castIdJson, furnace, caster, ribbonTypeNameJson, ribbonWidthJson,  current = 1, limit = 20 } = req.query;

    try {
      let queryCondition = {};
      if (caster) {
        queryCondition.caster = caster;
      }
      if (furnace) {
        queryCondition.furnace = furnace;
      }
      if (castIdJson) {
        let castIdList = JSON.parse(castIdJson);
        if (castIdList.length > 0) {
          castIdList = castIdList.map(item => {
            return Number(item);
          });
          queryCondition.castId = { $in: castIdList };
        }
      }
      if (ribbonTypeNameJson) {
        let ribbonTypeNameList = JSON.parse(ribbonTypeNameJson);
        if (ribbonTypeNameList.length > 0) {
          queryCondition.ribbonTypeName = { $in: ribbonTypeNameList };
        }
      }
      if (ribbonWidthJson) {
        let ribbonWidthList = JSON.parse(ribbonWidthJson);
        if (ribbonWidthList.length > 0) {
          ribbonWidthList = ribbonWidthList.map(item => {
            return Number(item);
          });
          queryCondition.ribbonWidth = { $in: ribbonWidthList };
        }
      }
      const count = await castModel.countDocuments(queryCondition);
      const totalPage = Math.ceil(count / limit);
      const list = await castModel.aggregate([
        {
          $match: queryCondition
        },
        {
          $lookup: {
            from: 'Measure',
            localField: 'furnace',
            foreignField: 'furnace',
            as: 'fromMeasure'
          }
        },
        {
          $lookup: {
            from: 'Melt',
            localField: 'furnace',
            foreignField: 'furnace',
            as: 'fromMelt'
          }
        },
        // {
        //   $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromMelt", 0 ] }, "$$ROOT" ] } }
        // },
        {
          $project: { 
            record: 0
          }
        },
        {
          $skip: (current - 1) * limit
        },
        {
          $limit: limit
        },
        {
          $sort: { furnace: -1 }
        }
      ]);

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
      console.log('查询带材质量统计失败', err);
      log.error('查询带材质量统计失败', err);
      res.send({
        status: -1,
        message: '查询带材质量统计失败'
      });
    }
  }

  async queryDataOfRatio(req, res, next) {
    const { startTime, endTime, ratioType } = req.query;

    try {
      let queryCondition = {};
      if(startTime && endTime) {
        queryCondition.createdAt = { $gt: startTime, $lt: endTime };
      }
      let list = [];
      if (ratioType === 'byCaster') {
        list = await castModel.aggregate([
          {
            $match: queryCondition
          },
          {
            $lookup: {
              from: 'Measure',
              localField: 'furnace',
              foreignField: 'furnace',
              as: 'fromMeasure'
            }
          },
          {
            $lookup: {
              from: 'Melt',
              localField: 'furnace',
              foreignField: 'furnace',
              as: 'fromMelt'
            }
          },
          // {
          //   $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromMelt", 0 ] }, "$$ROOT" ] } }
          // },
          // {
          //   $project: {
          //     fromMelt: 0,
          //     record: 0
          //   }
          // },
          {
            $unwind: '$fromMelt'
          },  
          {
            $group: {
              _id: '$caster',
              nozzleNum: { $sum: '$nozzleNum' },
              totalHeatNum: { $sum: 1 },
              alloyTotalWeight: { $sum: '$fromMelt.alloyTotalWeight' },
              rawWeight: { $sum: '$rawWeight' },
              uselessRibbonWeight: { $sum: '$uselessRibbonWeight' },
              furnaceList: {
                $push: '$$ROOT'
              }
            }
          }
        ]);  
      } else if (ratioType === 'byTeam') {
        list = await castModel.aggregate([
          {
            $match: queryCondition
          },
          {
            $lookup: {
              from: 'Measure',
              localField: 'furnace',
              foreignField: 'furnace',
              as: 'fromMeasure'
            }
          },
          {
            $lookup: {
              from: 'Melt',
              localField: 'furnace',
              foreignField: 'furnace',
              as: 'fromMelt'
            }
          },
          {
            $unwind: '$fromMelt'
          },
          {
            $group: {
              _id: '$team',
              nozzleNum: { $sum: '$nozzleNum' },
              totalHeatNum: { $sum: 1 },
              alloyTotalWeight: { $sum: '$fromMelt.alloyTotalWeight' },
              rawWeight: { $sum: '$rawWeight' },
              uselessRibbonWeight: { $sum: '$uselessRibbonWeight' },
              furnaceList: {
                $push: '$$ROOT'
              }
            }
          }
        ]);
      } else if (ratioType === 'byCastId') {
        list = await castModel.aggregate([
          {
            $match: queryCondition
          },
          {
            $lookup: {
              from: 'Measure',
              localField: 'furnace',
              foreignField: 'furnace',
              as: 'fromMeasure'
            }
          },
          {
            $lookup: {
              from: 'Melt',
              localField: 'furnace',
              foreignField: 'furnace',
              as: 'fromMelt'
            }
          },
          {
            $unwind: '$fromMelt'
          },
          {
            $group: {
              _id: '$castId',
              nozzleNum: { $sum: '$nozzleNum' },
              totalHeatNum: { $sum: 1 },
              alloyTotalWeight: { $sum: '$fromMelt.alloyTotalWeight' },
              rawWeight: { $sum: '$rawWeight' },
              uselessRibbonWeight: { $sum: '$uselessRibbonWeight' },
              furnaceList: {
                $push: '$$ROOT'
              }
            }
          }
        ]);
      }
      
      res.send({
        status: 0,
        message: '操作成功',
        data: {
          list
        }
      });
    } catch (err) {
      console.log('查询直通率统计失败', err);
      log.error('查询直通率统计失败', err);
      res.send({
        status: -1,
        message: '查询直通率统计失败'
      });
    }
  }
}

module.exports = new Statistics();