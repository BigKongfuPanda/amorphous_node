# 注意：

近期在把数据库从 mongodb 改成 mysql，正在进行中。

master分支为改造中的 mysql 版本分支，mongodb 为 mongodb 版本的分支。

# About
使用 express + mongodb + mongoose 搭建的生产数据采集管理后台。

配套的前端项目地址为[amorphous_vue](https://github.com/BigKongfuPanda/amorphous_vue)，前端项目使用 vue2.x + elementUI + vuex + vue-router + axios 做的单页面。

# 技术栈

nodejs + express + mongodb + mongoose + es6/7 + log4js + node-xlsx + pm2

具体：

- express：本项目使用的node框架，集成了大量实用的中间件

- mongodb：使用的是 3.4 版本，由于服务器的系统为 window server 2008 R2，最高支持到mongodb 3.4，同时将服务器上面的 mongodb 设置为 windows service，实现开机自启动

- mongoose：最大的特点是可以定义数据的 schema，并且封装了一套 CRUD 的API

- express-session 和 connect-mongo：本项目使用的是 session-cookie 来实现登录态的保持，使用 connect-mongo 来做 session 的持久化，将 session 保存到 mongodb 中

- ES6/7：大量使用了JS语言的新特性，尤其是在操作数据库的时候，使用 `async/await` 实现异步操作

- log4js：用来记录生产环境下的错误日志，方便追踪bug

- node-xlsx： 用来解析上传的excel文件中的数据，存入数据库

- pm2：用来启动和守护 node 服务进程

- supervior: 开发模式下代码热更新和服务重启

- 角色权限：共有14种角色，每个角色对数据的访问和操作权限通过其 roleId 来区分和控制的

# 项目布局

```
|----app.js 入口文件
|----config 运行配置
|    |----default.js 默认配置
|    |----development.js 运行配置
|    |----log4js.json 日志配置
|    |----node-windows.j node服务开启自启动配置
|
|----log 日志存储文件夹
|    |----access.log http请求日志
|    |----errors.log 错误日志
|    
|----mongodb 数据库配置    
|    |----db.js 数据库配置和启动
|
|----controller 处理中心，负责路由及数据库的具体操作
|    |----plan.js 生产计划控制中心
|    |----melt.js 冶炼控制中心
|    |----cast.js 喷带控制中心
|    |----measure.js 重卷和检测控制中心
|    |----storage.js 库房控制中心
|    |----returnGoods 退货控制中心
|    |----statistics.js 数据统计控制中心
|    |----ribbonThicknessLevel.js 带材厚度等级控制中心
|    |----ribbonToughnessLevel.js 带材韧性等级控制中心
|    |----ribbonType.js 带材牌号控制中心
|    |----ribbonWidth.js 带材规格控制中心
|    |----laminationLevel.js 带材叠片系数控制中心
|    |----user.js 用户管理控制中心
|    
|----models 数据模型（数据库）    
|    |----plan.js 生产计划疏浚模型
|    |----melt.js 冶炼数据模型
|    |----cast.js 喷带数据模型
|    |----measure.js 重卷和检测数据模型
|    |----storage.js 库房数据模型
|    |----returnGoods 退货数据模型
|    |----ribbonThicknessLevel.js 带材厚度等级数据模型
|    |----ribbonToughnessLevel.js 带材韧性等级数据模型
|    |----ribbonType.js 带材牌号数据模型
|    |----ribbonWidth.js 带材规格数据模型
|    |----laminationLevel.js 带材叠片系数数据模型
|    |----user.js 用户数据模型
|
|----routes 路由
|    |----index.js 路由配置主文件
|    |----plan.js 生产计划
|    |----melt.js 冶炼
|    |----cast.js 喷带
|    |----measure.js 重卷和检测
|    |----storage.js 库房
|    |----returnGoods 退货
|    |----statistics.js 数据统计
|    |----ribbonThicknessLevel.js 带材厚度等级
|    |----ribbonToughnessLevel.js 带材韧性等级
|    |----ribbonType.js 带材牌号
|    |----ribbonWidth.js 带材规格
|    |----laminationLevel.js 带材叠片系数
|    |----user.js 用户管理
|
|----middleware 中间件
|    |----checkLogin.js 登录权限中间件
|    
|----service 服务    
|    |----measure.js 检测
|    |----returnGood.js 退货
|    |----storage.js 入库和库房
|       
|----public 前端静态资源和html
|    |----static
|    |    |----css 样式表
|    |    |----fonts 字体图标
|    |    |----img 图片
|    |    |----js js脚本
|    |
|    |----index.html 前端页面入口
|    
|----views 视图（express 自动生成，本项目没有使用）    
```

# 启动项目

```
项目运行之前，请确保系统已经安装以下应用
1、node (8.0 及以上版本)
2、mongodb (开启状态) (3.4 版本及以上版本)
```

```
git clone https://github.com/BigKongfuPanda/amorphous_node.git  

cd amorphous_node

npm install

npm run dev

访问: http://localhost:8001
```

# 下一步

由于时间比较紧张，暂时只是实现了功能，代码和项目结构还不是特别满意，还需要再进一步进行优化。
