'use strict';

const sequelize = require('../mysql/db');
const castModel = require('../models/cast');
const measureModel = require('../models/measure');
const melttModel = require('../models/melt');
const log = require('log4js').getLogger("statistics");
const { toFixed, percent } = require('../util');

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

      const sqlStr = `SELECT c.castId, c.furnace, c.ribbonTypeName, c.ribbonWidth, c.caster, c.rawWeight, c.meltOutWeight, c.uselessRibbonWeight, t.alloyTotalWeight, 
      SUM(m.coilNetWeight) AS coilNetWeight, 
      SUM(m.totalStoredWeight) AS totalStoredWeight, 
      SUM(m.coilNetWeight-m.totalStoredWeight) AS unqualifiedWeight,
      SUM(m.qualityOfA) AS qualityOfA,
      SUM(m.qualityOfB) AS qualityOfB, 
      SUM(m.qualityOfC) AS qualityOfC, 
      SUM(m.qualityOfD) AS qualityOfD, 
      SUM(m.qualityOfE) AS qualityOfE, 
      SUM(m.thinRibbonWeight) AS thinRibbonWeight, 
      SUM(m.highFactorThinRibbonWeight) AS highFactorThinRibbonWeight, 
      SUM(m.inPlanStoredWeight) AS inPlanStoredWeight, 
      SUM(m.outPlanStoredWeight) AS outPlanStoredWeight, 
      SUM(m.inPlanThickRibbonWeight) AS inPlanThickRibbonWeight, 
      SUM(m.qualityOfGood) AS qualityOfGood, 
      SUM(m.qualityOfFine) AS qualityOfFine, 
      SUM(m.qualityOfNormal) AS qualityOfNormal 
      FROM cast AS c, measure AS m, melt AS t 
      WHERE c.furnace = m.furnace AND t.furnace = c.furnace 
      GROUP BY m.furnace 
      LIMIT ${limit} OFFSET ${(current - 1) * limit}`;

      let list = await sequelize.query(sqlStr, { type: sequelize.QueryTypes.SELECT });
      const count = list.length;
      const totalPage = Math.ceil(count / limit);

      list = list.map(item => {
        Object.keys(item).forEach(key => {
          if (typeof item[key] === 'number' && key !== 'castId' && key !== 'ribbonWidth') {
            item[key] = item[key].toFixed(2);
          }
        });
        return item;
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
      // 低产零产率：6,8,9机组 <= 80kg，7机组 <=50，算低产
      if (ratioType === 'byCaster') {
        const sqlStr = `SELECT c.castId, c.team, c.caster,
        COUNT(c.furnace) AS totalHeatNum,
        SUM(c.nozzleNum) AS nozzleNum,
        SUM(t.alloyTotalWeight) AS alloyTotalWeight,
        SUM(c.rawWeight) AS rawWeight,
        SUM(m.coilNetWeight) AS coilNetWeight,
        SUM(m.inPlanStoredWeight) AS inPlanStoredWeight,
        SUM(m.outPlanStoredWeight) AS outPlanStoredWeight,
        SUM(m.totalStoredWeight) AS totalStoredWeight,
        SUM(m.coilNetWeight-m.totalStoredWeight) AS unqualifiedWeight,
        SUM(c.uselessRibbonWeight) AS uselessRibbonWeight,
        SUM(c.meltOutWeight) AS meltOutWeight,
        SUM(c.rawWeight+c.uselessRibbonWeight)/SUM(t.alloyTotalWeight) AS effectiveMeltRatio,
        SUM(c.rawWeight)/SUM(c.rawWeight+c.uselessRibbonWeight) AS rollRatio,
        SUM(m.totalStoredWeight)/SUM(c.rawWeight) AS qualifiedRatio,
        SUM(m.qualityOfA) AS qualityOfA,
        SUM(m.qualityOfB) AS qualityOfB,
        SUM(m.qualityOfC) AS qualityOfC,
        SUM(m.qualityOfD) AS qualityOfD,
        SUM(m.qualityOfE) AS qualityOfE,
        SUM(m.qualityOfGood) AS qualityOfGood,
        SUM(m.qualityOfFine) AS qualityOfFine,
        SUM(m.qualityOfNormal) AS qualityOfNormal
        (SELECT COUNT(*) FROM cast WHERE rawWeight <= 50 AND castId = 7 OR rawWeight <= 80 AND castId IN (6,8,9)) AS lowHeatNum
        FROM cast AS c, measure AS m, melt AS t
        WHERE c.furnace = m.furnace AND t.furnace = c.furnace
        GROUP BY m.caster`;
        list = await sequelize.query(sqlStr, { type: sequelize.QueryTypes.SELECT });
        // 对数据进行格式化处理
        list.forEach(item => {
          item.alloyTotalWeight = toFixed(item.alloyTotalWeight);
          item.rawWeight = toFixed(item.rawWeight);
          item.coilNetWeight = toFixed(item.coilNetWeight);
          item.inPlanStoredWeight = toFixed(item.inPlanStoredWeight);
          item.outPlanStoredWeight = toFixed(item.outPlanStoredWeight);
          item.totalStoredWeight = toFixed(item.totalStoredWeight);
          item.unqualifiedWeight = toFixed(item.unqualifiedWeight);
          item.uselessRibbonWeight = toFixed(item.uselessRibbonWeight);
          item.effectiveMeltRatio = percent(item.effectiveMeltRatio);
          item.rollRatio = percent(item.rollRatio);
          item.qualifiedRatio = percent(item.qualifiedRatio);
          item.totalRatio = percent(item.effectiveMeltRatio * item.rollRatio * item.qualifiedRatio);
          item.qualityOfA = toFixed(item.qualityOfA);
          item.qualityOfB = toFixed(item.qualityOfB);
          item.qualityOfC = toFixed(item.qualityOfC);
          item.qualityOfD = toFixed(item.qualityOfD);
          item.qualityOfE = toFixed(item.qualityOfE);
          item.qualityOfGood = toFixed(item.qualityOfGood);
          item.qualityOfFine = toFixed(item.qualityOfFine);
          item.qualityOfNormal = toFixed(item.qualityOfNormal);
          // 计算低产零产
          
        });
      } else if (ratioType === 'byTeam') {
        const sqlStr = `SELECT c.castId, c.team, c.caster,
        COUNT(c.furnace) AS totalHeatNum,
        SUM(c.nozzleNum) AS nozzleNum,
        SUM(t.alloyTotalWeight) AS alloyTotalWeight,
        SUM(c.rawWeight) AS rawWeight,
        SUM(m.coilNetWeight) AS coilNetWeight,
        SUM(m.inPlanStoredWeight) AS inPlanStoredWeight,
        SUM(m.outPlanStoredWeight) AS outPlanStoredWeight,
        SUM(m.totalStoredWeight) AS totalStoredWeight,
        SUM(m.coilNetWeight-m.totalStoredWeight) AS unqualifiedWeight,
        SUM(c.uselessRibbonWeight) AS uselessRibbonWeight,
        SUM(c.meltOutWeight) AS meltOutWeight,
        SUM(c.rawWeight+c.uselessRibbonWeight)/SUM(t.alloyTotalWeight) AS effectiveMeltRatio,
        SUM(c.rawWeight)/SUM(c.rawWeight+c.uselessRibbonWeight) AS rollRatio,
        SUM(m.totalStoredWeight)/SUM(c.rawWeight) AS qualifiedRatio,
        SUM(m.qualityOfA) AS qualityOfA,
        SUM(m.qualityOfB) AS qualityOfB,
        SUM(m.qualityOfC) AS qualityOfC,
        SUM(m.qualityOfD) AS qualityOfD,
        SUM(m.qualityOfE) AS qualityOfE,
        SUM(m.qualityOfGood) AS qualityOfGood,
        SUM(m.qualityOfFine) AS qualityOfFine,
        SUM(m.qualityOfNormal) AS qualityOfNormal
        FROM cast AS c, measure AS m, melt AS t
        WHERE c.furnace = m.furnace AND t.furnace = c.furnace
        GROUP BY c.team`;
        list = sequelize.query(sqlStr, { type: sequelize.QueryTypes.SELECT });
      } else if (ratioType === 'byCastId') {
        const sqlStr = `SELECT c.castId, c.team, c.caster,
        COUNT(c.furnace) AS totalHeatNum,
        SUM(c.nozzleNum) AS nozzleNum,
        SUM(t.alloyTotalWeight) AS alloyTotalWeight,
        SUM(c.rawWeight) AS rawWeight,
        SUM(m.coilNetWeight) AS coilNetWeight,
        SUM(m.inPlanStoredWeight) AS inPlanStoredWeight,
        SUM(m.outPlanStoredWeight) AS outPlanStoredWeight,
        SUM(m.totalStoredWeight) AS totalStoredWeight,
        SUM(m.coilNetWeight-m.totalStoredWeight) AS unqualifiedWeight,
        SUM(c.uselessRibbonWeight) AS uselessRibbonWeight,
        SUM(c.meltOutWeight) AS meltOutWeight,
        SUM(c.rawWeight+c.uselessRibbonWeight)/SUM(t.alloyTotalWeight) AS effectiveMeltRatio,
        SUM(c.rawWeight)/SUM(c.rawWeight+c.uselessRibbonWeight) AS rollRatio,
        SUM(m.totalStoredWeight)/SUM(c.rawWeight) AS qualifiedRatio,
        SUM(m.qualityOfA) AS qualityOfA,
        SUM(m.qualityOfB) AS qualityOfB,
        SUM(m.qualityOfC) AS qualityOfC,
        SUM(m.qualityOfD) AS qualityOfD,
        SUM(m.qualityOfE) AS qualityOfE,
        SUM(m.qualityOfGood) AS qualityOfGood,
        SUM(m.qualityOfFine) AS qualityOfFine,
        SUM(m.qualityOfNormal) AS qualityOfNormal
        FROM cast AS c, measure AS m, melt AS t
        WHERE c.furnace = m.furnace AND t.furnace = c.furnace
        GROUP BY m.castId`;
        list = sequelize.query(sqlStr, { type: sequelize.QueryTypes.SELECT });
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