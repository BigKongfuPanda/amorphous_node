webpackJsonp([20],{"4BdW":function(t,e){},smyx:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("Xxa5"),s=a.n(n),o=a("exGp"),i=a.n(o),c=a("g7mi"),r=a("Au9i"),l={name:"ribbonInfo",data:function(){return{isDisabled:!1,sheetVisible:!1,adminname:"",roleId:0,text:"",actions:[],info:{},disabled:!1,tableData:[],totalCoilNum:0,totalWeight:0}},created:function(){var t=JSON.parse(localStorage.getItem("userinfo"))||{};this.adminname=t.adminname,this.roleId=t.roleId,this.actions=[{name:"当前登录："+this.adminname},{name:"退出登录",method:this.signout}],this.getData()},methods:{handleMore:function(){this.sheetVisible=!0},signout:function(){var t=this;this.isDisabled=!0,this.$http("POST",c.a.signout,{}).then(function(e){localStorage.removeItem("userinfo");var a=encodeURIComponent(window.location.href);t.$router.push({path:"/login",query:{returnUrl:a}})}).catch(function(t){console.log(t)}).finally(function(){t.isDisabled=!1})},getData:function(){var t=this;this.$http("GET",c.a.queryScanList).then(function(e){t.totalCoilNum=e.totalCoilNum,t.totalWeight=e.totalWeight,t.tableData=e.list}).catch(function(t){console.log(t)})},handleDelete:function(t){var e=this,a=t.furnace,n=t.coilNumber;r.MessageBox.confirm("确定删除 "+a+"，第"+n+"盘吗?").then(function(t){e.$http("POST",c.a.delScanConfirm,{furnace:a,coilNumber:n}).then(function(t){setTimeout(function(){window.location.reload()},2e3)}).catch(function(t){console.log(t)})})},handleScanListWithPlace:function(){var t=this;return i()(s.a.mark(function e(){var a,n,o;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,r.MessageBox.prompt("请输入仓位");case 3:return a=e.sent,n=a.value,a.action,n||Object(r.Toast)("仓位不能为空，请重新输入仓位"),o={ids:t.tableData.map(function(t){return t.storageId})||[],place:n},e.next=10,t.$http("POST",c.a.batchUpdateRibbonWithPlace,o);case 10:t.getData(),e.next=16;break;case 13:e.prev=13,e.t0=e.catch(0),console.log(e.t0);case 16:case"end":return e.stop()}},e,t,[[0,13]])}))()},handleOutStore:function(){var t=this;return i()(s.a.mark(function e(){var a,n,o;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,r.MessageBox.prompt("请输入实际去向");case 3:return a=e.sent,n=a.value,a.action,n||Object(r.Toast)("去向不能为空，请重新输入"),o={ids:t.tableData.map(function(t){return t.storageId})||[],takeBy:n},e.next=10,t.$http("POST",c.a.batchOutStoreByScan,o);case 10:t.getData(),e.next=16;break;case 13:e.prev=13,e.t0=e.catch(0),console.log(e.t0);case 16:case"end":return e.stop()}},e,t,[[0,13]])}))()}}},u={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container"},[a("mt-header",{attrs:{fixed:"",title:"带材信息"}},[a("mt-button",{attrs:{slot:"right",icon:"more"},on:{click:t.handleMore},slot:"right"})],1),t._v(" "),a("div",{staticClass:"content"},[a("el-row",{staticClass:"total_data"},[a("el-col",{attrs:{span:12}},[a("p",{staticClass:"text_center"},[t._v("总盘数："+t._s(t.totalCoilNum))])]),t._v(" "),a("el-col",{attrs:{span:12}},[a("p",{staticClass:"text_center"},[t._v("总重量(kg)："+t._s(t.totalWeight))])])],1),t._v(" "),a("el-row",{staticClass:"table-hd"},[a("el-col",{attrs:{span:12}},[a("p",{staticClass:"text_center"},[t._v("炉号")])]),t._v(" "),a("el-col",{attrs:{span:6}},[a("p",{staticClass:"text_center"},[t._v("盘号")])]),t._v(" "),a("el-col",{attrs:{span:6}},[a("p",{staticClass:"text_center"},[t._v("重量")])])],1),t._v(" "),t._l(t.tableData,function(e){return a("mt-cell-swipe",{key:e.storageId,attrs:{right:[{content:"删除",style:{background:"red",color:"#fff"},handler:function(){return t.handleDelete(e)}}]}},[a("el-row",{staticClass:"slot"},[a("el-col",{attrs:{span:12}},[a("p",{staticClass:"text_center"},[t._v(t._s(e.furnace))])]),t._v(" "),a("el-col",{attrs:{span:6}},[a("p",{staticClass:"text_center"},[t._v(t._s(e.coilNumber))])]),t._v(" "),a("el-col",{attrs:{span:6}},[a("p",{staticClass:"text_center"},[t._v(t._s(e.coilWeight))])])],1)],1)})],2),t._v(" "),6===t.roleId?a("div",{staticClass:"btn-wrapp"},[a("mt-button",{attrs:{plain:""},on:{click:t.handleOutStore}},[t._v("出库")]),t._v(" "),a("mt-button",{attrs:{type:"primary",disabled:t.disabled},on:{click:t.handleScanListWithPlace}},[t._v("入仓")])],1):t._e(),t._v(" "),a("mt-actionsheet",{attrs:{actions:t.actions},model:{value:t.sheetVisible,callback:function(e){t.sheetVisible=e},expression:"sheetVisible"}})],1)},staticRenderFns:[]};var h=a("VU/8")(l,u,!1,function(t){a("4BdW")},"data-v-77a150e6",null);e.default=h.exports}});
//# sourceMappingURL=ScanList.2b3e15d85e00fa0acb6d.js.map