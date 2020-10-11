"use strict";

const linerWeightModel = require("../models/linerWeight");
const log = require("log4js").getLogger("roller");

class LinerWeight {
  constructor() {}

  async queryData(req, res, next) {
    try {
      const list = await linerWeightModel.findAll();

      res.send({
        status: 0,
        message: "操作成功",
        data: {
          list,
        },
      });
    } catch (err) {
      console.log("查询内衬重量列表失败", err);
      log.error("查询内衬重量列表失败", err);
      res.send({
        status: -1,
        message: "查询内衬重量列表失败",
      });
    }
  }

  async createData(req, res, next) {
    const { ribbonWidth, linerWeight } = req.body;
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log(req.body);
    try {
      if (!ribbonWidth || !linerWeight) {
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
      const data = await linerWeightModel.findOne({
        where: {
          ribbonWidth,
        },
      });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error("带材宽度重复");
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
        ribbonWidth,
        linerWeight,
      };
      await linerWeightModel.create(newData);
      res.send({
        status: 0,
        message: "新增内衬重量成功",
      });
    } catch (err) {
      console.log("新增内衬重量失败", err);
      log.error("新增内衬重量失败", err);
      res.send({
        status: -1,
        message: `新增内衬重量失败, ${err.message}`,
      });
    }
  }

  async updateData(req, res, next) {
    const { id, ribbonWidth, linerWeight } = req.body;
    try {
      if (!id || !ribbonWidth || !linerWeight) {
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
        ribbonWidth,
        linerWeight,
      };
      const [n] = await linerWeightModel.update(newData, {
        where: { id },
      });
      if (n !== 0) {
        res.send({
          status: 0,
          message: "更新内衬重量列表成功",
        });
      } else {
        throw new Error("更新内衬重量列表失败");
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
    const { id } = req.body;
    try {
      if (!id) {
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
      const n = await linerWeightModel.destroy({
        where: { id },
      });
      if (n !== 0) {
        res.send({
          status: 0,
          message: "删除内衬重量成功",
        });
      } else {
        throw new Error("删除内衬重量失败");
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

module.exports = new LinerWeight();
