webpackJsonp([27],{fgmO:function(t,e){},zhBu:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("g7mi"),a={name:"ribbonInfo",data:function(){return{isDisabled:!1,sheetVisible:!1,adminname:"",roleId:0,text:"",actions:[],info:{},furnace:this.$route.query.f,coilNumber:this.$route.query.c,disabled:!1}},computed:{status:function(){var t="重卷完",e=this.info,i=e.isRollConfirmed,n=e.isMeasureConfirmed,a=e.isStorageConfirmed;e.isStored;return 1===i&&(t="已送检"),1===n&&(t="申请入库"),1===a&&(t="已入库"),t},storeType:function(){var t="",e=this.info.isStored;return 1===e&&(t="计划内入库"),2===e&&(t="计划外入库"),t}},created:function(){var t=JSON.parse(localStorage.getItem("userinfo"))||{};this.adminname=t.adminname,this.roleId=t.roleId,this.actions=[{name:"当前登录："+this.adminname},{name:"退出登录",method:this.signout}],this.getData()},methods:{handleMore:function(){this.sheetVisible=!0},signout:function(){var t=this;this.isDisabled=!0,this.$http("POST",n.a.signout,{}).then(function(e){localStorage.removeItem("userinfo");var i=encodeURIComponent(window.location.href);t.$router.push({path:"/login",query:{returnUrl:i}})}).catch(function(t){console.log(t)}).finally(function(){t.isDisabled=!1})},getData:function(){var t=this,e=this.furnace,i=this.coilNumber;this.$http("GET",n.a.queryRibbonInfo,{furnace:e,coilNumber:i}).then(function(e){var i=Array.isArray(e.list)&&e.list[0]||{};t.info=i}).catch(function(t){console.log(t)})},scanConfirm:function(){var t=this,e={furnace:this.furnace,coilNumber:this.coilNumber};this.$http("POST",n.a.scanConfirm,e).then(function(e){e.status?t.disabled=!1:t.disabled=!0}).catch(function(e){console.log(e),t.disabled=!1})},handleFinish:function(){this.$router.push({path:"/scanList"})}}},s={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"container"},[i("mt-header",{attrs:{fixed:"",title:"带材信息"}},[i("mt-button",{attrs:{slot:"right",icon:"more"},on:{click:t.handleMore},slot:"right"})],1),t._v(" "),i("div",{staticClass:"content"},[i("mt-cell",{attrs:{title:"炉号",value:t.info.furnace}}),t._v(" "),i("mt-cell",{attrs:{title:"盘号",value:t.info.coilNumber}}),t._v(" "),i("mt-cell",{attrs:{title:"材质",value:t.info.ribbonTypeName}}),t._v(" "),i("mt-cell",{attrs:{title:"规格",value:t.info.ribbonWidth+" mm"}}),t._v(" "),i("mt-cell",{attrs:{title:"重量",value:t.info.coilWeight+" kg"}}),t._v(" "),i("mt-cell",{attrs:{title:"级别",value:t.info.ribbonTotalLevel}}),t._v(" "),i("mt-cell",{attrs:{title:"状态",value:t.status}}),t._v(" "),1===t.info.isStorageConfirmed?i("mt-cell",{attrs:{title:"入库类型",value:t.storeType}}):t._e(),t._v(" "),6===t.roleId?i("p",{staticClass:"text_danger tip"},[t._v("\n      备注：如果要继续扫下一盘，则点击【下一盘】，关闭页面继续扫码；如果扫完了，打算入仓位或者出库，则点击【结束了】\n    ")]):t._e()],1),t._v(" "),6===t.roleId?i("div",{staticClass:"btn-wrapp"},[i("mt-button",{attrs:{plain:""},on:{click:t.handleFinish}},[t._v("结束了")]),t._v(" "),i("mt-button",{attrs:{type:"primary",disabled:t.disabled},on:{click:t.scanConfirm}},[t._v("下一盘")])],1):t._e(),t._v(" "),i("mt-actionsheet",{attrs:{actions:t.actions},model:{value:t.sheetVisible,callback:function(e){t.sheetVisible=e},expression:"sheetVisible"}})],1)},staticRenderFns:[]};var o=i("VU/8")(a,s,!1,function(t){i("fgmO")},"data-v-1c63cf44",null);e.default=o.exports}});
//# sourceMappingURL=ribbonInfo.2a1d6ccb9e3126c4dc44.js.map