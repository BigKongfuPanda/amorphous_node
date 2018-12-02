'use strict';

const express = require('express');
const router= express.Router();
const Cast = require('../controller/cast');

// 获取喷带记录表
router.get('/', Cast.queryData);

// 新增喷带记录表
router.post('/', Cast.createData);

// 更新喷带记录表
router.put('/', Cast.updateData);

module.exports = router;