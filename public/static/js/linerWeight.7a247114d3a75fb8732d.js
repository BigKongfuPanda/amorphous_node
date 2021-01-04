webpackJsonp([7],{XCwD:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=i("Dd8w"),r=i.n(a),o=i("NYxO"),n=i("woOf"),l=i.n(n),s=i("g7mi"),c=i("E4LH"),d={ribbonWidth:"",linerWeight:""},u={props:{dialogData:{type:Object,required:!0}},data:function(){return{formData:r()({},d),rules:{ribbonWidth:[{required:!0,message:"请填写带宽",trigger:"blur"},{validator:c.f,trigger:"blur"},{validator:Object(c.d)(99999),trigger:"blur"}],linerWeight:[{required:!0,message:"请填写内衬重量",trigger:"blur"},{validator:c.b,trigger:"blur"},{validator:Object(c.d)(99999),trigger:"blur"}]},loading:!1}},created:function(){"create"===this.dialogData.formType?this.formData=l()({},d):this.formData=l()(this.formData,this.dialogData.rowData)},methods:{closeDialog:function(){this.$emit("close")},submitForm:function(){var t=this;this.$refs.form.validate(function(e){if(!e)return!1;t.loading=!0;var i="create"===t.dialogData.formType?{method:"post",url:s.a.addLinerWeight}:{method:"put",url:s.a.updateLinerWeight},a=i.method,r=i.url;t.$http(a,r,t.formData).then(function(e){t.$emit("submit")}).catch(function(t){console.log(t)}).finally(function(){t.loading=!1})})}}},g={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("el-dialog",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],attrs:{title:"create"===t.dialogData.formType?"新增内衬重量数据":"修改内衬重量数据",visible:t.dialogData.dialogVisible,"close-on-click-modal":!1,"close-on-press-escape":!1,center:!0,"element-loading-text":"拼命加载中"},on:{"update:visible":function(e){return t.$set(t.dialogData,"dialogVisible",e)},close:t.closeDialog}},[i("el-form",{ref:"form",staticStyle:{width:"100%"},attrs:{model:t.formData,rules:t.rules,"label-width":"150px"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.submitForm(e)}}},[i("el-form-item",{attrs:{label:"带材宽度：",prop:"ribbonWidth"}},[i("el-input",{model:{value:t.formData.ribbonWidth,callback:function(e){t.$set(t.formData,"ribbonWidth",e)},expression:"formData.ribbonWidth"}})],1),t._v(" "),i("el-form-item",{attrs:{label:"内衬重量：",prop:"linerWeight"}},[i("el-input",{model:{value:t.formData.linerWeight,callback:function(e){t.$set(t.formData,"linerWeight",e)},expression:"formData.linerWeight"}})],1)],1),t._v(" "),i("div",{attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:t.closeDialog}},[t._v("取消")]),t._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:t.submitForm}},[t._v("提交")])],1)],1)},staticRenderFns:[]};var b={name:"linerWeight",components:{dialogForm:i("VU/8")(u,g,!1,function(t){i("p1qE")},"data-v-3590947c",null).exports},data:function(){return{dialogVisible:!1,formType:"create",rowData:{},tableData:[],loading:!1}},computed:r()({},Object(o.c)(["linerWeightList"])),created:function(){this.getLinerWeightList()},methods:r()({},Object(o.b)(["getLinerWeightList"]),{add:function(){this.dialogVisible=!0,this.formType="create"},edit:function(t){this.dialogVisible=!0,this.formType="edit",this.rowData=t},del:function(t){var e=this,i=t.ribbonWidth,a=t.id;this.$confirm("删除后数据无法恢复，确定要删除带宽 "+i+" 的内衬重量吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.$http("delete",s.a.delLinerWeight,{id:a}).then(function(t){e.getLinerWeightList()}).catch(function(t){console.log(t)})}).catch(function(){})},closeHandler:function(){this.dialogVisible=!1},submitHandler:function(){this.dialogVisible=!1,this.getLinerWeightList()}})},m={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("el-breadcrumb",{staticClass:"crumb",attrs:{"separator-class":"el-icon-arrow-right"}},[i("el-breadcrumb-item",[t._v("内衬重量管理")])],1),t._v(" "),i("div",{staticClass:"main_bd"},[i("el-col",{staticClass:"table_hd"},[i("el-button",{attrs:{type:"primary",icon:"el-icon-plus"},on:{click:t.add}},[t._v("新增内衬重量")])],1),t._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:t.linerWeightList,stripe:"",border:""}},[i("el-table-column",{attrs:{prop:"ribbonWidth",label:"带材宽度/mm",align:"center"}}),t._v(" "),i("el-table-column",{attrs:{prop:"linerWeight",label:"内衬重量/kg",align:"center"}}),t._v(" "),i("el-table-column",{attrs:{label:"操作",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(i){return t.edit(e.row)}}},[t._v("修改")]),t._v(" "),i("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(i){return t.del(e.row)}}},[t._v("删除")])]}}])})],1)],1),t._v(" "),t.dialogVisible?i("dialog-form",{attrs:{dialogData:{formType:t.formType,dialogVisible:t.dialogVisible,rowData:t.rowData}},on:{close:t.closeHandler,submit:t.submitHandler}}):t._e()],1)},staticRenderFns:[]};var f=i("VU/8")(b,m,!1,function(t){i("zRbb")},"data-v-4cd662b2",null);e.default=f.exports},p1qE:function(t,e){},zRbb:function(t,e){}});
//# sourceMappingURL=linerWeight.7a247114d3a75fb8732d.js.map