webpackJsonp([16],{"0Ep3":function(e,t){},jcxZ:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=a("woOf"),i=a.n(l),r=a("mvHQ"),n=a.n(r),o=a("Xxa5"),s=a.n(o),c=a("exGp"),u=a.n(c),b=a("Dd8w"),h=a.n(b),d=(a("mw3O"),a("M4fF"),a("g7mi")),m=a("X2Oc"),p=a("NYxO"),f={name:"melt",components:{Collapse:a("IC2r").a},data:function(){return{userinfo:{},searchForm:{castId:6,furnace:"",date:[new Date(Date.now()),new Date(Date.now()-2592e5)],ribbonTypeNames:[],ribbonWidths:[]},loading:!1,tableData:[],tableHeight:550,totalCount:0,totalWeight:0,totalQualifiedWeight:0,totalQualifiedRatio:""}},computed:h()({},Object(p.c)(["ribbonTypeList"])),beforeRouteUpdate:function(e,t,a){this.castId=e.params.castId,this.getTableData(),a()},created:function(){var e=this;return u()(s.a.mark(function t(){return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.castId=e.$route.params.castId,e.userinfo=JSON.parse(localStorage.getItem("userinfo")),t.next=4,e.getRibbonTypeList();case 4:e.getTableData();case 5:case"end":return t.stop()}},t,e)}))()},mounted:function(){var e=this;e.$nextTick(function(){e.tableHeight=window.innerHeight-80}),window.onresize=Object(m.c)(function(){e.tableHeight=window.innerHeight-80},1e3)},methods:h()({},Object(p.b)(["getRibbonTypeList"]),{clickSearch:function(){this.getTableData()},reset:function(){this.searchForm={caster:"",furnace:"",date:[],ribbonTypeNames:[],ribbonWidths:[]},this.getTableData(params)},getTableData:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a={castId:this.searchForm.castId,startTime:this.searchForm.date[0],endTime:this.searchForm.date[1],furnace:this.searchForm.furnace,ribbonTypeNameJson:n()(this.searchForm.ribbonTypeNames)};i()(t,a),this.$http("get",d.a.queryMeasureStatics,t).then(function(t){e.tableData=t.list,e.totalCount=t.list.length;var a=0,l=0;t.list.forEach(function(e){a+=e.netWeight,l+=e.qualifiedWeight,e.noQualifiedWeight=e.netWeight-e.qualifiedWeight}),e.totalWeight=a,e.totalQualifiedWeight=l,e.totalQualifiedRatio=a?(100*l/a).toFixed(2)+"%":0}).catch(function(e){console.log(e)}).finally(function(){e.loading=!1})},handleSelectionChange:function(e){this.multipleSelection=e}})},g={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-breadcrumb",{staticClass:"crumb",attrs:{"separator-class":"el-icon-arrow-right"}},[a("el-breadcrumb-item",[e._v("检测合格率")])],1),e._v(" "),a("Collapse",[a("el-form",{staticClass:"search_bar",attrs:{model:e.searchForm,inline:!0}},[a("el-form-item",{attrs:{label:"生产日期："}},[a("el-date-picker",{attrs:{type:"daterange","default-time":["00:00:00","23:59:59"],clearable:!1,"start-placeholder":"开始日期","end-placeholder":"结束日期"},model:{value:e.searchForm.date,callback:function(t){e.$set(e.searchForm,"date",t)},expression:"searchForm.date"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"机组："}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.searchForm.castId,callback:function(t){e.$set(e.searchForm,"castId",t)},expression:"searchForm.castId"}},[a("el-option",{attrs:{value:6,label:"6号"}}),e._v(" "),a("el-option",{attrs:{value:7,label:"7号"}}),e._v(" "),a("el-option",{attrs:{value:8,label:"8号"}}),e._v(" "),a("el-option",{attrs:{value:9,label:"9号"}})],1)],1),e._v(" "),a("el-form-item",{attrs:{label:"炉号："}},[a("el-input",{attrs:{placeholder:"请输入炉号"},model:{value:e.searchForm.furnace,callback:function(t){e.$set(e.searchForm,"furnace",t)},expression:"searchForm.furnace"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"材质："}},[a("el-select",{attrs:{placeholder:"请选择",multiple:"","collapse-tags":""},model:{value:e.searchForm.ribbonTypeNames,callback:function(t){e.$set(e.searchForm,"ribbonTypeNames",t)},expression:"searchForm.ribbonTypeNames"}},e._l(e.ribbonTypeList,function(e){return a("el-option",{key:e.ribbonTypeId,attrs:{value:e.ribbonTypeName,label:e.ribbonTypeName}})}),1)],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:e.clickSearch}},[e._v("搜索")]),e._v(" "),a("el-button",{attrs:{type:"primary",icon:"el-icon-refresh"},on:{click:e.reset}},[e._v("重置")])],1)],1)],1),e._v(" "),a("div",{staticClass:"main_bd"},[a("el-row",{staticClass:"total_data"},[a("el-col",{attrs:{span:6}},[e._v("炉次合计："),a("span",{staticClass:"total_num"},[e._v(e._s(e.totalCount))])]),e._v(" "),a("el-col",{attrs:{span:6}},[e._v("净重合计(kg)："),a("span",{staticClass:"total_num"},[e._v(e._s(e.totalWeight))])]),e._v(" "),a("el-col",{attrs:{span:6}},[e._v("合格重量合计(kg)："),a("span",{staticClass:"total_num"},[e._v(e._s(e.totalQualifiedWeight))])]),e._v(" "),a("el-col",{attrs:{span:6}},[e._v("不合格重量合计(kg)："),a("span",{staticClass:"total_num"},[e._v(e._s(e.totalWeight-e.totalQualifiedWeight))])]),e._v(" "),a("el-col",{attrs:{span:6}},[e._v("合格率合计："),a("span",{staticClass:"total_num"},[e._v(e._s(e.totalQualifiedRatio))])])],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",staticStyle:{width:"100%"},attrs:{data:e.tableData,stripe:"",border:"","highlight-current-row":"",height:e.tableHeight}},[a("el-table-column",{attrs:{prop:"furnace",label:"炉号",align:"center",fixed:""}}),e._v(" "),a("el-table-column",{attrs:{prop:"netWeight",label:"净重合计(kg)",align:"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"qualifiedWeight",label:"合格重量(kg)",align:"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"noQualifiedWeight",label:"不合格重量(kg)",align:"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"qualifyOfRatio",label:"合格率（%）",align:"center"}})],1)],1)],1)},staticRenderFns:[]};var v=a("VU/8")(f,g,!1,function(e){a("0Ep3")},"data-v-e46488f0",null);t.default=v.exports}});
//# sourceMappingURL=measureStatics.a0fc2267cdea67615ab3.js.map