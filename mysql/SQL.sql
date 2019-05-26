/*
重卷和检测数据表
*/
CREATE TABLE IF NOT EXISTS `measure`(
  `id` INT UNSIGNED AUTO_INCREAMENT comment '自增id，做主键',
  `castId` INT UNSIGNED comment '机组编号',
  `furnace` VARCHAR(100) NOT NULL comment '带材炉号',
  `ribbonTypeName` VARCHAR(100) NOT NULL comment '带材材质名称',
  `ribbonWidth` INT UNSIGNED comment '带材规格',
  `coilNumber` INT UNSIGNED comment '盘号',
  `diameter` FLOAT(6,2) NOT NULL comment '半径',
  `coilWeight` FLOAT(4,2) NOT NULL comment '盘重',
  `roller` VARCHAR(100) NOT NULL comment '重卷人',
  `rollMachine` INT UNSIGNED comment '重卷机编号',
  `isFlat` VARCHAR(10) comment '是否平整，是/否',
  PRIMARY KEY (`id`);
)ENGINE=InnoDB DEFAULT CHARSET=utf8;