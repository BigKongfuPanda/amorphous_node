"use strict";
const sequelize = require("../mysql/db");
const measureModel = require("../models/measure");
const castModel = require("../models/cast");
const planModel = require("../models/plan");
const rollerModel = require("../models/roller");
const storageModel = require("../models/storage");
const log = require("log4js").getLogger("measure");
const nodeExcel = require("excel-export");
const moment = require("moment");
const { valueToString } = require("../util");
const { cloneDeep } = require("lodash");

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
                      FROM measure m 
                      LEFT JOIN cast c 
                      ON m.furnace=c.furnace
                      ${queryCondition !== "" ? "WHERE " + queryCondition : ""}
                      ORDER BY m.createdAt DESC, m.furnace DESC, m.coilNumber ASC
                      LIMIT ${limit} OFFSET ${(current - 1) * limit}`;
      const sqlStr2 = `SELECT 
                        m.*, c.ribbonTypeName, c.ribbonWidth, c.createTime, c.caster
                      FROM measure m 
                      LEFT JOIN cast c 
                      ON m.furnace=c.furnace
                      ${
                        queryCondition !== "" ? "WHERE " + queryCondition : ""
                      }`;

      const list = await sequelize.query(sqlStr, {
        type: sequelize.QueryTypes.SELECT,
      });
      const totalList = await sequelize.query(sqlStr2, {
        type: sequelize.QueryTypes.SELECT,
      });
      const count = totalList.length;
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

  // 查询检测数据
  async queryMeasureData(req, res, next) {
    const {
      castId,
      furnace,
      startTime,
      endTime,
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
            ? ` AND roller='${roller}'`
            : ` roller='${roller}'`;
      }
      if (furnace) {
        queryCondition +=
          queryCondition !== ""
            ? ` AND m.furnace='${furnace}'`
            : ` m.furnace='${furnace}'`;
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

      const sqlStr = `SELECT 
                        m.*, c.ribbonTypeName, c.ribbonWidth, c.createTime, c.caster
                      FROM measure m 
                      LEFT JOIN cast c 
                      ON m.furnace=c.furnace
                      ${queryCondition !== "" ? "WHERE " + queryCondition : ""}
                      ORDER BY m.createdAt DESC, m.furnace DESC, m.coilNumber ASC
                      LIMIT ${limit} OFFSET ${(current - 1) * limit}`;
      const sqlStr2 = `SELECT 
                        m.*, c.ribbonTypeName, c.ribbonWidth, c.createTime, c.caster
                      FROM measure m 
                      LEFT JOIN cast c 
                      ON m.furnace=c.furnace
                      ${
                        queryCondition !== "" ? "WHERE " + queryCondition : ""
                      }`;

      let list = await sequelize.query(sqlStr, {
        type: sequelize.QueryTypes.SELECT,
      });
      const totalList = await sequelize.query(sqlStr2, {
        type: sequelize.QueryTypes.SELECT,
      });
      const count = totalList.length;
      const totalPage = Math.ceil(count / limit);

      // 如果排产12炉，喷带13或以上，则从第13炉开始，需要取第12炉的材质，规格，订单要求和排产要求
      // 查询生产计划集合中，当前炉次的订单要求和入库要求
      const uniqueFurnaceList = Array.from(
        new Set(list.map((item) => item.furnace))
      );
      let furnaceMapToOrderAndqualifiedDemands = {};
      let furnaceMapToCastInfo = {};
      for (const furnace of uniqueFurnaceList) {
        let planFurnace = furnace.substr(0, 14);
        const date = furnace.split("-")[1]; // 06-20190111-02/08 ---> 2019-01-11
        const fomatDate = moment(date).format("YYYY-MM-DD");
        const planListByDate = await planModel.findAll({
          where: { date: fomatDate },
          raw: true,
        });
        const _len = planListByDate.length;
        if (Number(planFurnace.split("-")[2]) > _len) {
          planFurnace = planListByDate[_len - 1].furnace;
        }
        const {
          orderThickness,
          orderLaminationFactor,
          orderRibbonToughnessLevels,
          orderAppearenceLevels,
          qualifiedDemands,
        } = await planModel.findOne({
          where: { furnace: planFurnace },
        });
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
        message: "查询检测记录失败",
      });
    }
  }

  // 新增操作，由重卷人员使用
  async createData(req, res, next) {
    let {
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
        `SELECT SUM(coilWeight) AS weight FROM measure WHERE  furnace = '${furnace}'`,
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

  // 重卷数据入库
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
          const data = await castModel.findOne({ where: { furnace } });
          if (!data) {
            throw new Error(`炉号 ${furnace} 不存在，请检查炉号是否正确`);
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
            `SELECT SUM(coilWeight) AS weight FROM measure WHERE  furnace = '${furnace}'`,
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
          const { createTime } = await castModel.findOne({
            where: { furnace },
          });
          const newData = {
            castDate: createTime,
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
        // 当带材检测后入库的时候，设置入库日期和检测日期，检测人员操作
        item.inStoreDate = Date.now();
        item.measureDate = Date.now();
        item.isMeasureConfirmed = 1; // 1-检测确认入库，0-没有入库
        await measureModel.update(
          {
            inStoreDate: item.inStoreDate,
            measureDate: item.measureDate,
            isMeasureConfirmed: 1,
          },
          { where: { measureId: item.measureId } }
        );
        // 将入库数据
        let clone = cloneDeep(item);
        delete clone.measureId;
        delete clone.createdAt;
        delete clone.updatedAt;
        await storageModel.create(clone);
      });
      res.send({
        status: 0,
        message: "入库成功",
      });
    } catch (err) {
      log.error(err.message, err);
      res.send({
        status: -1,
        message: "入库失败",
      });
    }
  }

  // 更新操作，由检测人员和库房人员使用
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
        `SELECT SUM(coilWeight) AS weight FROM measure WHERE  furnace = '${furnace}'`,
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
      const [n] = await measureModel.update(newData, { where: { measureId } });
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
      clients = "",
      remainWeight,
      takeBy,
      shipRemark,
      place,
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
        clients,
        remainWeight,
        takeBy,
        shipRemark,
        place,
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
      const [n] = await measureModel.update(newData, { where: { measureId } });
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

  // 批量更新操作，由检测人员使用
  async updateMeasureByBatch(req, res, next) {
    const { list } = req.body;
    Array.isArray(list).forEach(async (item) => {
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
        delete clone.measureId;
        const newData = {
          ...clone,
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
      furnace,
      startTime,
      endTime,
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
    } = req.query;
    try {
      let queryCondition = {};
      if (castId) {
        queryCondition.castId = castId;
      }
      if (caster) {
        queryCondition.caster = caster;
      }
      if (roller) {
        queryCondition.roller = roller;
      }
      if (furnace) {
        queryCondition.furnace = furnace;
      }
      if (startTime && endTime) {
        queryCondition.inStoreDate = { $gt: startTime, $lt: endTime };
      }
      if (ribbonTypeNameJson) {
        const ribbonTypeNameList = JSON.parse(ribbonTypeNameJson);
        if (ribbonTypeNameList.length > 0) {
          queryCondition.ribbonTypeName = { $in: ribbonTypeNameList };
        }
      }
      if (ribbonWidthJson) {
        const ribbonWidthList = JSON.parse(ribbonWidthJson);
        if (ribbonWidthList.length > 0) {
          queryCondition.ribbonWidth = { $in: ribbonWidthList };
        }
      }
      if (ribbonThicknessLevelJson) {
        const ribbonThicknessLevelList = JSON.parse(ribbonThicknessLevelJson);
        if (ribbonThicknessLevelList.length > 0) {
          queryCondition.ribbonThicknessLevel = {
            $in: ribbonThicknessLevelList,
          };
        }
      }
      if (laminationLevelJson) {
        const laminationLevelList = JSON.parse(laminationLevelJson);
        if (laminationLevelList.length > 0) {
          queryCondition.laminationLevel = { $in: laminationLevelList };
        }
      }
      if (ribbonToughnessLevelJson) {
        const ribbonToughnessLevelList = JSON.parse(ribbonToughnessLevelJson);
        if (ribbonToughnessLevelList.length > 0) {
          queryCondition.ribbonToughnessLevel = {
            $in: ribbonToughnessLevelList,
          };
        }
      }
      if (appearenceLevelJson) {
        const appearenceLevelList = JSON.parse(appearenceLevelJson);
        if (appearenceLevelList.length > 0) {
          queryCondition.appearenceLevel = { $in: appearenceLevelList };
        }
      }
      if (place) {
        queryCondition.place = place;
      }
      if (ribbonTotalLevels) {
        const ribbonTotalLevelList = ribbonTotalLevels.split(",");
        queryCondition.ribbonTotalLevel = { $in: ribbonTotalLevelList };
      }

      const conf = {};
      conf.name = "mysheet";
      conf.cols = [
        { caption: "炉号", type: "string" },
        { caption: "盘号", type: "number" },
        { caption: "材质", type: "string" },
        { caption: "规格", type: "number" },
        { caption: "生产日期", type: "string" },
        { caption: "喷带手", type: "string" },
        { caption: "外径", type: "number" },
        { caption: "重量", type: "number" },
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
        { caption: "是否入库", type: "string" },
        { caption: "不入库原因", type: "string" },
        { caption: "判定去向", type: "string" },
      ];
      conf.rows = [];
      // const list = await measureModel.find(queryCondition).sort({'furnace': 'asc', 'coilNumber': 'asc'});
      const list = await measureModel.findAll({
        where: queryCondition,
        roder: [
          ["furnace", "asc"],
          ["coilNumber", "asc"],
        ],
        raw: true,
      });

      conf.rows = await Promise.all(
        list.map(async (item) => {
          const {
            ribbonTypeName,
            ribbonWidth,
            createTime,
            caster,
          } = await castModel.findOne({
            where: { furnace: item.furnace },
            raw: true,
          });

          return [
            item.furnace,
            item.coilNumber,
            ribbonTypeName,
            ribbonWidth,
            moment(createTime).format("YYYY-MM-DD"),
            caster,
            item.diameter,
            item.coilWeight,
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
            isStoredDesc(item.isStored),
            item.unStoreReason,
            item.clients,
          ].map((val) => (val == undefined ? null : val));
        })
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
            return "不合格";
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
                      FROM mytable m 
                      LEFT JOIN cast c 
                      ON m.furnace=c.furnace
                      ${queryCondition !== "" ? "WHERE " + queryCondition : ""}
                      ORDER BY m.createdAt DESC, m.furnace DESC, m.coilNumber ASC`;

      const list =
        (await sequelize.query(sqlStr, {
          type: sequelize.QueryTypes.SELECT,
        })) || [];

      const rollerList = (await rollerModel.findAll()) || [];

      const conf = {};
      conf.name = "mysheet";
      conf.cols = [
        { caption: "炉号", type: "string" },
        { caption: "材质", type: "string" },
        { caption: "规格", type: "number" },
        { caption: "生产日期", type: "string" },
        { caption: "喷带手", type: "string" },
        { caption: "盘号", type: "number" },
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
          item.ribbonTypeName,
          item.ribbonWidth,
          moment(item.createTime).format("YYYY-MM-DD"),
          item.caster,
          item.coilNumber,
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
}

module.exports = new Measure();
