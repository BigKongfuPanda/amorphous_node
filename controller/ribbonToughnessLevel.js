"use strict";

const ribbonToughnessLevelModel = require("../models/ribbonToughnessLevel");
const log = require("log4js").getLogger("ribbonToughnessLevel");

class RibbonToughnessLevel {
  constructor() {}

  async queryData(req, res, next) {
    try {
      // const list = await ribbonToughnessLevelModel.find({}).sort({'ribbonToughnessLevel': 'asc'});
      const list = await ribbonToughnessLevelModel.findAll({
        order: [["ribbonToughnessLevel", "asc"]],
      });

      res.send({
        status: 0,
        message: "操作成功",
        data: {
          list,
        },
      });
    } catch (err) {
      console.log("查询带材韧性失败", err);
      log.error("查询带材韧性失败", err);
      res.send({
        status: -1,
        message: "查询带材韧性失败",
      });
    }
  }

  async createData(req, res, next) {
    const {
      ribbonToughness,
      ribbonToughnessLevel,
      ribbonToughnessLevelCode,
    } = req.body;
    try {
      if (!ribbonToughnessLevel || !ribbonToughness) {
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
      // const data = await ribbonToughnessLevelModel.findOne({ $or: [{ ribbonToughness }, { ribbonToughnessLevel }] });
      const data = await ribbonToughnessLevelModel.findOne({
        where: {
          $or: [
            { ribbonToughness },
            { ribbonToughnessLevel },
            { ribbonToughnessLevelCode },
          ],
        },
      });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error("韧性描述或等级或PLC中code码重复");
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
        ribbonToughnessLevel,
        ribbonToughness,
        ribbonToughnessLevelCode,
      };
      await ribbonToughnessLevelModel.create(newData);
      res.send({
        status: 0,
        message: "新增带材韧性成功",
      });
    } catch (err) {
      console.log("新增带材韧性失败", err);
      log.error("新增带材韧性失败", err);
      res.send({
        status: -1,
        message: `新增带材韧性失败, ${err.message}`,
      });
    }
  }

  async updateData(req, res, next) {
    const {
      ribbonToughnessLevelId,
      ribbonToughnessLevel,
      ribbonToughness,
      ribbonToughnessLevelCode,
    } = req.body;
    try {
      if (
        !ribbonToughnessLevelId ||
        !ribbonToughnessLevel ||
        !ribbonToughness ||
        !ribbonToughnessLevelCode
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
    try {
      const newData = {
        ribbonToughnessLevel,
        ribbonToughness,
        ribbonToughnessLevelCode,
      };
      const [n] = await ribbonToughnessLevelModel.update(newData, {
        where: { ribbonToughnessLevelId },
      });
      if (n !== 0) {
        res.send({
          status: 0,
          message: "更新带材韧性成功",
        });
      } else {
        throw new Error("更新带材韧性失败");
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

  // 删除
  async delData(req, res, next) {
    const { ribbonToughnessLevelId } = req.body;
    try {
      if (!ribbonToughnessLevelId) {
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
      const n = await ribbonToughnessLevelModel.destroy({
        where: {
          ribbonToughnessLevelId,
        },
      });
      if (n !== 0) {
        res.send({
          status: 0,
          message: "删除带材韧性成功",
        });
      } else {
        throw new Error("删除带材韧性失败");
      }
    } catch (err) {
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message,
      });
    }
  }
}

module.exports = new RibbonToughnessLevel();
