'use strict';

const measureModel = require('../models/measure');
const castModel = require('../models/cast');

class Measure {
  constructor() {

  }

  async queryData(req, res, next) {
    const { castId, startTime, endTime, caster, current = 1, limit = 10 } = req.query;
    try{
      if (!castId) {
        throw new Error('参数错误')
      }
    }catch(err){
      console.log(err.message, err);
      res.send({
        status: -1,
        message: err.message
      });
      return;
    }
    try {
      let queryCondition = {castId};
      if (caster) {
        queryCondition.caster = caster;
      }
      if (startTime && endTime) {
        queryCondition.createdAt = { $gt: startTime, $lt: endTime };
      }
      const count = await measureModel.countDocuments(queryCondition);
      const totalPage = Math.ceil(count / limit);
      const list = await measureModel.find(queryCondition).skip((current - 1) * limit).limit(limit).sort({'furnace': 'desc', 'coilNumber': 'desc'});
      // 要考虑分页
      res.send({
        status: 0,
        message: '操作成功',
        data: {
          count,
          current,
          totalPage,
          limit,
          list
        }
      });
    } catch (err) {
      console.log('查询检测记录失败', err);
      res.send({
        status: -1,
        message: '查询检测记录失败'
      });
    }
  }
  async createData(req, res, next) {
    const { castId, furnace, coilNumber, diameter, coilWeight, laminationFactor, laminationLevel } = req.body;
    try{
      if (!castId && !furnace && !coilNumber && !diameter && !coilWeight) {
        throw new Error('参数错误')
      }
    }catch(err){
      console.log(err.message, err);
      res.send({
        status: -1,
        message: err.message
      });
      return;
    }

    try {
      const data = await measureModel.findOne({ furnace, coilNumber });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error('炉号和盘号重复');
      }
    } catch (err) {
      console.log(err.message, err);
      res.send({
        status: -1,
        message: err.message
      });
      return;
    }

    try {
      // 根据炉号获取其他信息。但是如果furnace相同的话，可以只执行第一次查询，后面都使用缓存结果，此处需优化
      const { ribbonTypeName, ribbonWidth, createdAt, caster } = castModel.findOne({ furnace });
      const newData = {
        castId, furnace, ribbonTypeName, ribbonWidth, caster,
        castDate: createdAt,
        coilNumber, diameter, coilWeight,
        laminationFactor, laminationLevel
      };
      await measureModel.create(newData);
      res.send({
        status: 0,
        message: '新增重卷记录成功'
      });
    } catch (err) {
      console.log('新增重卷记录失败', err);
      res.send({
        status: -1,
        message: `新增重卷记录失败, ${err.message}`
      });
    }
  }
  async updateData(req, res, next) {
    const { _id, realRibbonWidth, ribbenThickness1, ribbenThickness2, ribbenThickness3, ribbenThickness4, ribbenThickness5, ribbenThickness6, ribbenThickness7, ribbenThickness8, ribbenThickness9, ribbenThicknessDeviation, ribbenThickness, ribbenThicknessLevel, ribbenToughness, ribbenToughnessLevel, appearence, appearenceLevel, ribbenTotalLevel, storageRule, isStored, clients } = req.body;
    try{
      if (!_id && !realRibbonWidth && !ribbenThickness1 && !ribbenThickness2 && !ribbenThickness3 && !ribbenThickness4 && !ribbenThickness5 && !ribbenThickness6 && !ribbenThickness7 && !ribbenThickness8 && !ribbenThickness9 && !ribbenThicknessDeviation && !ribbenThickness && !ribbenThicknessLevel && !ribbenToughness && !ribbenToughnessLevel && !appearence && !appearenceLevel && !ribbenTotalLevel && !storageRule && !isStored && !clients) {
        throw new Error('参数错误')
      }
    }catch(err){
      console.log(err.message, err);
      res.send({
        status: -1,
        message: err.message
      });
      return;
    }
    try {
      const newData = {
        realRibbonWidth, ribbenThickness1, ribbenThickness2, ribbenThickness3, ribbenThickness4, ribbenThickness5, ribbenThickness6, ribbenThickness7, ribbenThickness8, ribbenThickness9, ribbenThicknessDeviation, ribbenThickness, ribbenThicknessLevel, ribbenToughness, ribbenToughnessLevel, appearence, appearenceLevel, ribbenTotalLevel, storageRule, isStored, clients
      };
      await measureModel.updateOne({ _id }, { $set: newData });
      res.send({
        status: 0,
        message: '更新检测记录成功'
      });
    } catch (err) {
      console.log('更新检测记录失败', err);
      res.send({
        status: -1,
        message: `更新检测记录失败, ${err.message}`
      });
    }
  }

  async delData(req, res, next) {
    const { _id } = req.body;
    try {
      if (!_id) {
        throw new Error('参数错误');
      }
    } catch (error) {
      console.log(err.message, err);
      res.send({
        status: -1,
        message: error.message
      });
      return;
    }

    try {
      const { n } = await measureModel.deleteOne({ _id });
      if (n != 0) {
        res.send({
          status: 0,
          message: '删除检测记录成功'
        });
      } else {
        throw new Error('删除检测记录失败');
      }
    } catch (error) {
      res.send({
        status: -1,
        message: '删除检测记录失败'
      });
    }
  }
}

module.exports = new Measure();