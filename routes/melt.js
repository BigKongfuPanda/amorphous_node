"use strict";

const express = require("express");
const router = express.Router();
const Melt = require("../controller/melt");

// 获取化钢记录表
router.get("/", Melt.queryData);

//喷带工序筛选没有喷过的炉号列表
router.get("/queryDataByCast", Melt.queryDataByCast);

// 新增化钢记录表
router.post("/", Melt.createData);

// 更新化钢记录表
router.put("/", Melt.updateData);

// 删除化钢记录表
router.delete("/", Melt.delData);

// 导出化钢记录表
router.get("/export", Melt.export);

module.exports = router;
