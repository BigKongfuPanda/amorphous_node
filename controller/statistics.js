"use strict";

const sequelize = require("../mysql/db");
const castModel = require("../models/cast");
const measureModel = require("../models/measure");
const melttModel = require("../models/melt");
const log = require("log4js").getLogger("statistics");
const { toFixed, percent, handleSqlQuery } = require("../util");
const config = require("config-lite")(__dirname);
const TABLE_NAME = config.tableName;
class Statistics {
  constructor() {}

  async queryDataOfQuality(req, res, next) {
    const {
      castIdJson,
      furnace,
      caster,
      ribbonTypeNameJson,
      ribbonWidthJson,
      current = 1,
      limit = 20,
    } = req.query;

    try {
      const queryCondition = handleSqlQuery({
        equal: {
          furnace,
          caster,
        },
        json: {
          castId: castIdJson,
          ribbonTypeName: ribbonTypeNameJson,
          ribbonWidth: ribbonWidthJson,
        },
      });

      // let queryCondition = "";
      // if (caster) {
      //   queryCondition += `caster=${caster}`;
      // }
      // if (furnace) {
      //   queryCondition +=
      //     queryCondition !== ""
      //       ? ` AND furnace=${furnace}`
      //       : ` furnace=${furnace}`;
      // }
      // if (castIdJson) {
      //   let castIdList = JSON.parse(castIdJson);
      //   if (castIdList.length > 0) {
      //     const castIds = castIdList.join();
      //     queryCondition +=
      //       queryCondition !== ""
      //         ? ` AND castId IN (${castIds})`
      //         : ` castId IN (${castIds})`;
      //   }
      // }
      // if (ribbonTypeNameJson) {
      //   let ribbonTypeNameList = JSON.parse(ribbonTypeNameJson);
      //   if (ribbonTypeNameList.length > 0) {
      //     const ribbonTypeNames = ribbonTypeNameList.join();
      //     queryCondition +=
      //       queryCondition !== ""
      //         ? ` AND ribbonTypeName IN (${ribbonTypeNames})`
      //         : ` ribbonTypeName IN (${ribbonTypeNames})`;
      //   }
      // }
      // if (ribbonWidthJson) {
      //   let ribbonWidthList = JSON.parse(ribbonWidthJson);
      //   if (ribbonWidthList.length > 0) {
      //     const ribbonWidths = ribbonWidthList.join();
      //     queryCondition +=
      //       queryCondition !== ""
      //         ? ` AND ribbonWidth IN (${ribbonWidths})`
      //         : ` ribbonWidth IN (${ribbonWidths})`;
      //   }
      // }

      const sqlStr = `select j.*, m.* from
      (SELECT
          furnace,
          SUM(coilNetWeight) AS coilNetWeight,
          SUM(totalStoredWeight) AS totalStoredWeight,
          SUM(coilNetWeight-totalStoredWeight) AS unqualifiedWeight,
          SUM(qualityOfA) AS qualityOfA,
          SUM(qualityOfB) AS qualityOfB,
          SUM(qualityOfC) AS qualityOfC,
          SUM(qualityOfD) AS qualityOfD,
          SUM(qualityOfE) AS qualityOfE,
          SUM(thinRibbonWeight) AS thinRibbonWeight,
          SUM(highFactorThinRibbonWeight) AS highFactorThinRibbonWeight,
          SUM(inPlanStoredWeight) AS inPlanStoredWeight,
          SUM(outPlanStoredWeight) AS outPlanStoredWeight,
          SUM(inPlanThickRibbonWeight) AS inPlanThickRibbonWeight,
          SUM(qualityOfGood) AS qualityOfGood,
          SUM(qualityOfFine) AS qualityOfFine,
          SUM(qualityOfNormal) AS qualityOfNormal
      FROM measure ${queryCondition}  GROUP BY furnace) AS m LEFT JOIN (
          SELECT c.castId, c.furnace, c.ribbonTypeName, c.ribbonWidth, c.caster, c.rawWeight, c.meltOutWeight, c.uselessRibbonWeight, t.alloyTotalWeight
      FROM cast c JOIN melt t
          ON c.furnace = t.furnace
      ) j ON m.furnace = j.furnace
      LIMIT ${limit} OFFSET ${(current - 1) * limit}`;

      let list = await sequelize.query(sqlStr, {
        type: sequelize.QueryTypes.SELECT,
      });
      const count = list.length;
      const totalPage = Math.ceil(count / limit);

      list = list.map((item) => {
        Object.keys(item).forEach((key) => {
          if (
            typeof item[key] === "number" &&
            key !== "castId" &&
            key !== "ribbonWidth"
          ) {
            item[key] = item[key].toFixed(2);
          }
        });
        return item;
      });

      // 要考虑分页
      res.send({
        status: 0,
        message: "操作成功",
        data: {
          count,
          current,
          totalPage,
          limit,
          list,
        },
      });
    } catch (err) {
      console.log("查询带材质量统计失败", err);
      log.error("查询带材质量统计失败", err);
      res.send({
        status: -1,
        message: "查询带材质量统计失败",
      });
    }
  }

