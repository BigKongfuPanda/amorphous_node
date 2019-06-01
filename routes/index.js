'use strict';

const checkLogin = require('../middleware/checkLogin');
// const melt = require('./melt');
// const cast = require('./cast');
const plan = require('./plan');
const user = require('./user');
// const measure = require('./measure');
// const storage = require('./storage');
const ribbonType = require('./ribbonType');
const ribbonWidth = require('./ribbonWidth');
const ribbonThicknessLevel = require('./ribbonThicknessLevel');
const ribbonToughnessLevel = require('./ribbonToughnessLevel');
const laminationLevel = require('./laminationLevel');
// const statistics = require('./statistics');
// const _returnGoods = require('./returnGoods');

module.exports = app => {
  app.use(checkLogin);
  app.use('/user', user);
  // app.use('/melt', melt);
  // app.use('/cast', cast);
  app.use('/plan', plan);
  // app.use('/measure', measure);
  // app.use('/storage', storage);
  app.use('/ribbonType', ribbonType);
  app.use('/ribbonWidth', ribbonWidth);
  app.use('/ribbonThicknessLevel', ribbonThicknessLevel);
  app.use('/ribbonToughnessLevel', ribbonToughnessLevel);
  app.use('/laminationLevel', laminationLevel);
  // app.use('/statistics', statistics);
  // app.use('/returnGoods', _returnGoods);
};
