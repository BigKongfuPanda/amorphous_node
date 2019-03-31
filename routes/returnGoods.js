'use strict';

const express = require('express');
const router= express.Router();
const ReturnGoods = require('../controller/returnGoods');

// 获取退货处理记录表
router.get('/', ReturnGoods.queryData);

// 新增退货处理记录
// router.post('/', ReturnGoods.createData);

// 更新退货处理记录表
router.put('/', ReturnGoods.updateData);

// 删除退货处理记录
// router.delete('/', ReturnGoods.delData);

// 导出excel
router.get('/export', ReturnGoods.export);

module.exports = router;