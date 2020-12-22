webpackJsonp([13],{XE3K:function(e,t){},kYw5:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=o("Dd8w"),i=o.n(n),a=o("NYxO"),r=o("woOf"),l=o.n(r),s=o("g7mi"),u=o("E4LH"),b={ribbonToughness:"",ribbonToughnessLevel:"",ribbonToughnessLevelCode:""},c={props:{dialogData:{type:Object,required:!0}},data:function(){return{formData:{ribbonToughness:"",ribbonToughnessLevel:"",ribbonToughnessLevelCode:""},rules:{ribbonToughness:[{required:!0,message:"请填写带材韧性",trigger:"blur"},{maxlength:10,message:"不能超过10个字",trigger:"blur"}],ribbonToughnessLevel:[{required:!0,message:"请填写带材韧性等级",trigger:"blur"},{maxlength:1,message:"不能超过1个字母",trigger:"blur"},{pattern:/^[A-Z]$/,message:"只能填写大写字母",trigger:"blur"}],ribbonToughnessLevelCode:[{required:!0,message:"请填写PLC映射码",trigger:"blur"},{validator:u.f,trigger:"blur"},{validator:Object(u.d)(99999),trigger:"blur"}]},loading:!1}},created:function(){"create"===this.dialogData.formType?this.formData=l()({},b):this.formData=l()(this.formData,this.dialogData.rowData)},methods:{closeDialog:function(){this.$emit("close")},submitForm:function(){var e=this;this.$refs.form.validate(function(t){if(!t)return!1;e.loading=!0;var o="create"===e.dialogData.formType?{method:"post",url:s.a.addRibbonToughnessLevel}:{method:"put",url:s.a.updateRibbonToughnessLevel},n=o.method,i=o.url;e.$http(n,i,e.formData).then(function(t){e.$emit("submit")}).catch(function(e){console.log(e)}).finally(function(){e.loading=!1})})}}},d={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("el-dialog",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{title:"create"===e.dialogData.formType?"新增带材韧性":"修改带材韧性",visible:e.dialogData.dialogVisible,"close-on-click-modal":!1,"close-on-press-escape":!1,center:!0,"element-loading-text":"拼命加载中"},on:{"update:visible":function(t){return e.$set(e.dialogData,"dialogVisible",t)},close:e.closeDialog}},[o("el-form",{ref:"form",staticStyle:{width:"100%"},attrs:{model:e.formData,rules:e.rules,"label-width":"100px"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.submitForm(t)}}},[o("el-form-item",{attrs:{label:"韧性等级：",prop:"ribbonToughnessLevel"}},[o("el-input",{model:{value:e.formData.ribbonToughnessLevel,callback:function(t){e.$set(e.formData,"ribbonToughnessLevel",t)},expression:"formData.ribbonToughnessLevel"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"带材韧性：",prop:"ribbonToughness"}},[o("el-input",{model:{value:e.formData.ribbonToughness,callback:function(t){e.$set(e.formData,"ribbonToughness",t)},expression:"formData.ribbonToughness"}})],1),e._v(" "),o("el-form-item",{attrs:{label:"PLC映射码：",prop:"ribbonToughnessLevelCode"}},[o("el-input",{model:{value:e.formData.ribbonToughnessLevelCode,callback:function(t){e.$set(e.formData,"ribbonToughnessLevelCode",t)},expression:"formData.ribbonToughnessLevelCode"}})],1)],1),e._v(" "),o("div",{attrs:{slot:"footer"},slot:"footer"},[o("el-button",{on:{click:e.closeDialog}},[e._v("取消")]),e._v(" "),o("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("提交")])],1)],1)},staticRenderFns:[]};var g={name:"ribbon",components:{dialogForm:o("VU/8")(c,d,!1,function(e){o("xrbD")},"data-v-093da53a",null).exports},data:function(){return{dialogVisible:!1,formType:"create",rowData:{},tableData:[],loading:!1}},computed:i()({},Object(a.c)(["ribbonToughnessLevelList"])),created:function(){this.getRibbonToughnessLevelList()},methods:i()({},Object(a.b)(["getRibbonToughnessLevelList"]),{add:function(){this.dialogVisible=!0,this.formType="create"},edit:function(e){this.dialogVisible=!0,this.formType="edit",this.rowData=e},del:function(e){var t=this,o=e.ribbonToughnessLevelId,n=e.ribbonToughness;this.$confirm("删除后数据无法恢复，确定要删除 "+n+" 吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.$http("delete",s.a.delRibbonToughnessLevel,{ribbonToughnessLevelId:o}).then(function(e){t.getRibbonToughnessLevelList()}).catch(function(e){console.log(e)})}).catch(function(){})},closeHandler:function(){this.dialogVisible=!1},submitHandler:function(){this.dialogVisible=!1,this.getRibbonToughnessLevelList()}})},m={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",[o("el-breadcrumb",{staticClass:"crumb",attrs:{"separator-class":"el-icon-arrow-right"}},[o("el-breadcrumb-item",[e._v("带材韧性管理")])],1),e._v(" "),o("div",{staticClass:"main_bd"},[o("el-col",{staticClass:"table_hd"},[o("el-button",{attrs:{type:"primary",icon:"el-icon-plus"},on:{click:e.add}},[e._v("新增带材韧性")])],1),e._v(" "),o("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:e.ribbonToughnessLevelList,stripe:"",border:""}},[o("el-table-column",{attrs:{prop:"ribbonToughness",label:"带材韧性",align:"center"}}),e._v(" "),o("el-table-column",{attrs:{prop:"ribbonToughnessLevel",label:"带材韧性级别",align:"center"}}),e._v(" "),o("el-table-column",{attrs:{prop:"ribbonToughnessLevelCode",label:"PLC映射码",align:"center"}}),e._v(" "),o("el-table-column",{attrs:{label:"操作",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[o("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(o){return e.edit(t.row)}}},[e._v("修改")]),e._v(" "),o("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(o){return e.del(t.row)}}},[e._v("删除")])]}}])})],1)],1),e._v(" "),e.dialogVisible?o("dialog-form",{attrs:{dialogData:{formType:e.formType,dialogVisible:e.dialogVisible,rowData:e.rowData}},on:{close:e.closeHandler,submit:e.submitHandler}}):e._e()],1)},staticRenderFns:[]};var f=o("VU/8")(g,m,!1,function(e){o("XE3K")},"data-v-df630f7e",null);t.default=f.exports},xrbD:function(e,t){}});
//# sourceMappingURL=RibbonToughnessLevel.46bbd5e4e9b702f66011.js.map