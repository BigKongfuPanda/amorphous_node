"use strict";

const checkLogin = require("../middleware/checkLogin");
const melt = require("./melt");
const cast = require("./cast");
const plan = require("./plan");
const user = require("./user");
const measure = require("./measure");
const storage = require("./storage");
const ribbonType = require("./ribbonType");
const ribbonWidth = require("./ribbonWidth");
const ribbonThicknessLevel = require("./ribbonThicknessLevel");
const ribbonToughnessLevel = require("./ribbonToughnessLevel");
const laminationLevel = require("./laminationLevel");
const statistics = require("./statistics");
const _returnGoods = require("./returnGoods");
const clients = require("./clients");
const appearenceLevel = require("./appearenceLevel");

module.exports = app => {
  // app.use(checkLogin);
  app.use("/user", checkLogin, user);
  app.use("/melt", checkLogin, melt);
  app.use("/cast", checkLogin, cast);
  app.use("/plan", checkLogin, plan);
  app.use("/measure", checkLogin, measure);
  app.use("/storage", checkLogin, storage);
  app.use("/statistics", checkLogin, statistics);
  app.use("/returnGoods", checkLogin, _returnGoods);
  app.use("/clients", checkLogin, clients);
  app.use("/ribbonType", ribbonType);
  app.use("/ribbonWidth", ribbonWidth);
  app.use("/appearenceLevel", appearenceLevel);
  app.use("/laminationLevel", laminationLevel);
  app.use("/ribbonThicknessLevel", ribbonThicknessLevel);
  app.use("/ribbonToughnessLevel", ribbonToughnessLevel);
};
