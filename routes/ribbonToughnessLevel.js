'use strict';

const express = require('express');
const router= express.Router();
const RibbonToughnessLevel = require('../controller/ribbonToughnessLevel');

// 获取带材韧性级别列表
router.get('/', RibbonToughnessLevel.queryData);

// 新增带材韧性级别
router.post('/', RibbonToughnessLevel.createData);

// 更新带材韧性级别
router.put('/', RibbonToughnessLevel.updateData);

// 删除带材韧性级别
router.delete('/', RibbonToughnessLevel.delData);

module.exports = router;