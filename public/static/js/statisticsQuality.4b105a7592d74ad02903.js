webpackJsonp([21],{"KF/+":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=a("woOf"),r=a.n(l),n=a("mvHQ"),i=a.n(n),o=a("Dd8w"),c=a.n(o),s=a("g7mi"),b=a("NYxO"),p={data:function(){return{searchForm:{castIds:[],caster:"",furnace:"",ribbonTypeNames:[],ribbonWidths:[]},loading:!1,tableData:[],pageConfig:{total:1,current:1,pageSize:10}}},computed:c()({},Object(b.c)(["ribbonTypeList","ribbonWidthList"])),created:function(){this.getTableData(),this.getRibbonTypeList(),this.getRibbonWidthList()},methods:c()({},Object(b.b)(["getRibbonTypeList","getRibbonWidthList"]),{clickSearch:function(){this.pageConfig.current=1,this.getTableData({current:1})},reset:function(){this.searchForm={castIds:[],caster:"",furnace:"",ribbonTypeNames:[],ribbonWidths:[]};this.pageConfig.current=1,this.getTableData({current:1})},getTableData:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a={castIdJson:i()(this.searchForm.castIds),caster:this.searchForm.caster,furnace:this.searchForm.furnace,ribbonTypeNameJson:i()(this.searchForm.ribbonTypeNames),ribbonWidthJson:i()(this.searchForm.ribbonWidths)};r()(t,a),this.$http("get",s.a.queryStatisticsQuality,t).then(function(t){e.pageConfig.total=t.count,e.pageConfig.pageSize=t.limit,e.tableData=t.list}).catch(function(e){console.log(e)}).finally(function(){e.loading=!1})},handleCurrentChange:function(e){var t={current:e};this.getTableData(t)},calcSum:function(e,t){return e.reduce(function(e,a){return void 0!==a[t]&&null!==a[t]||(a[t]=0),e+a[t]},0).toFixed(2)}})},u={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-breadcrumb",{staticClass:"crumb",attrs:{"separator-class":"el-icon-arrow-right"}},[a("el-breadcrumb-item",[e._v("数据统计")]),e._v(" "),a("el-breadcrumb-item",[e._v("带材质量统计")])],1),e._v(" "),a("el-form",{staticClass:"search_bar",attrs:{model:e.searchForm,inline:!0}},[a("el-form-item",{attrs:{label:"机组："}},[a("el-select",{attrs:{placeholder:"请选择机组",multiple:"","collapse-tags":""},model:{value:e.searchForm.castIds,callback:function(t){e.$set(e.searchForm,"castIds",t)},expression:"searchForm.castIds"}},[a("el-option",{attrs:{value:6,label:"6号机组"}}),e._v(" "),a("el-option",{attrs:{value:7,label:"7号机组"}}),e._v(" "),a("el-option",{attrs:{value:8,label:"8号机组"}}),e._v(" "),a("el-option",{attrs:{value:9,label:"9号机组"}})],1)],1),e._v(" "),a("el-form-item",{attrs:{label:"喷带手："}},[a("el-input",{attrs:{placeholder:"请输入喷带手姓名"},model:{value:e.searchForm.caster,callback:function(t){e.$set(e.searchForm,"caster",t)},expression:"searchForm.caster"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"炉号："}},[a("el-input",{attrs:{placeholder:"请输入炉号"},model:{value:e.searchForm.furnace,callback:function(t){e.$set(e.searchForm,"furnace",t)},expression:"searchForm.furnace"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"材质："}},[a("el-select",{attrs:{placeholder:"请选择",multiple:"","collapse-tags":""},model:{value:e.searchForm.ribbonTypeNames,callback:function(t){e.$set(e.searchForm,"ribbonTypeNames",t)},expression:"searchForm.ribbonTypeNames"}},e._l(e.ribbonTypeList,function(e){return a("el-option",{key:e.ribbonTypeId,attrs:{value:e.ribbonTypeName,label:e.ribbonTypeName}})}),1)],1),e._v(" "),a("el-form-item",{attrs:{label:"规格："}},[a("el-select",{attrs:{placeholder:"请选择",multiple:"","collapse-tags":""},model:{value:e.searchForm.ribbonWidths,callback:function(t){e.$set(e.searchForm,"ribbonWidths",t)},expression:"searchForm.ribbonWidths"}},e._l(e.ribbonWidthList,function(e){return a("el-option",{key:e.ribbonWidthId,attrs:{label:e.ribbonWidth,value:e.ribbonWidth}})}),1)],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:e.clickSearch}},[e._v("搜索")]),e._v(" "),a("el-button",{attrs:{type:"primary",icon:"el-icon-refresh"},on:{click:e.reset}},[e._v("重置")])],1)],1),e._v(" "),a("div",{staticClass:"main_bd"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:e.tableData,stripe:"",border:""}},[a("el-table-column",{attrs:{prop:"castId",label:"机组",align:"center",width:"50px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"furnace",label:"炉号",align:"center",width:"170px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"ribbonTypeName",label:"材质",align:"center",width:"80px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"ribbonWidth",label:"规格",align:"center",width:"50px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"caster",label:"喷带手",align:"center",width:"70px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"rawWeight",label:"大盘毛重(kg)",align:"center",width:"110px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"coilNetWeight",label:"倒卷净重(kg)",align:"center",width:"80px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"unqualifiedWeight",label:"不合格重量(kg)",align:"center",width:"80px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"totalStoredWeight",label:"入库重量(kg)",align:"center",width:"110px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"uselessRibbonWeight",label:"废带(kg)",align:"center",width:"80px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"alloyTotalWeight",label:"投入母合金(kg)",align:"center",width:"80px"}}),e._v(" "),a("el-table-column",{attrs:{label:"质量等级分布",align:"center",width:"110px"}},[a("el-table-column",{attrs:{label:"A",prop:"qualityOfA"}}),e._v(" "),a("el-table-column",{attrs:{label:"B",prop:"qualityOfB"}}),e._v(" "),a("el-table-column",{attrs:{label:"C",prop:"qualityOfC"}}),e._v(" "),a("el-table-column",{attrs:{label:"D",prop:"qualityOfD"}}),e._v(" "),a("el-table-column",{attrs:{label:"E",prop:"qualityOfE"}})],1),e._v(" "),a("el-table-column",{attrs:{prop:"thinRibbonWeight",label:"薄带(kg)",align:"center",width:"80px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"highFactorThinRibbonWeight",label:"高叠片薄带(kg)",align:"center",width:"80px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"inPlanStoredWeight",label:"计划内入库(kg)",align:"center",width:"90px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"outPlanStoredWeight",label:"计划外入库(kg)",align:"center",width:"90px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"inPlanThickRibbonWeight",label:"符合订单非薄带(kg)",align:"center",width:"100px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"qualityOfGood",label:"好(kg)",align:"center",width:"70px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"qualityOfFine",label:"良(kg)",align:"center",width:"70px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"qualityOfNormal",label:"中(kg)",align:"center",width:"70px"}})],1),e._v(" "),a("el-pagination",{attrs:{background:"",layout:"total,prev,pager,next",total:e.pageConfig.total,"current-page":e.pageConfig.current,"page-size":e.pageConfig.pageSize},on:{"update:currentPage":function(t){e.$set(e.pageConfig,"current",t)},"current-change":e.handleCurrentChange}})],1)],1)},staticRenderFns:[]};var h=a("VU/8")(p,u,!1,function(e){a("UYUJ")},"data-v-4b3f1ac6",null);t.default=h.exports},UYUJ:function(e,t){}});
//# sourceMappingURL=statisticsQuality.4b105a7592d74ad02903.js.map