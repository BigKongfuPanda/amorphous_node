"use strict";

const express = require("express");
const router = express.Router();
const Statistics = require("../controller/statistics");

// 获取带材质量统计表
router.get("/quality", Statistics.queryDataOfQuality);
router.get("/ratio", Statistics.queryDataOfRatio);

// 投入产出统计表
router.get("/inputOuput", Statistics.queryDataOfInputOuput);

module.exports = router;