  async queryDataOfRatio(req, res, next) {
    const { startTime, endTime, ratioType } = req.query;

    try {
      let queryCondition = {};
      if (startTime && endTime) {
        queryCondition.createdAt = { $gt: startTime, $lt: endTime };
      }
      let list = [];
      // 低产零产率：6,8,9机组 <= 80kg，7机组 <=50，算低产
      if (ratioType === "byCaster") {
        const sqlStr = `
        SELECT
          j.caster,
          m.totalHeatNum,
          j.nozzleNum,
          j.lowHeatNum,
          j.zeroHeatNum,
          j.alloyTotalWeight,
          j.rawWeight,
          m.coilNetWeight,
          m.inPlanStoredWeight,
          m.outPlanStoredWeight,
          m.totalStoredWeight,
          (m.coilNetWeight-m.totalStoredWeight) AS unqualifiedWeight,
          j.uselessRibbonWeight,
          j.meltOutWeight,
          (j.rawWeight+j.uselessRibbonWeight)/j.alloyTotalWeight AS effectiveMeltRatio,
          j.rawWeight/(j.rawWeight+j.uselessRibbonWeight) AS rollRatio,
          m.totalStoredWeight/j.rawWeight AS qualifiedRatio,
          m.qualityOfA,
          m.qualityOfB,
          m.qualityOfC,
          m.qualityOfD,
          m.qualityOfE,
          m.qualityOfGood,
          m.qualityOfFine,
          m.qualityOfNormal
        FROM
          (
            SELECT
            caster,
            COUNT(DISTINCT furnace) AS totalHeatNum,
            SUM(coilNetWeight) AS coilNetWeight,
            SUM(inPlanStoredWeight) AS inPlanStoredWeight,
            SUM(outPlanStoredWeight) AS outPlanStoredWeight,
            SUM(totalStoredWeight) AS totalStoredWeight,
            SUM(coilNetWeight-totalStoredWeight) AS unqualifiedWeight,
            SUM(qualityOfA) AS qualityOfA,
            SUM(qualityOfB) AS qualityOfB,
            SUM(qualityOfC) AS qualityOfC,
            SUM(qualityOfD) AS qualityOfD,
            SUM(qualityOfE) AS qualityOfE,
            SUM(qualityOfGood) AS qualityOfGood,
            SUM(qualityOfFine) AS qualityOfFine,
            SUM(qualityOfNormal) AS qualityOfNormal
            FROM measure
            GROUP BY caster
          ) AS m
          LEFT JOIN
          (
            SELECT
            c.caster,
            SUM(t.alloyTotalWeight) AS alloyTotalWeight,
            SUM(c.nozzleNum) AS nozzleNum,
            SUM(c.rawWeight) AS rawWeight,
            SUM(c.uselessRibbonWeight) AS uselessRibbonWeight,
            SUM(c.meltOutWeight) AS meltOutWeight,
            SUM(c.rawWeight+c.uselessRibbonWeight)/SUM(t.alloyTotalWeight) AS effectiveMeltRatio,
            SUM(c.rawWeight)/SUM(c.rawWeight+c.uselessRibbonWeight) AS rollRatio,
            (
                SELECT COUNT(*)
                FROM cast
                WHERE (rawWeight <= 50 AND castId = 7) OR (rawWeight <= 80 AND castId IN (6,8,9))
            ) AS lowHeatNum,
            (
                SELECT COUNT(*)
                FROM cast
                WHERE rawWeight = 0
            ) AS zeroHeatNum
            FROM cast AS c
            JOIN melt AS t
            ON c.furnace = t.furnace
            GROUP BY c.caster
          ) AS j
          ON m.caster = j.caster;`;
        list = await sequelize.query(sqlStr, {
          type: sequelize.QueryTypes.SELECT,
        });
      } else if (ratioType === "byTeam") {
        const sqlStr = `
        SELECT 
          j.team, 
          COUNT(m.furnace) AS totalHeatNum,
          SUM(j.nozzleNum) AS nozzleNum, 
          SUM(j.alloyTotalWeight) AS alloyTotalWeight,
          SUM(j.rawWeight) AS rawWeight,
          SUM(m.coilNetWeight) AS coilNetWeight, 
          SUM(m.inPlanStoredWeight) AS inPlanStoredWeight,
          SUM(m.outPlanStoredWeight) AS outPlanStoredWeight,
          SUM(m.totalStoredWeight) AS totalStoredWeight,
          SUM(m.coilNetWeight-m.totalStoredWeight) AS unqualifiedWeight,
          SUM(j.uselessRibbonWeight) AS uselessRibbonWeight,
          SUM(j.meltOutWeight) AS meltOutWeight,
          SUM(j.rawWeight+j.uselessRibbonWeight)/SUM(j.alloyTotalWeight) AS effectiveMeltRatio,
          SUM(j.rawWeight)/SUM(j.rawWeight+j.uselessRibbonWeight) AS rollRatio,
          SUM(m.totalStoredWeight)/SUM(j.rawWeight) AS qualifiedRatio,
          SUM(m.qualityOfA) AS qualityOfA,
          SUM(m.qualityOfB) AS qualityOfB, 
          SUM(m.qualityOfC) AS qualityOfC,
          SUM(m.qualityOfD) AS qualityOfD,
          SUM(m.qualityOfE) AS qualityOfE,
          SUM(m.qualityOfGood) AS qualityOfGood,
          SUM(m.qualityOfFine) AS qualityOfFine,
          SUM(m.qualityOfNormal) AS qualityOfNormal
        FROM
          (
            SELECT
              furnace,
              SUM(coilNetWeight) AS coilNetWeight, 
              SUM(inPlanStoredWeight) AS inPlanStoredWeight,
              SUM(outPlanStoredWeight) AS outPlanStoredWeight,
              SUM(totalStoredWeight) AS totalStoredWeight,
              SUM(coilNetWeight-totalStoredWeight) AS unqualifiedWeight,
              SUM(qualityOfA) AS qualityOfA,
              SUM(qualityOfB) AS qualityOfB,
              SUM(qualityOfC) AS qualityOfC,
              SUM(qualityOfD) AS qualityOfD,
              SUM(qualityOfE) AS qualityOfE,
              SUM(qualityOfGood) AS qualityOfGood,
              SUM(qualityOfFine) AS qualityOfFine,
              SUM(qualityOfNormal) AS qualityOfNormal
            FROM measure GROUP BY furnace
          ) AS m 
          LEFT JOIN
          (
            SELECT 
              c.*, t.alloyTotalWeight,
              (
                SELECT COUNT(*)
                FROM cast
                WHERE rawWeight <= 50 AND castId = 7 OR rawWeight <= 80 AND castId IN (6,8,9)
              ) AS lowHeatNum,
              (
                SELECT COUNT(*)
                FROM cast
                WHERE rawWeight = 0
              ) AS zeroHeatNum
            FROM cast c JOIN melt t
            ON c.furnace = t.furnace
          ) AS j 
          ON m.furnace = j.furnace
        GROUP BY j.team;`;
        list = await sequelize.query(sqlStr, {
          type: sequelize.QueryTypes.SELECT,
        });
      } else if (ratioType === "byCastId") {
        const sqlStr = `
        SELECT 
          j.castId, 
          COUNT(m.furnace) AS totalHeatNum,
          SUM(j.nozzleNum) AS nozzleNum, 
          SUM(j.alloyTotalWeight) AS alloyTotalWeight,
          SUM(j.rawWeight) AS rawWeight,
          SUM(m.coilNetWeight) AS coilNetWeight, 
          SUM(m.inPlanStoredWeight) AS inPlanStoredWeight,
          SUM(m.outPlanStoredWeight) AS outPlanStoredWeight,
          SUM(m.totalStoredWeight) AS totalStoredWeight,
          SUM(m.coilNetWeight-m.totalStoredWeight) AS unqualifiedWeight,
          SUM(j.uselessRibbonWeight) AS uselessRibbonWeight,
          SUM(j.meltOutWeight) AS meltOutWeight,
          SUM(j.rawWeight+j.uselessRibbonWeight)/SUM(j.alloyTotalWeight) AS effectiveMeltRatio,
          SUM(j.rawWeight)/SUM(j.rawWeight+j.uselessRibbonWeight) AS rollRatio,
          SUM(m.totalStoredWeight)/SUM(j.rawWeight) AS qualifiedRatio,
          SUM(m.qualityOfA) AS qualityOfA,
          SUM(m.qualityOfB) AS qualityOfB, 
          SUM(m.qualityOfC) AS qualityOfC,
          SUM(m.qualityOfD) AS qualityOfD,
          SUM(m.qualityOfE) AS qualityOfE,
          SUM(m.qualityOfGood) AS qualityOfGood,
          SUM(m.qualityOfFine) AS qualityOfFine,
          SUM(m.qualityOfNormal) AS qualityOfNormal
        FROM
          (
            SELECT
              furnace,
              SUM(coilNetWeight) AS coilNetWeight, 
              SUM(inPlanStoredWeight) AS inPlanStoredWeight,
              SUM(outPlanStoredWeight) AS outPlanStoredWeight,
              SUM(totalStoredWeight) AS totalStoredWeight,
              SUM(coilNetWeight-totalStoredWeight) AS unqualifiedWeight,
              SUM(qualityOfA) AS qualityOfA,
              SUM(qualityOfB) AS qualityOfB,
              SUM(qualityOfC) AS qualityOfC,
              SUM(qualityOfD) AS qualityOfD,
              SUM(qualityOfE) AS qualityOfE,
              SUM(qualityOfGood) AS qualityOfGood,
              SUM(qualityOfFine) AS qualityOfFine,
              SUM(qualityOfNormal) AS qualityOfNormal
            FROM measure GROUP BY furnace
          ) AS m 
          LEFT JOIN
          (
            SELECT 
              c.*, t.alloyTotalWeight,
              (
                SELECT COUNT(*)
                FROM cast
                WHERE rawWeight <= 50 AND castId = 7 OR rawWeight <= 80 AND castId IN (6,8,9)
              ) AS lowHeatNum,
              (
                SELECT COUNT(*)
                FROM cast
                WHERE rawWeight = 0
              ) AS zeroHeatNum
            FROM cast c JOIN melt t
            ON c.furnace = t.furnace
          ) AS j 
          ON m.furnace = j.furnace
        GROUP BY j.castId;`;
        list = await sequelize.query(sqlStr, {
          type: sequelize.QueryTypes.SELECT,
        });
      }

      // 对数据进行格式化处理
      list.forEach((item) => {
        item.alloyTotalWeight = toFixed(item.alloyTotalWeight);
        item.rawWeight = toFixed(item.rawWeight);
        item.coilNetWeight = toFixed(item.coilNetWeight);
        item.inPlanStoredWeight = toFixed(item.inPlanStoredWeight);
        item.outPlanStoredWeight = toFixed(item.outPlanStoredWeight);
        item.totalStoredWeight = toFixed(item.totalStoredWeight);
        item.unqualifiedWeight = toFixed(item.unqualifiedWeight);
        item.uselessRibbonWeight = toFixed(item.uselessRibbonWeight);
        item.totalRatio = percent(
          item.effectiveMeltRatio * item.rollRatio * item.qualifiedRatio
        );
        item.effectiveMeltRatio = percent(item.effectiveMeltRatio);
        item.rollRatio = percent(item.rollRatio);
        item.qualifiedRatio = percent(item.qualifiedRatio);
        item.inPlanRatio = percent(item.inPlanRatio);
        item.qualityOfA = toFixed(item.qualityOfA);
        item.qualityOfB = toFixed(item.qualityOfB);
        item.qualityOfC = toFixed(item.qualityOfC);
        item.qualityOfD = toFixed(item.qualityOfD);
        item.qualityOfE = toFixed(item.qualityOfE);
        item.qualityOfGood = toFixed(item.qualityOfGood);
        item.qualityOfFine = toFixed(item.qualityOfFine);
        item.qualityOfNormal = toFixed(item.qualityOfNormal);
        // 计算低产零产
        item.lowAndZeroRatio = percent(
          (item.zeroHeatNum + item.lowHeatNum) / item.totalHeatNum
        );
      });

      res.send({
        status: 0,
        message: "操作成功",
        data: {
          list,
        },
      });
    } catch (err) {
      console.log("查询直通率统计失败", err);
      log.error("查询直通率统计失败", err);
      res.send({
        status: -1,
        message: "查询直通率统计失败",
      });
    }
  }

