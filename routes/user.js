'use strict';

const express = require('express');
const router= express.Router();
const User = require('../controller/user');

// 新增用户
router.post('/', User.createUser);

// 修改密码
router.put('/', User.updatePassword);

// 登录
router.post('/login', User.login);

// 退出登录
router.post('/signout', User.signout);

module.exports = router;