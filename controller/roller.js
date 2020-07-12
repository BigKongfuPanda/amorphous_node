"use strict";

const rollerModel = require("../models/roller");
const log = require("log4js").getLogger("roller");
const { valueToString } = require("../util");

class Roller {
  constructor() {}

  async queryData(req, res, next) {
    try {
      const list = await rollerModel.findAll();

      res.send({
        status: 0,
        message: "操作成功",
        data: {
          list,
        },
      });
    } catch (err) {
      console.log("查询重卷人员列表失败", err);
      log.error("查询重卷人员列表失败", err);
      res.send({
        status: -1,
        message: "查询重卷人员列表失败",
      });
    }
  }

  async createData(req, res, next) {
    const { roller, rollerName } = req.body;
    try {
      if (!rollerName || !valueToString(roller)) {
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
      const data = await rollerModel.findOne({
        where: {
          $or: [{ rollerName }, { roller }],
        },
      });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error("重卷人员名称或编号重复");
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
        rollerName,
        roller,
      };
      await rollerModel.create(newData);
      res.send({
        status: 0,
        message: "新增重卷人员成功",
      });
    } catch (err) {
      console.log("新增重卷人员失败", err);
      log.error("新增重卷人员失败", err);
      res.send({
        status: -1,
        message: `新增重卷人员失败, ${err.message}`,
      });
    }
  }

  async updateData(req, res, next) {
    const { rollerId, rollerName, roller } = req.body;
    try {
      if (!rollerId || !rollerName || !valueToString(roller)) {
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
        rollerName,
        roller,
      };
      const [n] = await rollerModel.update(newData, {
        where: { rollerId },
      });
      if (n !== 0) {
        res.send({
          status: 0,
          message: "更新重卷人员列表成功",
        });
      } else {
        throw new Error("更新重卷人员列表失败");
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
    const { rollerId } = req.body;
    try {
      if (!rollerId) {
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
      const n = await rollerModel.destroy({
        where: { rollerId },
      });
      if (n !== 0) {
        res.send({
          status: 0,
          message: "删除重卷人员成功",
        });
      } else {
        throw new Error("删除重卷人员失败");
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

module.exports = new Roller();
