'use strict';

const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const measureSchema = new Schema({
  castId: Number,// 机组编号
  // 重卷录入信息
  furnace: String,// 制带炉号 06-20181120-01/01
  ribbonTypeName: String,//材质名称
  ribbonWidth: Number,//带宽
  castDate: Date, //生产日期
  caster: String, //喷带手
  coilNumber: Number, // 盘号 1, 2, 3
  diameter: Number, // 外径
  coilWeight: Number, // 单盘重量
  laminationFactor: Number, //叠片系数 0.80
  laminationLevel: String, //叠片等级 不合格, 0, 1, 2, 3, 4
  // 检测录入信息
  realRibbonWidth: Number,//实际带宽
  ribbenThickness1: Number, //带材厚度点1, μm
  ribbenThickness2: Number, //带材厚度点2, μm
  ribbenThickness3: Number, //带材厚度点3, μm
  ribbenThickness4: Number, //带材厚度点4, μm
  ribbenThickness5: Number, //带材厚度点5, μm
  ribbenThickness6: Number, //带材厚度点6, μm
  ribbenThickness7: Number, //带材厚度点7, μm
  ribbenThickness8: Number, //带材厚度点8, μm
  ribbenThickness9: Number, //带材厚度点9, μm
  ribbenThicknessDeviation: Number, // 带材横向偏差, μm
  ribbenThickness: Number, // 带材平均厚度, μm
  ribbenThicknessLevel: Number, // 带材厚度级别
  ribbenToughness: String, //带材韧性
  ribbenToughnessLevel: String, //带材韧性等级
  appearence: String, //带材外观
  appearenceLevel: String, //带材外观等级
  ribbenTotalLevel: String, //带材综合级别
  storageRule: String, //入库规则
  isStored: String, // 是否入库 是/否
  clients: String //去向 德国，法国
}, {
	collection: 'Measure',
	timestamps: true,
	autoIndex: false
});

measureSchema.index({furnace: 1});

const Measure = mongoose.model('Measure', measureSchema);

module.exports = Measure;