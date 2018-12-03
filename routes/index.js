'use strict';

const melt = require('./melt');
const cast = require('./cast');
const plan = require('./plan');

module.exports = app => {
  app.use('/melt', melt);
  app.use('/cast', cast);
  app.use('/plan', plan);
};
