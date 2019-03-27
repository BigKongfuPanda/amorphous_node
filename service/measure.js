const measureModel = require('../models/measure');
const log = require('log4js').getLogger("measure");

class MeasureService {
  constructor() {

  }
  // 检测确认入库
  async measureConfirm(req, res, next) {
    const { dataJson } = req.body;
    let data = [];
    try{
      if (!dataJson) {
        throw new Error('参数错误')
      }
      data = JSON.parse(dataJson);
    }catch(err){
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
      });
      return;
    }

    try {
      data.forEach(async (item) => {
      // 当带材检测后入库的时候，设置入库日期和检测日期，检测人员操作
        item.inStoreDate = Date.now();
        item.measureDate = Date.now();
        await measureModel.updateOne({ _id: item._id }, { $set: item });
      });
      res.send({
        status: 0,
        message: '更新数据成功'
      });
    } catch (err) {
      log.error(err.message, err);
      res.send({
        status: -1,
        message: '更新数据成功失败'
      });
    }
  }

  // 整托盘出库
  async allOutStore(req, res, next) {
    const { place, takeBy } = req.body;
    try{
      if (!place || !takeBy) {
        throw new Error('参数错误')
      }
    }catch(err){
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
      });
      return;
    }

    try {
      const { n } = await measureModel.updateMany({ 
        place: place, 
        isStored: { $in: [1, 2] },
        isMeasureConfirmed: 1,
        remainWeight: { $gt: 0 }
      }, {
        $set: {
          outStoreDate: new Date(),
          takeBy,
          remainWeight: 0
        }
      });

      if (n != 0) {
        res.send({
          status: 0,
          message: '更新数据成功'
        });
      } else {
        throw new Error('更新数据失败')
      }
    } catch (err) {
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
      });
    }
  }

  // 批量出库
  async batchOutStore(req, res, next) {
    const { dataJson } = req.body;
    let data = [];
    try{
      if (!dataJson) {
        throw new Error('参数错误')
      }
      data = JSON.parse(dataJson);
    }catch(err){
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
      });
      return;
    }

    try {
      data.forEach(async (item) => {
      // 批量出库
        item.outStoreDate = Date.now();
        await measureModel.updateOne({ _id: item._id }, { $set: item });
      });

      res.send({
        status: 0,
        message: '更新数据成功'
      });
    } catch (err) {
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
      });
    }
  }
}

module.exports = new MeasureService();