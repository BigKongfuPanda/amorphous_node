'use strict';

const measureModel = require('../models/measure');
const castModel = require('../models/cast');
const planModel = require('../models/plan');

class Measure {
  constructor() {

  }

  async queryData(req, res, next) {
    const { castId, furnace, startTime, endTime, caster, roller, ribbonTypeNameJson, ribbonWidthJson, ribbonThicknessLevelJson, laminationLevelJson, place, ribbonTotalLevels, current = 1, limit = 10 } = req.query;
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
      if (roller) {
        queryCondition.roller = roller;
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
    let { castId, furnace, coilNumber, diameter, coilWeight, ribbonTypeName, ribbonWidth, castDate, caster, roller, rollMachine } = req.body;
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

    // 判断该炉号是否在喷带记录中存在
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
      /** 
       * 计算单盘净重，不同规格的内衬重量不同
       * 内衬的规格和重量对应表
       * 20.5: 0.05,
        25.5: 0.06,
        30: 0.08,
        40: 0.12,
        50: 0.12
       */
      let linerWeight = 0;
      if (ribbonWidth < 25) {
        linerWeight = 0.05;
      } else if (ribbonWidth >= 25 && ribbonWidth < 30) {
        linerWeight = 0.06;
      } else if (ribbonWidth >= 30 && ribbonWidth < 40) {
        linerWeight = 0.08;
      } else if (ribbonWidth >= 40 && ribbonWidth < 50) {
        linerWeight = 0.12;
      } else if (ribbonWidth >= 50 && ribbonWidth < 58) {
        linerWeight = 0.12;
      } else if (ribbonWidth >= 58) { // 58mm 以上的使用两个 30 的内衬拼接起来
        linerWeight = 0.08 * 2;
      } 

      const coilNetWeight = coilWeight - linerWeight;
      const remainWeight = coilNetWeight;

      // 查询生产计划集合中，当前炉次的订单要求和入库要求
      const planFurnace = furnace.substr(0, 14);
      const { orderThickness, orderLaminationFactor, orderRibbonToughnessLevels, orderAppearenceLevels, qualifiedThickness, qualifiedLaminationFactor, qualifiedRibbonToughnessLevels, qualifiedAppearenceLevels } = await planModel.findOne({ furnace: planFurnace });

      const newData = {
        castId, furnace,
        ribbonTypeName, ribbonWidth, caster, castDate,
        coilNumber, diameter, coilWeight, coilNetWeight, remainWeight,
        roller, rollMachine,
        orderThickness, orderLaminationFactor, orderRibbonToughnessLevels, orderAppearenceLevels, qualifiedThickness, qualifiedLaminationFactor, qualifiedRibbonToughnessLevels, qualifiedAppearenceLevels
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
    let { _id, roleId, adminname, castId, furnace, coilNumber, diameter, coilWeight, coilNetWeight, ribbonTypeName, ribbonWidth, roller, rollMachine, castDate, caster, laminationFactor, laminationLevel, realRibbonWidth, ribbonThickness1, ribbonThickness2, ribbonThickness3, ribbonThickness4, ribbonThickness5, ribbonThickness6, ribbonThickness7, ribbonThickness8, ribbonThickness9, ribbonThicknessDeviation, ribbonThickness, ribbonThicknessLevel, ribbonToughness, ribbonToughnessLevel, appearence, appearenceLevel, ribbonTotalLevel, isStored, unStoreReason, clients, remainWeight, takeBy, shipRemark, place, createdAt } = req.body;
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

    // 如果修改时间相比创建时间，已经过了24小时，则除了超级管理员，检测，库房以外不能修改。
    if (roleId == 4) {
      try {
        const createTime = new Date(createdAt);
        const period = Date.now() - createTime;
        if (period > 24*60*60*1000) {
          throw new Error('已过24小时，您无操作权限，请联系车间主任或厂长！');
        }
      } catch (error) {
        console.log(error.message, error);
        res.send({
          status: -1,
          message: error.message
        });
        return;
      }
    }

    try {
      // 没有入库的情况下，才能重新机选净重和结存
      if (isStored !== '是') {
        /** 
         * 计算单盘净重，不同规格的内衬重量不同
         * 内衬的规格和重量对应表
         * 20.5: 0.05,
          25.5: 0.06,
          30: 0.08,
          40: 0.12,
          50: 0.12
        */
        let linerWeight = 0;
        if (ribbonWidth < 25) {
          linerWeight = 0.05;
        } else if (ribbonWidth >= 25 && ribbonWidth < 30) {
          linerWeight = 0.06;
        } else if (ribbonWidth >= 30 && ribbonWidth < 40) {
          linerWeight = 0.08;
        } else if (ribbonWidth >= 40 && ribbonWidth < 50) {
          linerWeight = 0.12;
        } else if (ribbonWidth >= 50 && ribbonWidth < 58) {
          linerWeight = 0.12;
        } else if (ribbonWidth >= 58) { // 58mm 以上的使用两个 30 的内衬拼接起来
          linerWeight = 0.08 * 2;
        } 
        coilNetWeight = coilWeight - linerWeight;
        remainWeight = coilNetWeight;
      }

      let inStoreDate = null;
      // 当带材检测后入库的时候，设置入库日期，检测人员操作
      if (isStored === 1 || isStored === 2) {
        inStoreDate = Date.now();
      }

      let outStoreDate = null;
      // 当带材被领用的时候，设置出库日期，库房操作
      if (takeBy) { 
        outStoreDate = Date.now();
      }
      const newData = {
        castId, furnace, coilNumber, diameter, coilWeight, coilNetWeight,
        ribbonTypeName, ribbonWidth, castDate, caster, roller, rollMachine,
        laminationFactor, laminationLevel,
        realRibbonWidth, ribbonThickness1, ribbonThickness2, ribbonThickness3, ribbonThickness4, ribbonThickness5, ribbonThickness6, ribbonThickness7, ribbonThickness8, ribbonThickness9, ribbonThicknessDeviation, ribbonThickness, ribbonThicknessLevel, ribbonToughness, ribbonToughnessLevel, appearence, appearenceLevel, ribbonTotalLevel, isStored, unStoreReason, clients,
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