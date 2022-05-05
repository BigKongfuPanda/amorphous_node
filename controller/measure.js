"use strict";
const sequelize = require("../mysql/db");
const measureModel = require("../models/measure");
const castModel = require("../models/cast");
const planModel = require("../models/plan");
const rollerModel = require("../models/roller");
const log = require("log4js").getLogger("measure");
const nodeExcel = require("excel-export");
const moment = require("moment");
const path = require("path");
const formidable = require("formidable");
const xlsx = require("node-xlsx");
const fs = require("fs");
const { valueToString } = require("../util");
const { cloneDeep } = require("lodash");
const config = require("config-lite")(__dirname);
const TABLE_NAME = config.tableName;

class Measure {
  constructor() {}

  // 查询重卷数据
  async queryRollData(req, res, next) {
    const {
      castId,
      furnace,
      startTime,
      endTime,
      caster,
      roller,
      orderBy,
      current = 1,
      limit = 30,
    } = req.query;
    try {
      let queryCondition = "";
      if (caster) {
        queryCondition += `c.caster='${caster}'`;
      }
      if (castId) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND m.castId=${castId}`
            : ` m.castId=${castId}`;
      }
      if (roller) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND m.roller='${roller}'`
            : ` m.roller='${roller}'`;
      }
      if (furnace) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND m.furnace='${furnace}'`
            : ` m.furnace='${furnace}'`;
      }
      if (startTime && endTime) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND c.createTime BETWEEN '${startTime}' AND '${endTime}'`
            : ` c.createTime BETWEEN '${startTime}' AND '${endTime}'`;
      }

      let orderQuery = "";
      if (Number(orderBy) === 1) {
        orderQuery = "ORDER BY m.updatedAt DESC";
      } else if (Number(orderBy) === 2) {
        orderQuery = "ORDER BY m.furnace DESC, m.coilNumber ASC";
      }

