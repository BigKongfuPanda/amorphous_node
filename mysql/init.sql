-- -- 如果数据库存在则删除数据库
-- DROP DATABASE IF EXISTS daicai;

-- 创建新的 daicai 数据库
CREATE DATABASE IF NOT EXISTS daicai DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
-- 使用 myApp 数据库
USE daicai;

-- 创建用户表
CREATE TABLE IF NOT EXISTS `user`(
  `roleId` INT UNSIGNED COMMENT '角色id',
  `username` VARCHAR(100) COMMENT '登录名',
  `adminname` VARCHAR(100) COMMENT '真实姓名',
  `password` VARCHAR(100) DEFAULT '123456' COMMENT '密码',
  `loginTime` VARCHAR(100) COMMENT '登录时间',
  `createTime` VARCHAR(100) COMMENT '创建时间',
  PRIMARY KEY (`username`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 创建超级管理员
INSERT INTO user (
  roleId, username, adminname, password, loginTime, createTime
)
VALUES 
(
  1, 'heyuntao', '何云涛', '123456', NOW(), NOW()
);

-- 重卷和检测数据表
CREATE TABLE IF NOT EXISTS `measure`(
  `coilId` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增id，做主键',
  `castId` INT UNSIGNED COMMENT '机组编号',
  `furnace` VARCHAR(100) COMMENT '带材炉号',
  `ribbonTypeName` VARCHAR(100) COMMENT '带材材质名称',
  `ribbonWidth` INT UNSIGNED COMMENT '带材规格',
  `coilNumber` INT UNSIGNED COMMENT '盘号',
  `diameter` FLOAT(6,2) COMMENT '半径',
  `coilWeight` FLOAT(4,2) COMMENT '盘重',
  `roller` VARCHAR(100) COMMENT '重卷人',
  `rollMachine` INT UNSIGNED COMMENT '重卷机编号',
  `isFlat` VARCHAR(10) COMMENT '是否平整，是/否',
  PRIMARY KEY (`coilId`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 叠片系数
CREATE TABLE IF NOT EXISTS `laminationLevel`(
  `laminationLevelId` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增id，做主键',
  `laminationLevel` INT UNSIGNED COMMENT '叠片系数等级',
  `laminationFactorRange` VARCHAR(100) COMMENT '叠片系数范围',
  PRIMARY KEY (`laminationLevelId`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 带厚等级
CREATE TABLE IF NOT EXISTS `ribbonThicknessLevel`(
  `ribbonThicknessLevelId` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增id，做主键',
  `ribbonThicknessLevel` INT UNSIGNED COMMENT '厚度等级',
  `ribbonThicknessRange` VARCHAR(100) COMMENT '厚度等级对应的范围',
  PRIMARY KEY (`ribbonThicknessLevelId`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 韧性等级
CREATE TABLE IF NOT EXISTS `ribbonToughnessLevel`(
  `ribbonToughnessLevelId` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增id，做主键',
  `ribbonToughnessLevel` VARCHAR(100) COMMENT '韧性等级',
  `ribbonToughness` VARCHAR(100) COMMENT '韧性等级对应的范围',
  PRIMARY KEY (`ribbonToughnessLevelId`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 带材牌号
CREATE TABLE IF NOT EXISTS `ribbonType`(
  `ribbonTypeId` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增id，做主键',
  `ribbonTypeName` VARCHAR(100) COMMENT '带材牌号名称',
  `NCode` VARCHAR(100) COMMENT 'NC编码',
  PRIMARY KEY (`ribbonTypeId`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 带材宽度
CREATE TABLE IF NOT EXISTS `ribbonWidth`(
  `ribbonWidthId` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增id，做主键',
  `ribbonWidth` INT COMMENT '带材宽度',
  PRIMARY KEY (`ribbonWidthId`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

