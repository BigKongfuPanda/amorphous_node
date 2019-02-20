'use strict';

const express = require('express');
const router= express.Router();
const RibbonWidth = require('../controller/ribbonWidth');

// 获取带材规格
router.get('/', RibbonWidth.queryData);

// 新增带材规格
router.post('/', RibbonWidth.createData);

// 更新带材规格
router.put('/', RibbonWidth.updateData);

// 删除带材规格
router.delete('/', RibbonWidth.delData);

module.exports = router;