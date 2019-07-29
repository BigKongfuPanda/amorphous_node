const storageModel = require('../models/storage');
const log = require('log4js').getLogger("storage");

class StorageService {
  constructor() {

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
      // const { n } = await storageModel.updateMany({ 
      //   place: place,
      //   remainWeight: { $gt: 0 }
      // }, {
      //   $set: {
      //     outStoreDate: new Date(),
      //     takeBy,
      //     remainWeight: 0
      //   }
      // });

      const [n] = await storageModel.update({
        outStoreDate: new Date(),
        takeBy,
        remainWeight: 0
      }, {
          where: {
            place: place,
            remainWeight: { $gt: 0 }
          }
        });

      if (n != 0) {
        res.send({
          status: 0,
          message: '出库成功'
        });
      } else {
        throw new Error('出库失败')
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
    const { ids, takeBy } = req.body;
    try {
      if (!ids || !takeBy) {
        throw new Error('参数错误')
      }
    } catch(err) {
      console.log(err.message, err);
      log.error(err.message, err);
      res.send({
        status: -1,
        message: err.message
      });
      return;
    }

    try {
      // data.forEach(async (item) => {
      // // 批量出库
      //   item.outStoreDate = Date.now();
      //   await storageModel.updateOne({ storageId: item.storageId }, { $set: item });
      // });

      await storageModel.update({
        outStoreDate: Date.now(),
        remainWeight: 0,
        takeBy
      }, {
        where: {
          storageId: {
            $in: ids.split(',')
          }
        }
      });

      res.send({
        status: 0,
        message: '出库成功'
      });
    } catch (err) {
      log.error(err.message, err);
      res.send({
        status: -1,
        message: `出库失败：${err.message}`
      });
    }
  }
}

module.exports = new StorageService();