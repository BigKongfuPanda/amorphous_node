'use strict';

const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const planSchema = new Schema({
  date: String,//排产日期 2018-12-01
  remark: String,//备注
  fileNumber: String,//文件编号 QEHAT-FJ/D-C03-036-C/0
  taskList: [
    {
      castId: Number, // 机组编号
      team: String,// 班组 早
      taskOrder: String, //任务单号
      ribbonTypeId: Number, // 材质id
      ribbonTypeName: String,//材质名称 1k107B
      client: String, //客户 
      thickness: String, //带材厚度要求  23-24
      laminationFactor: String, // 叠片系数的要求 > 0.80
      furnace: String, //制带炉号 06-20181120-01/01
      alloyWeight: Number, // 单炉投入重量 KG
      castTime: String, //计划喷带时间 8:00-10:00
      rawWeight: Number // 实际产出的大盘毛重 KG
    }
  ]
}, {
	collection: 'Plan',
	timestamps: true,
	autoIndex: false
});

planSchema.index({furnace: 1});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;