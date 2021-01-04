webpackJsonp([12],{"GD+g":function(e,t){},VXxv:function(e,t){},YjKU:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=a("X2Oc"),r=a("g7mi"),i=a("mvHQ"),o=a.n(i),s=a("woOf"),n=a.n(s),c=a("Dd8w"),d=a.n(c),u=a("E4LH"),m=a("NYxO"),p=a("M4fF"),b={date:"",castId:null,team:"",taskOrder:"",ribbonTypeName:"",ribbonWidth:null,client:"",furnace:"",theBeginfurnace:"",heatNum:null,alloyWeight:null,castTime:"",rawWeight:null,remark:"计划喷带12炉，如果有富余时间喷带按照当天最后一炉规定的要求生产。",fileNumber:"",orderThickness:"",orderLaminationFactor:"",orderRibbonToughnessLevels:[],orderAppearenceLevels:[],qualifiedDemands:[{qualifiedThickness:"",qualifiedLaminationFactor:"",qualifiedRibbonToughnessLevels:[],qualifiedAppearenceLevels:[]}]},f={props:{dialogData:{type:Object,required:!0}},data:function(){var e=function(e,t,a){if(!t)return a(new Error("炉号不能为空"));/^0[1-9]-[0-9]{8}-[0-9]{2}$/.test(t)?a():a(new Error("炉号格式错误"))};return{roleId:null,visible:!1,loading:!1,formData:{date:"",castId:null,team:"",taskOrder:"",ribbonTypeName:"",ribbonWidth:null,client:"",furnace:"",theBeginfurnace:"",heatNum:null,alloyWeight:null,castTime:"",rawWeight:null,remark:"",fileNumber:"",orderThickness:"",orderLaminationFactor:"",orderRibbonToughnessLevels:[],orderAppearenceLevels:[],qualifiedDemands:[{qualifiedThickness:"",qualifiedLaminationFactor:"",qualifiedRibbonToughnessLevels:[],qualifiedAppearenceLevels:[]}]},rules:{date:[{required:!0,message:"请选择日期",trigger:"blur"}],castId:[{required:!0,message:"请选择机组",trigger:"blur"}],team:[{required:!0,message:"请选择班次",trigger:"blur"}],ribbonTypeName:[{required:!0,message:"请选择材质",trigger:"blur"}],ribbonWidth:[{required:!0,message:"请填写带宽",trigger:"blur"},{validator:u.f,trigger:"blur"},{validator:Object(u.d)(99999),trigger:"blur"}],client:[{max:50,message:"最多50位字符",trigger:"blur"}],furnace:[{required:!0,message:"请填写炉号",trigger:"blur"},{max:20,message:"最多20位字符",trigger:"blur"},{validator:e,trigger:"blur"}],theBeginfurnace:[{required:!0,message:"请填写开始炉号",trigger:"blur"},{max:20,message:"最多20位字符",trigger:"blur"},{validator:e,trigger:"blur"}],heatNum:[{required:!0,message:"请填写计划炉次",trigger:"blur"},{validator:u.f,trigger:"blur"},{validator:Object(u.d)(99999),trigger:"blur"}],alloyWeight:[{required:!0,message:"请填写单炉投入重量",trigger:"blur"},{validator:u.f,trigger:"blur"},{validator:Object(u.d)(99999),trigger:"blur"}],castTime:[{max:50,message:"最多50位字符",trigger:"blur"}],remark:[{max:100,message:"最多100位字符",trigger:"blur"}],fileNumber:[{max:50,message:"最多50位字符",trigger:"blur"}],orderThickness:[{required:!0,message:"请填写带厚",trigger:"blur"},{max:50,message:"最多50位字符",trigger:"blur"},{pattern:/^([1-3]\d-[1-3]\d|≤[1-3]\d)$/,message:"格式错误，20-23或者≤23",trigger:"blur"}],orderLaminationFactor:[{required:!0,message:"请选择叠片系数",trigger:"blur"}],orderRibbonToughnessLevels:[{required:!0,message:"请选择韧性等级",trigger:"blur"}],orderAppearenceLevels:[{required:!0,message:"请选择外观等级",trigger:"blur"}]}}},computed:d()({},Object(m.c)(["ribbonTypeList","ribbonWidthList","ribbonToughnessLevelList"])),created:function(){"create"===this.dialogData.formType?this.formData=n()({},b,{castId:Number(this.$route.params.castId)}):this.formData=n()(this.formData,this.dialogData.rowData),this.roleId=JSON.parse(localStorage.getItem("userinfo")).roleId,this.getRibbonTypeList(),this.getRibbonWidthList(),this.getRibbonToughnessLevelList()},methods:d()({pick:function(){var e=this.formData.date.replace(/-/g,"");this.formData.theBeginfurnace="0"+this.formData.castId+"-"+e+"-01"}},Object(m.b)(["getRibbonTypeList","getRibbonWidthList","getRibbonToughnessLevelList"]),{closeDialog:function(){this.$emit("close")},addRequirement:function(){this.formData.qualifiedDemands.length<2&&this.formData.qualifiedDemands.push({qualifiedThickness:"",qualifiedLaminationFactor:"",qualifiedRibbonToughnessLevels:[],qualifiedAppearenceLevels:[]})},delRequirement:function(){2===this.formData.qualifiedDemands.length&&this.formData.qualifiedDemands.pop()},submitForm:function(){var e=this;this.$refs.form.validate(function(t){if(!t)return!1;e.loading=!0;var a="",l="",i=null;if("create"===e.dialogData.formType){a="post",l=r.a.addPlan;for(var s=[],n=e.formData.heatNum,c=e.formData.theBeginfurnace.substring(0,12),d=e.formData.theBeginfurnace.substring(12,14);n>0;){n--;var u=Object(p.cloneDeep)(e.formData);u.furnace=c+d,u.castTime=e.setCastTime(d),u.roleId=e.roleId,u.orderRibbonToughnessLevels=u.orderRibbonToughnessLevels.join(),u.orderAppearenceLevels=u.orderAppearenceLevels.join(),u.qualifiedDemands=o()(u.qualifiedDemands),s.push(u),d=Number(d)+1<10?"0"+(Number(d)+1):Number(d)+1}i={formDataJson:o()(s)}}else{a="put",l=r.a.updatePlan;var m=Object(p.cloneDeep)(e.formData);m.roleId=e.roleId,m.orderRibbonToughnessLevels=m.orderRibbonToughnessLevels.join(),m.orderAppearenceLevels=m.orderAppearenceLevels.join(),m.qualifiedDemands=o()(m.qualifiedDemands),i=m}e.$http(a,l,i).then(function(t){e.$emit("submit")}).catch(function(e){console.log(e)}).finally(function(){e.loading=!1})})},setCastTime:function(e){var t="";switch(Number(e)){case 1:t="08:00-10:00";break;case 2:t="10:00-12:00";break;case 3:t="12:00-14:00";break;case 4:t="14:00-16:00";break;case 5:t="16:00-18:00";break;case 6:t="18:00-20:00";break;case 7:t="20:00-22:00";break;case 8:t="22:00-24:00";break;case 9:t="00:00-02:00";break;case 10:t="02:00-04:00";break;case 11:t="04:00-06:00";break;case 12:t="06:00-08:00"}return t}})},g={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{title:"create"===e.dialogData.formType?"新增生产计划-"+e.$route.params.castId+"号机组":"修改生产计划-"+e.$route.params.castId+"号机组",visible:e.dialogData.dialogVisible,"close-on-click-modal":!1,"close-on-press-escape":!1,center:!0,width:"1200px","element-loading-text":"拼命加载中"},on:{"update:visible":function(t){return e.$set(e.dialogData,"dialogVisible",t)},close:e.closeDialog}},[a("el-form",{ref:"form",attrs:{model:e.formData,rules:e.rules,"label-width":"100px"},nativeOn:{submit:function(e){e.preventDefault()}}},[a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"日期",prop:"date"}},[a("el-date-picker",{attrs:{type:"date","value-format":"yyyy-MM-dd",placeholder:"选择日期",editable:!1,clearable:!1},on:{change:e.pick},model:{value:e.formData.date,callback:function(t){e.$set(e.formData,"date",t)},expression:"formData.date"}})],1)],1),e._v(" "),a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"客户",prop:"client"}},[a("el-input",{model:{value:e.formData.client,callback:function(t){e.$set(e.formData,"client",t)},expression:"formData.client"}})],1)],1),e._v(" "),a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"班次",prop:"team"}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.formData.team,callback:function(t){e.$set(e.formData,"team",t)},expression:"formData.team"}},[a("el-option",{attrs:{label:"早班",value:"早"}}),e._v(" "),a("el-option",{attrs:{label:"中班",value:"中"}}),e._v(" "),a("el-option",{attrs:{label:"夜班",value:"夜"}})],1)],1)],1),e._v(" "),a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"任务单号",prop:"taskOrder"}},[a("el-input",{model:{value:e.formData.taskOrder,callback:function(t){e.$set(e.formData,"taskOrder",t)},expression:"formData.taskOrder"}})],1)],1)],1),e._v(" "),a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"材质",prop:"ribbonTypeName"}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.formData.ribbonTypeName,callback:function(t){e.$set(e.formData,"ribbonTypeName",t)},expression:"formData.ribbonTypeName"}},e._l(e.ribbonTypeList,function(e){return a("el-option",{key:e.ribbonTypeId,attrs:{label:e.ribbonTypeName,value:e.ribbonTypeName}})}),1)],1)],1),e._v(" "),a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"规格",prop:"ribbonWidth"}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.formData.ribbonWidth,callback:function(t){e.$set(e.formData,"ribbonWidth",t)},expression:"formData.ribbonWidth"}},e._l(e.ribbonWidthList,function(e){return a("el-option",{key:e.ribbonWidthId,attrs:{label:e.ribbonWidth,value:e.ribbonWidth}})}),1)],1)],1),e._v(" "),"create"===e.dialogData.formType?a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"开始炉号",prop:"theBeginfurnace"}},[a("el-input",{model:{value:e.formData.theBeginfurnace,callback:function(t){e.$set(e.formData,"theBeginfurnace",t)},expression:"formData.theBeginfurnace"}})],1)],1):e._e(),e._v(" "),"create"===e.dialogData.formType?a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"计划炉次",prop:"heatNum"}},[a("el-input",{model:{value:e.formData.heatNum,callback:function(t){e.$set(e.formData,"heatNum",t)},expression:"formData.heatNum"}})],1)],1):e._e(),e._v(" "),"edit"===e.dialogData.formType?a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"制带炉号",prop:"furnace"}},[a("el-input",{model:{value:e.formData.furnace,callback:function(t){e.$set(e.formData,"furnace",t)},expression:"formData.furnace"}})],1)],1):e._e(),e._v(" "),"edit"===e.dialogData.formType?a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"喷带时间",prop:"castTime"}},[a("el-input",{model:{value:e.formData.castTime,callback:function(t){e.$set(e.formData,"castTime",t)},expression:"formData.castTime"}})],1)],1):e._e()],1),e._v(" "),a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"单炉投入",prop:"alloyWeight"}},[a("el-input",{model:{value:e.formData.alloyWeight,callback:function(t){e.$set(e.formData,"alloyWeight",t)},expression:"formData.alloyWeight"}})],1)],1),e._v(" "),a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"文件编号",prop:"fileNumber"}},[a("el-input",{model:{value:e.formData.fileNumber,callback:function(t){e.$set(e.formData,"fileNumber",t)},expression:"formData.fileNumber"}})],1)],1),e._v(" "),a("el-col",{attrs:{span:12}},[a("el-form-item",{staticClass:"dialog_field orign_field",attrs:{label:"备注",prop:"remark"}},[a("el-input",{model:{value:e.formData.remark,callback:function(t){e.$set(e.formData,"remark",t)},expression:"formData.remark"}})],1)],1)],1),e._v(" "),a("section",{staticClass:"requirement_detail"},[a("h3",{staticClass:"requirement_hd"},[e._v("订单要求")]),e._v(" "),a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"带厚(μm)",prop:"orderThickness"}},[a("el-input",{model:{value:e.formData.orderThickness,callback:function(t){e.$set(e.formData,"orderThickness",t)},expression:"formData.orderThickness"}})],1)],1),e._v(" "),a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"叠片系数",prop:"orderLaminationFactor"}},[a("el-select",{attrs:{placeholder:""},model:{value:e.formData.orderLaminationFactor,callback:function(t){e.$set(e.formData,"orderLaminationFactor",t)},expression:"formData.orderLaminationFactor"}},[a("el-option",{attrs:{label:"≥0.72",value:"≥0.72"}}),e._v(" "),a("el-option",{attrs:{label:"≥0.75",value:"≥0.75"}}),e._v(" "),a("el-option",{attrs:{label:"≥0.78",value:"≥0.78"}}),e._v(" "),a("el-option",{attrs:{label:"≥0.80",value:"≥0.80"}}),e._v(" "),a("el-option",{attrs:{label:"≥0.82",value:"≥0.82"}}),e._v(" "),a("el-option",{attrs:{label:"≥0.84",value:"≥0.84"}})],1)],1)],1),e._v(" "),a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"韧性",prop:"orderRibbonToughnessLevels"}},[a("el-select",{attrs:{placeholder:"",multiple:"","collapse-tags":""},model:{value:e.formData.orderRibbonToughnessLevels,callback:function(t){e.$set(e.formData,"orderRibbonToughnessLevels",t)},expression:"formData.orderRibbonToughnessLevels"}},e._l(e.ribbonToughnessLevelList,function(e){return a("el-option",{key:e.ribbonToughnessLevelId,attrs:{label:e.ribbonToughnessLevel,value:e.ribbonToughnessLevel}})}),1)],1)],1),e._v(" "),a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"外观",prop:"orderAppearenceLevels"}},[a("el-select",{attrs:{placeholder:"",multiple:"","collapse-tags":""},model:{value:e.formData.orderAppearenceLevels,callback:function(t){e.$set(e.formData,"orderAppearenceLevels",t)},expression:"formData.orderAppearenceLevels"}},[a("el-option",{attrs:{label:"A",value:"A"}}),e._v(" "),a("el-option",{attrs:{label:"B",value:"B"}}),e._v(" "),a("el-option",{attrs:{label:"C",value:"C"}})],1)],1)],1)],1)],1),e._v(" "),a("section",{staticClass:"requirement_detail"},[a("h3",{staticClass:"requirement_hd"},[e._v("此类带材入库规范"),a("i",{staticClass:"el-icon-circle-plus",on:{click:e.addRequirement}})]),e._v(" "),e._l(e.formData.qualifiedDemands,function(t,l){return a("el-row",{key:l,staticClass:"requirement_row",attrs:{gutter:20}},[a("i",{staticClass:"el-icon-remove",on:{click:e.delRequirement}}),e._v(" "),a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"带厚(μm)",prop:"qualifiedDemands."+l+".qualifiedThickness",rules:[{required:!0,message:"请填写带厚",trigger:"blur"},{max:50,message:"最多50位字符",trigger:"blur"},{pattern:/^([1-3]\d-[1-3]\d|≤[1-3]\d)$/,message:"格式错误，20-23或者≤23",trigger:"blur"}]}},[a("el-input",{model:{value:t.qualifiedThickness,callback:function(a){e.$set(t,"qualifiedThickness",a)},expression:"item.qualifiedThickness"}})],1)],1),e._v(" "),a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"叠片系数",prop:"qualifiedDemands."+l+".qualifiedLaminationFactor",rules:[{required:!0,message:"请选择叠片系数",trigger:"blur"}]}},[a("el-select",{attrs:{placeholder:""},model:{value:t.qualifiedLaminationFactor,callback:function(a){e.$set(t,"qualifiedLaminationFactor",a)},expression:"item.qualifiedLaminationFactor"}},[a("el-option",{attrs:{label:"≥0.72",value:"≥0.72"}}),e._v(" "),a("el-option",{attrs:{label:"≥0.75",value:"≥0.75"}}),e._v(" "),a("el-option",{attrs:{label:"≥0.78",value:"≥0.78"}}),e._v(" "),a("el-option",{attrs:{label:"≥0.80",value:"≥0.80"}}),e._v(" "),a("el-option",{attrs:{label:"≥0.82",value:"≥0.82"}}),e._v(" "),a("el-option",{attrs:{label:"≥0.84",value:"≥0.84"}})],1)],1)],1),e._v(" "),a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"韧性",prop:"qualifiedDemands."+l+".qualifiedRibbonToughnessLevels",rules:[{required:!0,message:"请选择韧性",trigger:"blur"}]}},[a("el-select",{attrs:{placeholder:"",multiple:"","collapse-tags":""},model:{value:t.qualifiedRibbonToughnessLevels,callback:function(a){e.$set(t,"qualifiedRibbonToughnessLevels",a)},expression:"item.qualifiedRibbonToughnessLevels"}},e._l(e.ribbonToughnessLevelList,function(e){return a("el-option",{key:e.ribbonToughnessLevelId,attrs:{label:e.ribbonToughnessLevel,value:e.ribbonToughnessLevel}})}),1)],1)],1),e._v(" "),a("el-col",{attrs:{span:6}},[a("el-form-item",{staticClass:"dialog_field",attrs:{label:"外观",prop:"qualifiedDemands."+l+".qualifiedAppearenceLevels",rules:[{required:!0,message:"请选择外观",trigger:"blur"}]}},[a("el-select",{attrs:{placeholder:"",multiple:"","collapse-tags":""},model:{value:t.qualifiedAppearenceLevels,callback:function(a){e.$set(t,"qualifiedAppearenceLevels",a)},expression:"item.qualifiedAppearenceLevels"}},[a("el-option",{attrs:{label:"A",value:"A"}}),e._v(" "),a("el-option",{attrs:{label:"B",value:"B"}}),e._v(" "),a("el-option",{attrs:{label:"C",value:"C"}})],1)],1)],1)],1)})],2)],1),e._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.closeDialog}},[e._v("取消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("提交")])],1)],1)},staticRenderFns:[]};var v=a("VU/8")(f,g,!1,function(e){a("VXxv")},"data-v-c0369c0e",null).exports,h=a("mw3O"),_=a.n(h),D={props:{exportData:{type:Object,required:!0}},data:function(){return{visible:!1,formData:{date:null},rules:{date:[{required:!0,message:"请选择日期",trigger:"blur"}]}}},methods:{closeDialog:function(){this.$emit("closeExport")},submitForm:function(){var e=this;this.$refs.form.validate(function(t){if(!t)return!1;var a={castId:e.exportData.castId,startTime:e.formData.date[0],endTime:e.formData.date[1]},l=r.a.exportPlan+"?"+_.a.stringify(a);window.open(l),e.$emit("submitExport")})}}},k={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{title:"导出生产计划",visible:e.exportData.exportVisible,"close-on-click-modal":!1,"close-on-press-escape":!1,center:!0,width:"550px"},on:{"update:visible":function(t){return e.$set(e.exportData,"exportVisible",t)},close:e.closeDialog}},[a("el-form",{ref:"form",attrs:{model:e.formData,rules:e.rules,"label-width":"100px"},nativeOn:{submit:function(e){e.preventDefault()}}},[a("el-form-item",{attrs:{label:"日期范围：",prop:"date"}},[a("el-date-picker",{attrs:{type:"daterange","default-time":["00:00:00","23:59:59"],clearable:!1,"start-placeholder":"开始日期","end-placeholder":"结束日期"},model:{value:e.formData.date,callback:function(t){e.$set(e.formData,"date",t)},expression:"formData.date"}})],1)],1),e._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.closeDialog}},[e._v("取消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("提交")])],1)],1)},staticRenderFns:[]},x={name:"plan",components:{dialogForm:v,excelForm:a("VU/8")(D,k,!1,null,null,null).exports},data:function(){return{searchForm:{date:Object(l.a)(new Date)},isApproved:!1,isExportable:!1,dialogVisible:!1,exportVisible:!1,formType:"create",rowData:{},tableData:[],loading:!0,castId:6,roleId:null}},beforeRouteUpdate:function(e,t,a){this.castId=e.params.castId,this.getTableData(),this.isExportable=this.setExportable(),a()},created:function(){this.castId=this.$route.params.castId,this.getTableData(),this.roleId=JSON.parse(localStorage.getItem("userinfo")).roleId,this.isExportable=this.setExportable()},computed:{pickerOptions:function(){var e=this;return{disabledDate:function(t){var a=new Date;return a.setDate(a.getDate()+1),![1,2,3].includes(Number(e.roleId))&&t.getTime()>=a.getTime()}}}},methods:{closeHandler:function(){this.dialogVisible=!1},submitHandler:function(e){"edit"===this.formType&&(this.dialogVisible=!1),this.getTableData()},clickSearch:function(){this.getTableData()},setExportable:function(){return!![1,2,3].includes(this.roleId)},getTableData:function(){var e=this,t={castId:this.castId,date:this.searchForm.date};this.$http("get",r.a.queryPlan,t).then(function(t){var a=t.list;a.forEach(function(e){e.orderRibbonToughnessLevels=e.orderRibbonToughnessLevels.split(","),e.orderAppearenceLevels=e.orderAppearenceLevels.split(","),e.qualifiedDemands=JSON.parse(e.qualifiedDemands)}),e.isApproved=a.every(function(e){return 1===e.approved}),e.isApproved?e.tableData=a:1===e.roleId||2===e.roleId?e.tableData=a:e.tableData=[]}).catch(function(e){console.log(e)}).finally(function(){e.loading=!1})},createPlan:function(){this.formType="create",this.dialogVisible=!0},editPlan:function(e){this.dialogVisible=!0,this.rowData=e,this.formType="edit"},delPlan:function(e){var t=this,a=e.planId,l=e.furnace;this.$confirm("删除后数据无法恢复，确定要删除 "+l+" 吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.$http("delete",r.a.delPlan,{planId:a}).then(function(e){t.getTableData()}).catch(function(e){console.log(e)})}).catch(function(){})},approve:function(){var e=this;this.$confirm("确定要审批吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){var t={date:e.searchForm.date,castId:e.castId,roleId:e.roleId};e.$http("PUT",r.a.updatePlan,t).then(function(t){e.getTableData()}).catch(function(e){console.log(e)})}).catch(function(){})}}},T={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-breadcrumb",{staticClass:"crumb",attrs:{"separator-class":"el-icon-arrow-right"}},[a("el-breadcrumb-item",[e._v("生产计划")]),e._v(" "),a("el-breadcrumb-item",[e._v(e._s(e.castId)+"号机组")])],1),e._v(" "),a("el-form",{staticClass:"search_bar",attrs:{model:e.searchForm,inline:!0}},[a("el-form-item",{attrs:{label:"排产日期："}},[a("el-date-picker",{attrs:{type:"date","value-format":"yyyy-MM-dd",placeholder:"选择日期",editable:!1,clearable:!1,"picker-options":e.pickerOptions},model:{value:e.searchForm.date,callback:function(t){e.$set(e.searchForm,"date",t)},expression:"searchForm.date"}})],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:e.clickSearch}},[e._v("搜索")])],1)],1),e._v(" "),a("div",{staticClass:"main_bd"},[a("el-col",{staticClass:"table_hd"},[1===e.roleId||2===e.roleId?a("el-button",{attrs:{type:"primary",icon:"el-icon-plus"},on:{click:e.createPlan}},[e._v("新增生产计划")]):e._e(),e._v(" "),(1===e.roleId||2===e.roleId)&&e.tableData.length>0&&!e.isApproved?a("el-button",{attrs:{type:"primary",icon:"el-icon-check",disabled:2===e.roleId&&e.tableData.length>0&&!e.isApproved},on:{click:e.approve}},[e._v("待审批")]):e._e(),e._v(" "),(1===e.roleId||2===e.roleId)&&e.tableData.length>0&&e.isApproved?a("el-button",{attrs:{type:"primary",icon:"el-icon-check",disabled:""}},[e._v("已审批")]):e._e(),e._v(" "),e.isExportable?a("el-button",{staticClass:"pull_right",attrs:{type:"primary",icon:"el-icon-download"},on:{click:function(t){e.exportVisible=!0}}},[e._v("导出")]):e._e()],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",staticStyle:{width:"100%"},attrs:{data:e.tableData,stripe:"",border:"","highlight-current-row":""}},[a("el-table-column",{attrs:{prop:"date",label:"日期",align:"center",width:"110px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"castId",label:"机组",align:"center",width:"60px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"team",label:"班组",align:"center",width:"50px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"ribbonTypeName",label:"材质",align:"center",width:"80px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"ribbonWidth",label:"规格(mm)",align:"center",width:"90px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"furnace",label:"制带炉号",align:"center",width:"150px"}}),e._v(" "),a("el-table-column",{attrs:{label:"订单要求"}},[a("el-table-column",{attrs:{label:"带厚(μm)",align:"center",width:"90px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{staticClass:"text_danger"},[e._v(e._s(t.row.orderThickness))])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"叠片",align:"center",width:"80px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{staticClass:"text_danger"},[e._v(e._s(t.row.orderLaminationFactor))])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"韧性",align:"center",width:"80px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{staticClass:"text_danger"},[e._v(e._s(t.row.orderRibbonToughnessLevels.toString()))])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"外观",align:"center",width:"80px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{staticClass:"text_danger"},[e._v(e._s(t.row.orderAppearenceLevels.toString()))])]}}])})],1),e._v(" "),1==e.roleId||2==e.roleId||3==e.roleId?a("el-table-column",{attrs:{label:"计划外入库要求"}},[a("el-table-column",{attrs:{label:"带厚(μm)",align:"center",width:"90px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.qualifiedDemands&&t.row.qualifiedDemands[0].qualifiedThickness))])]}}],null,!1,206788358)}),e._v(" "),a("el-table-column",{attrs:{label:"叠片",align:"center",width:"80px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.qualifiedDemands&&t.row.qualifiedDemands[0].qualifiedLaminationFactor))])]}}],null,!1,1074984679)}),e._v(" "),a("el-table-column",{attrs:{label:"韧性",align:"center",width:"80px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.qualifiedDemands&&t.row.qualifiedDemands[0].qualifiedRibbonToughnessLevels.toString()))])]}}],null,!1,3894480132)}),e._v(" "),a("el-table-column",{attrs:{label:"外观",align:"center",width:"80px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.qualifiedDemands&&t.row.qualifiedDemands[0].qualifiedAppearenceLevels.toString()))])]}}],null,!1,1909284558)})],1):e._e(),e._v(" "),1==e.roleId||2==e.roleId||3==e.roleId?a("el-table-column",{attrs:{label:"计划外入库要求"}},[a("el-table-column",{attrs:{label:"带厚(μm)",align:"center",width:"90px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.qualifiedDemands&&t.row.qualifiedDemands[1]&&t.row.qualifiedDemands[1].qualifiedThickness))])]}}],null,!1,3330752234)}),e._v(" "),a("el-table-column",{attrs:{label:"叠片",align:"center",width:"80px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.qualifiedDemands&&t.row.qualifiedDemands[1]&&t.row.qualifiedDemands[1].qualifiedLaminationFactor))])]}}],null,!1,1509679275)}),e._v(" "),a("el-table-column",{attrs:{label:"韧性",align:"center",width:"80px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.qualifiedDemands&&t.row.qualifiedDemands[1]&&t.row.qualifiedDemands[1].qualifiedRibbonToughnessLevels.toString()))])]}}],null,!1,1992660648)}),e._v(" "),a("el-table-column",{attrs:{label:"外观",align:"center",width:"80px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.qualifiedDemands&&t.row.qualifiedDemands[1]&&t.row.qualifiedDemands[1].qualifiedAppearenceLevels.toString()))])]}}],null,!1,934052002)})],1):e._e(),e._v(" "),a("el-table-column",{attrs:{prop:"taskOrder",label:"任务单号",align:"center",width:"100px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"client",label:"客户",align:"center",width:"100px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"alloyWeight",label:"单炉投入",align:"center",width:"80px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"castTime",label:"制带时间",align:"center",width:"110px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"rawWeight",label:"大盘毛重",align:"center",width:"80px"}}),e._v(" "),a("el-table-column",{attrs:{label:"实际规格(mm)",align:"center",width:"80px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{class:{text_danger:t.row.realRibbonWidth!==t.row.ribbonWidth}},[e._v(e._s(t.row.realRibbonWidth))])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"操作",align:"center",width:"150px"},scopedSlots:e._u([{key:"default",fn:function(t){return 2===e.roleId?[a("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(a){return e.editPlan(t.row)}}},[e._v("修改")]),e._v(" "),a("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(a){return e.delPlan(t.row)}}},[e._v("删除")])]:void 0}}],null,!0)})],1),e._v(" "),a("div",{staticClass:"table_tip"},[a("p",[e._v("1. 文件编号："+e._s(e.tableData[0]&&e.tableData[0].fileNumber))]),e._v(" "),a("p",[e._v("2. "+e._s(e.tableData[0]&&e.tableData[0].remark))])])],1),e._v(" "),e.dialogVisible?a("dialog-form",{attrs:{dialogData:{formType:e.formType,dialogVisible:e.dialogVisible,rowData:e.rowData}},on:{close:e.closeHandler,submit:e.submitHandler}}):e._e(),e._v(" "),e.exportVisible?a("excel-form",{attrs:{exportData:{exportVisible:e.exportVisible,castId:e.castId}},on:{closeExport:function(t){e.exportVisible=!1},submitExport:function(t){e.exportVisible=!1}}}):e._e()],1)},staticRenderFns:[]};var q=a("VU/8")(x,T,!1,function(e){a("GD+g")},"data-v-0cc7acbc",null);t.default=q.exports}});
//# sourceMappingURL=plan.c6cd784aef28a60ad1f0.js.map