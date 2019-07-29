const returnGoodsModel = require('../models/returnGoods');
const storageModel = require('../models/storage');
const log = require('log4js').getLogger("returnGoods");
const { cloneDeep } = require('lodash');

class returnGoodsService {
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
        const {m} = await returnGoodsModel.updateOne({ furnace: item.furnace, coilNumber: item.coilNumber }, { $set: { inStoreDate: item.inStoreDate, measureDate: item.measureDate, isMeasureConfirmed: 1 } });
        console.log(m);
        // 将入库数据
        let clone = cloneDeep(item);
        delete clone._id;
        delete clone.createdAt;
        delete clone.updatedAt;
        delete clone._v;
        clone.place = '';
        clone.takeBy = '';
        clone.shipRemark = '';
        clone.outStoreDate = null;
        clone.takeBy = '';
        // await storageModel.create(clone);
        const {n} = await storageModel.updateOne({ furnace: clone.furnace, coilNumber: clone.coilNumber }, { $set: clone });
        console.log(n);
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

module.exports = new returnGoodsService();