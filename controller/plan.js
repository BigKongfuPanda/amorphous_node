'use strict';

const planModel = require('../models/plan');
const log = require('log4js').getLogger("plan");
const nodeExcel = require('excel-export');

class Plan {
  constructor() {

  }

  async queryData(req, res, next) {
    const { castId, date } = req.query;
    try{
      if (!castId) {
        throw new Error('机组编号错误')
      }
      if (!date) {
        throw new Error('排产日期错误')
      }
    }catch(err){
      console.log(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }
    try {
      const list = await planModel.find({date, castId}).sort({'furnace': 'asc'});
      res.send({
        status: 0,
        message: '操作成功',
        data: {
          list
        }
      });
    } catch (err) {
      console.log('查询生产计划失败', err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: '查询生产计划失败'
      });
    }
  }

  async createData(req, res, next) {
    const { formDataJson } = req.body;
    let formData = [];
    let furnaceList = [];
    try{
      if (!formDataJson) {
        throw new Error('参数错误')
      }
      formData = JSON.parse(formDataJson);
      furnaceList = [];
      formData.forEach(item => {
        furnaceList.push(item.furnace);
        delete item.theBeginfurnace;
        delete item.heatNum;
      });
    }catch(err){
      console.log(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }

    try {
      furnaceList.forEach(async (furnace) => {
        const data = await planModel.findOne({ furnace });
        // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
        if (data) {
          throw new Error(`炉号 ${furnace} 重复`);
        }
      });
    } catch (err) {
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }

    try {
      await planModel.insertMany(formData);
      res.send({
        status: 0,
        message: '新增生产记录成功'
      });
    } catch (err) {
      console.log('新增生产记录失败', err);
      log.error('新增生产记录失败', err);
      res.send({
        status: -1,
        message: `新增生产记录失败, ${err.message}`
      });
    }
  }
  
  async updateData(req, res, next) {
    const { _id, roleId, date, castId, remark = '', fileNumber = '', team, taskOrder = '', ribbonTypeName, ribbonWidth, client = '', furnace, alloyWeight = 0, castTime = '', orderThickness = '', orderLaminationFactor = '', orderRibbonToughnessLevelsJson = '[]', orderAppearenceLevelsJson = '[]', qualifiedThickness = '', qualifiedLaminationFactor = '', qualifiedRibbonToughnessLevelsJson = '[]', qualifiedAppearenceLevelsJson = '[]' } = req.body;

    // const orderRibbonToughnessLevels = JSON.parse(orderRibbonToughnessLevelsJson);
    // const orderAppearenceLevels = JSON.parse(orderAppearenceLevelsJson);
    // const qualifiedRibbonToughnessLevels = JSON.parse(qualifiedRibbonToughnessLevelsJson);
    // const qualifiedAppearenceLevels = JSON.parse(qualifiedAppearenceLevelsJson);

    try{
      if (!date || !castId || !roleId) {
        throw new Error('参数错误')
      }
    }catch(err){
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }
    try {
      if (Number(roleId) === 1) { // 角色：厂长，操作：审批，将 isApproved 设置为 1  
        const { m } = await planModel.updateMany({ date, castId }, { $set: {approved: 1} });
  
        if (m !== 0) {
          res.send({
            status: 0,
            message: '审批生产计划成功'
          });
        } else {
          throw new Error('审批生产计划失败')
        }
      } else if (Number(roleId) === 2) { // 角色：生产计划，操作：更新数据
        const newData = {
          _id, date, remark, fileNumber,
          castId, team, taskOrder,
          ribbonTypeName, ribbonWidth, client, furnace, alloyWeight, castTime,
          orderThickness, orderLaminationFactor, 
          orderRibbonToughnessLevels: orderRibbonToughnessLevelsJson, 
          orderAppearenceLevels: orderAppearenceLevelsJson, 
          qualifiedThickness, qualifiedLaminationFactor, 
          qualifiedRibbonToughnessLevels: qualifiedRibbonToughnessLevelsJson, 
          qualifiedAppearenceLevels: qualifiedAppearenceLevelsJson
        };
        
        const { n } = await planModel.updateOne({ _id }, { $set: newData });
        // 一旦更改生产计划，则需要重新审批，状态变为“待审批”
        const { l } = await planModel.updateMany({ date, castId }, { $set: {approved: 0} });
  
        if (n !== 0 && l !== 0) {
          res.send({
            status: 0,
            message: '更新生产计划成功'
          });
        } else {
          throw new Error('更新生产计划失败')
        }
      } else {
        throw new Error('当前用户更新生产计划的权限')
      }
    } catch (err) {
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
      });
    }
  }

  // 删除
  async delData(req, res, next) {
    const { _id } = req.body;
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
      })
      return;
    }
    try {
      const { n } = await planModel.deleteOne({ _id } );
      if (n !== 0) {
        res.send({
          status: 0,
          message: '删除生产计划成功'
        });
      } else {
        throw new Error('删除生产计划失败');
      }
    } catch (err) {
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
      });
    }
  }

  async export(req, res, next) {
    const { castId, startTime, endTime } = req.query;
    try{
      if (!castId || !startTime || !endTime) {
        throw new Error('参数错误')
      }
    }catch(err){
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }

    try {
      let queryCondition = {};
      if(castId) {
        queryCondition.castId = castId;
      }
      if(startTime && endTime) {
        queryCondition.date = { $gt: startTime, $lt: endTime };
      }

      const conf = {};
      conf.name = "mysheet";
      conf.cols = [
        { caption: '日期', type: 'string' },
        { caption: '机组', type: 'number' },
        { caption: '班组', type: 'string' },
        { caption: '材质', type: 'string' },
        { caption: '规格', type: 'number' },
        { caption: '制带炉号', type: 'string' },
        { caption: '带厚(订单要求)', type: 'string' },
        { caption: '叠片(订单要求)', type: 'string' },
        { caption: '韧性(订单要求)', type: 'string' },
        { caption: '外观(订单要求)', type: 'string' },
        { caption: '带厚(入库要求)', type: 'string' },
        { caption: '叠片(入库要求)', type: 'string' },
        { caption: '韧性(入库要求)', type: 'string' },
        { caption: '外观(入库要求)', type: 'string' },
        { caption: '任务单号', type: 'string' },
        { caption: '客户', type: 'string' },
        { caption: '单炉投入', type: 'number' },
        { caption: '制带时间', type: 'string' },
        { caption: '大盘毛重', type: 'number' }
      ];
      conf.rows = [];
      const list = await planModel.find(queryCondition).sort({'furnace': 'asc'});
      
      conf.rows = list.map(item => {
        return [
          item.date, item.castId, item.team, item.ribbonTypeName, item.ribbonWidth, item.furnace, item.orderThickness, item.orderLaminationFactor, item.orderRibbonToughnessLevels.join(), item.orderAppearenceLevels.join(), 
          item.qualifiedThickness, item.qualifiedLaminationFactor, item.qualifiedRibbonToughnessLevels.join(), item.qualifiedAppearenceLevels.join(), 
          item.taskOrder, item.client, item.alloyWeight, item.castTime, item.rawWeight
        ].map(val => val == undefined ? null : val);
      });
      
      const result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader("Content-Disposition", "attachment; filename=" + "shengchanjihua.xlsx");
  	  res.end(result, 'binary'); 
    } catch (err) {
      console.log('导出生产计划失败', err);
      log.error('导出生产计划失败', err);
      res.send({
        status: -1,
        message: '导出生产计划失败'
      });
    }
  }
}

module.exports = new Plan();