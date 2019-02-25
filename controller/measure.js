'use strict';

const measureModel = require('../models/measure');
const castModel = require('../models/cast');

class Measure {
  constructor() {

  }

  async queryData(req, res, next) {
    const { castId, furnace, startTime, endTime, caster, ribbonTypeNameJson, ribbonWidthJson, ribbonThicknessLevelJson, laminationLevelJson, place, ribbonTotalLevels, current = 1, limit = 10 } = req.query;
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
      let queryCondition = { castId };
      if(caster) {
        queryCondition.caster = caster;
      }
      if(furnace) {
        queryCondition.furnace = furnace;        
      }
      if(startTime && endTime) {
        queryCondition.inStoreDate = { $gt: startTime, $lt: endTime };
      }
      if (ribbonTypeNameJson) {
        const ribbonTypeNameList = JSON.parse(ribbonTypeNameJson);
        if(ribbonTypeNameList.length > 0) {
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
          queryCondition.ribbonThicknessLevel = { $in: ribbonThicknessLevelList };
        }
      }
      if (laminationLevelJson) {
        const laminationLevelList = JSON.parse(laminationLevelJson);
        if (laminationLevelList.length > 0) {
          queryCondition.laminationLevel = { $in: laminationLevelList };
        }
      }
      if(place) {
        queryCondition.place = place;        
      }
      if (ribbonTotalLevels) {
        const ribbonTotalLevelList = ribbonTotalLevels.split(',');
        queryCondition.ribbonTotalLevel = { $in: ribbonTotalLevelList };
      }
      
      const count = await measureModel.countDocuments(queryCondition);
      const totalPage = Math.ceil(count / limit);
      const list = await measureModel.find(queryCondition).skip((current - 1) * limit).limit(limit).sort({'furnace': 'desc', 'coilNumber': 'asc'});
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

  // 更新操作，由重卷人员使用
  async createData(req, res, next) {
    const { castId, furnace, coilNumber, diameter, coilWeight, ribbonTypeName, ribbonWidth, castDate, caster, roller, rollMachine } = req.body;
    try{
      if (!castId || !furnace || !coilNumber || !diameter || !coilWeight || !roller || !rollMachine) {
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

    // 判断该炉号是否存在
    try {
      const data = await castModel.findOne({furnace});
      if (!data) {
        throw new Error('该炉号不存在')
      }
    } catch (error) {
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
      // 计算单盘净重，不同规格的内衬重量不同
      const linerWeight = {
        30: 0.08,
        50: 0.12
      };
      const coilNetWeight = coilWeight - linerWeight[ribbonWidth];
      const remainWeight = coilNetWeight;

      const newData = {
        castId, furnace,
        ribbonTypeName, ribbonWidth, caster, castDate,
        coilNumber, diameter, coilWeight, coilNetWeight, remainWeight,
        roller, rollMachine
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

  // 更新操作，由检测人员和库房人员使用
  async updateData(req, res, next) {
    const { _id, castId, furnace, coilNumber, diameter, coilWeight, ribbonTypeName, ribbonWidth, roller, rollMachine, castDate, caster, laminationFactor, laminationLevel, realRibbonWidth, ribbonThickness1, ribbonThickness2, ribbonThickness3, ribbonThickness4, ribbonThickness5, ribbonThickness6, ribbonThickness7, ribbonThickness8, ribbonThickness9, ribbonThicknessDeviation, ribbonThickness, ribbonThicknessLevel, ribbonToughness, ribbonToughnessLevel, appearence, appearenceLevel, ribbonTotalLevel, storageRule, isStored, unStoreReason, clients, remainWeight, takeBy, shipRemark, place } = req.body;
    try{
      if (!_id) {
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
      let inStoreDate = null;
      // 当带材检测后入库的时候，设置入库日期，检测人员操作
      if (isStored === '是') {
        inStoreDate = Date.now();
      }

      let outStoreDate = null;
      // 当带材被领用的时候，设置出库日期，库房操作
      if (takeBy) { 
        outStoreDate = Date.now();
      }
      const newData = {
        castId, furnace, coilNumber, diameter, coilWeight,
        ribbonTypeName, ribbonWidth, castDate, caster, roller, rollMachine,
        laminationFactor, laminationLevel,
        realRibbonWidth, ribbonThickness1, ribbonThickness2, ribbonThickness3, ribbonThickness4, ribbonThickness5, ribbonThickness6, ribbonThickness7, ribbonThickness8, ribbonThickness9, ribbonThicknessDeviation, ribbonThickness, ribbonThicknessLevel, ribbonToughness, ribbonToughnessLevel, appearence, appearenceLevel, ribbonTotalLevel, storageRule, isStored, unStoreReason, clients,
        inStoreDate, remainWeight, takeBy, shipRemark, place, outStoreDate
      };
      await measureModel.updateOne({ _id }, { $set: newData });
      res.send({
        status: 0,
        message: '更新数据成功'
      });
    } catch (err) {
      console.log('更新数据失败', err);
      res.send({
        status: -1,
        message: `更新数据失败, ${err.message}`
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