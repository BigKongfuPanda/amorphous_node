'use strict';

const returnGoodsModel = require('../models/returnGoods');
const castModel = require('../models/cast');
const planModel = require('../models/plan');
const log = require('log4js').getLogger("measure");
const nodeExcel = require('excel-export');
const moment = require('moment');
const returnGoodsService = require('../service/returnGoods');

class ReturnGoods {
  constructor() {

  }

  async queryData(req, res, next) {
    const { castId, furnace, ribbonTypeNameJson, ribbonWidthJson, ribbonThicknessLevelJson, laminationLevelJson, ribbonToughnessLevelJson,  appearenceLevelJson, current = 1, limit = 20 } = req.query;
    try {
      let queryCondition = {};
      if(castId) {
        queryCondition.castId = castId;
      }
      if(furnace) {
        queryCondition.furnace = furnace;        
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
      
      // const count = await returnGoodsModel.countDocuments(queryCondition);
      // const totalPage = Math.ceil(count / limit);
      // const list = await returnGoodsModel.find(queryCondition).skip((current - 1) * limit).limit(limit).sort({'furnace': 'desc', 'coilNumber': 'asc'});

      const pageData = await returnGoodsModel.findAndCountAll({
        where: queryCondition,
        offset: (current - 1) * limit,
        limit: limit,
        order: [
          ['furnace', 'ASC'],
          ['coilNumber', 'ASC']
        ]
      });
      const list = pageData.rows;
      const count = pageData.count;
      const totalPage = Math.ceil(count / limit);
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
      console.log('查询退库记录失败', err);
      log.error('查询退库记录失败', err);
      res.send({
        status: -1,
        message: '查询退库记录失败'
      });
    }
  }

  // 更新操作，由检测人员和库房人员使用
  async updateData(req, res, next) {
    // 检测确认入库操作，传参为dataJson
    if (req.body.dataJson) {
      return returnGoodsService.measureConfirm(req, res, next);
    }

    let { furnace, coilNumber, diameter, coilWeight, coilNetWeight,
      ribbonTypeName, ribbonWidth, castDate, caster,
      laminationFactor, laminationLevel,
      realRibbonWidth, ribbonThickness1, ribbonThickness2, ribbonThickness3, 
      ribbonThickness4, ribbonThickness5, ribbonThickness6, ribbonThickness7, ribbonThickness8, ribbonThickness9, ribbonThicknessDeviation, ribbonThickness, ribbonThicknessLevel, ribbonToughness, ribbonToughnessLevel, appearence, appearenceLevel, ribbonTotalLevel, isMeasureConfirmed, isStored, unStoreReason, clients = '', remainWeight } = req.body;

    try {
      const newData = {
        furnace, coilNumber, diameter, coilWeight, coilNetWeight,
        ribbonTypeName, ribbonWidth, castDate, caster,
        laminationFactor, laminationLevel,
        realRibbonWidth, ribbonThickness1, ribbonThickness2, ribbonThickness3, ribbonThickness4, ribbonThickness5, ribbonThickness6, ribbonThickness7, ribbonThickness8, ribbonThickness9, ribbonThicknessDeviation, ribbonThickness, ribbonThicknessLevel, ribbonToughness, ribbonToughnessLevel, appearence, appearenceLevel, ribbonTotalLevel, isMeasureConfirmed, isStored, unStoreReason, clients, remainWeight, takeBy: '', shipRemark: '', place: ''
      };
      const { m } = await returnGoodsModel.deleteOne({ furnace, coilNumber });
      const { n } = await returnGoodsModel.create(newData);
      if (n != 0) {
        res.send({
          status: 0,
          message: '保存数据成功'
        });
      } else {
        throw new Error('保存数据失败');
      }
    } catch (err) {
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: '保存数据失败'
      });
    }
  }

  async export(req, res, next) {
    const { castId, furnace, ribbonTypeNameJson, ribbonWidthJson, ribbonThicknessLevelJson, laminationLevelJson, ribbonToughnessLevelJson, appearenceLevelJson } = req.query;
    try {
      let queryCondition = {};
      if(castId) {
        queryCondition.castId = castId;
      }
      if(furnace) {
        queryCondition.furnace = furnace;        
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

      const conf = {};
      conf.name = "mysheet";
      conf.cols = [
        { caption: '炉号', type: 'string' },
        { caption: '盘号', type: 'number' },
        { caption: '材质', type: 'string' },
        { caption: '规格', type: 'number' },
        { caption: '生产日期', type: 'string' },
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
      const list = await returnGoodsModel.find(queryCondition).sort({'furnace': 'desc', 'coilNumber': 'asc'});
      
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
          case 4:
            return '退货入库';
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
      console.log('导出退货记录失败', err);
      log.error('导出退货记录失败', err);
      res.send({
        status: -1,
        message: '导出退货记录失败'
      });
    }
  }
}

module.exports = new ReturnGoods();