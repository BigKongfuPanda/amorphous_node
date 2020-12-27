"use strict";

const express = require("express");
const router = express.Router();
const Storage = require("../controller/storage");

// 获取库房记录表
router.get("/", Storage.queryData);

// 查询申请入库实时记录
router.get("/queryApplyStorage", Storage.queryApplyStorage);

// 驳回入库申请
router.post("/rejectApplyStorage", Storage.rejectApplyStorage);

// 获取库房记录表中所有的炉号
router.get("/furnace", Storage.queryFurnace);

// 获取库房记录表中所有的炉号
router.get("/ribbonTotalLevel", Storage.queryRibbonTotalLevelList);

// 批量确认入库
router.post("/batchAddStorage", Storage.batchAddStorage);

// 确认入库
router.post("/addStorage", Storage.addStorage);

// 扫码后，确认
router.post("/scanConfirm", Storage.scanConfirm);

// 删除扫码确认的数据
router.post("/delScanConfirm", Storage.delScanConfirm);

// 获取扫码确认的数据
router.get("/queryScanList", Storage.queryScanList);

// 批量更新仓位--扫码方式
router.post("/batchUpdateRibbonWithPlace", Storage.batchUpdateRibbonWithPlace);

// 批量出库--扫码方式
router.post("/batchOutStoreByScan", Storage.batchOutStoreByScan);

// 更新库房记录表
router.put("/", Storage.updateData);

// 退库
router.delete("/", Storage.delData);

// 导出excel
router.get("/exportstorage", Storage.exportStorage);

// 导入excel，批量添加仓位
router.post("/uploadstorage", Storage.uploadStorage);

module.exports = router;
