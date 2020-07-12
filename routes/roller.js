"use strict";

const express = require("express");
const router = express.Router();
const Roller = require("../controller/roller");

// 获取重卷人员列表
router.get("/", Roller.queryData);

// 新增重卷人员
router.post("/", Roller.createData);

// 更新重卷人员
router.put("/", Roller.updateData);

// 删除重卷人员
router.delete("/", Roller.delData);

module.exports = router;
