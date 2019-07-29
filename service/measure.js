const measureModel = require('../models/measure');
const storageModel = require('../models/storage');
const log = require('log4js').getLogger("measure");
const { cloneDeep } = require('lodash');

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
        item.isMeasureConfirmed = 1; // 1-检测确认入库，0-没有入库
        // await measureModel.updateOne({ measureId: item.measureId }, { $set: { inStoreDate: item.inStoreDate, measureDate: item.measureDate, isMeasureConfirmed: 1 } });
        await measureModel.update({ inStoreDate: item.inStoreDate, measureDate: item.measureDate, isMeasureConfirmed: 1 }, { where: { measureId: item.measureId }});
        // 将入库数据
        let clone = cloneDeep(item);
        delete clone.measureId;
        delete clone.createdAt;
        delete clone.updatedAt;
        // await storageModel.create(clone);
        await storageModel.create(clone);
      });
      res.send({
        status: 0,
        message: '入库成功'
      });
    } catch (err) {
      log.error(err.message, err);
      res.send({
        status: -1,
        message: '入库失败'
      });
    }
  }
}

module.exports = new MeasureService();