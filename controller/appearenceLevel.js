"use strict";

const appearenceLevelModel = require("../models/appearenceLevel");
const log = require("log4js").getLogger("appearenceLevel");

class AppearenceLevel {
  constructor() {}

  async queryData(req, res, next) {
    try {
      const list = await appearenceLevelModel.findAll();

      res.send({
        status: 0,
        message: "操作成功",
        data: {
          list,
        },
      });
    } catch (err) {
      console.log("查询带材外观级别列表失败", err);
      log.error("查询带材外观级别列表失败", err);
      res.send({
        status: -1,
        message: "查询带材外观级别列表失败",
      });
    }
  }

  async createData(req, res, next) {
    const { appearenceLevel, appearence } = req.body;
    try {
      if (!appearence || !appearenceLevel) {
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
      // const data = await appearenceLevelModel.findOne({$or: [{ appearenceLevel }, { laminationFactorRange }]});
      const data = await appearenceLevelModel.findOne({
        where: {
          appearence,
        },
      });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error("带材外观描述重复");
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
        appearenceLevel,
        appearence,
      };
      await appearenceLevelModel.create(newData);
      res.send({
        status: 0,
        message: "新增带材外观级别成功",
      });
    } catch (err) {
      console.log("新增带材外观级别失败", err);
      log.error("新增带材外观级别失败", err);
      res.send({
        status: -1,
        message: `新增带材外观级别失败, ${err.message}`,
      });
    }
  }

  async updateData(req, res, next) {
    const { appearenceLevelId, appearenceLevel, appearence } = req.body;
    try {
      if (!appearenceLevelId || !appearenceLevel || !appearence) {
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
        appearenceLevel,
        appearence,
      };
      // const { n } = await appearenceLevelModel.updateOne({ _id: appearenceLevelId }, { $set: newData });
      const [n] = await appearenceLevelModel.update(newData, {
        where: { appearenceLevelId },
      });
      if (n !== 0) {
        res.send({
          status: 0,
          message: "更新带材外观级别成功",
        });
      } else {
        throw new Error("更新带材外观级别失败");
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
    const { appearenceLevelId } = req.body;
    try {
      if (!appearenceLevelId) {
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
      // const { n } = await appearenceLevelModel.deleteOne({ _id: appearenceLevelId } );
      const n = await appearenceLevelModel.destroy({
        where: { appearenceLevelId },
      });
      if (n !== 0) {
        res.send({
          status: 0,
          message: "删除带材外观级别成功",
        });
      } else {
        throw new Error("删除带材外观级别失败");
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

module.exports = new AppearenceLevel();