  async queryDataOfInputOuput(req, res, next) {
    const {
      startTime,
      endTime,
      caster,
      furnace,
      ribbonTypeNameJson,
      ribbonWidthJson,
      castIdJson,
      current = 1,
      limit = 20,
    } = req.query;
    try {
      const queryCondition = handleSqlQuery({
        equal: {
          "a.furnace": furnace,
          "b.caster": caster,
        },
        json: {
          "b.castId": castIdJson,
          "b.ribbonTypeName": ribbonTypeNameJson,
          "b.ribbonWidth": ribbonWidthJson,
        },
        between: {
          "b.createTime": [startTime, endTime],
        },
      });

      /**
       * 1. measure LEFT JOIN storage , SUM(若干项) group by furnace
       * 2. cast join melt
       * 1 left join 2
       */

      const sqlStr = `SELECT a.*, b.* 
      FROM 
      (
        SELECT 
          measure.furnace,
          SUM(m.coilNetWeight) AS coilNetWeight,
          SUM(m.totalStoredWeight) AS totalStoredWeight,
          SUM(m.coilNetWeight-m.totalStoredWeight) AS unqualifiedWeight,
          SUM(s.totalStoredWeight) AS actualTotalStoredWeight,
          SUM(IF(s.isLowQualified=1, s.isLowQualified, 0)) AS lowQualifiedWeight
        FROM ${TABLE_NAME} AS m
        LEFT JOIN storage AS s
        ON m.furnace=s.furnace
        GROUP BY m.furnace
      ) AS a
      LEFT JOIN
      (
        SELECT 
          c.castId, c.createTime, c.furnace, c.ribbonTypeName, c.ribbonWidth, c.caster, c.rawWeight, c.meltOutWeight, c.uselessRibbonWeight, t.alloyTotalWeight
        FROM cast c JOIN melt t
        ON c.furnace = t.furnace
      ) AS b
      ON a.furnace=b.furnace
      ${queryCondition}
      LIMIT ${limit} OFFSET ${(current - 1) * limit}`;

      // const sqlStr = `
      // select j.*, m.* from
      //   (
      //     SELECT
      //       furnace,
      //       SUM(coilNetWeight) AS coilNetWeight,
      //       SUM(totalStoredWeight) AS totalStoredWeight,
      //       SUM(coilNetWeight-totalStoredWeight) AS unqualifiedWeight,
      //       SUM(qualityOfA) AS qualityOfA,
      //       SUM(qualityOfB) AS qualityOfB,
      //       SUM(qualityOfC) AS qualityOfC,
      //       SUM(qualityOfD) AS qualityOfD,
      //       SUM(qualityOfE) AS qualityOfE,
      //       SUM(thinRibbonWeight) AS thinRibbonWeight,
      //       SUM(highFactorThinRibbonWeight) AS highFactorThinRibbonWeight,
      //       SUM(inPlanStoredWeight) AS inPlanStoredWeight,
      //       SUM(outPlanStoredWeight) AS outPlanStoredWeight,
      //       SUM(inPlanThickRibbonWeight) AS inPlanThickRibbonWeight,
      //       SUM(qualityOfGood) AS qualityOfGood,
      //       SUM(qualityOfFine) AS qualityOfFine,
      //       SUM(qualityOfNormal) AS qualityOfNormal
      //     FROM measure ${queryCondition}
      //     GROUP BY furnace
      //   )
      //   AS m
      //   LEFT JOIN
      //   (
      //     SELECT
      //       c.castId, c.furnace, c.ribbonTypeName, c.ribbonWidth, c.caster, c.rawWeight, c.meltOutWeight, c.uselessRibbonWeight, t.alloyTotalWeight
      //     FROM cast c JOIN melt t
      //     ON c.furnace = t.furnace
      //   )
      //   AS j
      //   ON m.furnace = j.furnace
      // LIMIT ${limit} OFFSET ${(current - 1) * limit}`;

      let list = await sequelize.query(sqlStr, {
        type: sequelize.QueryTypes.SELECT,
      });
      const count = list.length;
      const totalPage = Math.ceil(count / limit);

      list = list.map((item) => {
        Object.keys(item).forEach((key) => {
          if (
            typeof item[key] === "number" &&
            key !== "castId" &&
            key !== "ribbonWidth"
          ) {
            item[key] = item[key].toFixed(2);
          }
        });
        return item;
      });

      // 要考虑分页
      res.send({
        status: 0,
        message: "操作成功",
        data: {
          count,
          current,
          totalPage,
          limit,
          list,
        },
      });
    } catch (err) {
      console.log("查询带材质量统计失败", err);
      log.error("查询带材质量统计失败", err);
      res.send({
        status: -1,
        message: "查询带材质量统计失败",
      });
    }
  }

