'use strict';

const express = require('express');
const router= express.Router();
const Clients = require('../controller/clients');

// 获取客户列表
router.get('/', Clients.queryData);

// 新增客户
router.post('/', Clients.createData);

// 更新客户
router.put('/', Clients.updateData);

// 删除客户
router.delete('/', Clients.delData);

module.exports = router;