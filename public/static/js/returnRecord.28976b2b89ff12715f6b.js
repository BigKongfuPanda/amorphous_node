webpackJsonp([17],{"7Gne":function(e,n){},"GC/X":function(e,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var t=i("woOf"),o=i.n(t),s=i("mvHQ"),r=i.n(s),l=i("Dd8w"),a=i.n(l),b=i("mw3O"),c=i.n(b),h=i("M4fF"),u=i("g7mi"),p=i("X2Oc"),v=i("NYxO"),d={name:"melt",components:{Collapse:i("IC2r").a},data:function(){return{userinfo:{},searchForm:{caster:"",furnace:"",date:[],ribbonTypeNames:[],ribbonWidths:[],ribbonThicknessLevels:[],laminationLevels:[],ribbonToughnessLevels:[],appearenceLevels:[]},loading:!1,tableData:[],pageConfig:{total:1,current:1,pageSize:10},isExportable:!1,isEditable:!1,isDeleteable:!1,tableHeight:550,multipleSelection:[],isBatchInStored:!1}},computed:a()({},Object(v.c)(["ribbonToughnessLevelList","ribbonTypeList","ribbonWidthList","ribbonThicknessLevelList","laminationLevelList"])),beforeRouteUpdate:function(e,n,i){this.getTableData(),this.isExportable=this.setExportable(),this.isEditable=this.setEditable(),this.isDeleteable=this.setDeleteable(),this.isBatchInStored=this.setBatchInStored(),i()},created:function(){this.userinfo=JSON.parse(localStorage.getItem("userinfo")),this.isExportable=this.setExportable(),this.isEditable=this.setEditable(),this.isDeleteable=this.setDeleteable(),this.isBatchInStored=this.setBatchInStored(),this.getTableData(),this.getRibbonToughnessLevelList(),this.getRibbonTypeList(),this.getRibbonWidthList(),this.getRibbonThicknessLevelList(),this.getLaminationLevelList()},mounted:function(){var e=this;e.$nextTick(function(){e.tableHeight=window.innerHeight-100}),window.onresize=Object(p.c)(function(){e.tableHeight=window.innerHeight-100},1e3)},methods:a()({thicknessChangeHandler:function(e,n){var i=[n.ribbonThickness1,n.ribbonThickness2,n.ribbonThickness3,n.ribbonThickness4,n.ribbonThickness5,n.ribbonThickness6,n.ribbonThickness7,n.ribbonThickness8,n.ribbonThickness9];i=i.map(function(e){if(""!==e)return Number(e)}).filter(function(e){return void 0!==e}),n.ribbonThicknessDeviation=this.calcMaxDeviation(i),n.ribbonThickness=i.length>0?(i.reduce(function(e,n){return e+n},0)/i.length).toFixed(2):0,n.ribbonThicknessLevel=this.calcribbonThicknessLevel(n.ribbonThickness)}},Object(v.b)(["getRibbonToughnessLevelList","getRibbonTypeList","getRibbonWidthList","getRibbonThicknessLevelList","getLaminationLevelList"]),{dateFormat:function(e,n){return Object(p.a)(e.castDate)},dateTimeFormat:function(e,n){return e.measureDate?Object(p.b)(e.measureDate):""},setEditable:function(){return 5==this.userinfo.roleId||1==this.userinfo.roleId},setDeleteable:function(){return 1==this.userinfo.roleId},setExportable:function(){return!![1,2,3,5].includes(this.userinfo.roleId)},setBatchInStored:function(){return 5==this.userinfo.roleId},clickSearch:function(){this.pageConfig.current=1,this.getTableData({current:1})},reset:function(){this.searchForm={caster:"",furnace:"",date:[],ribbonTypeNames:[],ribbonWidths:[],ribbonThicknessLevels:[],laminationLevels:[],ribbonToughnessLevels:[],appearenceLevels:[]};this.pageConfig.current=1,this.getTableData({current:1})},getTableData:function(){var e=this,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i={startTime:this.searchForm.date[0],endTime:this.searchForm.date[1],caster:this.searchForm.caster,furnace:this.searchForm.furnace,ribbonTypeNameJson:r()(this.searchForm.ribbonTypeNames),ribbonWidthJson:r()(this.searchForm.ribbonWidths),ribbonThicknessLevelJson:r()(this.searchForm.ribbonThicknessLevels),laminationLevelJson:r()(this.searchForm.laminationLevels),ribbonToughnessLevelJson:r()(this.searchForm.ribbonToughnessLevels),appearenceLevelJson:r()(this.searchForm.appearenceLevels)};o()(n,i),this.$http("get",u.a.queryReturnGoods,n).then(function(n){e.pageConfig.total=n.count,e.pageConfig.pageSize=n.limit,n.list&&n.list.forEach(function(e){e.isEditing=!1,e.clients=e.clients.split(",")}),e.tableData=n.list}).catch(function(e){console.log(e)}).finally(function(){e.loading=!1})},edit:function(e){if(4==e.isStored&&1==e.isMeasureConfirmed)return this.$message({message:"该带材已经入库，您无权限操作，请联系库房主管人员！",type:"error"});e.isEditing=!0},save:function(e){if(e.isEditing=!1,e.laminationFactor=((e.coilWeight-.09)/(Math.PI*(e.diameter*e.diameter/4-9025/4)*7.2)*Math.pow(10,6)/e.realRibbonWidth).toFixed(2),e.laminationLevel=this.calcLaminationLevel(e.laminationFactor),e.ribbonToughnessLevel=this.ribbonToughnessLevelList.reduce(function(e,n){return e[n.ribbonToughness]=n.ribbonToughnessLevel,e},{})[e.ribbonToughness],e.ribbonThickness1="string"==typeof e.ribbonThickness1?Number(e.ribbonThickness1.trim()):e.ribbonThickness1,e.ribbonThickness2="string"==typeof e.ribbonThickness2?Number(e.ribbonThickness2.trim()):e.ribbonThickness2,e.ribbonThickness3="string"==typeof e.ribbonThickness3?Number(e.ribbonThickness3.trim()):e.ribbonThickness3,e.ribbonThickness4="string"==typeof e.ribbonThickness4?Number(e.ribbonThickness4.trim()):e.ribbonThickness4,e.ribbonThickness5="string"==typeof e.ribbonThickness5?Number(e.ribbonThickness5.trim()):e.ribbonThickness5,e.ribbonThickness6="string"==typeof e.ribbonThickness6?Number(e.ribbonThickness6.trim()):e.ribbonThickness6,e.ribbonThickness7="string"==typeof e.ribbonThickness7?Number(e.ribbonThickness7.trim()):e.ribbonThickness7,e.ribbonThickness8="string"==typeof e.ribbonThickness8?Number(e.ribbonThickness8.trim()):e.ribbonThickness8,e.ribbonThickness9="string"==typeof e.ribbonThickness9?Number(e.ribbonThickness9.trim()):e.ribbonThickness9,e.ribbonThicknessDeviation=this.calcMaxDeviation([e.ribbonThickness1,e.ribbonThickness2,e.ribbonThickness3,e.ribbonThickness4,e.ribbonThickness5,e.ribbonThickness6,e.ribbonThickness7,e.ribbonThickness8,e.ribbonThickness9]),e.ribbonThickness=((e.ribbonThickness1+e.ribbonThickness2+e.ribbonThickness3+e.ribbonThickness4+e.ribbonThickness5+e.ribbonThickness6+e.ribbonThickness7+e.ribbonThickness8+e.ribbonThickness9)/9).toFixed(2),e.ribbonThicknessLevel=this.calcribbonThicknessLevel(e.ribbonThickness),e.ribbonTotalLevel="不合格"===e.laminationLevel||"不合格"===e.appearenceLevel?"不合格":e.ribbonThicknessLevel+e.laminationLevel+e.ribbonToughnessLevel+e.appearenceLevel,[32,35,40,42,45,50].includes(e.ribbonWidth)&&"1K107B"==e.ribbonTypeName&&["D","E"].includes(e.ribbonToughnessLevel)&&(e.ribbonTotalLevel="不合格"),e.ribbonThicknessDeviation>3&&["D","E"].includes(e.ribbonToughnessLevel)&&(e.ribbonTotalLevel="不合格"),e.ribbonWidth<50?["D","E"].includes(e.ribbonToughnessLevel)&&Math.abs(e.realRibbonWidth-e.ribbonWidth)>.2&&(e.ribbonTotalLevel="不合格"):e.ribbonWidth>=50&&["D","E"].includes(e.ribbonToughnessLevel)&&Math.abs(e.realRibbonWidth-e.ribbonWidth)>.3&&(e.ribbonTotalLevel="不合格"),["AD25","ND25"].includes(e.ribbonTypeName)){var n=e.realRibbonWidth-e.ribbonWidth;(n>=.1||n<=-.2)&&(e.ribbonTotalLevel="不合格")}if("不合格"!==e.ribbonTotalLevel){e.ribbonThickness>=20&&e.ribbonThickness<=22&&(e.ribbonTotalLevel=e.ribbonTotalLevel+"G"),e.ribbonThickness>=23&&e.ribbonThickness<=24&&(e.ribbonTotalLevel=e.ribbonTotalLevel+"L"),e.ribbonThicknessDeviation>3&&["A","B","C"].includes(e.ribbonToughnessLevel)&&(e.ribbonTotalLevel=e.ribbonTotalLevel+"F");var i=e.realRibbonWidth-e.ribbonWidth;e.ribbonWidth<50?Math.abs(i)>.2&&["A","B","C"].includes(e.ribbonToughnessLevel)&&(i<-.2?e.ribbonTotalLevel=e.ribbonTotalLevel+"-E":i>.2&&(e.ribbonTotalLevel=e.ribbonTotalLevel+"+E")):e.ribbonWidth>=50&&Math.abs(i)>.3&&["A","B","C"].includes(e.ribbonToughnessLevel)&&(i<-.3?e.ribbonTotalLevel=e.ribbonTotalLevel+"-E":i>.3&&(e.ribbonTotalLevel=e.ribbonTotalLevel+"+E"))}""!=e.ribbonThicknessLevel&&""!==e.laminationLevel&&""!=e.ribbonToughnessLevel&&""!=e.appearenceLevel||(e.ribbonTotalLevel=""),"不合格"===e.ribbonTotalLevel?(e.isStored=3,e.isMeasureConfirmed=1):(e.isStored=this.setStoredType(e),1===e.isStored?(e.inPlanStoredWeight=e.coilNetWeight,2===e.ribbonThicknessLevel&&(e.inPlanThickRibbonWeight=e.coilNetWeight)):2===e.isStored&&(e.outPlanStoredWeight=e.coilNetWeight),e.totalStoredWeight=(e.inPlanStoredWeight+e.outPlanStoredWeight).toFixed(2),this.calcQualityOfABCDE(e),this.calcThinRibbonWeight(e),e.qualityOfGood=e.inPlanStoredWeight,2===e.isStored&&(/^[3-8][1-4][A-E][A-C]G?([+-]E)?F?$/.test(e.ribbonTotalLevel)||/^2[2-3][A-C]BL?([+-]E)?F?$/.test(e.ribbonTotalLevel)?e.qualityOfFine=e.coilNetWeight:e.qualityOfNormal=e.coilNetWeight));var t=Object(h.cloneDeep)(e);t.clients=t.clients.join(),this.$http("PUT",u.a.updateMeasure,t).then(function(e){}).catch(function(e){console.log(e)})},handleCurrentChange:function(e){var n={current:e};this.getTableData(n)},calcThinRibbonWeight:function(e){if(!(e.ribbonThickness>23))return e.laminationFactor>=.78?e.highFactorThinRibbonWeight=e.coilNetWeight:void(e.laminationFactor>=.75&&(e.thinRibbonWeight=e.coilNetWeight))},calcQualityOfABCDE:function(e){var n=e.ribbonTotalLevel;/^[3-8][2-4][A-E][A-C]G?([+-]E)?F?$/.test(n)?e.qualityOfA=e.coilNetWeight:/^[3-8]1[A-E][A-C]G?([+-]E)?F?$/.test(n)?e.qualityOfB=e.coilNetWeight:/^[3-8]0[A-E][A-C]G?([+-]E)?F?$/.test(n)?e.qualityOfC=e.coilNetWeight:/^2[1-4][A-E][A-C]L?([+-]E)?F?$/.test(n)?e.qualityOfD=e.coilNetWeight:/^1[1-4][A-E][A-C]([+-]E)?F?$/.test(n)&&(e.qualityOfE=e.coilNetWeight)},calcLaminationLevel:function(e){return e?e>=.84?"4":e>=.82&&e<.84?"3":e>=.8&&e<.82?"2":e>=.78&&e<.8?"1":e>=.75&&e<.78?"0":"不合格":""},calcMaxDeviation:function(e){return e.sort(function(e,n){return e-n}),e[e.length-1]-e[0]},calcribbonThicknessLevel:function(e){if(e)return e>26?1:e>23&&e<=26?2:e>20&&e<=23?3:e>18&&e<=20?4:e>16&&e<=18?5:e>14&&e<=16?6:e>12&&e<=14?7:e<=12?8:void 0},setStoredType:function(e){var n=!0,i=!0,t=e.ribbonThickness,o=e.orderThickness;if(o.indexOf("≤")>-1)t>parseInt(o.substr(1))&&(n=!1);else if(o.indexOf("-")>-1){var s=o.split("-")[1];(t<o.split("-")[0]||t>s)&&(n=!1)}var r=e.laminationFactor,l=e.orderLaminationFactor;if(l.indexOf("≥")>-1)r<parseInt(l.substr(1))&&(n=!1);else if(l.indexOf("-")>-1){var a=l.split("-")[1];(r<l.split("-")[0]||r>a)&&(n=!1)}var b=e.ribbonToughnessLevel;e.orderRibbonToughnessLevels.includes(b)||(n=!1);var c=e.appearenceLevel;if(e.orderAppearenceLevels.includes(c)||(n=!1),n)return 1;var h=e.qualifiedThickness;if(h.indexOf("≤")>-1)t>parseInt(h.substr(1))&&(i=!1);else if(h.indexOf("-")>-1){var u=h.split("-")[1];(t<h.split("-")[0]||t>u)&&(i=!1)}var p=e.qualifiedLaminationFactor;if(p.indexOf("≥")>-1)r<parseInt(p.substr(1))&&(i=!1);else if(p.indexOf("-")>-1){var v=p.split("-")[1];(r<p.split("-")[0]||r>v)&&(i=!1)}return e.qualifiedRibbonToughnessLevels.includes(b)||(i=!1),e.qualifiedAppearenceLevels.includes(c)||(i=!1),i?2:3},exportExcel:function(){var e={startTime:this.searchForm.date[0],endTime:this.searchForm.date[1],caster:this.searchForm.caster,furnace:this.searchForm.furnace,ribbonTypeNameJson:r()(this.searchForm.ribbonTypeNames),ribbonWidthJson:r()(this.searchForm.ribbonWidths),ribbonThicknessLevelJson:r()(this.searchForm.ribbonThicknessLevels),laminationLevelJson:r()(this.searchForm.laminationLevels),ribbonToughnessLevelJson:r()(this.searchForm.ribbonToughnessLevels),appearenceLevelJson:r()(this.searchForm.appearenceLevels)},n=u.a.exportMeasure+"?"+c.a.stringify(e);window.open(n)},setSelectable:function(e,n){return!(![1,2,4].includes(e.isStored)||e.isMeasureConfirmed)},handleSelectionChange:function(e){this.multipleSelection=e},measureConfirm:function(){var e=this;if(0===this.multipleSelection.length)return this.$alert("请选择要入库的带材","提示",{type:"warning"});this.multipleSelection.forEach(function(e){e.isMeasureConfirmed=1}),this.$http("PUT",u.a.updateReturnGoods,{dataJson:r()(this.multipleSelection)}).then(function(n){e.getTableData()}).catch(function(e){console.log(e)})}})},m={render:function(){var e=this,n=e.$createElement,i=e._self._c||n;return i("div",[i("el-breadcrumb",{staticClass:"crumb",attrs:{"separator-class":"el-icon-arrow-right"}},[i("el-breadcrumb-item",[e._v("退货处理")]),e._v(" "),i("el-breadcrumb-item",[e._v("退货记录")])],1),e._v(" "),i("Collapse",[i("el-form",{staticClass:"search_bar",attrs:{model:e.searchForm,inline:!0}},[i("el-form-item",{attrs:{label:"生产日期："}},[i("el-date-picker",{attrs:{type:"daterange","default-time":["00:00:00","23:59:59"],clearable:!1,"start-placeholder":"开始日期","end-placeholder":"结束日期"},model:{value:e.searchForm.date,callback:function(n){e.$set(e.searchForm,"date",n)},expression:"searchForm.date"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"喷带手："}},[i("el-input",{attrs:{placeholder:"请输入喷带手姓名"},model:{value:e.searchForm.caster,callback:function(n){e.$set(e.searchForm,"caster",n)},expression:"searchForm.caster"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"炉号："}},[i("el-input",{attrs:{placeholder:"请输入炉号"},model:{value:e.searchForm.furnace,callback:function(n){e.$set(e.searchForm,"furnace",n)},expression:"searchForm.furnace"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"材质："}},[i("el-select",{attrs:{placeholder:"请选择",multiple:"","collapse-tags":""},model:{value:e.searchForm.ribbonTypeNames,callback:function(n){e.$set(e.searchForm,"ribbonTypeNames",n)},expression:"searchForm.ribbonTypeNames"}},e._l(e.ribbonTypeList,function(e){return i("el-option",{key:e.ribbonTypeId,attrs:{value:e.ribbonTypeName,label:e.ribbonTypeName}})}),1)],1),e._v(" "),i("el-form-item",{attrs:{label:"规格："}},[i("el-select",{attrs:{placeholder:"请选择",multiple:"","collapse-tags":""},model:{value:e.searchForm.ribbonWidths,callback:function(n){e.$set(e.searchForm,"ribbonWidths",n)},expression:"searchForm.ribbonWidths"}},e._l(e.ribbonWidthList,function(e){return i("el-option",{key:e.ribbonWidthId,attrs:{label:e.ribbonWidth,value:e.ribbonWidth}})}),1)],1),e._v(" "),i("el-form-item",{attrs:{label:"厚度级别："}},[i("el-select",{attrs:{placeholder:"请选择",multiple:"","collapse-tags":""},model:{value:e.searchForm.ribbonThicknessLevels,callback:function(n){e.$set(e.searchForm,"ribbonThicknessLevels",n)},expression:"searchForm.ribbonThicknessLevels"}},e._l(e.ribbonThicknessLevelList,function(e){return i("el-option",{key:e.ribbonThicknessLevelId,attrs:{label:e.ribbonThicknessLevel,value:e.ribbonThicknessLevel}})}),1)],1),e._v(" "),i("el-form-item",{attrs:{label:"叠片级别："}},[i("el-select",{attrs:{placeholder:"请选择",multiple:"","collapse-tags":""},model:{value:e.searchForm.laminationLevels,callback:function(n){e.$set(e.searchForm,"laminationLevels",n)},expression:"searchForm.laminationLevels"}},e._l(e.laminationLevelList,function(e){return i("el-option",{key:e.laminationLevelId,attrs:{label:e.laminationLevel,value:e.laminationLevel}})}),1)],1),e._v(" "),i("el-form-item",{attrs:{label:"韧性级别："}},[i("el-select",{attrs:{placeholder:"请选择",multiple:"","collapse-tags":""},model:{value:e.searchForm.ribbonToughnessLevels,callback:function(n){e.$set(e.searchForm,"ribbonToughnessLevels",n)},expression:"searchForm.ribbonToughnessLevels"}},e._l(e.ribbonToughnessLevelList,function(e){return i("el-option",{key:e.ribbonToughnessLevelId,attrs:{label:e.ribbonToughnessLevel,value:e.ribbonToughnessLevel}})}),1)],1),e._v(" "),i("el-form-item",{attrs:{label:"外观级别："}},[i("el-select",{attrs:{placeholder:"请选择",multiple:"","collapse-tags":""},model:{value:e.searchForm.appearenceLevels,callback:function(n){e.$set(e.searchForm,"appearenceLevels",n)},expression:"searchForm.appearenceLevels"}},[i("el-option",{attrs:{label:"A",value:"A"}}),e._v(" "),i("el-option",{attrs:{label:"B",value:"B"}}),e._v(" "),i("el-option",{attrs:{label:"C",value:"C"}}),e._v(" "),i("el-option",{attrs:{label:"不合格",value:"不合格"}})],1)],1),e._v(" "),i("el-form-item",[i("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:e.clickSearch}},[e._v("搜索")]),e._v(" "),i("el-button",{attrs:{type:"primary",icon:"el-icon-refresh"},on:{click:e.reset}},[e._v("重置")])],1)],1)],1),e._v(" "),i("div",{staticClass:"main_bd"},[i("el-col",{staticClass:"table_hd"},[e.isBatchInStored?i("el-button",{attrs:{type:"primary",icon:"el-icon-success"},on:{click:e.measureConfirm}},[e._v("确认入库")]):e._e()],1),e._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",staticStyle:{width:"100%"},attrs:{data:e.tableData,stripe:"",border:"",height:e.tableHeight},on:{"selection-change":e.handleSelectionChange}},[i("el-table-column",{attrs:{type:"selection",width:"30",selectable:e.setSelectable}}),e._v(" "),i("el-table-column",{attrs:{prop:"furnace",label:"炉号",align:"center",width:"170px",fixed:""}}),e._v(" "),i("el-table-column",{attrs:{prop:"coilNumber",label:"盘号",align:"center",width:"50px",fixed:""}}),e._v(" "),i("el-table-column",{attrs:{prop:"ribbonTypeName",label:"材质",align:"center",width:"70px"}}),e._v(" "),i("el-table-column",{attrs:{prop:"ribbonWidth",label:"规格",align:"center",width:"50px"}}),e._v(" "),i("el-table-column",{attrs:{prop:"castDate",label:"生产日期",align:"center",formatter:e.dateFormat,width:"110px"}}),e._v(" "),i("el-table-column",{attrs:{prop:"caster",label:"喷带手",align:"center",width:"70px"}}),e._v(" "),i("el-table-column",{attrs:{prop:"diameter",label:"外径(mm)",align:"center",width:"90px"}}),e._v(" "),i("el-table-column",{attrs:{prop:"coilWeight",label:"重量(kg)",align:"center",width:"90px"}}),e._v(" "),i("el-table-column",{attrs:{prop:"laminationFactor",label:"叠片系数",align:"center",width:"80px"}}),e._v(" "),i("el-table-column",{attrs:{prop:"laminationLevel",label:"叠片等级",align:"center",width:"80px"}}),e._v(" "),i("el-table-column",{attrs:{prop:"realRibbonWidth",label:"实际带宽",align:"center",width:"80px"},scopedSlots:e._u([{key:"default",fn:function(n){return[!1===n.row.isEditing?i("div",[e._v("\n            "+e._s(n.row.realRibbonWidth)+"\n          ")]):i("div",[i("el-input",{attrs:{size:"mini"},model:{value:n.row.realRibbonWidth,callback:function(i){e.$set(n.row,"realRibbonWidth",i)},expression:"scope.row.realRibbonWidth"}})],1)]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"ribbonThickness1",label:"带厚1(μm)",align:"center",width:"90px"},scopedSlots:e._u([{key:"default",fn:function(n){return[!1===n.row.isEditing?i("div",[e._v("\n            "+e._s(n.row.ribbonThickness1)+"\n          ")]):i("div",[i("el-input",{attrs:{size:"mini"},nativeOn:{keyup:function(i){return function(i){return e.thicknessChangeHandler(i,n.row)}(i)}},model:{value:n.row.ribbonThickness1,callback:function(i){e.$set(n.row,"ribbonThickness1",i)},expression:"scope.row.ribbonThickness1"}})],1)]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"ribbonThickness2",label:"带厚2(μm)",align:"center",width:"90px"},scopedSlots:e._u([{key:"default",fn:function(n){return[!1===n.row.isEditing?i("div",[e._v("\n            "+e._s(n.row.ribbonThickness2)+"\n          ")]):i("div",[i("el-input",{attrs:{size:"mini"},nativeOn:{keyup:function(i){return function(i){return e.thicknessChangeHandler(i,n.row)}(i)}},model:{value:n.row.ribbonThickness2,callback:function(i){e.$set(n.row,"ribbonThickness2",i)},expression:"scope.row.ribbonThickness2"}})],1)]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"ribbonThickness3",label:"带厚3(μm)",align:"center",width:"90px"},scopedSlots:e._u([{key:"default",fn:function(n){return[!1===n.row.isEditing?i("div",[e._v("\n            "+e._s(n.row.ribbonThickness3)+"\n          ")]):i("div",[i("el-input",{attrs:{size:"mini"},nativeOn:{keyup:function(i){return function(i){return e.thicknessChangeHandler(i,n.row)}(i)}},model:{value:n.row.ribbonThickness3,callback:function(i){e.$set(n.row,"ribbonThickness3",i)},expression:"scope.row.ribbonThickness3"}})],1)]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"ribbonThickness4",label:"带厚4(μm)",align:"center",width:"90px"},scopedSlots:e._u([{key:"default",fn:function(n){return[!1===n.row.isEditing?i("div",[e._v("\n            "+e._s(n.row.ribbonThickness4)+"\n          ")]):i("div",[i("el-input",{attrs:{size:"mini"},nativeOn:{keyup:function(i){return function(i){return e.thicknessChangeHandler(i,n.row)}(i)}},model:{value:n.row.ribbonThickness4,callback:function(i){e.$set(n.row,"ribbonThickness4",i)},expression:"scope.row.ribbonThickness4"}})],1)]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"ribbonThickness5",label:"带厚5(μm)",align:"center",width:"90px"},scopedSlots:e._u([{key:"default",fn:function(n){return[!1===n.row.isEditing?i("div",[e._v("\n            "+e._s(n.row.ribbonThickness5)+"\n          ")]):i("div",[i("el-input",{attrs:{size:"mini"},nativeOn:{keyup:function(i){return function(i){return e.thicknessChangeHandler(i,n.row)}(i)}},model:{value:n.row.ribbonThickness5,callback:function(i){e.$set(n.row,"ribbonThickness5",i)},expression:"scope.row.ribbonThickness5"}})],1)]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"ribbonThickness6",label:"带厚6(μm)",align:"center",width:"90px"},scopedSlots:e._u([{key:"default",fn:function(n){return[!1===n.row.isEditing?i("div",[e._v("\n            "+e._s(n.row.ribbonThickness6)+"\n          ")]):i("div",[i("el-input",{attrs:{size:"mini"},nativeOn:{keyup:function(i){return function(i){return e.thicknessChangeHandler(i,n.row)}(i)}},model:{value:n.row.ribbonThickness6,callback:function(i){e.$set(n.row,"ribbonThickness6",i)},expression:"scope.row.ribbonThickness6"}})],1)]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"ribbonThickness7",label:"带厚7(μm)",align:"center",width:"90px"},scopedSlots:e._u([{key:"default",fn:function(n){return[!1===n.row.isEditing?i("div",[e._v("\n            "+e._s(n.row.ribbonThickness7)+"\n          ")]):i("div",[i("el-input",{attrs:{size:"mini"},nativeOn:{keyup:function(i){return function(i){return e.thicknessChangeHandler(i,n.row)}(i)}},model:{value:n.row.ribbonThickness7,callback:function(i){e.$set(n.row,"ribbonThickness7",i)},expression:"scope.row.ribbonThickness7"}})],1)]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"ribbonThickness8",label:"带厚8(μm)",align:"center",width:"90px"},scopedSlots:e._u([{key:"default",fn:function(n){return[!1===n.row.isEditing?i("div",[e._v("\n            "+e._s(n.row.ribbonThickness8)+"\n          ")]):i("div",[i("el-input",{attrs:{size:"mini"},nativeOn:{keyup:function(i){return function(i){return e.thicknessChangeHandler(i,n.row)}(i)}},model:{value:n.row.ribbonThickness8,callback:function(i){e.$set(n.row,"ribbonThickness8",i)},expression:"scope.row.ribbonThickness8"}})],1)]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"ribbonThickness9",label:"带厚9(μm)",align:"center",width:"90px"},scopedSlots:e._u([{key:"default",fn:function(n){return[!1===n.row.isEditing?i("div",[e._v("\n            "+e._s(n.row.ribbonThickness9)+"\n          ")]):i("div",[i("el-input",{attrs:{size:"mini"},nativeOn:{keyup:function(i){return function(i){return e.thicknessChangeHandler(i,n.row)}(i)}},model:{value:n.row.ribbonThickness9,callback:function(i){e.$set(n.row,"ribbonThickness9",i)},expression:"scope.row.ribbonThickness9"}})],1)]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"ribbonThicknessDeviation",label:"厚度偏差(μm)",align:"center",width:"110px"}}),e._v(" "),i("el-table-column",{attrs:{prop:"ribbonThickness",label:"平均厚度(μm)",align:"center",width:"110px"}}),e._v(" "),i("el-table-column",{attrs:{prop:"ribbonThicknessLevel",label:"厚度级别",align:"center",width:"90px"}}),e._v(" "),i("el-table-column",{attrs:{prop:"ribbonToughness",label:"韧性",align:"center",width:"90px"},scopedSlots:e._u([{key:"default",fn:function(n){return[!1===n.row.isEditing?i("div",[e._v("\n            "+e._s(n.row.ribbonToughness)+"\n          ")]):i("div",[i("el-select",{attrs:{size:"mini",placeholder:""},model:{value:n.row.ribbonToughness,callback:function(i){e.$set(n.row,"ribbonToughness",i)},expression:"scope.row.ribbonToughness"}},e._l(e.ribbonToughnessLevelList,function(e){return i("el-option",{key:e._id,attrs:{label:e.ribbonToughness,value:e.ribbonToughness}})}),1)],1)]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"ribbonToughnessLevel",label:"韧性等级",align:"center",width:"90px"}}),e._v(" "),i("el-table-column",{attrs:{prop:"appearence",label:"外观",align:"center",width:"90px"},scopedSlots:e._u([{key:"default",fn:function(n){return[!1===n.row.isEditing?i("div",[e._v("\n            "+e._s(n.row.appearence)+"\n          ")]):i("div",[i("el-select",{attrs:{size:"mini",placeholder:""},model:{value:n.row.appearence,callback:function(i){e.$set(n.row,"appearence",i)},expression:"scope.row.appearence"}},[i("el-option",{attrs:{label:"无明显缺陷",value:"无明显缺陷"}}),e._v(" "),i("el-option",{attrs:{label:"轻棱",value:"轻棱"}}),e._v(" "),i("el-option",{attrs:{label:"棱",value:"棱"}}),e._v(" "),i("el-option",{attrs:{label:"轻微麻点",value:"轻微麻点"}}),e._v(" "),i("el-option",{attrs:{label:"麻点",value:"麻点"}}),e._v(" "),i("el-option",{attrs:{label:"轻微划痕",value:"轻微划痕"}}),e._v(" "),i("el-option",{attrs:{label:"划痕",value:"划痕"}}),e._v(" "),i("el-option",{attrs:{label:"轻微挖心",value:"轻微挖心"}}),e._v(" "),i("el-option",{attrs:{label:"挖心",value:"挖心"}}),e._v(" "),i("el-option",{attrs:{label:"少量劈裂",value:"少量劈裂"}}),e._v(" "),i("el-option",{attrs:{label:"大量劈裂",value:"大量劈裂"}}),e._v(" "),i("el-option",{attrs:{label:"端面损坏",value:"端面损坏"}})],1)],1)]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"appearenceLevel",label:"外观等级",align:"center",width:"90px"},scopedSlots:e._u([{key:"default",fn:function(n){return[!1===n.row.isEditing?i("div",[e._v("\n            "+e._s(n.row.appearenceLevel)+"\n          ")]):i("div",[i("el-select",{attrs:{size:"mini",placeholder:""},model:{value:n.row.appearenceLevel,callback:function(i){e.$set(n.row,"appearenceLevel",i)},expression:"scope.row.appearenceLevel"}},[i("el-option",{attrs:{label:"A",value:"A"}}),e._v(" "),i("el-option",{attrs:{label:"B",value:"B"}}),e._v(" "),i("el-option",{attrs:{label:"C",value:"C"}}),e._v(" "),i("el-option",{attrs:{label:"不合格",value:"不合格"}})],1)],1)]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"ribbonTotalLevel",label:"综合级别",align:"center",width:"90px"},scopedSlots:e._u([{key:"default",fn:function(n){return[i("span",{class:"不合格"===n.row.ribbonTotalLevel?"text_danger":""},[e._v(e._s(n.row.ribbonTotalLevel))])]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"isStored",label:"是否入库",align:"center",width:"100px"},scopedSlots:e._u([{key:"default",fn:function(n){return[1===n.row.isMeasureConfirmed?i("div",[1===n.row.isStored?i("span",[e._v("计划内入库")]):e._e(),e._v(" "),2===n.row.isStored?i("span",[e._v("计划外入库")]):e._e(),e._v(" "),3===n.row.isStored?i("span",{staticClass:"text_danger"},[e._v("否")]):e._e(),e._v(" "),4===n.row.isStored?i("span",{staticClass:"text_warn"},[e._v("退货入库")]):e._e()]):e._e()]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"unStoreReason",label:"不入库原因",align:"center",width:"100px","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(n){return[!1===n.row.isEditing?i("div",{staticClass:"text_danger"},[e._v("\n            "+e._s(n.row.unStoreReason)+"\n          ")]):i("div",[i("el-input",{attrs:{size:"mini"},model:{value:n.row.unStoreReason,callback:function(i){e.$set(n.row,"unStoreReason",i)},expression:"scope.row.unStoreReason"}})],1)]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"clients",label:"判定去向",align:"center",width:"120px","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(n){return[!1===n.row.isEditing?i("div",[e._v("\n            "+e._s(n.row.clients?n.row.clients.toString():"")+"\n          ")]):i("div",[i("el-select",{attrs:{size:"mini",placeholder:"",multiple:"","collapse-tags":""},model:{value:n.row.clients,callback:function(i){e.$set(n.row,"clients",i)},expression:"scope.row.clients"}},[i("el-option",{attrs:{label:"F",value:"F"}}),e._v(" "),i("el-option",{attrs:{label:"D",value:"D"}}),e._v(" "),i("el-option",{attrs:{label:"VM",value:"VM"}}),e._v(" "),i("el-option",{attrs:{label:"VS",value:"VS"}}),e._v(" "),i("el-option",{attrs:{label:"VD",value:"VD"}}),e._v(" "),i("el-option",{attrs:{label:"O",value:"O"}}),e._v(" "),i("el-option",{attrs:{label:"Z",value:"Z"}})],1)],1)]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"measureDate",label:"检测时间",align:"center",width:"120px",formatter:e.dateTimeFormat,"show-overflow-tooltip":!0}})],1),e._v(" "),i("el-pagination",{attrs:{background:"",layout:"total,prev,pager,next",total:e.pageConfig.total,"current-page":e.pageConfig.current,"page-size":e.pageConfig.pageSize},on:{"update:currentPage":function(n){return e.$set(e.pageConfig,"current",n)},"update:current-page":function(n){return e.$set(e.pageConfig,"current",n)},"current-change":e.handleCurrentChange}})],1)],1)},staticRenderFns:[]};var f=i("VU/8")(d,m,!1,function(e){i("7Gne")},"data-v-e70cfaae",null);n.default=f.exports}});
//# sourceMappingURL=returnRecord.28976b2b89ff12715f6b.js.map