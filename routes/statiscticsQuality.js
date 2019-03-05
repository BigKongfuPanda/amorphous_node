'use strict';

const express = require('express');
const router= express.Router();
const StatisticsQuality = require('../controller/statisticsQuality');

// 获取带材质量统计表
router.get('/', StatisticsQuality.queryData);

module.exports = router;