      const sqlStr = `SELECT SQL_CALC_FOUND_ROWS
                        m.*, c.ribbonTypeName, c.ribbonWidth, c.createTime AS castDate, c.caster
                      FROM ${TABLE_NAME} m 
                      LEFT JOIN cast c 
                      ON m.furnace=c.furnace
                      ${queryCondition !== "" ? "WHERE " + queryCondition : ""}
                      ${orderQuery}
                      LIMIT ${limit} OFFSET ${(current - 1) * limit}`;
      // const sqlStr2 = `SELECT
      //                   m.*, c.ribbonTypeName, c.ribbonWidth, c.createTime AS castDate, c.caster
      //                 FROM ${TABLE_NAME} m
      //                 LEFT JOIN cast c
      //                 ON m.furnace=c.furnace
      //                 ${
      //                   queryCondition !== "" ? "WHERE " + queryCondition : ""
      //                 }`;
      const sqlStr2 = `SELECT FOUND_ROWS() AS totalCount`;
      const list = await sequelize.query(sqlStr, {
        type: sequelize.QueryTypes.SELECT,
      });
      const totalList = await sequelize.query(sqlStr2, {
        type: sequelize.QueryTypes.SELECT,
      });
      // const count = totalList.length;
      const count = Array.isArray(totalList) ? totalList[0].totalCount : 0;
      const totalPage = Math.ceil(count / limit);

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
      console.log("查询重卷记录失败", err);
      log.error("查询重卷记录失败", err);
      res.send({
        status: -1,
        message: "查询重卷记录失败",
      });
    }
  }

  // 查询检测的炉号
  async queryMeasureFurnaceList(req, res, next) {
    const { query, castId, startTime, endTime } = req.query;
    try {
      let queryCondition = {};
      if (castId) {
        queryCondition.castId = castId;
      }
      if (startTime && endTime) {
        queryCondition.createTime = { $between: [startTime, endTime] };
      }

      let list = await castModel.findAll({
        attributes: ["furnace"],
        where: {
          furnace: {
            $like: `%${query}%`,
          },
          ...queryCondition,
        },
        raw: true,
      });

      let furnaceList = list.map((item) => {
        return item.furnace;
      });

      furnaceList = Array.from(new Set(furnaceList));

      res.send({
        status: 0,
        message: "查询成功",
        data: {
          list: furnaceList,
        },
      });
    } catch (err) {
      console.log("查询检测炉号记录失败", err);
      log.error("查询检测炉号记录失败", err);
      res.send({
        status: -1,
        message: "查询检测炉号记录失败",
      });
    }
  }

  // 查询检测数据
  async queryMeasureData(req, res, next) {
    const {
      castId,
      // furnace,
      furnaceJson,
      startTime,
      endTime,
      startMeasureTime,
      endMeasureTime,
      caster,
      roller,
      ribbonTypeNameJson,
      ribbonWidthJson,
      ribbonThicknessLevelJson,
      laminationLevelJson,
      ribbonToughnessLevelJson,
      appearenceLevelJson,
      place,
      ribbonTotalLevels,
      thicknessDivation,
      orderBy,
      current = 1,
      limit = 30,
    } = req.query;

    try {
      let queryCondition = "";
      if (caster) {
        queryCondition += `c.caster='${caster}'`;
      }
      if (castId) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND m.castId=${castId}`
            : ` m.castId=${castId}`;
      }
      if (roller) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND m.roller='${roller}'`
            : ` m.roller='${roller}'`;
      }
      // if (furnace) {
      //   queryCondition +=
      //     queryCondition !== ""
      //       ? ` AND m.furnace='${furnace}'`
      //       : ` m.furnace='${furnace}'`;
      // }
      if (furnaceJson) {
        let furnanceList = JSON.parse(furnaceJson);
        if (furnanceList.length > 0) {
          const furnaces = furnanceList.map((item) => `'${item}'`).join();
          queryCondition +=
            queryCondition !== ""
              ? ` AND m.furnace IN (${furnaces})`
              : ` m.furnace IN (${furnaces})`;
        }
      }
      if (place) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND m.place='${place}'`
            : ` m.place='${place}'`;
      }
      if (startTime && endTime) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND c.createTime BETWEEN '${startTime}' AND '${endTime}'`
            : ` c.createTime BETWEEN '${startTime}' AND '${endTime}'`;
      }
      if (startMeasureTime && endMeasureTime) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND m.measureDate BETWEEN '${startMeasureTime}' AND '${endMeasureTime}'`
            : ` m.measureDate BETWEEN '${startMeasureTime}' AND '${endMeasureTime}'`;
      }
      if (ribbonTypeNameJson) {
        let ribbonTypeNameList = JSON.parse(ribbonTypeNameJson);
        if (ribbonTypeNameList.length > 0) {
          const ribbonTypeNames = ribbonTypeNameList
            .map((item) => `'${item}'`)
            .join();
          queryCondition +=
            queryCondition !== ""
              ? ` AND c.ribbonTypeName IN (${ribbonTypeNames})`
              : ` c.ribbonTypeName IN (${ribbonTypeNames})`;
        }
      }
      if (ribbonWidthJson) {
        let ribbonWidthList = JSON.parse(ribbonWidthJson);
        if (ribbonWidthList.length > 0) {
          const ribbonWidths = ribbonWidthList.join();
          queryCondition +=
            queryCondition !== ""
              ? ` AND c.ribbonWidth IN (${ribbonWidths})`
              : ` c.ribbonWidth IN (${ribbonWidths})`;
        }
      }
      if (ribbonThicknessLevelJson) {
        let ribbonThicknessLevelList = JSON.parse(ribbonThicknessLevelJson);
        if (ribbonThicknessLevelList.length > 0) {
          const ribbonThicknessLevels = ribbonThicknessLevelList.join();
          queryCondition +=
            queryCondition !== ""
              ? ` AND m.ribbonThicknessLevel IN (${ribbonThicknessLevels})`
              : ` m.ribbonThicknessLevel IN (${ribbonThicknessLevels})`;
        }
      }
      if (laminationLevelJson) {
        let laminationLevelList = JSON.parse(laminationLevelJson);
        if (laminationLevelList.length > 0) {
          const laminationLevels = laminationLevelList.join();
          queryCondition +=
            queryCondition !== ""
              ? ` AND m.laminationLevel IN (${laminationLevels})`
              : ` m.laminationLevel IN (${laminationLevels})`;
        }
      }
      if (ribbonToughnessLevelJson) {
        let ribbonToughnessLevelList = JSON.parse(ribbonToughnessLevelJson);
        if (ribbonToughnessLevelList.length > 0) {
          const ribbonToughnessLevels = ribbonToughnessLevelList
            .map((item) => `'${item}'`)
            .join();
          queryCondition +=
            queryCondition !== ""
              ? ` AND m.ribbonToughnessLevel IN (${ribbonToughnessLevels})`
              : ` m.ribbonToughnessLevel IN (${ribbonToughnessLevels})`;
        }
      }
      if (appearenceLevelJson) {
        let appearenceLevelList = JSON.parse(appearenceLevelJson);
        if (appearenceLevelList.length > 0) {
          const appearenceLevels = appearenceLevelList
            .map((item) => `'${item}'`)
            .join();
          queryCondition +=
            queryCondition !== ""
              ? ` AND m.appearenceLevel IN (${appearenceLevels})`
              : ` m.appearenceLevel IN (${appearenceLevels})`;
        }
      }
      if (ribbonTotalLevels) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND m.ribbonTotalLevel IN (${ribbonTotalLevels})`
            : ` m.ribbonTotalLevel IN (${ribbonTotalLevels})`;
      }
      if (thicknessDivation) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND m.ribbonThicknessDeviation<=${thicknessDivation}`
            : ` m.ribbonThicknessDeviation<=${thicknessDivation}`;
      }

      // 检测只能看到重卷确认后的带材
      queryCondition +=
        queryCondition !== ""
          ? ` AND m.isRollConfirmed=1`
          : ` m.isRollConfirmed=1`;

      let orderQuery = "";
      if (Number(orderBy) === 1) {
        orderQuery = "ORDER BY m.updatedAt DESC";
      } else if (Number(orderBy) === 2) {
        orderQuery = "ORDER BY m.furnace DESC, m.coilNumber ASC";
      }

      console.time("query1");
      const sqlStr = `SELECT SQL_CALC_FOUND_ROWS
                      m.*, c.ribbonTypeName, c.ribbonWidth, c.createTime AS castDate, c.caster
                    FROM ${TABLE_NAME} m
                    LEFT JOIN cast c
                    ON m.furnace=c.furnace
                    ${queryCondition !== "" ? "WHERE " + queryCondition : ""}
                    ${orderQuery}
                    LIMIT ${limit} OFFSET ${(current - 1) * limit}`;
      const sqlStr2 = `SELECT FOUND_ROWS() AS totalCount`;
      let list = await sequelize.query(sqlStr, {
        type: sequelize.QueryTypes.SELECT,
      });
      const totalList = await sequelize.query(sqlStr2, {
        type: sequelize.QueryTypes.SELECT,
      });
      console.timeEnd("query1");
      const count = Array.isArray(totalList) ? totalList[0].totalCount : 0;

      // 获取总行数的方法二：使用 SELECT COUNT(*)
      // const sqlStr = `SELECT
      //                 m.*, c.ribbonTypeName, c.ribbonWidth, c.createTime AS castDate, c.caster
      //               FROM ${TABLE_NAME} m
      //               LEFT JOIN cast c
      //               ON m.furnace=c.furnace
      //               ${queryCondition !== "" ? "WHERE " + queryCondition : ""}
      //               ORDER BY m.updatedAt DESC
      //               LIMIT ${limit} OFFSET ${(current - 1) * limit}`;
      // const sqlStr2 = `SELECT
      //                 COUNT(*)
      //                 FROM ${TABLE_NAME} m
      //                 LEFT JOIN cast c
      //                 ON m.furnace=c.furnace
      //                 ${
      //                   queryCondition !== "" ? "WHERE " + queryCondition : ""
      //                 }`;
      // let list = await sequelize.query(sqlStr, {
      //   type: sequelize.QueryTypes.SELECT,
      // });
      // const totalList = await sequelize.query(sqlStr2, {
      //   type: sequelize.QueryTypes.SELECT,
      // });
      // console.log(totalList, 999);
      // const count = Array.isArray(totalList) ? totalList[0]['COUNT(*)'] : 0;

      const totalPage = Math.ceil(count / limit);

      // 如果排产12炉，喷带13或以上，则从第13炉开始，需要取第12炉的材质，规格，订单要求和排产要求
      // 查询生产计划集合中，当前炉次的订单要求和入库要求
      const uniqueFurnaceList = Array.from(
        new Set(list.map((item) => item.furnace))
      );
      let furnaceMapToOrderAndqualifiedDemands = {};
      let furnaceMapToCastInfo = {};

      console.time("query2");
      for (const furnace of uniqueFurnaceList) {
        let planFurnace = furnace.substr(0, 14);
        const date = furnace.split("-")[1]; // 06-20190111-02/08 ---> 2019-01-11
        const _castId = furnace.split("-")[0]; // 06-20190111-02/08 ---> 06
        const fomatDate = moment(date).format("YYYY-MM-DD");
        const planListByDate = await planModel.findAll({
          where: { date: fomatDate },
          raw: true,
        });
        const _len = planListByDate.length;
        if (_len == 0) {
          throw new Error(
            `机组：${_castId}，日期：${fomatDate}， 缺少生产计划，请联系生产计划管理员添加计划`
          );
        }
        if (Number(planFurnace.split("-")[2]) > _len) {
          planFurnace = planListByDate[_len - 1].furnace;
        }
        const planData = await planModel.findOne({
          where: { furnace: planFurnace },
        });

        if (!planData || Object.keys(planData).length === 0) {
          throw new Error(
            `生产炉号${furnace}对应的生产计划${planFurnace}不存在，请检查炉号是否正确`
          );
        }
        const {
          orderThickness,
          orderLaminationFactor,
          orderRibbonToughnessLevels,
          orderAppearenceLevels,
          qualifiedDemands,
        } = planData;
        furnaceMapToOrderAndqualifiedDemands[furnace] = {
          orderThickness,
          orderLaminationFactor,
          orderRibbonToughnessLevels,
          orderAppearenceLevels,
          qualifiedDemands,
        };
        // const { ribbonTypeName, ribbonWidth, createTime, caster } = await castModel.findOne({
        //   where: { furnace }
        // });
        // furnaceMapToCastInfo[furnace] = { ribbonTypeName, ribbonWidth, createTime, caster };
      }
      console.timeEnd("query2");
      list.forEach((item) => {
        item.orderThickness =
          furnaceMapToOrderAndqualifiedDemands[item.furnace][
            "orderThickness"
          ] || "";
        item.orderLaminationFactor =
          furnaceMapToOrderAndqualifiedDemands[item.furnace][
            "orderLaminationFactor"
          ] || "";
        item.orderRibbonToughnessLevels =
          furnaceMapToOrderAndqualifiedDemands[item.furnace][
            "orderRibbonToughnessLevels"
          ] || "";
        item.orderAppearenceLevels =
          furnaceMapToOrderAndqualifiedDemands[item.furnace][
            "orderAppearenceLevels"
          ] || "";
        item.qualifiedDemands =
          furnaceMapToOrderAndqualifiedDemands[item.furnace][
            "qualifiedDemands"
          ] || "[]";
        // item.ribbonTypeName = furnaceMapToCastInfo[item.furnace]['ribbonTypeName'] || '';
        // item.ribbonWidth = furnaceMapToCastInfo[item.furnace]['ribbonWidth'] || '';
        // item.castDate = furnaceMapToCastInfo[item.furnace]['createTime'] || '';
        // item.caster = furnaceMapToCastInfo[item.furnace]['caster'] || '';
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
      console.log("查询检测记录失败", err);
      log.error("查询检测记录失败", err);
      res.send({
        status: -1,
        message: err.message || "查询检测记录失败",
      });
    }
  }

  /**
   * 获取单条带材信息
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async queryRibbonInfo(req, res, next) {
    const { furnace, coilNumber } = req.query;
    try {
      let queryCondition = "";
      if (coilNumber) {
        queryCondition += `m.coilNumber='${coilNumber}'`;
      }
      if (furnace) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND m.furnace='${furnace}'`
            : ` m.furnace='${furnace}'`;
      }
      const sqlStr = `SELECT 
                        m.*, c.ribbonTypeName, c.ribbonWidth, c.createTime AS castDate, c.caster
                      FROM ${TABLE_NAME} m 
                      LEFT JOIN cast c 
                      ON m.furnace=c.furnace
                      ${
                        queryCondition !== "" ? "WHERE " + queryCondition : ""
                      }`;

      let list = await sequelize.query(sqlStr, {
        type: sequelize.QueryTypes.SELECT,
      });
      res.send({
        status: 0,
        message: "操作成功",
        data: {
          list,
        },
      });
    } catch (err) {
      console.log("查询单条带材信息记录失败", err);
      log.error("查询单条带材信息记录失败", err);
      res.send({
        status: -1,
        message: err.message || "查询单条带材信息记录失败",
      });
    }
  }

  /**
   * 获取申请入库信息
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async queryApplyStorageByFurnace(req, res, next) {
    const { castId } = req.query;
    try {
      if (!castId) {
        throw new Error("机组编号castId不能为空");
      }

      const sqlStr = `SELECT furnace, COUNT(*) AS totalCount, SUM(coilNetWeight) AS totalWeight FROM ${TABLE_NAME} WHERE castId = ${castId} AND isStored IN (1,2) AND isStorageConfirmed = 0 AND isMeasureConfirmed = 0 AND isRollConfirmed = 1
      GROUP BY furnace`;

      let list = await sequelize.query(sqlStr, {
        type: sequelize.QueryTypes.SELECT,
      });
      res.send({
        status: 0,
        message: "操作成功",
        data: {
          list: list.map((item) => ({
            ...item,
            totalWeight: item.totalWeight.toFixed(2),
          })),
        },
      });
    } catch (err) {
      console.log("查询单条带材信息记录失败", err);
      log.error("查询单条带材信息记录失败", err);
      res.send({
        status: -1,
        message: err.message,
      });
    }
  }

  /**
   * 获取检测合格率数据
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async queryMeasureStatics(req, res, next) {
    const {
      castId,
      startTime,
      endTime,
      startMeasureTime,
      endMeasureTime,
      furnace,
      ribbonTypeNameJson,
    } = req.query;
    try {
      if (!castId) {
        throw new Error("机组编号castId不能为空");
      }

      let queryCondition = "";
      if (castId) {
        queryCondition += `m.castId='${castId}'`;
      }
      if (furnace) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND m.furnace='${furnace}'`
            : ` m.furnace='${furnace}'`;
      }

      if (ribbonTypeNameJson) {
        let ribbonTypeNameList = JSON.parse(ribbonTypeNameJson);
        if (ribbonTypeNameList.length > 0) {
          const ribbonTypeNames = ribbonTypeNameList
            .map((item) => `'${item}'`)
            .join();
          queryCondition +=
            queryCondition !== ""
              ? ` AND c.ribbonTypeName IN (${ribbonTypeNames})`
              : ` c.ribbonTypeName IN (${ribbonTypeNames})`;
        }
      }

      if (startTime && endTime) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND c.createTime BETWEEN '${startTime}' AND '${endTime}'`
            : ` c.createTime BETWEEN '${startTime}' AND '${endTime}'`;
      }

      if (startMeasureTime && endMeasureTime) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND m.measureDate BETWEEN '${startMeasureTime}' AND '${endMeasureTime}'`
            : ` m.measureDate BETWEEN '${startMeasureTime}' AND '${endMeasureTime}'`;
      }

      // 检测计算综合级别之后
      queryCondition +=
        queryCondition !== ""
          ? ` AND m.ribbonTotalLevel IS NOT NULL`
          : ` m.ribbonTotalLevel IS NOT NULL`;

      // 检测只能看到重卷确认后的带材
      queryCondition +=
        queryCondition !== ""
          ? ` AND m.isRollConfirmed=1`
          : ` m.isRollConfirmed=1`;

      const sqlStr = `SELECT m.furnace, SUM(IF(m.ribbonTotalLevel='不合格', m.coilNetWeight, 0)) AS unQualifiedWeight, SUM(m.coilNetWeight) AS netWeight 
      FROM ${TABLE_NAME} m
      LEFT JOIN cast c 
      ON m.furnace=c.furnace
      ${queryCondition !== "" ? "WHERE " + queryCondition : ""}
      GROUP BY m.furnace
      ORDER BY m.furnace ASC`;

      let list = await sequelize.query(sqlStr, {
        type: sequelize.QueryTypes.SELECT,
      });
      res.send({
        status: 0,
        message: "操作成功",
        data: {
          list: list.map((item) => ({
            ...item,
            netWeight: Number(item.netWeight.toFixed(2)),
            unQualifiedWeight: Number(item.unQualifiedWeight.toFixed(2)),
            qualifiedWeight: Number(
              (item.netWeight - item.unQualifiedWeight).toFixed(2)
            ),
            qualifyOfRatio: Number(
              (100 * (item.netWeight - item.unQualifiedWeight)) / item.netWeight
            ).toFixed(2),
          })),
        },
      });
    } catch (err) {
      console.log("查询单条带材信息记录失败", err);
      log.error("查询单条带材信息记录失败", err);
      res.send({
        status: -1,
        message: err.message,
      });
    }
  }

  /**
   * 获取带材重卷后的重量数据
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async queryRollStatics(req, res, next) {
    const {
      castId,
      startTime,
      endTime,
      furnace,
      ribbonTypeNameJson,
      current = 1,
      limit = 30,
    } = req.query;
    try {
      if (!castId) {
        throw new Error("机组编号castId不能为空");
      }

      let queryCondition = "";
      if (castId) {
        queryCondition += `c.castId='${castId}'`;
      }
      if (furnace) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND m.furnace='${furnace}'`
            : ` m.furnace='${furnace}'`;
      }

      if (ribbonTypeNameJson) {
        let ribbonTypeNameList = JSON.parse(ribbonTypeNameJson);
        if (ribbonTypeNameList.length > 0) {
          const ribbonTypeNames = ribbonTypeNameList
            .map((item) => `'${item}'`)
            .join();
          queryCondition +=
            queryCondition !== ""
              ? ` AND c.ribbonTypeName IN (${ribbonTypeNames})`
              : ` c.ribbonTypeName IN (${ribbonTypeNames})`;
        }
      }

      if (startTime && endTime) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND c.createTime BETWEEN '${startTime}' AND '${endTime}'`
            : ` c.createTime BETWEEN '${startTime}' AND '${endTime}'`;
      }

      // const sqlStr = `SELECT SQL_CALC_FOUND_ROWS m.furnace, c.ribbonTypeName, c.caster, c.castId, c.ribbonWidth, c.createTime, c.rawWeight, SUM(m.coilWeight) AS totalCoilWeight, COUNT(m.coilNumber) AS coilCount
      // FROM ${TABLE_NAME} m
      // LEFT JOIN cast c
      // ON m.furnace=c.furnace
      // ${queryCondition !== "" ? "WHERE " + queryCondition : ""}
      // GROUP BY m.furnace
      // ORDER BY m.furnace ASC
      // LIMIT ${limit} OFFSET ${(current - 1) * limit}`;

      const sqlStr = `SELECT 
        SQL_CALC_FOUND_ROWS 
        m.furnace,
        c.ribbonTypeName, 
        c.caster, 
        c.castId, 
        c.ribbonWidth, 
        c.createTime, 
        c.rawWeight,
        c.alloyTotalWeight,
        m.totalCoilWeight, 
        m.coilCount
      FROM 
      (
        SELECT  
          furnace,
          SUM(coilWeight) AS totalCoilWeight,
          COUNT(coilNumber) AS coilCount
        FROM ${TABLE_NAME} GROUP BY furnace
      ) AS m
      LEFT JOIN
      (
        SELECT 
          cast.furnace,
          cast.ribbonTypeName, 
          cast.caster, 
          cast.castId, 
          cast.ribbonWidth, 
          cast.createTime, 
          cast.rawWeight,
          melt.alloyTotalWeight
        FROM cast JOIN melt
        ON cast.furnace = melt.furnace
      ) AS c
      ON m.furnace = c.furnace
      ${queryCondition !== "" ? "WHERE " + queryCondition : ""}
      ORDER BY m.furnace ASC
      LIMIT ${limit} OFFSET ${(current - 1) * limit}`;

      const sqlStr2 = `SELECT FOUND_ROWS() AS totalCount`;

      let list = await sequelize.query(sqlStr, {
        type: sequelize.QueryTypes.SELECT,
      });

      const totalList = await sequelize.query(sqlStr2, {
        type: sequelize.QueryTypes.SELECT,
      });
      const count = Array.isArray(totalList) ? totalList[0].totalCount : 0;
      const totalPage = Math.ceil(count / limit);
      // 判断该炉每一盘是否都被送检了
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const coilList = await measureModel.findAll({
          where: {
            furnace: item.furnace,
          },
          raw: true,
        });
        let isAllRollConfirmed = 0;
        if ((coilList || []).every((c) => c.isRollConfirmed === 1)) {
          // 该炉全部都送检了
          isAllRollConfirmed = 1;
        } else {
          // 该炉没有送检或者部分送检
          isAllRollConfirmed = 0;
        }

        item.isAllRollConfirmed = isAllRollConfirmed;
        // 将该炉号下所有的盘号都放到数组中，等到申请送检的时候，进行盘号重复的校验
        item.coilNumberList = coilList.map((c) => c.coilNumber);
      }

      res.send({
        status: 0,
        message: "操作成功",
        data: {
          list,
          count,
          current,
          totalPage,
          limit,
        },
      });
    } catch (err) {
      console.log("查询重卷总重失败", err);
      log.error("查询重卷总重失败", err);
      res.send({
        status: -1,
        message: err.message,
      });
    }
  }

  // 新增操作，由重卷人员使用
  async createData(req, res, next) {
    let {
      castId,
      furnace,
      coilNumber,
      diameter,
      coilWeight,
      roller,
      rollMachine,
      isFlat,
    } = req.body;
    try {
      if (
        !furnace ||
        !coilNumber ||
        !diameter ||
        !coilWeight ||
        !roller ||
        !rollMachine ||
        !valueToString(isFlat)
      ) {
        throw new Error("参数错误");
      }
    } catch (err) {
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message,
      });
      return;
    }

    // 判断该炉号是否在喷带记录中存在
    try {
      const data = await castModel.findOne({ where: { furnace } });
      if (!data) {
        throw new Error(`炉号 ${furnace} 该炉号不存在`);
      }
    } catch (error) {
      log.error(error.message, error);
      res.send({
        status: -1,
        message: error.message,
      });
      return;
    }

    // 判断炉号和盘号重复
    try {
      const data = await measureModel.findOne({
        where: { furnace, coilNumber },
      });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error(`炉号 ${furnace} 和盘号 ${coilNumber} 重复`);
      }
    } catch (err) {
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message,
      });
      return;
    }

    // 判断当前的盘重总数是否小于本炉的大盘毛重
    try {
      // 获取合计盘重的重量
      const rawRetCoil = await sequelize.query(
        `SELECT SUM(coilWeight) AS weight FROM ${TABLE_NAME} WHERE  furnace = '${furnace}'`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
      // [{ weight: 122.2323 }]
      const coilTotalWeight = rawRetCoil[0].weight;

      // 获取本炉的大盘毛重
      const rawRetFurnace = await castModel.findOne({
        where: { furnace },
      });
      const rawWeight = rawRetFurnace.rawWeight;
      if (coilTotalWeight > rawWeight + 10) {
        throw new Error(`炉号 ${furnace} 重卷总重不能大于当前炉次的大盘毛重`);
      }
    } catch (err) {
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message,
      });
      return;
    }

    try {
      const { createTime } = await castModel.findOne({
        where: { furnace },
      });
      const newData = {
        castId,
        furnace,
        castDate: createTime,
        coilNumber,
        diameter,
        coilWeight,
        roller,
        rollMachine,
        isFlat,
      };
      await measureModel.create(newData);
      res.send({
        status: 0,
        message: "新增重卷记录成功",
      });
    } catch (err) {
      log.error("新增重卷记录失败", err);
      res.send({
        status: -1,
        message: `新增重卷记录失败, ${err.message}`,
      });
    }
  }

  // 重卷数据确认送检
  async rollConfirm(req, res, next) {
    const { rollDataJson } = req.body;
    let list = [];
    try {
      if (!rollDataJson) {
        throw new Error("参数错误");
      }
      list = JSON.parse(rollDataJson);
    } catch (err) {
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message,
      });
      return;
    }

    try {
      list.forEach(async (item) => {
        const { furnace, coilNumber } = item;
        try {
          if (!furnace || !coilNumber) {
            throw new Error("参数错误");
          }
        } catch (err) {
          log.error(err.message, err);
          res.send({
            status: -1,
            message: err.message,
          });
          return;
        }

        // 判断该炉号是否在喷带记录中存在
        try {
          const data = await castModel.findOne({
            where: { furnace },
          });
          if (!data) {
            throw new Error(
              `喷带记录中，炉号 ${furnace} 不存在，请检查炉号是否正确`
            );
          }
        } catch (err) {
          log.error(err.message, err);
          res.send({
            status: -1,
            message: err.message,
          });
          return;
        }

        // 判断当前的盘重总数是否小于本炉的大盘毛重
        try {
          // 获取合计盘重的重量
          const rawRetCoil = await sequelize.query(
            `SELECT SUM(coilWeight) AS weight FROM ${TABLE_NAME} WHERE  furnace = '${furnace}'`,
            {
              type: sequelize.QueryTypes.SELECT,
            }
          );
          // [{ weight: 122.2323 }]
          const coilTotalWeight = rawRetCoil[0].weight;

          // 获取本炉的大盘毛重
          const rawRetFurnace = await castModel.findOne({
            where: { furnace },
          });
          const rawWeight = rawRetFurnace.rawWeight;
          if (coilTotalWeight > rawWeight + 10) {
            throw new Error(
              `炉号 ${furnace} 重卷总重不能大于当前炉次的大盘毛重`
            );
          }
        } catch (err) {
          log.error(err.message, err);
          res.send({
            status: -1,
            message: err.message,
          });
          return;
        }

        try {
          const newData = {
            rollerName: item.rollerName, // 将此刻重卷人名固定死，不能使用roller,因为roller 和 rollerName 的映射关系会变化
            isRollConfirmed: 1, // 确认成功
          };
          const [n] = await measureModel.update(newData, {
            where: { furnace, coilNumber },
          });
          if (n !== 0) {
            res.send({
              status: 0,
              message: "更新数据成功",
            });
          } else {
            throw new Error("更新数据失败");
          }
        } catch (err) {
          log.error("保存重卷记录失败", err);
          res.send({
            status: -1,
            message: `保存重卷记录失败, ${err.message}`,
          });
        }
      });
    } catch (error) {}
  }

  // 检测确认入库
  async measureConfirm(req, res, next) {
    const { dataJson } = req.body;
    let data = [];
    try {
      if (!dataJson) {
        throw new Error("参数错误");
      }
      data = JSON.parse(dataJson);
    } catch (err) {
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message,
      });
      return;
    }

    try {
      data.forEach(async (item) => {
        await measureModel.update(
          {
            measureConfirmDate: Date.now(),
            clients: item.clients,
            unStoreReason: item.unStoreReason,
            isMeasureConfirmed: 1, // 1-已确认，0-未确认
            isRejected: 0, // 1-驳回；0-未驳回
            orderThickness: item.orderThickness,
            orderLaminationFactor: item.orderLaminationFactor,
            orderRibbonToughnessLevels: item.orderRibbonToughnessLevels,
            orderAppearenceLevels: item.orderAppearenceLevels,
            qualifiedDemands: item.qualifiedDemands,
          },
          { where: { measureId: item.measureId } }
        );
      });
      res.send({
        status: 0,
        message: "申请入库成功",
      });
    } catch (err) {
      log.error(err.message, err);
      res.send({
        status: -1,
        message: "申请入库失败",
      });
    }
  }

  // 更新操作，由重卷人员使用
  async updateRoll(req, res, next) {
    let {
      measureId,
      roleId,
      furnace,
      coilNumber,
      diameter,
      coilWeight,
      roller,
      rollMachine,
      isFlat,
      createdAt,
    } = req.body;

    try {
      if (!measureId) {
        throw new Error("参数错误");
      }
    } catch (err) {
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message,
      });
      return;
    }

    const createTime = new Date(createdAt);
    const period = Date.now() - createTime;
    // 过了24小时，重卷人员不能修改
    if (roleId == 4) {
      // roleId: 4 重卷人员
      try {
        // const createTime = new Date(createdAt);
        // const period = Date.now() - createTime;
        if (period > 24 * 60 * 60 * 1000) {
          throw new Error("已过24小时，您无操作权限，请联系车间主任或厂长！");
        }
      } catch (err) {
        console.log(err.message, err);
        res.send({
          status: -1,
          message: err.message,
        });
        return;
      }
    }

    // 过了72小时，重卷组长也不能修改
    if (roleId == 15) {
      // roleId: 15 重卷组长
      try {
        // const createTime = new Date(createdAt);
        // const period = Date.now() - createTime;
        if (period > 3 * 24 * 60 * 60 * 1000) {
          throw new Error("已过72小时，您无操作权限，请联系车间主任或厂长！");
        }
      } catch (err) {
        console.log(err.message, err);
        res.send({
          status: -1,
          message: err.message,
        });
        return;
      }
    }

    // 判断当前的盘重总数是否小于本炉的大盘毛重
    try {
      // 获取合计盘重的重量
      const rawRetCoil = await sequelize.query(
        `SELECT SUM(coilWeight) AS weight FROM ${TABLE_NAME} WHERE  furnace = '${furnace}'`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
      // [{ weight: 122.2323 }]
      const coilTotalWeight = rawRetCoil[0].weight;

      // 获取本炉的大盘毛重
      const rawRetFurnace = await castModel.findOne({
        where: { furnace },
      });
      if (!rawRetFurnace) {
        throw new Error(`喷带记录中没有这一炉 ${furnace}，请检查。`);
      }
      const rawWeight = rawRetFurnace.rawWeight;

      console.log(coilTotalWeight, rawWeight); // 224, 200

      if (coilTotalWeight > rawWeight + 10) {
        throw new Error("重卷总重不能大于当前炉次的大盘毛重");
      }
    } catch (err) {
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message,
      });
      return;
    }

    try {
      const newData = {
        furnace,
        coilNumber,
        diameter,
        coilWeight,
        roller,
        rollMachine,
        isFlat,
      };
      const [n] = await measureModel.update(newData, {
        where: { measureId },
      });
      if (n !== 0) {
        res.send({
          status: 0,
          message: "更新数据成功",
        });
      } else {
        throw new Error("更新数据失败");
      }
    } catch (err) {
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message,
      });
    }
  }

  // 更新操作，由检测人员使用
  async updateMeasure(req, res, next) {
    let {
      measureId,
      // roleId,
      // castId,
      // furnace,
      // coilNumber,
      // diameter,
      // coilWeight,
      coilNetWeight,
      // ribbonTypeName,
      // ribbonWidth,
      // roller,
      // rollMachine,
      // isFlat,
      // castDate,
      // caster,
      laminationFactor,
      laminationLevel,
      realRibbonWidth,
      ribbonThickness1,
      ribbonThickness2,
      ribbonThickness3,
      ribbonThickness4,
      ribbonThickness5,
      ribbonThickness6,
      ribbonThickness7,
      ribbonThickness8,
      ribbonThickness9,
      ribbonThicknessDeviation,
      ribbonThickness,
      ribbonThicknessLevel,
      ribbonToughness,
      ribbonToughnessLevel,
      appearence,
      appearenceLevel,
      ribbonTotalLevel,
      isMeasureConfirmed,
      isStored,
      unStoreReason,
      unQualifiedReason,
      clients = "",
      remainWeight,
      totalStoredWeight = 0,
      inPlanStoredWeight = 0,
      outPlanStoredWeight = 0,
      qualityOfA = 0,
      qualityOfB = 0,
      qualityOfC = 0,
      qualityOfD = 0,
      qualityOfE = 0,
      highFactorThinRibbonWeight = 0,
      thinRibbonWeight = 0,
      inPlanThickRibbonWeight = 0,
      qualityOfGood = 0,
      qualityOfFine = 0,
      qualityOfNormal = 0,
    } = req.body;

    try {
      if (!measureId) {
        throw new Error("参数错误");
      }
    } catch (err) {
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message,
      });
      return;
    }

    try {
      const newData = {
        // measureId,
        // roleId,
        // castId,
        // furnace,
        // coilNumber,
        // diameter,
        // coilWeight,
        coilNetWeight,
        // ribbonTypeName,
        // ribbonWidth,
        // roller,
        // rollMachine,
        // isFlat,
        // castDate,
        // caster,
        laminationFactor,
        laminationLevel,
        realRibbonWidth,
        ribbonThickness1,
        ribbonThickness2,
        ribbonThickness3,
        ribbonThickness4,
        ribbonThickness5,
        ribbonThickness6,
        ribbonThickness7,
        ribbonThickness8,
        ribbonThickness9,
        ribbonThicknessDeviation,
        ribbonThickness,
        ribbonThicknessLevel,
        ribbonToughness,
        ribbonToughnessLevel,
        appearence,
        appearenceLevel,
        ribbonTotalLevel,
        isMeasureConfirmed,
        isStored,
        unStoreReason,
        unQualifiedReason,
        clients,
        remainWeight,
        totalStoredWeight,
        inPlanStoredWeight,
        outPlanStoredWeight,
        qualityOfA,
        qualityOfB,
        qualityOfC,
        qualityOfD,
        qualityOfE,
        highFactorThinRibbonWeight,
        thinRibbonWeight,
        inPlanThickRibbonWeight,
        qualityOfGood,
        qualityOfFine,
        qualityOfNormal,
      };
      const [n] = await measureModel.update(newData, {
        where: { measureId },
      });
      if (n !== 0) {
        res.send({
          status: 0,
          message: "更新数据成功",
        });
      } else {
        throw new Error("更新数据失败");
      }
    } catch (err) {
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message,
      });
    }
  }

  // 批量计算综合级别，由检测人员使用
  async updateMeasureByBatch(req, res, next) {
    const { listJson } = req.body;
    let list = [];
    try {
      list = JSON.parse(listJson) || [];
    } catch (err) {
      console.log(err.message, err);
      log.error(err.message, err);
      return res.send({
        status: -1,
        message: err.message || "数据有错误",
      });
    }
    Array.isArray(list) &&
      list.forEach(async (item) => {
        let clone = cloneDeep(item);
        const { measureId } = clone;

        try {
          if (!measureId) {
            throw new Error("参数错误");
          }
        } catch (err) {
          console.log(err.message, err);
          log.error(err.message, err);
          res.send({
            status: -1,
            message: err.message,
          });
          return;
        }

        try {
          const newData = {
            coilNetWeight: item.coilNetWeight,
            remainWeight: item.remainWeight,
            laminationFactor: item.laminationFactor,
            laminationLevel: item.laminationLevel,
            ribbonToughness: item.ribbonToughness,
            ribbonThicknessDeviation: item.ribbonThicknessDeviation,
            ribbonThickness: item.ribbonThickness,
            ribbonThicknessLevel: item.ribbonThicknessLevel,
            // ribbonToughnessLevel,
            // appearence,
            // appearenceLevel,
            ribbonTotalLevel: item.ribbonTotalLevel,
            // isMeasureConfirmed,
            isStored: item.isStored,
            // unStoreReason,
            clients: item.clients,
            // takeBy,
            // shipRemark,
            // place,
            totalStoredWeight: item.totalStoredWeight || 0,
            inPlanStoredWeight: item.inPlanStoredWeight || 0,
            outPlanStoredWeight: item.outPlanStoredWeight || 0,
            qualityOfA: item.qualityOfA || 0,
            qualityOfB: item.qualityOfB || 0,
            qualityOfC: item.qualityOfC || 0,
            qualityOfD: item.qualityOfD || 0,
            qualityOfE: item.qualityOfE || 0,
            highFactorThinRibbonWeight: item.highFactorThinRibbonWeight || 0,
            thinRibbonWeight: item.thinRibbonWeight || 0,
            inPlanThickRibbonWeight: item.inPlanThickRibbonWeight || 0,
            qualityOfGood: item.qualityOfGood || 0,
            qualityOfFine: item.qualityOfFine || 0,
            qualityOfNormal: item.qualityOfNormal || 0,
            measureDate: Date.now(), // 检测日期
            unQualifiedReason: item.unQualifiedReason, // 不合格原因
          };
          const [n] = await measureModel.update(newData, {
            where: { measureId },
          });
          if (n !== 0) {
            res.send({
              status: 0,
              message: "更新数据成功",
            });
          } else {
            throw new Error("更新数据失败");
          }
        } catch (err) {
          console.log(err.message, err);
          log.error(err.message, err);
          res.send({
            status: -1,
            message: err.message,
          });
        }
      });
  }

  async delData(req, res, next) {
    const { measureId } = req.body;
    try {
      if (!measureId) {
        throw new Error("参数错误");
      }
    } catch (err) {
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message,
      });
      return;
    }

    try {
      const m = await measureModel.destroy({ where: { measureId } });
      if (m != 0) {
        res.send({
          status: 0,
          message: "删除记录成功",
        });
      } else {
        throw new Error("删除记录失败");
      }
    } catch (err) {
      log.error(err.message, err);
      res.send({
        status: -1,
        message: "删除记录失败",
      });
    }
  }

  // 导出检测记录的excel
  async exportMeasure(req, res, next) {
    const {
      castId,
      startTime,
      endTime,
      startMeasureTime,
      endMeasureTime,
      furnaceJson,
    } = req.query;
    try {
      let queryCondition = "";
      // 检测只能看到重卷确认后的带材
      queryCondition +=
        queryCondition !== ""
          ? ` AND m.isRollConfirmed=1`
          : ` m.isRollConfirmed=1`;
      if (castId) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND m.castId=${castId}`
            : ` m.castId=${castId}`;
      }
      if (startTime && endTime) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND c.createTime BETWEEN '${startTime}' AND '${endTime}'`
            : ` c.createTime BETWEEN '${startTime}' AND '${endTime}'`;
      }

      if (startMeasureTime && endMeasureTime) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND m.measureDate BETWEEN '${startMeasureTime}' AND '${endMeasureTime}'`
            : ` m.measureDate BETWEEN '${startMeasureTime}' AND '${endMeasureTime}'`;
      }

      if (furnaceJson) {
        let furnanceList = JSON.parse(furnaceJson);
        if (furnanceList.length > 0) {
          const furnaces = furnanceList.map((item) => `'${item}'`).join();
          queryCondition +=
            queryCondition !== ""
              ? ` AND m.furnace IN (${furnaces})`
              : ` m.furnace IN (${furnaces})`;
        }
      }

      const conf = {};
      conf.name = "mysheet";
      conf.cols = [
        { caption: "炉号", type: "string" },
        { caption: "盘号", type: "number" },
        { caption: "材质", type: "string" },
        { caption: "规格", type: "number" },
        { caption: "生产日期", type: "string" },
        { caption: "检测日期", type: "string" },
        { caption: "喷带手", type: "string" },
        { caption: "外径", type: "number" },
        { caption: "重量", type: "number" },
        { caption: "净量", type: "number" },
        { caption: "叠片系数", type: "number" },
        { caption: "叠片等级", type: "string" },
        { caption: "实际带宽", type: "number" },
        { caption: "厚度1", type: "number" },
        { caption: "厚度2", type: "number" },
        { caption: "厚度3", type: "number" },
        { caption: "厚度4", type: "number" },
        { caption: "厚度5", type: "number" },
        { caption: "厚度6", type: "number" },
        { caption: "厚度7", type: "number" },
        { caption: "厚度8", type: "number" },
        { caption: "厚度9", type: "number" },
        { caption: "厚度偏差", type: "number" },
        { caption: "平均厚度", type: "number" },
        { caption: "厚度级别", type: "number" },
        { caption: "韧性", type: "string" },
        { caption: "韧性等级", type: "string" },
        { caption: "外观", type: "string" },
        { caption: "外观等级", type: "string" },
        { caption: "综合级别", type: "string" },
        { caption: "不合格原因", type: "string" },
        { caption: "是否入库", type: "string" },
        { caption: "入库类别", type: "string" },
        { caption: "不入库原因", type: "string" },
        { caption: "判定去向", type: "string" },
      ];
      conf.rows = [];
      const sqlStr = `SELECT 
                        m.*, c.ribbonTypeName, c.ribbonWidth, c.createTime AS castDate, c.caster
                      FROM ${TABLE_NAME} m 
                      LEFT JOIN cast c 
                      ON m.furnace=c.furnace
                      ${queryCondition !== "" ? "WHERE " + queryCondition : ""}
                      ORDER BY m.furnace DESC, m.coilNumber ASC`;

      const list = await sequelize.query(sqlStr, {
        type: sequelize.QueryTypes.SELECT,
      });

      // 导出已经计算出综合级别的带材记录
      conf.rows = list
        .filter((item) => item.ribbonTotalLevel)
        .map((item) =>
          [
            item.furnace,
            item.coilNumber,
            item.ribbonTypeName,
            item.ribbonWidth,
            moment(item.castDate).format("YYYY-MM-DD"),
            moment(item.measureDate).format("YYYY-MM-DD"),
            item.caster,
            item.diameter,
            item.coilWeight,
            item.coilNetWeight,
            item.laminationFactor,
            item.laminationLevel,
            item.realRibbonWidth,
            item.ribbonThickness1,
            item.ribbonThickness2,
            item.ribbonThickness3,
            item.ribbonThickness4,
            item.ribbonThickness5,
            item.ribbonThickness6,
            item.ribbonThickness7,
            item.ribbonThickness8,
            item.ribbonThickness9,
            item.ribbonThicknessDeviation,
            item.ribbonThickness,
            item.ribbonThicknessLevel,
            item.ribbonToughness,
            item.ribbonToughnessLevel,
            item.appearence,
            item.appearenceLevel,
            item.ribbonTotalLevel,
            item.unQualifiedReason,
            item.isStorageConfirmed === 1 ? "是" : "否",
            isStoredDesc(item.isStored),
            item.unStoreReason,
            item.clients,
          ].map((val) => (val == undefined ? null : val))
        );

      function isStoredDesc(status) {
        switch (status) {
          case 1:
            return "计划内入库";
            break;
          case 2:
            return "计划外入库";
            break;
          case 3:
            return "未入库";
            break;
          default:
            return "";
            break;
        }
      }

      const result = nodeExcel.execute(conf);
      res.setHeader("Content-Type", "application/vnd.openxmlformats");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "jiance.xlsx"
      );
      res.end(result, "binary");
    } catch (err) {
      console.log("导出检测记录失败", err);
      log.error("导出检测记录失败", err);
      res.send({
        status: -1,
        message: "导出检测记录失败",
      });
    }
  }

  // 导出重卷记录的excel
  async exportRoll(req, res, next) {
    const { castId, furnace, startTime, endTime, caster, roller } = req.query;

    try {
      let queryCondition = "";
      if (caster) {
        queryCondition += `c.caster='${caster}'`;
      }
      if (castId) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND m.castId=${castId}`
            : ` m.castId=${castId}`;
      }
      if (roller) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND roller='${roller}'`
            : ` roller='${roller}'`;
      }
      if (furnace) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND m.furnace='${furnace}'`
            : ` m.furnace='${furnace}'`;
      }
      if (startTime && endTime) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND c.createTime BETWEEN '${startTime}' AND '${endTime}'`
            : ` c.createTime BETWEEN '${startTime}' AND '${endTime}'`;
      }

      const sqlStr = `SELECT 
                        m.*, c.ribbonTypeName, c.ribbonWidth, c.createTime, c.caster
                      FROM ${TABLE_NAME} m 
                      LEFT JOIN cast c 
                      ON m.furnace=c.furnace
                      ${queryCondition !== "" ? "WHERE " + queryCondition : ""}
                      ORDER BY m.furnace DESC, m.coilNumber ASC`;

      const list =
        (await sequelize.query(sqlStr, {
          type: sequelize.QueryTypes.SELECT,
        })) || [];

      const rollerList = (await rollerModel.findAll()) || [];

      const conf = {};
      conf.name = "mysheet";
      conf.cols = [
        { caption: "炉号", type: "string" },
        { caption: "盘号", type: "number" },
        { caption: "材质", type: "string" },
        { caption: "规格", type: "number" },
        { caption: "生产日期", type: "string" },
        { caption: "喷带手", type: "string" },
        { caption: "外径(mm)", type: "number" },
        { caption: "重量(kg)", type: "number" },
        { caption: "机器编号", type: "number" },
        { caption: "重卷人员", type: "string" },
        { caption: "重卷日期", type: "string" },
        { caption: "是否平整", type: "string" },
      ];

      conf.rows = list.map((item) => {
        let rollerName = "";
        for (let i = 0; i < rollerList.length; i++) {
          const roll = rollerList[i];
          if (roll.roller === item.roller) {
            rollerName = roll.rollerName;
            break;
          }
        }

        return [
          item.furnace,
          item.coilNumber,
          item.ribbonTypeName,
          item.ribbonWidth,
          moment(item.createTime).format("YYYY-MM-DD"),
          item.caster,
          item.diameter,
          item.coilWeight,
          item.rollMachine,
          rollerName,
          moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss"),
          item.isFlat == 1 ? "不平整" : "平整",
        ].map((val) => (val == undefined ? null : val));
      });

      const result = nodeExcel.execute(conf);
      res.setHeader("Content-Type", "application/vnd.openxmlformats");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "chongjuan.xlsx"
      );
      res.end(result, "binary");
    } catch (err) {
      console.log("导出重卷记录失败", err);
      log.error("导出重卷记录失败", err);
      res.send({
        status: -1,
        message: "导出重卷记录失败",
      });
    }
  }

  // 导入检测数据
  async uploadMeasure(req, res, next) {
    let list = [];
    const form = new formidable.IncomingForm();
    form.encoding = "utf-8";
    form.uploadDir = path.join(__dirname, "../upload/");
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;

    form.parse(req, async (error, fields, files) => {
      try {
        if (error) {
          throw new Error("文件上传出错");
        }
        let filePath = files.file.path;
        let data = xlsx.parse(filePath);
        fs.unlinkSync(filePath);
        // 过滤掉标题和空行的数据
        list = data[0].data
          .filter((item, i) => i > 0 && item.length > 0)
          .map((item) => {
            return {
              castId: Number(item[0]),
              furnace: item[1],
              coilNumber: Number(item[2]),
              realRibbonWidth: Number(item[17]),
              ribbonThickness1: Number(item[18]),
              ribbonThickness2: Number(item[19]),
              ribbonThickness3: Number(item[20]),
              ribbonThickness4: Number(item[21]),
              ribbonThickness5: Number(item[22]),
              ribbonThickness6: Number(item[23]),
              ribbonThickness7: Number(item[24]),
              ribbonThickness8: Number(item[25]),
              ribbonThickness9: Number(item[26]),
              ribbonToughness: item[30],
              ribbonToughnessLevel: item[32],
              appearence: item[33],
              appearenceLevel: item[35],
            };
          });
      } catch (err) {
        log.error(err.message);
        console.log(err.message);
        res.send({
          status: -1,
          message: err.message,
        });
      }

      let errList = [];
      try {
        for (let i = 0, len = list.length; i < len; i++) {
          const item = list[i];
          const [n] = await measureModel.update(
            {
              castId: item.castId,
              realRibbonWidth: item.realRibbonWidth,
              ribbonThickness1: item.ribbonThickness1,
              ribbonThickness2: item.ribbonThickness2,
              ribbonThickness3: item.ribbonThickness3,
              ribbonThickness4: item.ribbonThickness4,
              ribbonThickness5: item.ribbonThickness5,
              ribbonThickness6: item.ribbonThickness6,
              ribbonThickness7: item.ribbonThickness7,
              ribbonThickness8: item.ribbonThickness8,
              ribbonThickness9: item.ribbonThickness9,
              ribbonToughness: item.ribbonToughness,
              ribbonToughnessLevel: item.ribbonToughnessLevel,
              appearence: item.appearence,
              appearenceLevel: item.appearenceLevel,
              ribbonTotalLevel: null, // 重新清空带材综合级别
            },
            {
              where: {
                furnace: item.furnace,
                coilNumber: item.coilNumber,
              },
            }
          );
          if (n == 0) {
            errList.push({
              furnace: item.furnace,
              coilNumber: item.coilNumber,
            });
          }
        }
        if (errList.length > 0) {
          throw new Error("添加检测数据失败");
        }
      } catch (err) {
        log.error(err.message);
        console.log(err.message);
        res.send({
          status: -1,
          message: err.message,
          data: errList,
        });
      }

      res.send({
        status: 0,
        message: "添加检测数据成功",
      });
    });
  }

  // 导入重卷数据
  async uploadRoll(req, res, next) {
    let list = [];
    const form = new formidable.IncomingForm();
    form.encoding = "utf-8";
    form.uploadDir = path.join(__dirname, "../upload/");
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;

    form.parse(req, async (error, fields, files) => {
      try {
        if (error) {
          throw new Error("文件上传出错");
        }
        let filePath = files.file.path;
        let data = xlsx.parse(filePath);
        fs.unlinkSync(filePath);
        // 过滤掉标题和空行的数据
        list = data[0].data
          .filter((item, i) => i > 0 && item.length > 0)
          .map((item) => {
            const furnace = item[1];
            const castId = parseInt(furnace.substring(0, 2));
            return {
              castId,
              furnace,
              coilNumber: Number(item[2]),
              rollerName: item[7],
              diameter: Number(item[9]),
              coilWeight: Number(item[10]),
            };
          });
      } catch (err) {
        log.error(err.message);
        console.log(err.message);
        res.send({
          status: -1,
          message: err.message,
        });
      }

      let errList = [];
      try {
        for (let i = 0, len = list.length; i < len; i++) {
          const item = list[i];
          // 首先查询喷带表中是否存在这个炉号，如果存在则在重卷记录中创建，如果不存在则不创建，加入到错误提示中
          const castData = await castModel.findOne({
            where: {
              furnace: item.furnace,
            },
          });
          if (castData) {
            await measureModel.findOrCreate({
              where: {
                furnace: item.furnace,
                coilNumber: item.coilNumber,
              },
              defaults: {
                castId: item.castId,
                furnace: item.furnace,
                coilNumber: item.coilNumber,
                rollerName: item.rollerName,
                diameter: item.diameter,
                coilWeight: item.coilWeight,
              },
            });
          } else {
            errList.push({
              furnace: item.furnace,
              coilNumber: item.coilNumber,
            });
          }
        }
        if (errList.length > 0) {
          throw new Error("添加重卷数据失败");
        }
      } catch (err) {
        log.error(err.message);
        console.log(err.message);
        res.send({
          status: -1,
          message: err.message,
          data: errList,
        });
      }

      res.send({
        status: 0,
        message: "添加重卷数据成功",
      });
    });
  }
}

module.exports = new Measure();
