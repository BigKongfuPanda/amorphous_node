'use strict';

const express = require('express');
const router= express.Router();
const Storage = require('../controller/storage');

// 获取库存记录表
router.get('/', Storage.queryData);

// 新增库存记录表
router.post('/', Storage.createData);

// 更新库存记录表
router.put('/', Storage.updateData);

// 删除库存记录
router.delete('/', Storage.delData);

module.exports = router;