'use strict';

const express = require('express');
const router= express.Router();
const RibbonThicknessLevel = require('../controller/ribbonThicknessLevel');

// 获取带材厚度级别列表
router.get('/', RibbonThicknessLevel.queryData);

// 新增带材厚度级别
router.post('/', RibbonThicknessLevel.createData);

// 更新带材厚度级别
router.put('/', RibbonThicknessLevel.updateData);

// 删除带材厚度级别
router.delete('/', RibbonThicknessLevel.delData);

module.exports = router;