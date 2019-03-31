'use strict';

const measureModel = require('../models/measure');
const castModel = require('../models/cast');
const planModel = require('../models/plan');
const log = require('log4js').getLogger("measure");
const nodeExcel = require('excel-export');
const moment = require('moment');
const measureService = require('../service/measure');

class Measure {
  constructor() {

  }

  async queryData(req, res, next) {
    const { castId, furnace, startTime, endTime, caster, roller, ribbonTypeNameJson, ribbonWidthJson, ribbonThicknessLevelJson, laminationLevelJson, ribbonToughnessLevelJson,  appearenceLevelJson, place, ribbonTotalLevels, current = 1, limit = 20 } = req.query;
    try {
      let queryCondition = {};
      if(castId) {
        queryCondition.castId = castId;
      }
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
      if (ribbonToughnessLevelJson) {
        const ribbonToughnessLevelList = JSON.parse(ribbonToughnessLevelJson);
        if (ribbonToughnessLevelList.length > 0) {
          queryCondition.ribbonToughnessLevel = { $in: ribbonToughnessLevelList };
        }
      }
      if (appearenceLevelJson) {
        const appearenceLevelList = JSON.parse(appearenceLevelJson);
        if (appearenceLevelList.length > 0) {
          queryCondition.appearenceLevel = { $in: appearenceLevelList };
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
      log.error('查询检测记录失败', err);
      res.send({
        status: -1,
        message: '查询检测记录失败'
      });
    }
  }

  // 更新操作，由重卷人员使用
  async createData(req, res, next) {
    let { castId, furnace, coilNumber, diameter, coilWeight, ribbonTypeName, ribbonWidth, castDate, caster, roller, rollMachine, isFlat } = req.body;
    try{
      if (!castId || !furnace || !coilNumber || !diameter || !coilWeight || !roller || !rollMachine || !isFlat) {
        throw new Error('参数错误')
      }
    }catch(err){
      console.log(err.message, err);
      log.error(err.message, err);
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
      log.error(err.message, err);
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
      log.error(err.message, err);
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
        roller, rollMachine, isFlat,
        orderThickness, orderLaminationFactor, orderRibbonToughnessLevels, orderAppearenceLevels, qualifiedThickness, qualifiedLaminationFactor, qualifiedRibbonToughnessLevels, qualifiedAppearenceLevels
      };
      await measureModel.create(newData);
      res.send({
        status: 0,
        message: '新增重卷记录成功'
      });
    } catch (err) {
      console.log('新增重卷记录失败', err);
      log.error('新增重卷记录失败', err);
      res.send({
        status: -1,
        message: `新增重卷记录失败, ${err.message}`
      });
    }
  }

  // 更新操作，由检测人员和库房人员使用
  async updateData(req, res, next) {
    // 检测确认入库操作，传参为dataJson
    if (req.body.dataJson) {
      return measureService.measureConfirm(req, res, next);
    }

    let { _id, roleId, adminname, castId, furnace, coilNumber, diameter, coilWeight, coilNetWeight, ribbonTypeName, ribbonWidth, roller, rollMachine, isFlat, castDate, caster, laminationFactor, laminationLevel, realRibbonWidth, ribbonThickness1, ribbonThickness2, ribbonThickness3, ribbonThickness4, ribbonThickness5, ribbonThickness6, ribbonThickness7, ribbonThickness8, ribbonThickness9, ribbonThicknessDeviation, ribbonThickness, ribbonThicknessLevel, ribbonToughness, ribbonToughnessLevel, appearence, appearenceLevel, ribbonTotalLevel, isMeasureConfirmed, isStored, unStoreReason, clients = [], remainWeight, takeBy, shipRemark, place, createdAt, totalStoredWeight = 0, inPlanStoredWeight = 0, outPlanStoredWeight = 0, qualityOfA = 0, qualityOfB = 0, qualityOfC = 0, qualityOfD = 0, qualityOfE = 0, highFactorThinRibbonWeight = 0, thinRibbonWeight = 0, inPlanThickRibbonWeight = 0, qualityOfGood = 0, qualityOfFine = 0, qualityOfNormal = 0 } = req.body;
    try{
      if (!_id) {
        throw new Error('参数错误')
      }
    }catch(err){
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
      });
      return;
    }

    // 如果修改时间相比创建时间，已经过了24小时，则除了超级管理员，检测，库房以外不能修改。
    if (roleId == 4) { // roleId: 4 重卷人员
      try {
        const createTime = new Date(createdAt);
        const period = Date.now() - createTime;
        if (period > 24*60*60*1000) {
          throw new Error('已过24小时，您无操作权限，请联系车间主任或厂长！');
        }
      } catch (err) {
        console.log(err.message, err);
        res.send({
          status: -1,
          message: err.message
        });
        return;
      }
    }

