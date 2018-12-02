'use strict';

const melt = require('./melt');
const cast = require('./cast');

module.exports = app => {
  app.use('/melt', melt);
  app.use('/cast', cast);
};
