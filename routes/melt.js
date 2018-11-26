'use strict';

const express = require('express');
const router= express.Router();
const Melt = require('../controller/melt');

// 获取化钢记录表
router.get('/', Melt);

// 新增化钢记录表
router.post('/', Melt);