'use strict';

const express = require('express');
const router= express.Router();
const Measure = require('../controller/measure');

// 获取检测记录表
router.get('/', Measure.queryData);

// 新增检测记录表
router.post('/', Measure.createData);

// 更新检测记录表
router.put('/', Measure.updateData);

// 删除检测记录
router.delete('/', Measure.delData);

module.exports = router;