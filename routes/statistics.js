"use strict";

const express = require("express");
const router = express.Router();
const Statistics = require("../controller/statistics");

// 获取带材质量统计表
router.get("/quality", Statistics.queryDataOfQuality);
router.get("/ratio", Statistics.queryDataOfRatio);

// 投入产出统计表
router.get("/inputOuput", Statistics.queryDataOfInputOuput);
// 重卷产量-人员
router.get("/rollWeightByRoller", Statistics.queryDataOfRollWeightByRoller);
// 重卷产量-机组
router.get("/rollWeightByCastId", Statistics.queryDataOfRollWeightByCastId);
// 母合金总重
router.get("/alloyWeight", Statistics.queryDataOfAlloyWeight);

module.exports = router;
