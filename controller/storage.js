"use strict";

const sequelize = require("../mysql/db");
const storageModel = require("../models/storage");
const measureModel = require("../models/measure");
const log = require("log4js").getLogger("storage");
const nodeExcel = require("excel-export");
const moment = require("moment");
const storageService = require("../service/storage");
const formidable = require("formidable");
const xlsx = require("node-xlsx");
const path = require("path");
const fs = require("fs");
const config = require("config-lite")(__dirname);
const TABLE_NAME = config.tableName;

class Storage {
  constructor() {}

  async queryData(req, res, next) {
    const {
      castIdJson,
      furnaceJson,
      startTime,
      endTime,
      outStartTime,
      outEndTime,
      caster,
      ribbonTypeNameJson,
      ribbonWidthJson,
      ribbonThicknessLevelJson,
      laminationLevelJson,
      takebyJson,
      place,
      ribbonTotalLevels,
      isRemain = 1,
      current = 1,
      limit = 20,
    } = req.query;
    try {
      let queryCondition = {};
      if (caster) {
        queryCondition.caster = caster;
      }
      if (castIdJson) {
        const castIdList = JSON.parse(castIdJson);
        if (castIdList.length > 0) {
          queryCondition.castId = { $in: castIdList };
        }
      }
      if (furnaceJson) {
        const furnaceList = JSON.parse(furnaceJson);
        if (furnaceList.length > 0) {
          queryCondition.furnace = { $in: furnaceList };
        }
      }
      if (startTime && endTime) {
        queryCondition.inStoreDate = { $gt: startTime, $lt: endTime };
      }
      if (outStartTime && outEndTime) {
        queryCondition.outStoreDate = {
          $gt: outStartTime,
          $lt: outEndTime,
        };
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
          queryCondition.laminationLevel = {
            $in: laminationLevelList,
          };
        }
      }
      if (takebyJson) {
        const takebyList = JSON.parse(takebyJson);
        if (takebyList.length > 0) {
          queryCondition.takeBy = { $in: takebyList };
        }
      }
      if (place) {
        const placeList = place.split(",");
        queryCondition.place = { $in: placeList };
      }
      if (isRemain === "0") {
        queryCondition.remainWeight = 0;
      } else if (isRemain === "1") {
        queryCondition.remainWeight = { $gt: 0 };
      }
      if (ribbonTotalLevels) {
        const ribbonTotalLevelList = ribbonTotalLevels.split(",");
        queryCondition.ribbonTotalLevel = { $in: ribbonTotalLevelList };
      }

      // const totalList = await storageModel.findAll(queryCondition);
      // const totalCoilNum = totalList.length;
      // let totalWeight = 0;
      // totalList.forEach(item => {
      //   totalWeight += item.remainWeight;
      // });
      // const totalCoilNum = await storageModel.count();
      // const totalWeight = await storageModel.sum('remainWeight');

      // const list = await storageModel.find(queryCondition).skip((current - 1) * limit).limit(limit).sort({'furnace': 'desc', 'coilNumber': 'asc'});

      const totalList = await storageModel.findAll({
        where: queryCondition,
      });
      const totalCoilNum = totalList.length;
      let totalWeight = 0;
      totalList.forEach((item) => {
        totalWeight += item.remainWeight;
      });

      const pageData = await storageModel.findAndCountAll({
        where: queryCondition,
        offset: (current - 1) * limit,
        limit: limit,
        order: [
          ["furnace", "ASC"],
          ["coilNumber", "ASC"],
        ],
      });
      const list = pageData.rows;
      const count = pageData.count;
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
          totalCoilNum,
          totalWeight: totalWeight.toFixed(2),
          list,
        },
      });
    } catch (err) {
      console.log("查询库房记录失败", err);
      log.error("查询库房记录失败", err);
      res.send({
        status: -1,
        message: "查询库房记录失败",
      });
    }
  }

  // 查询申请入库实时记录
  async queryApplyStorage(req, res, next) {
    const { castIds, furnaceJson } = req.query;
    try {
      let queryCondition = "";

      if (castIds) {
        let castIdList = JSON.parse(castIds);
        if (castIdList.length > 0) {
          const ids = castIdList.join();
          queryCondition +=
            queryCondition !== ""
              ? ` AND m.castId IN (${ids})`
              : ` m.castId IN (${ids})`;
        }
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

      // 只查找检测确认，并且库房没有确认的，可以入库的带材
      queryCondition +=
        queryCondition !== ""
          ? ` AND m.isMeasureConfirmed=1`
          : ` m.isMeasureConfirmed=1`;
      queryCondition +=
        queryCondition !== ""
          ? ` AND m.isStorageConfirmed=0`
          : ` m.isStorageConfirmed=0`;

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

      // 要考虑分页
      res.send({
        status: 0,
        message: "操作成功",
        data: {
          list,
        },
      });
    } catch (err) {
      console.log("查询申请入库记录失败", err);
      log.error("查询申请入库记录失败", err);
      res.send({
        status: -1,
        message: "查询申请入库记录失败",
      });
    }
  }

  /**
   * 确认入库
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async addStorage(req, res, next) {
    const { dataJson } = req.body;
    let list = [];
    try {
      if (!dataJson) {
        throw new Error("参数错误");
      }
      list = JSON.parse(dataJson);
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
        const data = {
          inStoreDate: Date.now(), // 入库时间
          castId: item.castId,
          furnace: item.furnace,
          castDate: item.castDate,
          caster: item.caster,
          coilNumber: item.coilNumber,
          diameter: item.diameter,
          coilWeight: item.coilWeight,
          coilNetWeight: item.coilNetWeight,
          remainWeight: item.remainWeight,
          ribbonTypeName: item.ribbonTypeName,
          ribbonWidth: item.ribbonWidth,
          realRibbonWidth: item.realRibbonWidth,
          ribbonThickness: item.ribbonThickness,
          ribbonThicknessLevel: item.ribbonThicknessLevel,
          ribbonToughness: item.ribbonToughness,
          ribbonToughnessLevel: item.ribbonToughnessLevel,
          appearence: item.appearence,
          appearenceLevel: item.appearenceLevel,
          laminationFactor: item.laminationFactor,
          laminationLevel: item.laminationLevel,
          ribbonTotalLevel: item.ribbonTotalLevel,

          orderThickness: item.orderThickness,
          orderLaminationFactor: item.orderLaminationFactor,
          orderRibbonToughnessLevels: item.orderRibbonToughnessLevels,
          orderAppearenceLevels: item.orderAppearenceLevels,
          qualifiedDemands: item.qualifiedDemands,

          isStored: item.isStored,
          clients: item.clients,
          totalStoredWeight: item.totalStoredWeight,
          inPlanStoredWeight: item.inPlanStoredWeight,
          outPlanStoredWeight: item.outPlanStoredWeight,
          qualityOfA: item.qualityOfA,
          qualityOfB: item.qualityOfB,
          qualityOfC: item.qualityOfC,
          qualityOfD: item.qualityOfD,
          qualityOfE: item.qualityOfE,
          thinRibbonWeight: item.thinRibbonWeight,
          highFactorThinRibbonWeight: item.highFactorThinRibbonWeight,
          inPlanThickRibbonWeight: item.inPlanThickRibbonWeight,
          qualityOfGood: item.qualityOfGood,
          qualityOfFine: item.qualityOfFine,
          qualityOfNormal: item.qualityOfNormal,
        };
        // 检测是否重复入库
        try {
          const data = await storageModel.findOne({
            where: { furnace: item.furnace, coilNumber: item.coilNumber },
          });
          // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
          if (data) {
            throw new Error(
              `炉号 ${item.furnace} 和盘号 ${item.coilNumber} 重复`
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

        await storageModel.create(data);
        // 同步更新检测记录表，将isStorageConfirmed设为1，表示入库确认
        const [n] = await measureModel.update(
          {
            isStorageConfirmed: 1,
          },
          {
            where: { measureId: item.measureId },
          }
        );
        if (n !== 0) {
          res.send({
            status: 0,
            message: "更新数据成功",
          });
        } else {
          throw new Error("更新库房记录表失败");
        }
      });
      res.send({
        status: 0,
        message: "确认入库成功",
      });
    } catch (err) {
      const message = err.message || "确认入库失败";
      log.error(message, err);
      res.send({
        status: -1,
        message,
      });
    }
  }
  /**
   * 请求库房表中所有的炉号
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async queryFurnace(req, res, next) {
    const { query } = req.query;
    try {
      let list = await storageModel.findAll({
        attributes: ["furnace"],
        where: {
          furnace: {
            $like: `%${query}%`,
          },
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
    } catch (error) {
      console.log("查询库房炉号记录失败", err);
      log.error("查询库房炉号记录失败", err);
      res.send({
        status: -1,
        message: "查询库房炉号记录失败",
      });
    }
  }

  async updateData(req, res, next) {
    // 整个托盘出库: 参数: type: all, place: '', takeBy: ''
    if (req.body.type === "all") {
      return storageService.allOutStore(req, res, next);
    }

    // 批量出库: 参数: type: batch, dataJson: '', takeBy: ''
    if (req.body.type === "batch") {
      return storageService.batchOutStore(req, res, next);
    }

    let {
      storageId,
      roleId,
      adminname,
      castId,
      furnace,
      coilNumber,
      diameter,
      coilWeight,
      coilNetWeight,
      ribbonTypeName,
      ribbonWidth,
      roller,
      rollMachine,
      castDate,
      caster,
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
      createdAt,
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
      if (!storageId) {
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
      // let inStoreDate = null;
      // // 当带材检测后入库的时候，设置入库日期，检测人员操作
      // if (isStored == 1 || isStored == 2) {
      //   inStoreDate = Date.now();
      // }

      let outStoreDate = null;
      // 当带材被领用的时候，设置出库日期，库房操作
      if (takeBy) {
        outStoreDate = Date.now();
      }
      const newData = {
        castId,
        furnace,
        coilNumber,
        diameter,
        coilWeight,
        coilNetWeight,
        ribbonTypeName,
        ribbonWidth,
        castDate,
        caster,
        roller,
        rollMachine,
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
        outStoreDate,
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
      const [n] = await storageModel.update(newData, {
        where: { storageId },
      });
      if (n !== 0) {
        res.send({
          status: 0,
          message: "更新数据成功",
        });
      } else {
        throw new Error("更新库房记录表失败");
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

  async delData(req, res, next) {
    const { storageId, furnace, coilNumber } = req.body;
    try {
      if (!storageId || !furnace || !coilNumber) {
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

    // try {
    //   // 此处应该使用事务，二者要么都成功，要么都失败
    //   // const { n } = await storageModel.deleteOne({ storageId });
    //   // const { m } = await measureModel.updateOne({ furnace, coilNumber: coilNumber }, { $set: { isStored: 3, isMeasureConfirmed: 0 } });

    //   const n = await storageModel.destroy({ where: { storageId } });
    //   const [m] = await measureModel.update(
    //     { isStored: 3, isMeasureConfirmed: 0, isStorageConfirmed: 0 },
    //     { where: { furnace, coilNumber } }
    //   );

    //   if (n != 0 && m != 0) {
    //     res.send({
    //       status: 0,
    //       message: "退库成功",
    //     });
    //   } else {
    //     throw new Error("退库失败");
    //   }
    // } catch (err) {
    //   console.log(err.message, err);
    //   log.error(err.message, err);
    //   res.send({
    //     status: -1,
    //     message: "退库失败",
    //   });
    // }

    // 事务：promise的写法
    // sequelize.transaction((t) => {
    //   // 事务操作
    //   return storageModel.destroy({ where: { storageId } ,{ transaction: t } } ).then(storage => {
    //     return measureModel.update({ isStored: 3, isMeasureConfirmed: 0 }, { where: { furnace, coilNumber }, transaction: t })
    //   });
    // }).then((result) => {

    // }).catch((err) => {

    // });

    // 事务：ES6 语法
    let transaction;
    try {
      transaction = await sequelize.transaction();
      const n = await storageModel.destroy({
        where: { storageId },
        transaction,
      });
      const [m] = await measureModel.update(
        {
          isMeasureConfirmed: 0,
          isStorageConfirmed: 0,
        },
        {
          where: { furnace, coilNumber },
          transaction,
        }
      );
      if (n != 0 && m != 0) {
        await transaction.commit();
        res.send({
          status: 0,
          message: "退库成功",
        });
        return true;
      } else {
        await transaction.rollBack();
        res.send({
          status: -1,
          message: "退库失败",
        });
        return false;
      }
    } catch (err) {
      await transaction.rollBack();
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: "退库失败",
      });
      return false;
    }
  }

  async exportStorage(req, res, next) {
    const {
      castIdJson,
      furnaceJson,
      startTime,
      endTime,
      outStartTime,
      outEndTime,
      ribbonTypeNameJson,
      ribbonWidthJson,
      ribbonThicknessLevelJson,
      laminationLevelJson,
      takebyJson,
      place,
      ribbonTotalLevels,
      isRemain = 1,
    } = req.query;

    try {
      let queryCondition = {};
      if (castIdJson) {
        const castIdList = JSON.parse(castIdJson);
        if (castIdList.length > 0) {
          queryCondition.castId = { $in: castIdList };
        }
      }
      if (furnaceJson) {
        const furnaceList = JSON.parse(furnaceJson);
        if (furnaceList.length > 0) {
          queryCondition.furnace = { $in: furnaceList };
        }
      }
      if (startTime && endTime) {
        queryCondition.inStoreDate = { $gt: startTime, $lt: endTime };
      }
      if (outStartTime && outEndTime) {
        queryCondition.outStoreDate = {
          $gt: outStartTime,
          $lt: outEndTime,
        };
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
          queryCondition.laminationLevel = {
            $in: laminationLevelList,
          };
        }
      }
      if (takebyJson) {
        const takebyList = JSON.parse(takebyJson);
        if (takebyList.length > 0) {
          queryCondition.takeBy = { $in: takebyList };
        }
      }
      if (place) {
        queryCondition.place = place;
      }
      if (isRemain === "0") {
        queryCondition.remainWeight = 0;
      } else if (isRemain === "1") {
        queryCondition.remainWeight = { $gt: 0 };
      }
      if (ribbonTotalLevels) {
        const ribbonTotalLevelList = ribbonTotalLevels.split(",");
        queryCondition.ribbonTotalLevel = { $in: ribbonTotalLevelList };
      }

      const conf = {};
      conf.name = "mysheet";
      conf.cols = [
        { caption: "机组", type: "number" },
        { caption: "炉号", type: "string" },
        { caption: "盘号", type: "number" },
        { caption: "材质", type: "string" },
        { caption: "规格", type: "number" },
        { caption: "综合级别", type: "string" },
        { caption: "厚度级别", type: "number" },
        { caption: "毛重", type: "number" },
        { caption: "净重", type: "number" },
        { caption: "入库情况", type: "string" },
        { caption: "入库日期", type: "string" },
        { caption: "出库日期", type: "string" },
        { caption: "判定去向", type: "string" },
        { caption: "实际去向", type: "string" },
        { caption: "结存", type: "number" },
        { caption: "仓位", type: "string" },
        { caption: "发货备注", type: "string" },
      ];
      conf.rows = [];
      // const list = await storageModel.find(queryCondition).sort({ 'furnace': 'desc', 'coilNumber': 'asc' });
      const list = await storageModel.findAll({
        where: queryCondition,
        order: [
          ["furnace", "desc"],
          ["coilNumber", "desc"],
        ],
      });

      console.log(list);

      conf.rows = list.map((item) => {
        return [
          item.castId,
          item.furnace,
          item.coilNumber,
          item.ribbonTypeName,
          item.ribbonWidth,
          item.ribbonTotalLevel,
          item.ribbonThicknessLevel,
          item.coilWeight,
          item.coilNetWeight,
          isStoredDesc(item.isStored),
          moment(item.inStoreDate).format("YYYY-MM-DD"),
          item.outStoreDate
            ? moment(item.outStoreDate).format("YYYY-MM-DD")
            : "",
          item.clients,
          item.takeBy,
          item.takeBy ? 0 : item.coilNetWeight,
          item.place,
          item.shipRemark,
        ].map((val) => (val == undefined ? null : val));
      });

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
        "attachment; filename=" + "kufang.xlsx"
      );
      res.end(result, "binary");
    } catch (err) {
      console.log("导出库房主表失败", err);
      log.error("导出库房主表失败", err);
      res.send({
        status: -1,
        message: "导出库房主表失败",
      });
    }
  }

  /**
   * 通过excel来批量更新仓位
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async uploadStorage(req, res, next) {
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
              furnace: item[0],
              coilNumber: Number(item[1]),
              place: item[2],
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
          // const { n } = await storageModel.updateOne({ furnace: item.furnace, coilNumber: item.coilNumber }, { place: item.place });
          const [n] = await storageModel.update(
            { place: item.place },
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
          throw new Error("添加仓位失败");
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
        message: "添加仓位成功",
      });
    });
  }
}

module.exports = new Storage();
