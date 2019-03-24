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
      // 当带材检测后入库的时候，设置入库日期，检测人员操作
        item.inStoreDate = Date.now();
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
}

module.exports = new MeasureService();