webpackJsonp([8],{EzPf:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("Dd8w"),i=a.n(r),n=a("NYxO"),l=a("woOf"),o=a.n(l),c=a("g7mi"),s=(a("E4LH"),{appearence:"",appearenceLevel:""}),p={props:{dialogData:{type:Object,required:!0}},data:function(){return{formData:{appearence:"",appearenceLevel:""},rules:{appearence:[{required:!0,message:"请填写外观",trigger:"blur"},{max:20,message:"最多20位字符",trigger:"blur"}],appearenceLevel:[{required:!0,message:"请填写外观等级",trigger:"blur"},{max:20,message:"最多20位字符",trigger:"blur"}]},loading:!1}},created:function(){"create"===this.dialogData.formType?this.formData=o()({},s):this.formData=o()(this.formData,this.dialogData.rowData)},methods:{closeDialog:function(){this.$emit("close")},submitForm:function(){var e=this;this.$refs.form.validate(function(t){if(!t)return!1;e.loading=!0;var a="create"===e.dialogData.formType?{method:"post",url:c.a.addAppearenceLevel}:{method:"put",url:c.a.updateAppearenceLevel},r=a.method,i=a.url;e.$http(r,i,e.formData).then(function(t){e.$emit("submit")}).catch(function(e){console.log(e)}).finally(function(){e.loading=!1})})}}},d={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{title:"create"===e.dialogData.formType?"新增外观":"修改外观",visible:e.dialogData.dialogVisible,"close-on-click-modal":!1,"close-on-press-escape":!1,center:!0,"element-loading-text":"拼命加载中"},on:{"update:visible":function(t){return e.$set(e.dialogData,"dialogVisible",t)},close:e.closeDialog}},[a("el-form",{ref:"form",staticStyle:{width:"100%"},attrs:{model:e.formData,rules:e.rules,"label-width":"150px"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.submitForm(t)}}},[a("el-form-item",{attrs:{label:"外观：",prop:"appearence"}},[a("el-input",{model:{value:e.formData.appearence,callback:function(t){e.$set(e.formData,"appearence",t)},expression:"formData.appearence"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"外观等级：",prop:"appearenceLevel"}},[a("el-input",{model:{value:e.formData.appearenceLevel,callback:function(t){e.$set(e.formData,"appearenceLevel",t)},expression:"formData.appearenceLevel"}})],1)],1),e._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.closeDialog}},[e._v("取消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("提交")])],1)],1)},staticRenderFns:[]};var u={name:"ribbon",components:{dialogForm:a("VU/8")(p,d,!1,function(e){a("uUov")},"data-v-49b67779",null).exports},data:function(){return{dialogVisible:!1,formType:"create",rowData:{},tableData:[],loading:!1}},computed:i()({},Object(n.c)(["appearenceList"])),created:function(){this.getAppearenceLevelList()},methods:i()({},Object(n.b)(["getAppearenceLevelList"]),{add:function(){this.dialogVisible=!0,this.formType="create"},edit:function(e){this.dialogVisible=!0,this.formType="edit",this.rowData=e},del:function(e){var t=this,a=e.appearenceLevelId,r=e.appearence;this.$confirm("删除后数据无法恢复，确定要删除 "+r+" 吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.$http("delete",c.a.delAppearenceLevel,{appearenceLevelId:a}).then(function(e){t.getAppearenceLevelList()}).catch(function(e){console.log(e)})}).catch(function(){})},closeHandler:function(){this.dialogVisible=!1},submitHandler:function(){this.dialogVisible=!1,this.getAppearenceLevelList()}})},m={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-breadcrumb",{staticClass:"crumb",attrs:{"separator-class":"el-icon-arrow-right"}},[a("el-breadcrumb-item",[e._v("外观管理")])],1),e._v(" "),a("div",{staticClass:"main_bd"},[a("el-col",{staticClass:"table_hd"},[a("el-button",{attrs:{type:"primary",icon:"el-icon-plus"},on:{click:e.add}},[e._v("新增外观")])],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:e.appearenceList,stripe:"",border:""}},[a("el-table-column",{attrs:{prop:"appearence",label:"外观",align:"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"appearenceLevel",label:"级别",align:"center"}}),e._v(" "),a("el-table-column",{attrs:{label:"操作",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(a){return e.edit(t.row)}}},[e._v("修改")]),e._v(" "),a("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(a){return e.del(t.row)}}},[e._v("删除")])]}}])})],1)],1),e._v(" "),e.dialogVisible?a("dialog-form",{attrs:{dialogData:{formType:e.formType,dialogVisible:e.dialogVisible,rowData:e.rowData}},on:{close:e.closeHandler,submit:e.submitHandler}}):e._e()],1)},staticRenderFns:[]};var f=a("VU/8")(u,m,!1,function(e){a("Fjn5")},"data-v-57ae2121",null);t.default=f.exports},Fjn5:function(e,t){},uUov:function(e,t){}});
//# sourceMappingURL=appearenceLevel.83b6d56482665dc69075.js.map