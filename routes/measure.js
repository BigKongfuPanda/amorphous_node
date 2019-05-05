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

// 导出检测excel
router.get('/exportmeasure', Measure.exportMeasure);

// 导出重卷excel
router.get('/exportroll', Measure.exportRoll);

module.exports = router;