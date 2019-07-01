'use strict';

const express = require('express');
const router= express.Router();
const AppearenceLevel = require('../controller/appearenceLevel');

// 获取外观列表
router.get('/', AppearenceLevel.queryData);

// 新增外观
router.post('/', AppearenceLevel.createData);

// 更新外观
router.put('/', AppearenceLevel.updateData);

// 删除外观
router.delete('/', AppearenceLevel.delData);

module.exports = router;