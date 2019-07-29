
-- 查询直通率-groupBy 喷带手
SELECT c.castId, c.team, c.caster,
COUNT(c.furnace) AS totalHeatNum,
SUM(c.nozzleNum) AS nozzleNum,
SUM(t.alloyTotalWeight) AS alloyTotalWeight,
SUM(c.rawWeight) AS rawWeight,
SUM(m.coilNetWeight) AS coilNetWeight,
SUM(m.inPlanStoredWeight) AS inPlanStoredWeight,
SUM(m.outPlanStoredWeight) AS outPlanStoredWeight,
SUM(m.totalStoredWeight) AS totalStoredWeight,
SUM(m.coilNetWeight-m.totalStoredWeight) AS unqualifiedWeight,
SUM(c.uselessRibbonWeight) AS uselessRibbonWeight,
SUM(c.meltOutWeight) AS meltOutWeight,
SUM(c.rawWeight+c.uselessRibbonWeight)/SUM(t.alloyTotalWeight) AS effectiveMeltRatio,
SUM(c.rawWeight)/SUM(c.rawWeight+c.uselessRibbonWeight) AS rollRatio,
SUM(m.totalStoredWeight)/SUM(c.rawWeight) AS qualifiedRatio,
SUM(m.qualityOfA) AS qualityOfA,
SUM(m.qualityOfB) AS qualityOfB,
SUM(m.qualityOfC) AS qualityOfC,
SUM(m.qualityOfD) AS qualityOfD,
SUM(m.qualityOfE) AS qualityOfE,
SUM(m.qualityOfGood) AS qualityOfGood,
SUM(m.qualityOfFine) AS qualityOfFine,
SUM(m.qualityOfNormal) AS qualityOfNormal,
(SELECT COUNT(*) FROM cast WHERE rawWeight <= 50 AND castId = 7 OR rawWeight <= 80 AND castId IN (6,8,9)) AS lowHeatNum,
(SELECT COUNT(*) FROM cast WHERE rawWeight = 0) AS zeroHeatNum
FROM cast AS c, measure AS m, melt AS t
WHERE c.furnace = m.furnace AND t.furnace = c.furnace
GROUP BY m.caster

-- 查询直通率-groupBy 班组
SELECT c.castId, c.team, c.caster,
COUNT(c.furnace) AS totalHeatNum,
SUM(c.nozzleNum) AS nozzleNum,
SUM(t.alloyTotalWeight) AS alloyTotalWeight,
SUM(c.rawWeight) AS rawWeight,
SUM(m.coilNetWeight) AS coilNetWeight,
SUM(m.inPlanStoredWeight) AS inPlanStoredWeight,
SUM(m.outPlanStoredWeight) AS outPlanStoredWeight,
SUM(m.totalStoredWeight) AS totalStoredWeight,
SUM(m.coilNetWeight-m.totalStoredWeight) AS unqualifiedWeight,
SUM(c.uselessRibbonWeight) AS uselessRibbonWeight,
SUM(c.meltOutWeight) AS meltOutWeight,
SUM(c.rawWeight+c.uselessRibbonWeight)/SUM(t.alloyTotalWeight) AS effectiveMeltRatio,
SUM(c.rawWeight)/SUM(c.rawWeight+c.uselessRibbonWeight) AS rollRatio,
SUM(m.totalStoredWeight)/SUM(c.rawWeight) AS qualifiedRatio,
SUM(m.qualityOfA) AS qualityOfA,
SUM(m.qualityOfB) AS qualityOfB,
SUM(m.qualityOfC) AS qualityOfC,
SUM(m.qualityOfD) AS qualityOfD,
SUM(m.qualityOfE) AS qualityOfE,
SUM(m.qualityOfGood) AS qualityOfGood,
SUM(m.qualityOfFine) AS qualityOfFine,
SUM(m.qualityOfNormal) AS qualityOfNormal,
(SELECT COUNT(*) FROM cast WHERE rawWeight <= 50 AND castId = 7 OR rawWeight <= 80 AND castId IN (6,8,9)) AS lowHeatNum
FROM cast AS c, measure AS m, melt AS t
WHERE c.furnace = m.furnace AND t.furnace = c.furnace
GROUP BY c.team
