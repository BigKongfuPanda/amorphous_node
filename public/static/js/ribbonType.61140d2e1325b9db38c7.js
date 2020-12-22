webpackJsonp([10],{YEzv:function(e,t){},cTP9:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=i("Dd8w"),o=i.n(a),n=i("NYxO"),r=i("woOf"),l=i.n(r),s=i("g7mi"),c={ribbonTypeId:"",ribbonTypeName:"",NCode:""},b={props:{dialogData:{type:Object,required:!0}},data:function(){return{formData:{ribbonTypeId:"",ribbonTypeName:"",NCode:""},rules:{ribbonTypeName:[{required:!0,message:"请填写带材牌号",trigger:"blur"},{max:50,message:"长度不能超过50位",trigger:"blur"}],NCode:[{required:!0,message:"请填写NC编码",trigger:"blur"},{max:50,message:"长度不能超过50位",trigger:"blur"}]},loading:!1}},created:function(){"create"===this.dialogData.formType?this.formData=l()({},c):this.formData=l()(this.formData,this.dialogData.rowData)},methods:{closeDialog:function(){this.$emit("close")},submitForm:function(){var e=this;this.$refs.form.validate(function(t){if(!t)return!1;e.loading=!0;var i="create"===e.dialogData.formType?{method:"post",url:s.a.addRibbonType}:{method:"put",url:s.a.updateRibbonType},a=i.method,o=i.url;e.$http(a,o,e.formData).then(function(t){e.$emit("submit")}).catch(function(e){console.log(e)}).finally(function(){e.loading=!1})})}}},d={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("el-dialog",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{title:"create"===e.dialogData.formType?"新增带材牌号":"修改带材牌号",visible:e.dialogData.dialogVisible,"close-on-click-modal":!1,"close-on-press-escape":!1,center:!0,"element-loading-text":"拼命加载中"},on:{"update:visible":function(t){return e.$set(e.dialogData,"dialogVisible",t)},close:e.closeDialog}},[i("el-form",{ref:"form",staticStyle:{width:"100%"},attrs:{model:e.formData,rules:e.rules,"label-width":"100px"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.submitForm(t)}}},[i("el-form-item",{attrs:{label:"带材牌号：",prop:"ribbonTypeName"}},[i("el-input",{model:{value:e.formData.ribbonTypeName,callback:function(t){e.$set(e.formData,"ribbonTypeName",t)},expression:"formData.ribbonTypeName"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"NC编码：",prop:"NCode"}},[i("el-input",{model:{value:e.formData.NCode,callback:function(t){e.$set(e.formData,"NCode",t)},expression:"formData.NCode"}})],1)],1),e._v(" "),i("div",{attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:e.closeDialog}},[e._v("取消")]),e._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("提交")])],1)],1)},staticRenderFns:[]};var u={name:"ribbon",components:{dialogForm:i("VU/8")(b,d,!1,function(e){i("YEzv")},"data-v-c48f1b62",null).exports},data:function(){return{dialogVisible:!1,formType:"create",rowData:{},tableData:[],loading:!1}},computed:o()({},Object(n.c)(["ribbonTypeList"])),created:function(){this.getRibbonTypeList()},methods:o()({},Object(n.b)(["getRibbonTypeList"]),{createRibbon:function(){this.dialogVisible=!0,this.formType="create"},editRibbon:function(e){this.dialogVisible=!0,this.formType="edit",this.rowData=e},delRibbon:function(e){var t=this,i=e.ribbonTypeId,a=e.ribbonTypeName;this.$confirm("删除后数据无法恢复，确定要删除 "+a+" 吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.$http("delete",s.a.delRibbonType,{ribbonTypeId:i}).then(function(e){t.getRibbonTypeList()}).catch(function(e){console.log(e)})}).catch(function(){})},closeHandler:function(){this.dialogVisible=!1},submitHandler:function(){this.dialogVisible=!1,this.getRibbonTypeList()}})},m={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("el-breadcrumb",{staticClass:"crumb",attrs:{"separator-class":"el-icon-arrow-right"}},[i("el-breadcrumb-item",[e._v("带材牌号管理")])],1),e._v(" "),i("div",{staticClass:"main_bd"},[i("el-col",{staticClass:"table_hd"},[i("el-button",{attrs:{type:"primary",icon:"el-icon-plus"},on:{click:e.createRibbon}},[e._v("新增带材牌号")])],1),e._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:e.ribbonTypeList,stripe:"",border:""}},[i("el-table-column",{attrs:{type:"index",label:"序号",align:"center",width:"200"}}),e._v(" "),i("el-table-column",{attrs:{prop:"ribbonTypeName",label:"带材牌号名称",align:"center"}}),e._v(" "),i("el-table-column",{attrs:{prop:"NCode",label:"NC编码",align:"center"}}),e._v(" "),i("el-table-column",{attrs:{label:"操作",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(i){return e.editRibbon(t.row)}}},[e._v("修改")]),e._v(" "),i("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(i){return e.delRibbon(t.row)}}},[e._v("删除")])]}}])})],1)],1),e._v(" "),e.dialogVisible?i("dialog-form",{attrs:{dialogData:{formType:e.formType,dialogVisible:e.dialogVisible,rowData:e.rowData}},on:{close:e.closeHandler,submit:e.submitHandler}}):e._e()],1)},staticRenderFns:[]};var p=i("VU/8")(u,m,!1,function(e){i("kl2n")},"data-v-10e5a968",null);t.default=p.exports},kl2n:function(e,t){}});
//# sourceMappingURL=ribbonType.61140d2e1325b9db38c7.js.map