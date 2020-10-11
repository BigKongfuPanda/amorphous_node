"use strict";

const express = require("express");
const router = express.Router();
const LinerWeight = require("../controller/linerWeight");

router.get("/", LinerWeight.queryData);

router.post("/", LinerWeight.createData);

router.put("/", LinerWeight.updateData);

router.delete("/", LinerWeight.delData);

module.exports = router;
