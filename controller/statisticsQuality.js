'use strict';

const castModel = require('../models/cast');
const planModel = require('../models/plan');
const mesasureModel = require('../models/measure');

class StatisticsQuality {
  constructor() {

  }

  async queryData(req, res, next) {
    const { castId, furnace, caster, ribbonTypeName, ribbonWidthJson,  current = 1, limit = 10 } = req.query;
    // try{
    //   if (!castId) {
    //     throw new Error('参数错误')
    //   }
    // }catch(err){
    //   console.log(err.message, err);
    //   res.send({
    //     status: -1,
    //     message: err.message
    //   })
    //   return;
    // }
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
      // const list = await castModel.find(queryCondition).skip((current - 1) * limit).limit(limit).sort({'furnace': 'desc'});
      
      // const list = await mesasureModel.aggregate([
      //   {
      //     $group: {
      //       _id: '$furnace',
      //       totalStoredWeight: { $sum: '$totalStoredWeight'},
      //       inPlanStoredWeight: { $sum: '$inPlanStoredWeight'},
      //       outPlanStoredWeight: { $sum: '$outPlanStoredWeight'},
      //       qualityOfA: { $sum: '$qualityOfA'},
      //       qualityOfB: { $sum: '$qualityOfB'},
      //       qualityOfC: { $sum: '$qualityOfC'},
      //       qualityOfD: { $sum: '$qualityOfD'},
      //       qualityOfE: { $sum: '$qualityOfE'},
      //       thinRibbonWeight: { $sum: '$thinRibbonWeight'},
      //       highFactorThinRibbonWeight: { $sum: '$highFactorThinRibbonWeight'},
      //       inPlanThickRibbonWeight: { $sum: '$inPlanThickRibbonWeight'},
      //       qualityOfGood: { $sum: '$qualityOfGood'},
      //       qualityOfFine: { $sum: '$qualityOfFine'},
      //       qualityOfNormal: { $sum: '$qualityOfNormal'}
      //     }
      //   },
      //   {
      //     $lookup: {
      //       from: "Cast",
      //       localField: "_id",    // field in the orders collection
      //       foreignField: "furnace",  // field in the items collection
      //       as: "fromCast"
      //     }
      //   },
      //   {
      //     $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromCast", 0 ] }, "$$ROOT" ] } }
      //   },
      //   { $project: { fromCast: 0 } }
      // ]);

      // const list = await castModel.find(queryCondition).skip((current - 1) * limit).limit(limit).sort({'furnace': 'desc'});

      // const list = await castModel.aggregate([
      //   {
      //     $lookup: {
      //       from: 'Measure',
      //       localField: 'furnace',
      //       foreignField: 'furnace',
      //       as: 'fromMeasure'
      //     }
      //   },
      //   {
      //     $skip: (current - 1) * limit
      //   },
      //   {
      //     $limit: limit
      //   },
      //   {
      //     $sort: { furnace: -1 }
      //   }
      // ]);

      const list = await castModel.aggregate([
        {
          $lookup: {
            from: 'Melt',
            localField: 'furnace',
            foreignField: 'furnace',
            as: 'fromMelt'
          }
        },
        {
          $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromMelt", 0 ] }, "$$ROOT" ] } }
        },
        { 
          $project: { fromMelt: 0 } 
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
      res.send({
        status: -1,
        message: '查询带材质量统计失败'
      });
    }
  }
}

module.exports = new StatisticsQuality();