    try {
      // 没有入库的情况下，才能重新计算净重和结存，由重卷人员来操作
      if (isStored !== 1 || isStored !== 2) {
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
        coilNetWeight = (coilWeight - linerWeight).toFixed(2);
        remainWeight = coilNetWeight;
      }

      const newData = {
        castId, furnace, coilNumber, diameter, coilWeight, coilNetWeight,
        ribbonTypeName, ribbonWidth, castDate, caster, roller, rollMachine, isFlat,
        laminationFactor, laminationLevel,
        realRibbonWidth, ribbonThickness1, ribbonThickness2, ribbonThickness3, ribbonThickness4, ribbonThickness5, ribbonThickness6, ribbonThickness7, ribbonThickness8, ribbonThickness9, ribbonThicknessDeviation, ribbonThickness, ribbonThicknessLevel, ribbonToughness, ribbonToughnessLevel, appearence, appearenceLevel, ribbonTotalLevel, isMeasureConfirmed, isStored, unStoreReason, clients, remainWeight, takeBy, shipRemark, place, 
        totalStoredWeight, inPlanStoredWeight, outPlanStoredWeight,
        qualityOfA, qualityOfB, qualityOfC, qualityOfD, qualityOfE,
        highFactorThinRibbonWeight, thinRibbonWeight,
        inPlanThickRibbonWeight,
        qualityOfGood, qualityOfFine, qualityOfNormal
      };
      await measureModel.updateOne({ _id }, { $set: newData });
      res.send({
        status: 0,
        message: '更新数据成功'
      });
    } catch (err) {
      console.log('更新数据失败', err);
      log.error('更新数据失败', err);
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
    } catch (err) {
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
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
    } catch (err) {
      log.error(err.message, err);
      res.send({
        status: -1,
        message: '删除检测记录失败'
      });
    }
  }

  async exportMeasure(req, res, next) {
    const { castId, furnace, startTime, endTime, caster, roller, ribbonTypeNameJson, ribbonWidthJson, ribbonThicknessLevelJson, laminationLevelJson, ribbonToughnessLevelJson, appearenceLevelJson, place, ribbonTotalLevels} = req.query;
    try {
      let queryCondition = {};
      if(castId) {
        queryCondition.castId = castId;
      }
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
      if (ribbonToughnessLevelJson) {
        const ribbonToughnessLevelList = JSON.parse(ribbonToughnessLevelJson);
        if (ribbonToughnessLevelList.length > 0) {
          queryCondition.ribbonToughnessLevel = { $in: ribbonToughnessLevelList };
        }
      }
      if (appearenceLevelJson) {
        const appearenceLevelList = JSON.parse(appearenceLevelJson);
        if (appearenceLevelList.length > 0) {
          queryCondition.appearenceLevel = { $in: appearenceLevelList };
        }
      }
      if(place) {
        queryCondition.place = place;        
      }
      if (ribbonTotalLevels) {
        const ribbonTotalLevelList = ribbonTotalLevels.split(',');
        queryCondition.ribbonTotalLevel = { $in: ribbonTotalLevelList };
      }

      const conf = {};
      conf.name = "mysheet";
      conf.cols = [
        { caption: '炉号', type: 'string' },
        { caption: '盘号', type: 'number' },
        { caption: '材质', type: 'string' },
        { caption: '规格', type: 'number' },
        { caption: '生产日期', type: 'date' },
        { caption: '喷带手', type: 'string' },
        { caption: '外径', type: 'number' },
        { caption: '重量', type: 'number' },
        { caption: '叠片系数', type: 'number' },
        { caption: '叠片等级', type: 'string' },
        { caption: '实际带宽', type: 'number' },
        { caption: '厚度偏差', type: 'number' },
        { caption: '平均厚度', type: 'number' },
        { caption: '厚度级别', type: 'number' },
        { caption: '韧性', type: 'string' },
        { caption: '韧性等级', type: 'string' },
        { caption: '外观', type: 'string' },
        { caption: '外观等级', type: 'string' },
        { caption: '综合级别', type: 'string' },
        { caption: '是否入库', type: 'string' },
        { caption: '不入库原因', type: 'string' },
        { caption: '判定去向', type: 'string' },
      ];
      conf.rows = [];
      const list = await measureModel.find(queryCondition).sort({'furnace': 'desc', 'coilNumber': 'asc'});
      
      conf.rows = list.map(item => {
        return [ 
          item.furnace, item.coilNumber, item.ribbonTypeName, item.ribbonWidth, 
          moment(item.castDate).format('YYYY-MM-DD'), item.caster, item.diameter,
          item.coilWeight, item.laminationFactor, item.laminationLevel, item.realRibbonWidth,
          item.ribbonThicknessDeviation, item.ribbonThickness, item.ribbonThicknessLevel,
          item.ribbonToughness, item.ribbonToughnessLevel, item.appearence, item.appearenceLevel, item.ribbonTotalLevel, isStoredDesc(item.isStored),
          item.unStoreReason, item.clients.join()
        ].map(val => val == undefined ? null : val);
      });

      function isStoredDesc (status) {
        switch (status) {
          case 1:
            return '计划内入库';
            break;
          case 2:
            return '计划外入库';
            break;
          case 3:
            return '不合格';
            break;
          default:
            return '';
            break;
        }
      }
      
      const result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader("Content-Disposition", "attachment; filename=" + "jiance.xlsx");
  	  res.end(result, 'binary'); 
    } catch (err) {
      console.log('导出检测记录失败', err);
      log.error('导出检测记录失败', err);
      res.send({
        status: -1,
        message: '导出检测记录失败'
      });
    }
  }
}

module.exports = new Measure();