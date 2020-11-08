webpackJsonp([8],{gMoS:function(e,t,l){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=l("Dd8w"),o=l.n(a),r=l("NYxO"),i=l("woOf"),n=l.n(i),s=l("g7mi"),c=l("E4LH"),d={rollerName:"",roller:""},u={props:{dialogData:{type:Object,required:!0}},data:function(){return{formData:{rollerName:"",roller:""},rules:{rollerName:[{required:!0,message:"请填写姓名",trigger:"blur"},{max:20,message:"最多20位字符",trigger:"blur"}],roller:[{required:!0,message:"请填写编号",trigger:"blur"},{validator:c.e,trigger:"blur"}]},loading:!1}},created:function(){"create"===this.dialogData.formType?this.formData=n()({},d):this.formData=n()(this.formData,this.dialogData.rowData)},methods:{closeDialog:function(){this.$emit("close")},submitForm:function(){var e=this;this.$refs.form.validate(function(t){if(!t)return!1;e.loading=!0;var l="create"===e.dialogData.formType?{method:"post",url:s.a.addRoller}:{method:"put",url:s.a.updateRoller},a=l.method,o=l.url;e.$http(a,o,e.formData).then(function(t){e.$emit("submit")}).catch(function(e){console.log(e)}).finally(function(){e.loading=!1})})}}},m={render:function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("el-dialog",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{title:"create"===e.dialogData.formType?"新增重卷人员":"修改重卷人员",visible:e.dialogData.dialogVisible,"close-on-click-modal":!1,"close-on-press-escape":!1,center:!0,"element-loading-text":"拼命加载中"},on:{"update:visible":function(t){e.$set(e.dialogData,"dialogVisible",t)},close:e.closeDialog}},[l("el-form",{ref:"form",staticStyle:{width:"100%"},attrs:{model:e.formData,rules:e.rules,"label-width":"150px"},nativeOn:{keyup:function(t){return"button"in t||!e._k(t.keyCode,"enter",13,t.key,"Enter")?e.submitForm(t):null}}},[l("el-form-item",{attrs:{label:"姓名：",prop:"rollerName"}},[l("el-input",{model:{value:e.formData.rollerName,callback:function(t){e.$set(e.formData,"rollerName",t)},expression:"formData.rollerName"}})],1),e._v(" "),l("el-form-item",{attrs:{label:"编号：",prop:"roller"}},[l("el-input",{model:{value:e.formData.roller,callback:function(t){e.$set(e.formData,"roller",t)},expression:"formData.roller"}})],1)],1),e._v(" "),l("div",{attrs:{slot:"footer"},slot:"footer"},[l("el-button",{on:{click:e.closeDialog}},[e._v("取消")]),e._v(" "),l("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("提交")])],1)],1)},staticRenderFns:[]};var f={name:"roller",components:{dialogForm:l("VU/8")(u,m,!1,function(e){l("o4Cn")},"data-v-701bf703",null).exports},data:function(){return{dialogVisible:!1,formType:"create",rowData:{},tableData:[],loading:!1}},computed:o()({},Object(r.c)(["rollerList"])),created:function(){this.getRollerList()},methods:o()({},Object(r.b)(["getRollerList"]),{add:function(){this.dialogVisible=!0,this.formType="create"},edit:function(e){this.dialogVisible=!0,this.formType="edit",this.rowData=e},del:function(e){var t=this,l=e.rollerName,a=e.rollerId;this.$confirm("删除后数据无法恢复，确定要删除 "+l+" 吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.$http("delete",s.a.delRoller,{rollerId:a}).then(function(e){t.getRollerList()}).catch(function(e){console.log(e)})}).catch(function(){})},closeHandler:function(){this.dialogVisible=!1},submitHandler:function(){this.dialogVisible=!1,this.getRollerList()}})},g={render:function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("div",[l("el-breadcrumb",{staticClass:"crumb",attrs:{"separator-class":"el-icon-arrow-right"}},[l("el-breadcrumb-item",[e._v("重卷人员管理")])],1),e._v(" "),l("div",{staticClass:"main_bd"},[l("el-col",{staticClass:"table_hd"},[l("el-button",{attrs:{type:"primary",icon:"el-icon-plus"},on:{click:e.add}},[e._v("新增重卷人员")])],1),e._v(" "),l("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:e.rollerList,stripe:"",border:""}},[l("el-table-column",{attrs:{prop:"rollerName",label:"姓名",align:"center"}}),e._v(" "),l("el-table-column",{attrs:{prop:"roller",label:"编号",align:"center"}}),e._v(" "),l("el-table-column",{attrs:{label:"操作",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[l("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(l){e.edit(t.row)}}},[e._v("修改")]),e._v(" "),l("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(l){e.del(t.row)}}},[e._v("删除")])]}}])})],1)],1),e._v(" "),e.dialogVisible?l("dialog-form",{attrs:{dialogData:{formType:e.formType,dialogVisible:e.dialogVisible,rowData:e.rowData}},on:{close:e.closeHandler,submit:e.submitHandler}}):e._e()],1)},staticRenderFns:[]};var b=l("VU/8")(f,g,!1,function(e){l("koAO")},"data-v-2dc0171c",null);t.default=b.exports},koAO:function(e,t){},o4Cn:function(e,t){}});
//# sourceMappingURL=roller.38010c05d1475fadd522.js.map