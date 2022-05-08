"use strict";

const meltModel = require("../models/melt");
const castModel = require("../models/cast");
const mearsureModel = require("../models/measure");
const log = require("log4js").getLogger("melt");
const moment = require("moment");
const nodeExcel = require("excel-export");

class Melt {
  constructor() {}

  async queryData(req, res, next) {
    const {
      castId,
      startTime,
      endTime,
      melter,
      ribbonTypeName,
      bucket,
      newAlloyNumber,
      oldAlloyNumber,
      current = 1,
      limit = 20,
    } = req.query;
    try {
      if (!castId) {
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
      let queryCondition = { castId };
      if (melter) {
        queryCondition.melter = melter;
      }
      if (ribbonTypeName) {
        queryCondition.ribbonTypeName = ribbonTypeName;
      }
      if (bucket) {
        queryCondition.bucket = bucket;
      }
      if (newAlloyNumber) {
        queryCondition.newAlloyNumber = newAlloyNumber;
      }
      if (oldAlloyNumber) {
        queryCondition.oldAlloyNumber = oldAlloyNumber;
      }
      if (startTime && endTime) {
        queryCondition.createTime = { $gt: startTime, $lt: endTime };
      }
      // const count = await meltModel.countDocuments(queryCondition);
      // const totalPage = Math.ceil(count / limit);
      // const list = await meltModel.find(queryCondition).skip((current - 1) * limit).limit(limit).sort({'furnace': 'asc'});

      // findAndCountAll 返回值的格式：{ count: 0, rows: [] }
      const pageData = await meltModel.findAndCountAll({
        where: queryCondition,
        offset: (current - 1) * limit,
        limit: limit,
        order: [["createTime", "DESC"], ["furnace"]],
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
          list,
        },
      });
    } catch (err) {
      console.log("查询化钢记录失败", err);
      log.error("查询化钢记录失败", err);
      res.send({
        status: -1,
        message: "查询化钢记录失败",
      });
    }
  }

