'use strict';

const express = require('express');
const router= express.Router();
const LaminationLevel = require('../controller/laminationLevel');

// 获取带材叠片级别列表
router.get('/', LaminationLevel.queryData);

// 新增带材叠片级别
router.post('/', LaminationLevel.createData);

// 更新带材叠片级别
router.put('/', LaminationLevel.updateData);

// 删除带材叠片级别
router.delete('/', LaminationLevel.delData);

module.exports = router;