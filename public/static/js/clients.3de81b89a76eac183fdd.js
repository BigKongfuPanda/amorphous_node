webpackJsonp([9],{"0n1/":function(t,e){},"2Zrv":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("Dd8w"),l=a.n(i),n=a("NYxO"),o=a("woOf"),r=a.n(o),s=a("g7mi"),c=(a("E4LH"),{client:"",isFlat:0}),d={props:{dialogData:{type:Object,required:!0}},data:function(){return{formData:{client:"",isFlat:0},rules:{client:[{required:!0,message:"请填写客户",trigger:"blur"},{max:20,message:"最多20位字符",trigger:"blur"}],isFlat:[{required:!0,message:"请选择是否必须要求平整",trigger:"blur"}]},loading:!1}},created:function(){"create"===this.dialogData.formType?this.formData=r()({},c):this.formData=r()(this.formData,this.dialogData.rowData)},methods:{closeDialog:function(){this.$emit("close")},submitForm:function(){var t=this;this.$refs.form.validate(function(e){if(!e)return!1;t.loading=!0;var a="create"===t.dialogData.formType?{method:"post",url:s.a.addClients}:{method:"put",url:s.a.updateClients},i=a.method,l=a.url;t.$http(i,l,t.formData).then(function(e){t.$emit("submit")}).catch(function(t){console.log(t)}).finally(function(){t.loading=!1})})}}},u={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-dialog",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],attrs:{title:"create"===t.dialogData.formType?"新增客户":"修改客户",visible:t.dialogData.dialogVisible,"close-on-click-modal":!1,"close-on-press-escape":!1,center:!0,"element-loading-text":"拼命加载中"},on:{"update:visible":function(e){t.$set(t.dialogData,"dialogVisible",e)},close:t.closeDialog}},[a("el-form",{ref:"form",staticStyle:{width:"100%"},attrs:{model:t.formData,rules:t.rules,"label-width":"150px"},nativeOn:{keyup:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?t.submitForm(e):null}}},[a("el-form-item",{attrs:{label:"客户：",prop:"client"}},[a("el-input",{model:{value:t.formData.client,callback:function(e){t.$set(t.formData,"client",e)},expression:"formData.client"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"是否必须平整：",prop:"isFlat"}},[a("el-select",{attrs:{placeholder:""},model:{value:t.formData.isFlat,callback:function(e){t.$set(t.formData,"isFlat",e)},expression:"formData.isFlat"}},[a("el-option",{attrs:{value:0,label:"是"}}),t._v(" "),a("el-option",{attrs:{value:1,label:"否"}})],1)],1)],1),t._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:t.closeDialog}},[t._v("取消")]),t._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:t.submitForm}},[t._v("提交")])],1)],1)},staticRenderFns:[]};var m={name:"ribbon",components:{dialogForm:a("VU/8")(d,u,!1,function(t){a("0n1/")},"data-v-1038801c",null).exports},data:function(){return{dialogVisible:!1,formType:"create",rowData:{},tableData:[],loading:!1}},computed:l()({},Object(n.c)(["clientsList"])),created:function(){this.getClientsList()},methods:l()({},Object(n.b)(["getClientsList"]),{add:function(){this.dialogVisible=!0,this.formType="create"},edit:function(t){this.dialogVisible=!0,this.formType="edit",this.rowData=t},del:function(t){var e=this,a=t.clientsId,i=t.client;this.$confirm("删除后数据无法恢复，确定要删除 "+i+" 吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.$http("delete",s.a.delClients,{clientsId:a}).then(function(t){e.getClientsList()}).catch(function(t){console.log(t)})}).catch(function(){})},closeHandler:function(){this.dialogVisible=!1},submitHandler:function(){this.dialogVisible=!1,this.getClientsList()}})},f={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("el-breadcrumb",{staticClass:"crumb",attrs:{"separator-class":"el-icon-arrow-right"}},[a("el-breadcrumb-item",[t._v("客户管理")])],1),t._v(" "),a("div",{staticClass:"main_bd"},[a("el-col",{staticClass:"table_hd"},[a("el-button",{attrs:{type:"primary",icon:"el-icon-plus"},on:{click:t.add}},[t._v("新增客户")])],1),t._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:t.clientsList,stripe:"",border:""}},[a("el-table-column",{attrs:{type:"index",label:"序号",align:"center",width:"200"}}),t._v(" "),a("el-table-column",{attrs:{prop:"client",label:"客户",align:"center"}}),t._v(" "),a("el-table-column",{attrs:{prop:"isFlat",label:"是否必须平整",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",[t._v(t._s(1===e.row.isFlat?"否":"是"))])]}}])}),t._v(" "),a("el-table-column",{attrs:{label:"操作",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(a){t.edit(e.row)}}},[t._v("修改")]),t._v(" "),a("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(a){t.del(e.row)}}},[t._v("删除")])]}}])})],1)],1),t._v(" "),t.dialogVisible?a("dialog-form",{attrs:{dialogData:{formType:t.formType,dialogVisible:t.dialogVisible,rowData:t.rowData}},on:{close:t.closeHandler,submit:t.submitHandler}}):t._e()],1)},staticRenderFns:[]};var b=a("VU/8")(m,f,!1,function(t){a("chQ2")},"data-v-a397bf60",null);e.default=b.exports},chQ2:function(t,e){}});
//# sourceMappingURL=clients.3de81b89a76eac183fdd.js.map