  // 喷带工序筛选没有喷过的炉号列表
  async queryDataByCast(req, res, next) {
    const { castId, startTime, endTime } = req.query;
    try {
      if (!castId) {
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
      let queryCondition = { castId };
      const timestamp = new Date().getTime() - 8 * 60 * 60 * 1000;

      // 开始时间在当前时间的基础上再减去8小时
      const _startTime = startTime ? startTime : timestamp - 8 * 60 * 60 * 1000;
      const _endTime = endTime ? endTime : timestamp;
      queryCondition.createTime = { $gt: _startTime, $lt: _endTime };

      const meltList = await meltModel.findAll({
        where: queryCondition,
        raw: true,
      });
      const castList = await castModel.findAll({
        where: queryCondition,
        raw: true,
      });
      const castFurnaceList = castList.map((cast) => cast.furnace);
      // 找出没有喷过的炉次
      const list = meltList.filter(
        (melt) => !castFurnaceList.includes(melt.furnace)
      );

      // 要考虑分页
      res.send({
        status: 0,
        message: "操作成功",
        data: {
          list,
        },
      });
    } catch (err) {
      console.log("查询化钢记录失败", err);
      log.error("查询化钢记录失败", err);
      res.send({
        status: -1,
        message: "查询化钢记录失败",
      });
    }
  }

  async createData(req, res, next) {
    const {
      castId,
      furnace,
      ribbonTypeName,
      bucket,
      melter,
      meltFurnace,
      newAlloyNumber = "",
      newAlloyWeight = 0,
      oldAlloyNumber = "",
      oldAlloyWeight = 0,
      mixAlloyNumber = "",
      mixAlloyWeight = 0,
      highNbNumber = "",
      highNbWeight = 0,
      Si = 0,
      Ni = 0,
      Cu = 0,
      BFe = 0,
      NbFe = 0,
      alloyTotalWeight = 0,
      alloyOutWeight = 0,
      alloyFixWeight = 0,
      remark = "",
      adminname,
      addMeltNumber1 = "",
      addMeltNumber2 = "",
      addMeltNumber3 = "",
      addMeltWeight1 = 0,
      addMeltWeight2 = 0,
      addMeltWeight3 = 0,
      startMeltingTime = "",
      endMeltingTime = "",
    } = req.body;
    try {
      if (
        !castId ||
        !furnace ||
        !ribbonTypeName ||
        !bucket ||
        !melter ||
        !meltFurnace ||
        !startMeltingTime ||
        !endMeltingTime
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
      const data = await meltModel.findOne({ where: { furnace } });

      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error("炉号重复");
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

    // 夜班12点后填入的数据不能自动生成第二天的日期，还得是第一天的。早上八点之前生产的数据都算是昨天的，需要把当前时间减去8小时
    const timestamp = new Date().getTime() - 8 * 60 * 60 * 1000;
    const createTime = new Date(timestamp).toISOString();

    try {
      const newData = {
        castId,
        furnace,
        ribbonTypeName,
        bucket,
        melter,
        meltFurnace,
        newAlloyNumber,
        newAlloyWeight,
        oldAlloyNumber,
        oldAlloyWeight,
        mixAlloyNumber,
        mixAlloyWeight,
        highNbNumber,
        highNbWeight,
        Si,
        Ni,
        Cu,
        BFe,
        NbFe,
        alloyTotalWeight,
        alloyOutWeight,
        alloyFixWeight,
        createPerson: adminname,
        remark,
        createTime,
        addMeltNumber1,
        addMeltNumber2,
        addMeltNumber3,
        addMeltWeight1,
        addMeltWeight2,
        addMeltWeight3,
        startMeltingTime,
        endMeltingTime,
      };
      await meltModel.create(newData);
      res.send({
        status: 0,
        message: "新增化钢记录成功",
      });
    } catch (err) {
      console.log("新增化钢记录失败", err);
      log.error("新增化钢记录失败", err);
      res.send({
        status: -1,
        message: `新增化钢记录失败, ${err.message}`,
      });
    }
  }
  async updateData(req, res, next) {
    const {
      castId,
      meltId,
      furnace,
      ribbonTypeName,
      bucket,
      melter,
      meltFurnace,
      newAlloyNumber = "",
      newAlloyWeight = 0,
      oldAlloyNumber = "",
      oldAlloyWeight = 0,
      mixAlloyNumber = "",
      mixAlloyWeight = 0,
      highNbNumber = "",
      highNbWeight = 0,
      Si = 0,
      Ni = 0,
      Cu = 0,
      BFe = 0,
      NbFe = 0,
      alloyTotalWeight = 0,
      alloyOutWeight = 0,
      alloyFixWeight = 0,
      remark = "",
      createdAt,
      roleId,
      adminname,
      addMeltNumber1 = "",
      addMeltNumber2 = "",
      addMeltNumber3 = "",
      addMeltWeight1 = 0,
      addMeltWeight2 = 0,
      addMeltWeight3 = 0,
      startMeltingTime = "",
      endMeltingTime = "",
    } = req.body;
    try {
      if (
        !castId ||
        !meltId ||
        !furnace ||
        !ribbonTypeName ||
        !bucket ||
        !melter ||
        !meltFurnace
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

    // 如果修改时间相比创建时间，已经过了24小时，则除了超级管理员以外不能修改。
    if (roleId != 1 && roleId != 3) {
      try {
        const createTime = new Date(createdAt);
        const period = Date.now() - createTime;
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

    try {
      // 当化钢修改炉号的时候，喷带和重卷，检测表中对应的炉号都改变
      const data = await meltModel.findOne({ where: { meltId } });
      const oldFurnace = data.furnace;
      if (furnace !== oldFurnace) {
        await castModel.update(
          { furnace: furnace },
          {
            where: {
              furnace: oldFurnace,
            },
          }
        );
        await mearsureModel.update(
          { furnace: furnace },
          {
            where: {
              furnace: oldFurnace,
            },
          }
        );
      }
      const newData = {
        castId,
        furnace,
        ribbonTypeName,
        bucket,
        melter,
        meltFurnace,
        newAlloyNumber,
        newAlloyWeight,
        oldAlloyNumber,
        oldAlloyWeight,
        mixAlloyNumber,
        mixAlloyWeight,
        highNbNumber,
        highNbWeight,
        Si,
        Ni,
        Cu,
        BFe,
        NbFe,
        alloyTotalWeight,
        alloyOutWeight,
        alloyFixWeight,
        remark,
        updatePerson: adminname,
        addMeltNumber1,
        addMeltNumber2,
        addMeltNumber3,
        addMeltWeight1,
        addMeltWeight2,
        addMeltWeight3,
        startMeltingTime,
        endMeltingTime,
      };
      // await meltModel.updateOne({ meltId }, { $set: newData });
      const [n] = await meltModel.update(newData, {
        where: { meltId },
      });
      if (n !== 0) {
        res.send({
          status: 0,
          message: "更新化钢记录成功",
        });
      } else {
        throw new Error("更新化钢记录失败");
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
    const { meltId } = req.body;
    try {
      if (!meltId) {
        throw new Error("参数错误");
      }
    } catch (error) {
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: error.message,
      });
      return;
    }

    try {
      const n = await meltModel.destroy({ where: { meltId } });
      if (n != 0) {
        res.send({
          status: 0,
          message: "删除化钢记录成功",
        });
      } else {
        throw new Error("删除化钢记录失败");
      }
    } catch (err) {
      log.error(err.message, err);
      res.send({
        status: -1,
        message: "删除化钢记录失败",
      });
    }
  }

  async export(req, res, next) {
    const {
      castId,
      startTime,
      endTime,
      melter,
      ribbonTypeName,
      bucket,
      newAlloyNumber,
      oldAlloyNumber,
    } = req.query;
    try {
      let queryCondition = {};
      if (castId) {
        queryCondition.castId = castId;
      }
      if (melter) {
        queryCondition.melter = melter;
      }
      if (ribbonTypeName) {
        queryCondition.ribbonTypeName = ribbonTypeName;
      }
      if (bucket) {
        queryCondition.bucket = bucket;
      }
      if (newAlloyNumber) {
        queryCondition.newAlloyNumber = newAlloyNumber;
      }
      if (oldAlloyNumber) {
        queryCondition.oldAlloyNumber = oldAlloyNumber;
      }
      if (startTime && endTime) {
        queryCondition.createTime = { $gt: startTime, $lt: endTime };
      }

      const conf = {};
      conf.name = "mysheet";
      conf.cols = [
        { caption: "冶炼日期", type: "string" },
        { caption: "材质", type: "string" },
        { caption: "炉号", type: "string" },
        { caption: "桶号", type: "string" },
        { caption: "冶炼人", type: "string" },
        { caption: "冶炼炉", type: "string" },
        { caption: "新料炉号", type: "string" },
        { caption: "新料重量(kg)", type: "number" },
        { caption: "加工料炉号", type: "string" },
        { caption: "加工料重量(kg)", type: "number" },
        { caption: "回炉锭炉号", type: "string" },
        { caption: "回炉锭重量(kg)", type: "number" },
        { caption: "高铌料炉号", type: "string" },
        { caption: "高铌料重量(kg)", type: "number" },
        { caption: "硅(g)", type: "number" },
        { caption: "镍(g)", type: "number" },
        { caption: "铜(g)", type: "number" },
        { caption: "硼铁(g)", type: "number" },
        { caption: "铌铁(g)", type: "number" },
        { caption: "总重量(kg)", type: "number" },
        { caption: "放钢重量(kg)", type: "number" },
        { caption: "修正重量(kg)", type: "number" },
        { caption: "更新时间", type: "string" },
        { caption: "更新者", type: "string" },
        { caption: "备注", type: "string" },
        { caption: "加料时间", type: "string" },
        { caption: "浇钢时间", type: "string" },
      ];
      conf.rows = [];
      // const list = await meltModel.find(queryCondition).sort({'furnace': 'asc'});
      const list = await meltModel.findAll({
        where: queryCondition,
        order: [["furnace", "ASC"]],
      });

      conf.rows = list.map((item) => {
        return [
          moment(item.createTime).format("YYYY-MM-DD"),
          item.ribbonTypeName,
          item.furnace,
          item.bucket,
          item.melter,
          item.meltFurnace,
          item.newAlloyNumber,
          item.newAlloyWeight,
          item.oldAlloyNumber,
          item.oldAlloyWeight,
          item.mixAlloyNumber,
          item.mixAlloyWeight,
          item.highNbNumber,
          item.highNbWeight,
          item.Si,
          item.Ni,
          item.Cu,
          item.BFe,
          item.NbFe,
          item.alloyTotalWeight,
          item.alloyOutWeight,
          item.alloyFixWeight,
          moment(item.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
          item.updatePerson,
          item.remark,
          moment(item.startMeltingTime).format("YYYY-MM-DD HH:mm:ss"),
          moment(item.endMeltingTime).format("YYYY-MM-DD HH:mm:ss"),
        ].map((val) => (val == undefined ? null : val));
      });

      const result = nodeExcel.execute(conf);
      res.setHeader("Content-Type", "application/vnd.openxmlformats");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "yelian.xlsx"
      );
      res.end(result, "binary");
    } catch (err) {
      console.log("导出化钢记录失败", err);
      log.error("导出化钢记录失败", err);
      res.send({
        status: -1,
        message: "导出化钢记录失败",
      });
    }
  }
}

module.exports = new Melt();
