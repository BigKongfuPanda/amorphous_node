const castModel = require("../models/cast");
const measureModel = require("../models/measure");
const storageModel = require("../models/storage");
const log = require("log4js").getLogger("measure");
const { cloneDeep } = require("lodash");
const sequelize = require("../mysql/db");

class MeasureService {
  constructor() {}
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
        // await measureModel.updateOne({ measureId: item.measureId }, { $set: { inStoreDate: item.inStoreDate, measureDate: item.measureDate, isMeasureConfirmed: 1 } });
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
        // await storageModel.create(clone);
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
}

module.exports = new MeasureService();
