'use strict';

const express = require('express');
const router= express.Router();
const RibbonType = require('../controller/ribbonType');

// 获取材质
router.get('/', RibbonType.queryData);

// 新增材质
router.post('/', RibbonType.createData);

// 更新材质
router.put('/', RibbonType.updateData);

// 删除材质
router.delete('/', RibbonType.delData);

module.exports = router;