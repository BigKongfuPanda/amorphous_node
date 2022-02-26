"use strict";

const express = require("express");
const router = express.Router();
const Measure = require("../controller/measure");

// 获取重卷记录表
router.get("/queryRollData", Measure.queryRollData);

// 获取检测的炉号
router.get("/queryMeasureFurnaceList", Measure.queryMeasureFurnaceList);

// 获取检测记录表
router.get("/queryMeasureData", Measure.queryMeasureData);

// 新增检测记录表
router.post("/addRoll", Measure.createData);

// 重卷确认数据正确
router.post("/rollConfirm", Measure.rollConfirm);

// 检测确认入库
router.post("/measureConfirm", Measure.measureConfirm);

// 更新重卷记录表
router.put("/updateRoll", Measure.updateRoll);

// 更新检测记录表
router.put("/updateMeasure", Measure.updateMeasure);

// 批量更新检测记录
router.put("/updateMeasureByBatch", Measure.updateMeasureByBatch);

// 删除重卷记录
router.delete("/delRoll", Measure.delData);

// 导出检测excel
router.get("/exportmeasure", Measure.exportMeasure);

// 导出重卷excel
router.get("/exportroll", Measure.exportRoll);

// 获取单条带材信息
router.get("/queryRibbonInfo", Measure.queryRibbonInfo);

// 获取申请入库的带材信息
router.get("/queryApplyStorageByFurnace", Measure.queryApplyStorageByFurnace);

// 获取检测带材合格率数据
router.get("/queryMeasureStatics", Measure.queryMeasureStatics);

// 获取重卷小盘总重
router.get("/queryRollStatics", Measure.queryRollStatics);

// 导入excel，更新检测数据
router.post("/uploadMeasure", Measure.uploadMeasure);

// 导入excel，更新重卷数据
router.post("/uploadRoll", Measure.uploadRoll);

module.exports = router;
