'use strict';

const express = require('express');
const router= express.Router();
const Melt = require('../controller/melt');

// 获取化钢记录表
router.get('/', Melt.queryData);

// 新增化钢记录表
router.post('/', Melt.createData);

// 更新化钢记录表
router.put('/', Melt.updateData);

// 删除化钢记录表
router.delete('/', Melt.delData);

module.exports = router;