"use strict";

const express = require("express");
const router = express.Router();
const Storage = require("../controller/storage");

// 获取库房记录表
router.get("/", Storage.queryData);

// 查询申请入库实时记录
router.get("/queryApplyStorage", Storage.queryApplyStorage);

// 获取库房记录表中所有的炉号
router.get("/furnace", Storage.queryFurnace);

// 获取库房记录表中所有的炉号
router.get("/ribbonTotalLevel", Storage.queryRibbonTotalLevelList);

// 确认入库
router.post("/addStorage", Storage.addStorage);

// 扫码后，确认
router.post("/scanConfirm", Storage.scanConfirm);

// 更新库房记录表
router.put("/", Storage.updateData);

// 退库
router.delete("/", Storage.delData);

// 导出excel
router.get("/exportstorage", Storage.exportStorage);

// 导入excel，批量添加仓位
router.post("/uploadstorage", Storage.uploadStorage);

module.exports = router;
