'use strict';

const storageModel = require('../models/storage');
const measureModel = require('../models/measure');
const log = require('log4js').getLogger("storage");
const nodeExcel = require('excel-export');
const moment = require('moment');
const storageService = require('../service/storage');
const formidable = require('formidable');
const xlsx = require('node-xlsx');
const path = require('path');
const fs = require('fs');

class Storage {
  constructor() {

  }

  async queryData(req, res, next) {
    const { castId, furnace, startTime, endTime, outStartTime, outEndTime, caster, roller, ribbonTypeNameJson, ribbonWidthJson, ribbonThicknessLevelJson, laminationLevelJson, place, ribbonTotalLevels, isRemain = 1, current = 1, limit = 20 } = req.query;
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
      if(outStartTime && outEndTime) {
        queryCondition.outStoreDate = { $gt: outStartTime, $lt: outEndTime };
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
      if(isRemain == 0) {
        queryCondition.remainWeight = 0;        
      } else {
        queryCondition.remainWeight = {$gt: 0};
      }
      if (ribbonTotalLevels) {
        const ribbonTotalLevelList = ribbonTotalLevels.split(',');
        queryCondition.ribbonTotalLevel = { $in: ribbonTotalLevelList };
      }
      
      const count = await storageModel.countDocuments(queryCondition);
      const totalPage = Math.ceil(count / limit);
      const totalList = await storageModel.find(queryCondition);
      let totalCoilNum = totalList.length;
      let totalWeight = 0;
      totalList.forEach(item => {
        totalWeight += item.remainWeight;
      });
      const list = await storageModel.find(queryCondition).skip((current - 1) * limit).limit(limit).sort({'furnace': 'desc', 'coilNumber': 'asc'});
      // 要考虑分页
      res.send({
        status: 0,
        message: '操作成功',
        data: {
          count,
          current,
          totalPage,
          limit,
          totalCoilNum,
          totalWeight: totalWeight.toFixed(2),
          list
        }
      });
    } catch (err) {
      console.log('查询库房记录失败', err);
      log.error('查询库房记录失败', err);
      res.send({
        status: -1,
        message: '查询库房记录失败'
      });
    }
  }

  async updateData(req, res, next) {
    // 整个托盘出库: 参数: type: all, place: '', takeBy: ''
    if (req.body.type === 'all') {
      return storageService.allOutStore(req, res, next);
    }

    // 批量出库: 参数: type: batch, dataJson: '', takeBy: ''
    if (req.body.type === 'batch') {
      return storageService.batchOutStore(req, res, next);
    }

    let { _id, roleId, adminname, castId, furnace, coilNumber, diameter, coilWeight, coilNetWeight, ribbonTypeName, ribbonWidth, roller, rollMachine, castDate, caster, laminationFactor, laminationLevel, realRibbonWidth, ribbonThickness1, ribbonThickness2, ribbonThickness3, ribbonThickness4, ribbonThickness5, ribbonThickness6, ribbonThickness7, ribbonThickness8, ribbonThickness9, ribbonThicknessDeviation, ribbonThickness, ribbonThicknessLevel, ribbonToughness, ribbonToughnessLevel, appearence, appearenceLevel, ribbonTotalLevel, isMeasureConfirmed, isStored, unStoreReason, clients = [], remainWeight, takeBy, shipRemark, place, createdAt, totalStoredWeight = 0, inPlanStoredWeight = 0, outPlanStoredWeight = 0, qualityOfA = 0, qualityOfB = 0, qualityOfC = 0, qualityOfD = 0, qualityOfE = 0, highFactorThinRibbonWeight = 0, thinRibbonWeight = 0, inPlanThickRibbonWeight = 0, qualityOfGood = 0, qualityOfFine = 0, qualityOfNormal = 0 } = req.body;
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

    try {

      // let inStoreDate = null;
      // // 当带材检测后入库的时候，设置入库日期，检测人员操作
      // if (isStored == 1 || isStored == 2) {
      //   inStoreDate = Date.now();
      // }

      let outStoreDate = null;
      // 当带材被领用的时候，设置出库日期，库房操作
      if (takeBy) {
        outStoreDate = Date.now();
      }
      const newData = {
        castId, furnace, coilNumber, diameter, coilWeight, coilNetWeight,
        ribbonTypeName, ribbonWidth, castDate, caster, roller, rollMachine,
        laminationFactor, laminationLevel,
        realRibbonWidth, ribbonThickness1, ribbonThickness2, ribbonThickness3, ribbonThickness4, ribbonThickness5, ribbonThickness6, ribbonThickness7, ribbonThickness8, ribbonThickness9, ribbonThicknessDeviation, ribbonThickness, ribbonThicknessLevel, ribbonToughness, ribbonToughnessLevel, appearence, appearenceLevel, ribbonTotalLevel, isMeasureConfirmed, isStored, unStoreReason, clients, remainWeight, takeBy, shipRemark, place, outStoreDate, 
        totalStoredWeight, inPlanStoredWeight, outPlanStoredWeight,
        qualityOfA, qualityOfB, qualityOfC, qualityOfD, qualityOfE,
        highFactorThinRibbonWeight, thinRibbonWeight,
        inPlanThickRibbonWeight,
        qualityOfGood, qualityOfFine, qualityOfNormal
      };
      await storageModel.updateOne({ _id }, { $set: newData });
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
    const { _id, furnace, coilNumber } = req.body;
    try {
      if (!_id || !furnace || !coilNumber) {
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
      // 此处应该使用事务，二者要么都成功，要么都失败 
      const { n } = await storageModel.deleteOne({ _id });
      const { m } = await measureModel.updateOne({ furnace, coilNumber: coilNumber }, { $set: { isStored: 3, isMeasureConfirmed: 0 } });
      if (n != 0 && m != 0) {
        res.send({
          status: 0,
          message: '退库成功'
        });
      } else {
        throw new Error('退库失败');
      }
    } catch (err) {
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: '退库失败'
      });
    }
  }

