"use strict";

const express = require("express");
const router = express.Router();
const Measure = require("../controller/measure");

// 获取重卷记录表
router.get("/queryRollData", Measure.queryRollData);

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

// 删除检测记录
router.delete("/delRoll", Measure.delData);

// 导出检测excel
router.get("/exportmeasure", Measure.exportMeasure);

// 导出重卷excel
router.get("/exportroll", Measure.exportRoll);

module.exports = router;