  async queryDataOfRollWeightByRoller(req, res, next) {
    const { startTime, endTime } = req.query;
    try {
      const queryCondition = handleSqlQuery({
        between: {
          "c.createTime": [startTime, endTime],
        },
      });

      const sqlStr = `SELECT m.rollerName, SUM(m.coilNetWeight) AS totalCoilNetWeight
      FROM ${TABLE_NAME} m
      LEFT JOIN cast c
      ON m.furnace=c.furnace
      ${queryCondition}
      GROUP BY m.rollerName`;

      let list = await sequelize.query(sqlStr, {
        type: sequelize.QueryTypes.SELECT,
      });

      list = list
        .filter((item) => item.rollerName)
        .map((item) => {
          item.totalCoilNetWeight =
            typeof item.totalCoilNetWeight === "number"
              ? item.totalCoilNetWeight.toFixed(2)
              : 0;
          return item;
        });

      res.send({
        status: 0,
        message: "操作成功",
        data: {
          list,
        },
      });
    } catch (err) {
      console.log("查询重卷重量失败", err);
      log.error("查询重卷重量失败", err);
      res.send({
        status: -1,
        message: "查询重卷重量失败",
      });
    }
  }

  async queryDataOfRollWeightByCastId(req, res, next) {
    const {
      startTime,
      endTime,
      caster,
      furnace,
      ribbonTypeNameJson,
      ribbonWidthJson,
      castIdJson,
      current = 1,
      limit = 20,
    } = req.query;
    try {
      const queryCondition = handleSqlQuery({
        equal: {
          "a.furnace": furnace,
          "b.caster": caster,
        },
        json: {
          "b.castId": castIdJson,
          "b.ribbonTypeName": ribbonTypeNameJson,
          "b.ribbonWidth": ribbonWidthJson,
        },
        between: {
          "b.createTime": [startTime, endTime],
        },
      });

      /**
       * 1. measure LEFT JOIN storage , SUM(若干项) group by furnace
       * 2. cast join melt
       * 1 left join 2
       */

      const sqlStr = `SELECT a.*, b.* 
      FROM 
      (
        SELECT 
          measure.furnace,
          SUM(measure.coilNetWeight) AS coilNetWeight,
          SUM(measure.totalStoredWeight) AS totalStoredWeight,
          SUM(measure.coilNetWeight-measure.totalStoredWeight) AS unqualifiedWeight,
          SUM(storage.totalStoredWeight) AS actualTotalStoredWeight,
          SUM(IF(storage.isLowQualified=1, storage.isLowQualified, 0)) AS lowQualifiedWeight
        FROM measure
        LEFT JOIN storage
        ON measure.furnace=storage.furnace
        GROUP BY measure.furnace
      ) AS a
      LEFT JOIN
      (
        SELECT 
          c.castId, c.createTime, c.furnace, c.ribbonTypeName, c.ribbonWidth, c.caster, c.rawWeight, c.meltOutWeight, c.uselessRibbonWeight, t.alloyTotalWeight
        FROM cast c JOIN melt t
        ON c.furnace = t.furnace
      ) AS b
      ON a.furnace=b.furnace
      ${queryCondition}
      LIMIT ${limit} OFFSET ${(current - 1) * limit}`;

      // const sqlStr = `
      // select j.*, m.* from
      //   (
      //     SELECT
      //       furnace,
      //       SUM(coilNetWeight) AS coilNetWeight,
      //       SUM(totalStoredWeight) AS totalStoredWeight,
      //       SUM(coilNetWeight-totalStoredWeight) AS unqualifiedWeight,
      //       SUM(qualityOfA) AS qualityOfA,
      //       SUM(qualityOfB) AS qualityOfB,
      //       SUM(qualityOfC) AS qualityOfC,
      //       SUM(qualityOfD) AS qualityOfD,
      //       SUM(qualityOfE) AS qualityOfE,
      //       SUM(thinRibbonWeight) AS thinRibbonWeight,
      //       SUM(highFactorThinRibbonWeight) AS highFactorThinRibbonWeight,
      //       SUM(inPlanStoredWeight) AS inPlanStoredWeight,
      //       SUM(outPlanStoredWeight) AS outPlanStoredWeight,
      //       SUM(inPlanThickRibbonWeight) AS inPlanThickRibbonWeight,
      //       SUM(qualityOfGood) AS qualityOfGood,
      //       SUM(qualityOfFine) AS qualityOfFine,
      //       SUM(qualityOfNormal) AS qualityOfNormal
      //     FROM measure ${queryCondition}
      //     GROUP BY furnace
      //   )
      //   AS m
      //   LEFT JOIN
      //   (
      //     SELECT
      //       c.castId, c.furnace, c.ribbonTypeName, c.ribbonWidth, c.caster, c.rawWeight, c.meltOutWeight, c.uselessRibbonWeight, t.alloyTotalWeight
      //     FROM cast c JOIN melt t
      //     ON c.furnace = t.furnace
      //   )
      //   AS j
      //   ON m.furnace = j.furnace
      // LIMIT ${limit} OFFSET ${(current - 1) * limit}`;

      let list = await sequelize.query(sqlStr, {
        type: sequelize.QueryTypes.SELECT,
      });
      const count = list.length;
      const totalPage = Math.ceil(count / limit);

      list = list.map((item) => {
        Object.keys(item).forEach((key) => {
          if (
            typeof item[key] === "number" &&
            key !== "castId" &&
            key !== "ribbonWidth"
          ) {
            item[key] = item[key].toFixed(2);
          }
        });
        return item;
      });

      // 要考虑分页
      res.send({
        status: 0,
        message: "操作成功",
        data: {
          count,
          current,
          totalPage,
          limit,
          list,
        },
      });
    } catch (err) {
      console.log("查询带材质量统计失败", err);
      log.error("查询带材质量统计失败", err);
      res.send({
        status: -1,
        message: "查询带材质量统计失败",
      });
    }
  }
}

module.exports = new Statistics();