  async exportStorage(req, res, next) {
    const { castId, furnace, startTime, endTime, outStartTime, outEndTime, caster, roller, ribbonTypeNameJson, ribbonWidthJson, ribbonThicknessLevelJson, laminationLevelJson, place, ribbonTotalLevels, isRemain = 1 } = req.query;
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
      if(outStartTime && outEndTime) {
        queryCondition.outStoreDate = { $gt: outStartTime, $lt: outEndTime };
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
      if(isRemain === 0) {
        queryCondition.remainWeight = 0;        
      } else {
        queryCondition.remainWeight = {$gt: 0};
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
        { caption: '综合级别', type: 'string' },
        { caption: '厚度级别', type: 'number' },
        { caption: '毛重', type: 'number' },
        { caption: '净重', type: 'number' },
        { caption: '入库情况', type: 'string' },
        { caption: '入库日期', type: 'date' },
        { caption: '出库日期', type: 'date' },
        { caption: '判定去向', type: 'string' },
        { caption: '实际去向', type: 'string' },
        { caption: '结存', type: 'number' },
        { caption: '仓位', type: 'string' },
        { caption: '发货备注', type: 'string' }
      ];
      conf.rows = [];
      const list = await storageModel.find(queryCondition).sort({'furnace': 'desc', 'coilNumber': 'asc'});
      
      conf.rows = list.map(item => {
        return [ 
          item.furnace, item.coilNumber, item.ribbonTypeName, item.ribbonWidth, 
          item.ribbonTotalLevel, item.ribbonThicknessLevel,
          item.coilWeight, item.coilNetWeight, isStoredDesc(item.isStored),
          moment(item.inStoreDate).format('YYYY-MM-DD'), 
          item.outStoreDate ? moment(item.outStoreDate).format('YYYY-MM-DD') : '', 
          item.clients.join(), item.takeBy,
          item.takeBy ? 0 : item.coilNetWeight,
          item.place, item.shipRemark 
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
      res.setHeader("Content-Disposition", "attachment; filename=" + "kufang.xlsx");
  	  res.end(result, 'binary'); 
    } catch (err) {
      console.log('导出库房主表失败', err);
      log.error('导出库房主表失败', err);
      res.send({
        status: -1,
        message: '导出库房主表失败'
      });
    }
  }

  async uploadStorage(req, res, next) {
    let list = [];
    const form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
		form.uploadDir = path.join(__dirname,'../upload/');
		form.keepExtensions = true;//保留后缀
    form.maxFieldsSize = 2*1024*1024;
    
    form.parse(req, async (error, fields, files) => {
      try {
        if (error) {
          throw new Error('文件上传出错');
        }
        let filePath = files.file.path;
        let data = xlsx.parse(filePath);
        fs.unlinkSync(filePath);
        // 过滤掉标题和空行的数据
        list = data[0].data.filter((item, i) => i > 0 && item.length > 0).map(item => {
          return {
            furnace: item[0],
            coilNumber: Number(item[1]),
            place: item[2],
          };
        });
      } catch (err) {
        log.error(err.message);
        console.log(err.message);
        res.send({
          status: -1,
          message: err.message
        });
      }
      
      let errList = [];
      try {
        for (let i = 0, len = list.length; i < len; i++) {
          const item = list[i];
          const { n } = await storageModel.updateOne({ furnace: item.furnace, coilNumber: item.coilNumber }, { place: item.place });
          if (n == 0) {
            errList.push({
              furnace: item.furnace,
              coilNumber: item.coilNumber
            });
          }
        }
        if (errList.length > 0) {
          throw new Error('添加仓位失败');
        }
      } catch (err) {
        log.error(err.message);
        console.log(err.message);
        res.send({
          status: -1,
          message: err.message,
          data: errList
        });
      }

      res.send({
        status: 0,
        message: '添加仓位成功'
      });
    });
  }
}

module.exports = new Storage();