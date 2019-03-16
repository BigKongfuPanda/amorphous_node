var Service = require('node-windows').Service;
var path = require('path');
 
// Create a new service object
var svc = new Service({
  name:'amorphous-node',
  description: '带材厂生产数据管理系统',
  script: path.join(__dirname, 'node-windows.js')
});
 
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});
 
svc.install();