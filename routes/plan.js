'use strict';

const express = require('express');
const router= express.Router();
const Plan = require('../controller/plan');

// 获取生产计划
router.get('/', Plan.queryData);

// 新增生产计划
router.post('/', Plan.createData);

// 更新生产计划
router.put('/', Plan.updateData);

module.exports = router;