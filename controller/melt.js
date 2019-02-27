'use strict';

const meltModel = require('../models/melt');

class Melt {
  constructor() {

  }

  async queryData(req, res, next) {
    const { castId, startTime, endTime, melter, ribbonTypeName, bucket,  current = 1, limit = 10 } = req.query;
    try{
      if (!castId) {
        throw new Error('参数错误')
      }
    }catch(err){
      console.log(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }
    try {
      let queryCondition = {castId};
      if (melter) {
        queryCondition.melter = melter;
      }
      if (ribbonTypeName) {
        queryCondition.ribbonTypeName = ribbonTypeName;
      }
      if (bucket) {
        queryCondition.bucket = bucket;
      }
      if (startTime && endTime) {
        queryCondition.createdAt = { $gt: startTime, $lt: endTime };
      }
      const count = await meltModel.countDocuments(queryCondition);
      const totalPage = Math.ceil(count / limit);
      const list = await meltModel.find(queryCondition).skip((current - 1) * limit).limit(limit).sort({'furnace': 'desc'});
      // 要考虑分页
      res.send({
        status: 0,
        message: '操作成功',
        data: {
          count,
          current,
          totalPage,
          limit,
          list
        }
      });
    } catch (err) {
      console.log('查询化钢记录失败', err);
      res.send({
        status: -1,
        message: '查询化钢记录失败'
      });
    }
  }
  async createData(req, res, next) {
    const { castId, furnace, ribbonTypeName, bucket, melter, meltFurnace, newAlloyNumber = '', newAlloyWeight = 0, oldAlloyNumber = '', oldAlloyWeight = 0, mixAlloyNumber = '', mixAlloyWeight = 0, hignNbNumber = '', hignNbWeight = 0, Si = 0, Ni = 0, Cu = 0, BFe = 0, NbFe = 0, alloyTotalWeight = 0, alloyOutWeight = 0, alloyFixWeight = 0, remark = '', adminname } = req.body;
    try{
      if (!castId || !furnace || !ribbonTypeName || !bucket || !melter || !meltFurnace) {
        throw new Error('参数错误')
      }
    }catch(err){
      console.log(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }

    try {
      const data = await meltModel.findOne({ furnace });
      // 如果没有查到则返回值为 null， 如果查询到则返回值为一个对象
      if (data) {
        throw new Error('炉号重复');
      }
    } catch (err) {
      console.log(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }

    try {
      const newData = {
        castId, furnace,
        ribbonTypeName, bucket, melter, meltFurnace,
        newAlloyNumber, newAlloyWeight,
        oldAlloyNumber, oldAlloyWeight,
        mixAlloyNumber, mixAlloyWeight,
        hignNbNumber, hignNbWeight,
        Si, Ni, Cu, BFe, NbFe, 
        alloyTotalWeight, alloyOutWeight, alloyFixWeight,
        createPerson: adminname,
        remark
      };
      await meltModel.create(newData);
      res.send({
        status: 0,
        message: '新增化钢记录成功'
      });
    } catch (err) {
      console.log('新增化钢记录失败', err);
      res.send({
        status: -1,
        message: `新增化钢记录失败, ${err.message}`
      });
    }
  }
  async updateData(req, res, next) {
    const { castId, _id, furnace, ribbonTypeName, bucket, melter, meltFurnace, newAlloyNumber = '', newAlloyWeight = 0, oldAlloyNumber = '', oldAlloyWeight = 0, mixAlloyNumber = '', mixAlloyWeight = 0, hignNbNumber = '', hignNbWeight = 0, Si = 0, Ni = 0, Cu = 0, BFe = 0, NbFe = 0, alloyTotalWeight = 0, alloyOutWeight = 0, alloyFixWeight = 0, remark = '', createdAt, roleId, adminname } = req.body;
    try{
      if (!castId || !_id || !furnace || !ribbonTypeName || !bucket || !melter || !meltFurnace) {
        throw new Error('参数错误')
      }
    }catch(err){
      console.log(err.message, err);
      res.send({
        status: -1,
        message: err.message
      })
      return;
    }

    // 如果修改时间相比创建时间，已经过了24小时，则除了超级管理员以外不能修改。
    if (roleId != 1 && roleId != 3) {
      try {
        const createTime = new Date(createdAt);
        const period = Date.now() - createTime;
        if (period > 24*60*60*1000) {
          throw new Error('已过24小时，您无操作权限，请联系车间主任或厂长！');
        }
      } catch (error) {
        console.log(error.message, error);
        res.send({
          status: -1,
          message: error.message
        });
        return;
      }
    }

    try {
      const newData = {
        castId, _id, furnace,
        ribbonTypeName, bucket, melter, meltFurnace,
        newAlloyNumber, newAlloyWeight,
        oldAlloyNumber, oldAlloyWeight,
        mixAlloyNumber, mixAlloyWeight,
        hignNbNumber, hignNbWeight,
        Si, Ni, Cu, BFe, NbFe,
        alloyTotalWeight, alloyOutWeight, alloyFixWeight,
        remark, 
        updatePerson: adminname
      };
      await meltModel.updateOne({ _id }, { $set: newData });
      res.send({
        status: 0,
        message: '更新化钢记录成功'
      });
    } catch (err) {
      console.log('更新化钢记录失败', err);
      res.send({
        status: -1,
        message: `更新化钢记录失败, ${err.message}`
      });
    }
  }

  async delData(req, res, next) {
    const { _id } = req.body;
    try {
      if (!_id) {
        throw new Error('参数错误');
      }
    } catch (error) {
      console.log(err.message, err);
      res.send({
        status: -1,
        message: error.message
      });
      return;
    }

    try {
      const { n } = await meltModel.deleteOne({ _id });
      if (n != 0) {
        res.send({
          status: 0,
          message: '删除化钢记录成功'
        });
      } else {
        throw new Error('删除化钢记录失败');
      }
    } catch (error) {
      res.send({
        status: -1,
        message: '删除化钢记录失败'
      });
    }
  }
}

module.exports = new Melt();