webpackJsonp([2],{Cdx3:function(e,t,a){var r=a("sB3e"),l=a("lktj");a("uqUo")("keys",function(){return function(e){return l(r(e))}})},fZjL:function(e,t,a){e.exports={default:a("jFbC"),__esModule:!0}},jFbC:function(e,t,a){a("Cdx3"),e.exports=a("FeBl").Object.keys},uqUo:function(e,t,a){var r=a("kM2E"),l=a("FeBl"),o=a("S82l");e.exports=function(e,t){var a=(l.Object||{})[e]||Object[e],i={};i[e]=t(a),r(r.S+r.F*o(function(){a(1)}),"Object",i)}},vS98:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("mvHQ"),l=a.n(r),o=a("woOf"),i=a.n(o),n=a("Xxa5"),s=a.n(n),c=a("exGp"),u=a.n(c),d=a("Dd8w"),m=a.n(d),f=a("NYxO"),p=a("PJh5"),b=a.n(p),h=a("g7mi"),g=a("X2Oc"),v=a("fZjL"),_=a.n(v),D=a("E4LH"),y={castId:6,roller:"",rollMachine:null,isFlat:0,furnace:"",coilNumber:"",diameter:"",coilWeight:""},x={data:function(){return{userinfo:{},visible:!1,loading:!1,formData:{castId:6,roller:"",rollMachine:null,isFlat:0,furnace:"",coilNumber:"",diameter:"",coilWeight:""},rules:{roller:[{required:!0,message:"请选择重卷人员",trigger:"blur"}],rollMachine:[{required:!0,message:"请选择重卷机编号",trigger:"blur"}],furnace:[{required:!0,message:"请填写炉号",trigger:"blur"},{max:20,message:"最多20位字符",trigger:"blur"},{validator:D.a,trigger:"blur"}],coilNumber:[{required:!0,message:"请填写盘号",trigger:"blur"},{validator:D.f,trigger:"blur"},{validator:Object(D.d)(99999),trigger:"blur"}],diameter:[{required:!0,message:"请填写外径",trigger:"blur"},{validator:D.b,trigger:"blur"},{validator:Object(D.d)(99999),trigger:"blur"}],coilWeight:[{required:!0,message:"请填写重量",trigger:"blur"},{validator:D.b,trigger:"blur"},{validator:Object(D.d)(99999),trigger:"blur"}],isFlat:[{required:!0,message:"请选择是否平整",trigger:"blur"}]}}},props:{dialogData:{type:Object,required:!0},rollerList:{type:Array,required:!0}},created:function(){this.userinfo=JSON.parse(localStorage.getItem("userinfo")),"add"===this.dialogData.formType?this.formData=i()({},y,{castId:Number(this.$route.params.castId)}):(this.formData=i()(this.formData,this.dialogData.rowData),this.formData.diameter=this.formData.diameter?Number(this.formData.diameter.toFixed(2)):"")},mounted:function(){},methods:{closeDialog:function(){this.$emit("close")},submitForm:function(){var e=this;this.$refs.form.validate(function(t){if(!t)return!1;e.loading=!0;var a=m()({},e.formData,{roleId:e.userinfo.roleId}),r="add"===e.dialogData.formType?{method:"POST",url:h.a.addRoll}:{method:"PUT",url:h.a.updateRoll},l=r.method,o=r.url;_()(a).forEach(function(e){null==a[e]&&delete a[e]}),e.$http(l,o,a).then(function(t){-1!==t.status&&(e.formData.coilNumber++,e.formData.coilWeight=null,e.formData.diameter=null,e.$emit("submit"))}).catch(function(e){console.log(e)}).finally(function(){e.loading=!1})})}}},w={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{title:"add"===e.dialogData.formType?"新增重卷记录-"+e.$route.params.castId+"号机组":"修改重卷记录-"+e.$route.params.castId+"号机组",visible:e.dialogData.dialogVisible,"close-on-click-modal":!1,"close-on-press-escape":!1,center:!0,width:"30%","element-loading-text":"拼命加载中"},on:{"update:visible":function(t){return e.$set(e.dialogData,"dialogVisible",t)},close:e.closeDialog}},[a("el-form",{ref:"form",staticStyle:{},attrs:{model:e.formData,rules:e.rules,"label-width":"100px"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.submitForm(t)}}},[a("el-form-item",{attrs:{label:"重卷人员：",prop:"roller"}},[a("el-select",{attrs:{placeholder:"请选择重卷人"},model:{value:e.formData.roller,callback:function(t){e.$set(e.formData,"roller",t)},expression:"formData.roller"}},e._l(e.rollerList,function(e){return a("el-option",{key:e.roller,attrs:{value:e.roller,label:e.rollerName}})}),1)],1),e._v(" "),a("el-form-item",{attrs:{label:"重卷机器：",prop:"rollMachine"}},[a("el-select",{attrs:{placeholder:""},model:{value:e.formData.rollMachine,callback:function(t){e.$set(e.formData,"rollMachine",t)},expression:"formData.rollMachine"}},[a("el-option",{attrs:{label:"#1",value:1}}),e._v(" "),a("el-option",{attrs:{label:"#2",value:2}}),e._v(" "),a("el-option",{attrs:{label:"#3",value:3}}),e._v(" "),a("el-option",{attrs:{label:"#4",value:4}}),e._v(" "),a("el-option",{attrs:{label:"#5",value:5}}),e._v(" "),a("el-option",{attrs:{label:"#6",value:6}}),e._v(" "),a("el-option",{attrs:{label:"#7",value:7}}),e._v(" "),a("el-option",{attrs:{label:"#8",value:8}}),e._v(" "),a("el-option",{attrs:{label:"#9",value:9}}),e._v(" "),a("el-option",{attrs:{label:"#10",value:10}}),e._v(" "),a("el-option",{attrs:{label:"#11",value:11}}),e._v(" "),a("el-option",{attrs:{label:"#12",value:12}}),e._v(" "),a("el-option",{attrs:{label:"#13",value:13}}),e._v(" "),a("el-option",{attrs:{label:"#14",value:14}}),e._v(" "),a("el-option",{attrs:{label:"#15",value:15}}),e._v(" "),a("el-option",{attrs:{label:"#16",value:16}})],1)],1),e._v(" "),a("el-form-item",{attrs:{label:"炉号：",prop:"furnace"}},[a("el-input",{model:{value:e.formData.furnace,callback:function(t){e.$set(e.formData,"furnace",t)},expression:"formData.furnace"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"盘号：",prop:"coilNumber"}},[a("el-input",{model:{value:e.formData.coilNumber,callback:function(t){e.$set(e.formData,"coilNumber",t)},expression:"formData.coilNumber"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"外径：",prop:"diameter"}},[a("el-input",{model:{value:e.formData.diameter,callback:function(t){e.$set(e.formData,"diameter",t)},expression:"formData.diameter"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"重量：",prop:"coilWeight"}},[a("el-input",{model:{value:e.formData.coilWeight,callback:function(t){e.$set(e.formData,"coilWeight",t)},expression:"formData.coilWeight"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"是否平整：",prop:"isFlat"}},[a("el-select",{attrs:{placeholder:""},model:{value:e.formData.isFlat,callback:function(t){e.$set(e.formData,"isFlat",t)},expression:"formData.isFlat"}},[a("el-option",{attrs:{value:0,label:"是"}}),e._v(" "),a("el-option",{attrs:{value:1,label:"否"}})],1)],1)],1),e._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.closeDialog}},[e._v("取消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("提交")])],1)],1)},staticRenderFns:[]},F=a("VU/8")(x,w,!1,null,null,null).exports,k=a("IC2r"),C=a("mw3O"),I=a.n(C),$=a("M4fF"),T=[b()().subtract(6,"days").format("YYYY-MM-DD")+" 00:00:00",b()().format("YYYY-MM-DD")+" 23:59:59"],N={name:"melt",components:{dialogForm:F,Collapse:k.a},data:function(){return{userinfo:{},isAddable:!1,isEditable:!1,castId:6,searchForm:{caster:"",furnace:"",roller:"",date:[].concat(T)},loading:!1,tableData:[],dialogVisible:!1,formType:"add",rowData:{},pageConfig:{total:1,current:1,pageSize:10},tableHeight:200,multipleSelection:[]}},beforeRouteUpdate:function(e,t,a){this.castId=e.params.castId,this.getTableData(),this.isAddable=this.setIsAddable(),a()},computed:m()({},Object(f.c)(["rollerList"])),created:function(){var e=this;return u()(s.a.mark(function t(){return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.castId=e.$route.params.castId,e.userinfo=JSON.parse(localStorage.getItem("userinfo")),e.isAddable=e.setIsAddable(),t.next=5,e.getRollerList();case 5:e.getTableData();case 6:case"end":return t.stop()}},t,e)}))()},mounted:function(){var e=this;e.$nextTick(function(){e.tableHeight=window.innerHeight-100}),window.onresize=Object(g.c)(function(){e.tableHeight=window.innerHeight-100},1e3)},methods:m()({},Object(f.b)(["getRollerList"]),{getRollerName:function(e){return(this.rollerList.find(function(t){return t.roller===e})||{}).rollerName||""},dateFormat:function(e,t){return console.log(e.castDate),Object(g.a)(e.castDate)},rollDateFormat:function(e,t){return Object(g.b)(e.createdAt)},clickSearch:function(){this.pageConfig.current=1,this.getTableData({current:1})},reset:function(){this.searchForm={caster:"",furnace:"",roller:"",date:[].concat(T)};this.pageConfig.current=1,this.getTableData({current:1})},getTableData:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a={castId:this.castId,startTime:this.searchForm.date[0],endTime:this.searchForm.date[1],caster:this.searchForm.caster,furnace:this.searchForm.furnace,roller:this.searchForm.roller};i()(t,a),this.loading=!0,this.$http("get",h.a.queryRollData,t).then(function(t){e.pageConfig.total=t.count,e.pageConfig.pageSize=t.limit,t.list&&t.list.forEach(function(t){t.clients=t.clients?t.clients.split(","):[],t.rollerName=t.rollerName?t.rollerName:e.getRollerName(t.roller)}),e.tableData=t.list}).catch(function(e){console.log(e)}).finally(function(){e.loading=!1})},add:function(){this.dialogVisible=!0,this.formType="add"},edit:function(e){this.rowData=e,this.dialogVisible=!0,this.formType="edit"},del:function(e){var t=this,a=e.measureId,r=e.furnace,l=e.coilNumber;this.$confirm("该操作可能会影响检测数据，请确认没有送检和入库之后再删除","确定要删除 "+r+" 的 第 "+l+" 盘 吗？",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.$http("delete",h.a.delRoll,{measureId:a}).then(function(e){t.getTableData()}).catch(function(e){console.log(e)})}).catch(function(){})},closeHandler:function(){this.dialogVisible=!1},submitHandler:function(){"edit"===this.formType&&(this.dialogVisible=!1),this.pageConfig.current=1,this.getTableData()},handleCurrentChange:function(e){var t={current:e};this.getTableData(t)},setIsAddable:function(){return!![1,2,3,4,15].includes(this.userinfo.roleId)},setIsEditable:function(e){return!([1,2,3,15].includes(this.userinfo.roleId)||4===this.userinfo.roleId&&e.rollerName===this.userinfo.adminname)},exportExcel:function(){var e=this.castId,t=this.searchForm.date[0],a=this.searchForm.date[1],r=this.searchForm.caster,l=this.searchForm.furnace,o=this.searchForm.roller,i={castId:e,startTime:t,endTime:a,caster:r,furnace:l,roller:o};if(t||a||r||l||o){var n=h.a.exportRoll+"?"+I.a.stringify(i);window.open(n)}else this.$confirm("没有设置搜索条件，将导出全部数据，速度很慢，要继续导出吗?","提示",{confirmButtonText:"去设置筛选条件",cancelButtonText:"继续导出",type:"warning",center:!0}).then(function(){}).catch(function(e){var t=h.a.exportRoll+"?"+I.a.stringify(i);window.open(t)})},setSelectable:function(e,t){return 1!==e.isRollConfirmed},handleSelectionChange:function(e){this.multipleSelection=e},handleConfirm:function(){var e=this,t=Object($.cloneDeep)(this.multipleSelection);if(0===t.length)return this.$alert("请选择带材","提示",{type:"warning"});var a={};t.forEach(function(t){var r=t.furnace,l=t.coilNumber;if(a.hasOwnProperty(r)&&Array.isArray(a[r])){if(a[r].includes(l))return e.$alert("炉号"+r+"，盘号"+l+" 存在重复盘号，请检查并手动修改数据，同时更新标签");a[r].push(l)}else a[r]=[l]}),this.$http("POST",h.a.rollConfirm,{rollDataJson:l()(t)}).then(function(t){0===t.status&&(e.pageConfig.current=1,e.getTableData())}).catch(function(e){console.log(e)})}})},O={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-breadcrumb",{staticClass:"crumb",attrs:{"separator-class":"el-icon-arrow-right"}},[a("el-breadcrumb-item",[e._v("重卷记录")]),e._v(" "),a("el-breadcrumb-item",[e._v(e._s(e.castId)+"号机组")])],1),e._v(" "),a("Collapse",[a("el-form",{staticClass:"search_bar",attrs:{model:e.searchForm,inline:!0}},[a("el-form-item",{attrs:{label:"生产日期："}},[a("el-date-picker",{attrs:{type:"daterange","default-time":["00:00:00","23:59:59"],"value-format":"yyyy-MM-dd HH:mm:ss",clearable:!1,"start-placeholder":"开始日期","end-placeholder":"结束日期"},model:{value:e.searchForm.date,callback:function(t){e.$set(e.searchForm,"date",t)},expression:"searchForm.date"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"喷带手："}},[a("el-input",{attrs:{placeholder:"请输入喷带手姓名"},model:{value:e.searchForm.caster,callback:function(t){e.$set(e.searchForm,"caster",t)},expression:"searchForm.caster"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"炉号："}},[a("el-input",{attrs:{placeholder:"请输入炉号"},model:{value:e.searchForm.furnace,callback:function(t){e.$set(e.searchForm,"furnace",t)},expression:"searchForm.furnace"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"重卷："}},[a("el-select",{attrs:{placeholder:"请选择重卷人姓名"},model:{value:e.searchForm.roller,callback:function(t){e.$set(e.searchForm,"roller",t)},expression:"searchForm.roller"}},e._l(e.rollerList,function(e){return a("el-option",{key:e.roller,attrs:{value:e.roller,label:e.rollerName}})}),1)],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:e.clickSearch}},[e._v("搜索")]),e._v(" "),a("el-button",{attrs:{type:"primary",icon:"el-icon-refresh"},on:{click:e.reset}},[e._v("重置")])],1)],1)],1),e._v(" "),a("div",{staticClass:"main_bd"},[a("el-col",{staticClass:"table_hd"},[e.isAddable?a("el-button",{attrs:{type:"primary",icon:"el-icon-success"},on:{click:e.handleConfirm}},[e._v("确认送检")]):e._e(),e._v(" "),e.isAddable?a("el-button",{attrs:{type:"primary",icon:"el-icon-plus"},on:{click:e.add}},[e._v("创建重卷记录")]):e._e(),e._v(" "),[1,2,3,4,15].includes(e.userinfo.roleId)?a("el-button",{staticClass:"pull_right",attrs:{type:"primary",icon:"el-icon-download"},on:{click:e.exportExcel}},[e._v("导出")]):e._e()],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",staticStyle:{width:"100%"},attrs:{data:e.tableData,stripe:"",border:"","highlight-current-row":"",height:e.tableHeight},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"20",selectable:e.setSelectable}}),e._v(" "),a("el-table-column",{attrs:{prop:"furnace",label:"炉号",align:"center","min-width":"130px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"ribbonTypeName",label:"材质",align:"center","min-width":"60px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"ribbonWidth",label:"规格",align:"center",width:"40px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"castDate",label:"生产日期",align:"center",formatter:e.dateFormat,"min-width":"80px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"caster",label:"喷带手",align:"center",width:"50px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"coilNumber",label:"盘号",align:"center",width:"40px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"diameter",label:"外径(mm)",align:"center",width:"70px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"coilWeight",label:"重量(kg)",align:"center",width:"70px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"rollMachine",label:"机器编号",align:"center",width:"70px"}}),e._v(" "),a("el-table-column",{attrs:{prop:"roller",label:"重卷人员",align:"center",width:"70px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.rollerName))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"createdAt",label:"重卷日期",align:"center",formatter:e.rollDateFormat,"min-width":"80px"}}),e._v(" "),a("el-table-column",{attrs:{label:"是否平整",align:"center",width:"60px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{class:{text_danger:1===t.row.isFlat}},[e._v(e._s(1===t.row.isFlat?"否":"是"))])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"操作",align:"center",width:"140px"},scopedSlots:e._u([{key:"default",fn:function(t){return[[1,2,3,4,15].includes(e.userinfo.roleId)?a("el-button",{attrs:{size:"mini",type:"primary",disabled:e.setIsEditable(t.row)},on:{click:function(a){return e.edit(t.row)}}},[e._v("修改")]):e._e(),e._v(" "),[1,2,3,4,15].includes(e.userinfo.roleId)?a("el-button",{attrs:{size:"mini",type:"danger",disabled:e.setIsEditable(t.row)},on:{click:function(a){return e.del(t.row)}}},[e._v("删除")]):e._e()]}}])})],1),e._v(" "),a("el-pagination",{attrs:{background:"",layout:"total,prev,pager,next",total:e.pageConfig.total,"current-page":e.pageConfig.current,"page-size":e.pageConfig.pageSize},on:{"update:currentPage":function(t){return e.$set(e.pageConfig,"current",t)},"update:current-page":function(t){return e.$set(e.pageConfig,"current",t)},"current-change":e.handleCurrentChange}})],1),e._v(" "),e.dialogVisible?a("dialog-form",{attrs:{rollerList:e.rollerList,dialogData:{formType:e.formType,dialogVisible:e.dialogVisible,rowData:e.rowData}},on:{close:e.closeHandler,submit:e.submitHandler}}):e._e()],1)},staticRenderFns:[]},S=a("VU/8")(N,O,!1,null,null,null);t.default=S.exports}});
//# sourceMappingURL=roll.6e1ec07284fa30dca5c5.js.map