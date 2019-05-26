'use strict';

const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const planSchema = new Schema({
  date: String,//排产日期 2018-12-01
  approved: {type: Number, default: 0}, // 是否审批，1-是，0-否
  remark: String,//备注
  fileNumber: String,//文件编号 QEHAT-FJ/D-C03-036-C/0
  castId: Number, // 机组编号
  team: String,// 班组 早
  taskOrder: String, //任务单号
  ribbonTypeId: Schema.Types.ObjectId, // 材质id
  ribbonTypeName: String,//材质名称 1k107B
  ribbonWidth: Number, // 带宽
  client: String, //客户 
  furnace: String, //制带炉号 06-20181120-01/01
  alloyWeight: Number, // 单炉投入重量 KG
  castTime: String, //计划喷带时间 8:00-10:00
  rawWeight: Number, // 实际产出的大盘毛重 KG，与 喷带记录表关联
  orderThickness: String, // 订单要求：厚度 20-23, ≤23
  orderLaminationFactor: String, // 订单要求：叠片系数 ≥0.78
  orderRibbonToughnessLevels: Array, // 订单要求：韧性 [A,B,C]
  orderAppearenceLevels: Array, // 订单要求：外观 [A,B,C]
  qualifiedThickness: String, // 入库要求：厚度 20-23, ≤23
  qualifiedLaminationFactor: String, // 入库要求：叠片系数 ≥0.78
  qualifiedRibbonToughnessLevels: Array, // 入库要求：韧性 [A,B,C]
  qualifiedAppearenceLevels: Array, // 入库要求：外观 [A,B,C]
  realRibbonWidth: Number // 实际带宽
}, {
  // 默认添加时间戳属性 (updatedAt, createdAt)
  timestamps: true,
  // 设置为true则将自动设置所有属性的字段选项为下划线命名方式。
  underscored: false,
  // 禁用修改表名; 默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数。 如果你不想这样，请设置以下内容
  freezeTableName: true,
});

planSchema.index({date: 1});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;