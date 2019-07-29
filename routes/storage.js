'use strict';

const express = require('express');
const router= express.Router();
const Storage = require('../controller/storage');

// 获取库房记录表
router.get('/', Storage.queryData);

// 获取库房记录表中所有的炉号
router.get('/furnace', Storage.queryFurnace);

// 更新库房记录表
router.put('/', Storage.updateData);

// 退库
router.delete('/', Storage.delData);

// 导出excel
router.get('/exportstorage', Storage.exportStorage);

// 导入excel，批量添加仓位
router.post('/uploadstorage', Storage.uploadStorage);

module.exports = router;