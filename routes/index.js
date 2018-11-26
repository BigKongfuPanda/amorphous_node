'use strict';

const melt = require('./melt');

module.exports = app => {
  app.use('/melt', melt);
}


