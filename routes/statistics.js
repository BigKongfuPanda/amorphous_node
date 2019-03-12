'use strict';

const express = require('express');
const router= express.Router();
const Statistics = require('../controller/statistics');

// 获取带材质量统计表
router.get('/quality', Statistics.queryDataOfQuality);
router.get('/ratio', Statistics.queryDataOfRatio);

module.exports = router;