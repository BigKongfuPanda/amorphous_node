webpackJsonp([2],{Cdx3:function(e,t,r){var a=r("sB3e"),o=r("lktj");r("uqUo")("keys",function(){return function(e){return o(a(e))}})},SldL:function(e,t){!function(t){"use strict";var r,a=Object.prototype,o=a.hasOwnProperty,n="function"==typeof Symbol?Symbol:{},l=n.iterator||"@@iterator",i=n.asyncIterator||"@@asyncIterator",c=n.toStringTag||"@@toStringTag",s="object"==typeof e,u=t.regeneratorRuntime;if(u)s&&(e.exports=u);else{(u=t.regeneratorRuntime=s?e.exports:{}).wrap=_;var f="suspendedStart",d="suspendedYield",h="executing",m="completed",p={},g={};g[l]=function(){return this};var b=Object.getPrototypeOf,v=b&&b(b(E([])));v&&v!==a&&o.call(v,l)&&(g=v);var y=F.prototype=x.prototype=Object.create(g);D.prototype=y.constructor=F,F.constructor=D,F[c]=D.displayName="GeneratorFunction",u.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===D||"GeneratorFunction"===(t.displayName||t.name))},u.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,F):(e.__proto__=F,c in e||(e[c]="GeneratorFunction")),e.prototype=Object.create(y),e},u.awrap=function(e){return{__await:e}},k(L.prototype),L.prototype[i]=function(){return this},u.AsyncIterator=L,u.async=function(e,t,r,a){var o=new L(_(e,t,r,a));return u.isGeneratorFunction(t)?o:o.next().then(function(e){return e.done?e.value:o.next()})},k(y),y[c]="Generator",y[l]=function(){return this},y.toString=function(){return"[object Generator]"},u.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var a=t.pop();if(a in e)return r.value=a,r.done=!1,r}return r.done=!0,r}},u.values=E,T.prototype={constructor:T,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(N),!e)for(var t in this)"t"===t.charAt(0)&&o.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=r)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function a(a,o){return i.type="throw",i.arg=e,t.next=a,o&&(t.method="next",t.arg=r),!!o}for(var n=this.tryEntries.length-1;n>=0;--n){var l=this.tryEntries[n],i=l.completion;if("root"===l.tryLoc)return a("end");if(l.tryLoc<=this.prev){var c=o.call(l,"catchLoc"),s=o.call(l,"finallyLoc");if(c&&s){if(this.prev<l.catchLoc)return a(l.catchLoc,!0);if(this.prev<l.finallyLoc)return a(l.finallyLoc)}else if(c){if(this.prev<l.catchLoc)return a(l.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<l.finallyLoc)return a(l.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var a=this.tryEntries[r];if(a.tryLoc<=this.prev&&o.call(a,"finallyLoc")&&this.prev<a.finallyLoc){var n=a;break}}n&&("break"===e||"continue"===e)&&n.tryLoc<=t&&t<=n.finallyLoc&&(n=null);var l=n?n.completion:{};return l.type=e,l.arg=t,n?(this.method="next",this.next=n.finallyLoc,p):this.complete(l)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),p},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),N(r),p}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var a=r.completion;if("throw"===a.type){var o=a.arg;N(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,a){return this.delegate={iterator:E(e),resultName:t,nextLoc:a},"next"===this.method&&(this.arg=r),p}}}function _(e,t,r,a){var o=t&&t.prototype instanceof x?t:x,n=Object.create(o.prototype),l=new T(a||[]);return n._invoke=function(e,t,r){var a=f;return function(o,n){if(a===h)throw new Error("Generator is already running");if(a===m){if("throw"===o)throw n;return j()}for(r.method=o,r.arg=n;;){var l=r.delegate;if(l){var i=I(l,r);if(i){if(i===p)continue;return i}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(a===f)throw a=m,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);a=h;var c=w(e,t,r);if("normal"===c.type){if(a=r.done?m:d,c.arg===p)continue;return{value:c.arg,done:r.done}}"throw"===c.type&&(a=m,r.method="throw",r.arg=c.arg)}}}(e,r,l),n}function w(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}function x(){}function D(){}function F(){}function k(e){["next","throw","return"].forEach(function(t){e[t]=function(e){return this._invoke(t,e)}})}function L(e){var t;this._invoke=function(r,a){function n(){return new Promise(function(t,n){!function t(r,a,n,l){var i=w(e[r],e,a);if("throw"!==i.type){var c=i.arg,s=c.value;return s&&"object"==typeof s&&o.call(s,"__await")?Promise.resolve(s.__await).then(function(e){t("next",e,n,l)},function(e){t("throw",e,n,l)}):Promise.resolve(s).then(function(e){c.value=e,n(c)},l)}l(i.arg)}(r,a,t,n)})}return t=t?t.then(n,n):n()}}function I(e,t){var a=e.iterator[t.method];if(a===r){if(t.delegate=null,"throw"===t.method){if(e.iterator.return&&(t.method="return",t.arg=r,I(e,t),"throw"===t.method))return p;t.method="throw",t.arg=new TypeError("The iterator does not provide a 'throw' method")}return p}var o=w(a,e.iterator,t.arg);if("throw"===o.type)return t.method="throw",t.arg=o.arg,t.delegate=null,p;var n=o.arg;return n?n.done?(t[e.resultName]=n.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=r),t.delegate=null,p):n:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,p)}function O(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function N(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function T(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(O,this),this.reset(!0)}function E(e){if(e){var t=e[l];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,n=function t(){for(;++a<e.length;)if(o.call(e,a))return t.value=e[a],t.done=!1,t;return t.value=r,t.done=!0,t};return n.next=n}}return{next:j}}function j(){return{value:r,done:!0}}}(function(){return this}()||Function("return this")())},Xxa5:function(e,t,r){e.exports=r("jyFz")},exGp:function(e,t,r){"use strict";t.__esModule=!0;var a,o=r("//Fk"),n=(a=o)&&a.__esModule?a:{default:a};t.default=function(e){return function(){var t=e.apply(this,arguments);return new n.default(function(e,r){return function a(o,l){try{var i=t[o](l),c=i.value}catch(e){return void r(e)}if(!i.done)return n.default.resolve(c).then(function(e){a("next",e)},function(e){a("throw",e)});e(c)}("next")})}}},fZjL:function(e,t,r){e.exports={default:r("jFbC"),__esModule:!0}},jFbC:function(e,t,r){r("Cdx3"),e.exports=r("FeBl").Object.keys},jyFz:function(e,t,r){var a=function(){return this}()||Function("return this")(),o=a.regeneratorRuntime&&Object.getOwnPropertyNames(a).indexOf("regeneratorRuntime")>=0,n=o&&a.regeneratorRuntime;if(a.regeneratorRuntime=void 0,e.exports=r("SldL"),o)a.regeneratorRuntime=n;else try{delete a.regeneratorRuntime}catch(e){a.regeneratorRuntime=void 0}},uqUo:function(e,t,r){var a=r("kM2E"),o=r("FeBl"),n=r("S82l");e.exports=function(e,t){var r=(o.Object||{})[e]||Object[e],l={};l[e]=t(r),a(a.S+a.F*n(function(){r(1)}),"Object",l)}},vS98:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=r("mvHQ"),o=r.n(a),n=r("woOf"),l=r.n(n),i=r("Xxa5"),c=r.n(i),s=r("exGp"),u=r.n(s),f=r("Dd8w"),d=r.n(f),h=r("NYxO"),m=r("g7mi"),p=r("X2Oc"),g=r("fZjL"),b=r.n(g),v=r("E4LH"),y={castId:6,roller:"",rollMachine:null,isFlat:0,furnace:"",coilNumber:"",diameter:"",coilWeight:""},_={data:function(){return{userinfo:{},visible:!1,loading:!1,formData:{castId:6,roller:"",rollMachine:null,isFlat:0,furnace:"",coilNumber:"",diameter:"",coilWeight:""},rules:{roller:[{required:!0,message:"请选择重卷人员",trigger:"blur"}],rollMachine:[{required:!0,message:"请选择重卷机编号",trigger:"blur"}],furnace:[{required:!0,message:"请填写炉号",trigger:"blur"},{max:20,message:"最多20位字符",trigger:"blur"},{validator:v.a,trigger:"blur"}],coilNumber:[{required:!0,message:"请填写盘号",trigger:"blur"},{validator:v.f,trigger:"blur"},{validator:Object(v.d)(99999),trigger:"blur"}],diameter:[{required:!0,message:"请填写外径",trigger:"blur"},{validator:v.e,trigger:"blur"},{validator:Object(v.d)(99999),trigger:"blur"}],coilWeight:[{required:!0,message:"请填写重量",trigger:"blur"},{validator:v.b,trigger:"blur"},{validator:Object(v.d)(99999),trigger:"blur"}],isFlat:[{required:!0,message:"请选择是否平整",trigger:"blur"}]}}},props:{dialogData:{type:Object,required:!0},rollerList:{type:Array,required:!0}},created:function(){this.userinfo=JSON.parse(localStorage.getItem("userinfo")),"add"===this.dialogData.formType?this.formData=l()({},y,{castId:Number(this.$route.params.castId)}):this.formData=l()(this.formData,this.dialogData.rowData)},mounted:function(){},methods:{closeDialog:function(){this.$emit("close")},submitForm:function(){var e=this;this.$refs.form.validate(function(t){if(!t)return!1;e.loading=!0;var r=d()({},e.formData,{roleId:e.userinfo.roleId}),a="add"===e.dialogData.formType?{method:"POST",url:m.a.addRoll}:{method:"PUT",url:m.a.updateRoll},o=a.method,n=a.url;b()(r).forEach(function(e){null==r[e]&&delete r[e]}),e.$http(o,n,r).then(function(t){-1!==t.status&&(e.formData.coilNumber++,e.formData.coilWeight=null,e.formData.diameter=null,e.$emit("submit"))}).catch(function(e){console.log(e)}).finally(function(){e.loading=!1})})}}},w={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("el-dialog",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{title:"add"===e.dialogData.formType?"新增重卷记录-"+e.$route.params.castId+"号机组":"修改重卷记录-"+e.$route.params.castId+"号机组",visible:e.dialogData.dialogVisible,"close-on-click-modal":!1,"close-on-press-escape":!1,center:!0,width:"30%","element-loading-text":"拼命加载中"},on:{"update:visible":function(t){e.$set(e.dialogData,"dialogVisible",t)},close:e.closeDialog}},[r("el-form",{ref:"form",staticStyle:{},attrs:{model:e.formData,rules:e.rules,"label-width":"100px"},nativeOn:{keyup:function(t){return"button"in t||!e._k(t.keyCode,"enter",13,t.key,"Enter")?e.submitForm(t):null}}},[r("el-form-item",{attrs:{label:"重卷人员：",prop:"roller"}},[r("el-select",{attrs:{placeholder:"请选择重卷人"},model:{value:e.formData.roller,callback:function(t){e.$set(e.formData,"roller",t)},expression:"formData.roller"}},e._l(e.rollerList,function(e){return r("el-option",{key:e.roller,attrs:{value:e.roller,label:e.rollerName}})}),1)],1),e._v(" "),r("el-form-item",{attrs:{label:"重卷机器：",prop:"rollMachine"}},[r("el-select",{attrs:{placeholder:""},model:{value:e.formData.rollMachine,callback:function(t){e.$set(e.formData,"rollMachine",t)},expression:"formData.rollMachine"}},[r("el-option",{attrs:{label:"#1",value:1}}),e._v(" "),r("el-option",{attrs:{label:"#2",value:2}}),e._v(" "),r("el-option",{attrs:{label:"#3",value:3}}),e._v(" "),r("el-option",{attrs:{label:"#4",value:4}}),e._v(" "),r("el-option",{attrs:{label:"#5",value:5}}),e._v(" "),r("el-option",{attrs:{label:"#6",value:6}}),e._v(" "),r("el-option",{attrs:{label:"#7",value:7}}),e._v(" "),r("el-option",{attrs:{label:"#8",value:8}}),e._v(" "),r("el-option",{attrs:{label:"#9",value:9}}),e._v(" "),r("el-option",{attrs:{label:"#10",value:10}}),e._v(" "),r("el-option",{attrs:{label:"#11",value:11}}),e._v(" "),r("el-option",{attrs:{label:"#12",value:12}}),e._v(" "),r("el-option",{attrs:{label:"#13",value:13}}),e._v(" "),r("el-option",{attrs:{label:"#14",value:14}}),e._v(" "),r("el-option",{attrs:{label:"#15",value:15}}),e._v(" "),r("el-option",{attrs:{label:"#16",value:16}})],1)],1),e._v(" "),r("el-form-item",{attrs:{label:"炉号：",prop:"furnace"}},[r("el-input",{model:{value:e.formData.furnace,callback:function(t){e.$set(e.formData,"furnace",t)},expression:"formData.furnace"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"盘号：",prop:"coilNumber"}},[r("el-input",{model:{value:e.formData.coilNumber,callback:function(t){e.$set(e.formData,"coilNumber",t)},expression:"formData.coilNumber"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"外径：",prop:"diameter"}},[r("el-input",{model:{value:e.formData.diameter,callback:function(t){e.$set(e.formData,"diameter",t)},expression:"formData.diameter"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"重量：",prop:"coilWeight"}},[r("el-input",{model:{value:e.formData.coilWeight,callback:function(t){e.$set(e.formData,"coilWeight",t)},expression:"formData.coilWeight"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"是否平整：",prop:"isFlat"}},[r("el-select",{attrs:{placeholder:""},model:{value:e.formData.isFlat,callback:function(t){e.$set(e.formData,"isFlat",t)},expression:"formData.isFlat"}},[r("el-option",{attrs:{value:0,label:"是"}}),e._v(" "),r("el-option",{attrs:{value:1,label:"否"}})],1)],1)],1),e._v(" "),r("div",{attrs:{slot:"footer"},slot:"footer"},[r("el-button",{on:{click:e.closeDialog}},[e._v("取消")]),e._v(" "),r("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("提交")])],1)],1)},staticRenderFns:[]},x=r("VU/8")(_,w,!1,null,null,null).exports,D=r("IC2r"),F=r("mw3O"),k=r.n(F),L=r("M4fF"),I={name:"melt",components:{dialogForm:x,Collapse:D.a},data:function(){return{userinfo:{},isAddable:!1,isEditable:!1,castId:6,searchForm:{caster:"",furnace:"",roller:"",date:[]},loading:!1,tableData:[],dialogVisible:!1,formType:"add",rowData:{},pageConfig:{total:1,current:1,pageSize:10},tableHeight:200,multipleSelection:[]}},beforeRouteUpdate:function(e,t,r){this.castId=e.params.castId,this.getTableData(),this.isAddable=this.setIsAddable(),r()},computed:d()({},Object(h.c)(["rollerList"])),created:function(){var e=this;return u()(c.a.mark(function t(){return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.castId=e.$route.params.castId,e.userinfo=JSON.parse(localStorage.getItem("userinfo")),e.isAddable=e.setIsAddable(),t.next=5,e.getRollerList();case 5:e.getTableData();case 6:case"end":return t.stop()}},t,e)}))()},mounted:function(){var e=this;e.$nextTick(function(){e.tableHeight=window.innerHeight-100}),window.onresize=Object(p.c)(function(){e.tableHeight=window.innerHeight-100},1e3)},methods:d()({},Object(h.b)(["getRollerList"]),{getRollerName:function(e){return(this.rollerList.find(function(t){return t.roller===e})||{}).rollerName||""},dateFormat:function(e,t){return console.log(e.castDate),Object(p.a)(e.castDate)},rollDateFormat:function(e,t){return Object(p.b)(e.createdAt)},clickSearch:function(){this.pageConfig.current=1,this.getTableData({current:1})},reset:function(){this.searchForm={caster:"",furnace:"",roller:"",date:[]};this.pageConfig.current=1,this.getTableData({current:1})},getTableData:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r={castId:this.castId,startTime:this.searchForm.date[0],endTime:this.searchForm.date[1],caster:this.searchForm.caster,furnace:this.searchForm.furnace,roller:this.searchForm.roller};l()(t,r),this.$http("get",m.a.queryRollData,t).then(function(t){e.pageConfig.total=t.count,e.pageConfig.pageSize=t.limit,t.list&&t.list.forEach(function(t){t.clients=t.clients?t.clients.split(","):[],t.rollerName=t.rollerName?t.rollerName:e.getRollerName(t.roller)}),e.tableData=t.list}).catch(function(e){console.log(e)}).finally(function(){e.loading=!1})},add:function(){this.dialogVisible=!0,this.formType="add"},edit:function(e){this.rowData=e,this.dialogVisible=!0,this.formType="edit"},del:function(e){var t=this,r=e.measureId,a=e.furnace,o=e.coilNumber;this.$confirm("该操作可能会影响检测数据，请确认没有送检和入库之后再删除","确定要删除 "+a+" 的 第 "+o+" 盘 吗？",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.$http("delete",m.a.delRoll,{measureId:r}).then(function(e){t.getTableData()}).catch(function(e){console.log(e)})}).catch(function(){})},closeHandler:function(){this.dialogVisible=!1},submitHandler:function(){"edit"===this.formType&&(this.dialogVisible=!1),this.pageConfig.current=1,this.getTableData()},handleCurrentChange:function(e){var t={current:e};this.getTableData(t)},setIsAddable:function(){return!![1,2,3,4,15].includes(this.userinfo.roleId)},setIsEditable:function(e){return!([1,2,3,15].includes(this.userinfo.roleId)||4===this.userinfo.roleId&&e.rollerName===this.userinfo.adminname)},exportExcel:function(){var e=this.castId,t=this.searchForm.date[0],r=this.searchForm.date[1],a=this.searchForm.caster,o=this.searchForm.furnace,n=this.searchForm.roller,l={castId:e,startTime:t,endTime:r,caster:a,furnace:o,roller:n};if(t||r||a||o||n){var i=m.a.exportRoll+"?"+k.a.stringify(l);window.open(i)}else this.$confirm("没有设置搜索条件，将导出全部数据，速度很慢，要继续导出吗?","提示",{confirmButtonText:"去设置筛选条件",cancelButtonText:"继续导出",type:"warning",center:!0}).then(function(){}).catch(function(e){var t=m.a.exportRoll+"?"+k.a.stringify(l);window.open(t)})},setSelectable:function(e,t){return 1!==e.isRollConfirmed},handleSelectionChange:function(e){this.multipleSelection=e},handleConfirm:function(){var e=this,t=Object(L.cloneDeep)(this.multipleSelection);if(0===t.length)return this.$alert("请选择带材","提示",{type:"warning"});this.$http("POST",m.a.rollConfirm,{rollDataJson:o()(t)}).then(function(t){e.getTableData()}).catch(function(e){console.log(e)})}})},O={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("el-breadcrumb",{staticClass:"crumb",attrs:{"separator-class":"el-icon-arrow-right"}},[r("el-breadcrumb-item",[e._v("重卷记录")]),e._v(" "),r("el-breadcrumb-item",[e._v(e._s(e.castId)+"号机组")])],1),e._v(" "),r("Collapse",[r("el-form",{staticClass:"search_bar",attrs:{model:e.searchForm,inline:!0}},[r("el-form-item",{attrs:{label:"生产日期："}},[r("el-date-picker",{attrs:{type:"daterange","default-time":["00:00:00","23:59:59"],clearable:!1,"start-placeholder":"开始日期","end-placeholder":"结束日期"},model:{value:e.searchForm.date,callback:function(t){e.$set(e.searchForm,"date",t)},expression:"searchForm.date"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"喷带手："}},[r("el-input",{attrs:{placeholder:"请输入喷带手姓名"},model:{value:e.searchForm.caster,callback:function(t){e.$set(e.searchForm,"caster",t)},expression:"searchForm.caster"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"炉号："}},[r("el-input",{attrs:{placeholder:"请输入炉号"},model:{value:e.searchForm.furnace,callback:function(t){e.$set(e.searchForm,"furnace",t)},expression:"searchForm.furnace"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"重卷："}},[r("el-select",{attrs:{placeholder:"请选择重卷人姓名"},model:{value:e.searchForm.roller,callback:function(t){e.$set(e.searchForm,"roller",t)},expression:"searchForm.roller"}},e._l(e.rollerList,function(e){return r("el-option",{key:e.roller,attrs:{value:e.roller,label:e.rollerName}})}),1)],1),e._v(" "),r("el-form-item",[r("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:e.clickSearch}},[e._v("搜索")]),e._v(" "),r("el-button",{attrs:{type:"primary",icon:"el-icon-refresh"},on:{click:e.reset}},[e._v("重置")])],1)],1)],1),e._v(" "),r("div",{staticClass:"main_bd"},[r("el-col",{staticClass:"table_hd"},[e.isAddable?r("el-button",{attrs:{type:"primary",icon:"el-icon-success"},on:{click:e.handleConfirm}},[e._v("确认送检")]):e._e(),e._v(" "),e.isAddable?r("el-button",{attrs:{type:"primary",icon:"el-icon-plus"},on:{click:e.add}},[e._v("创建重卷记录")]):e._e(),e._v(" "),[1,2,3,4,15].includes(e.userinfo.roleId)?r("el-button",{staticClass:"pull_right",attrs:{type:"primary",icon:"el-icon-download"},on:{click:e.exportExcel}},[e._v("导出")]):e._e()],1),e._v(" "),r("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",staticStyle:{width:"100%"},attrs:{data:e.tableData,stripe:"",border:"",height:e.tableHeight},on:{"selection-change":e.handleSelectionChange}},[r("el-table-column",{attrs:{type:"selection",width:"20",selectable:e.setSelectable}}),e._v(" "),r("el-table-column",{attrs:{prop:"furnace",label:"炉号",align:"center","min-width":"130px"}}),e._v(" "),r("el-table-column",{attrs:{prop:"ribbonTypeName",label:"材质",align:"center","min-width":"60px"}}),e._v(" "),r("el-table-column",{attrs:{prop:"ribbonWidth",label:"规格",align:"center",width:"40px"}}),e._v(" "),r("el-table-column",{attrs:{prop:"castDate",label:"生产日期",align:"center",formatter:e.dateFormat,"min-width":"80px"}}),e._v(" "),r("el-table-column",{attrs:{prop:"caster",label:"喷带手",align:"center",width:"50px"}}),e._v(" "),r("el-table-column",{attrs:{prop:"coilNumber",label:"盘号",align:"center",width:"40px"}}),e._v(" "),r("el-table-column",{attrs:{prop:"diameter",label:"外径(mm)",align:"center",width:"70px"}}),e._v(" "),r("el-table-column",{attrs:{prop:"coilWeight",label:"重量(kg)",align:"center",width:"70px"}}),e._v(" "),r("el-table-column",{attrs:{prop:"rollMachine",label:"机器编号",align:"center",width:"70px"}}),e._v(" "),r("el-table-column",{attrs:{prop:"roller",label:"重卷人员",align:"center",width:"70px"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("span",[e._v(e._s(t.row.rollerName))])]}}])}),e._v(" "),r("el-table-column",{attrs:{prop:"createdAt",label:"重卷日期",align:"center",formatter:e.rollDateFormat,"min-width":"80px"}}),e._v(" "),r("el-table-column",{attrs:{label:"是否平整",align:"center",width:"60px"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("span",{class:{text_danger:1===t.row.isFlat}},[e._v(e._s(1===t.row.isFlat?"否":"是"))])]}}])}),e._v(" "),r("el-table-column",{attrs:{label:"操作",align:"center",width:"140px"},scopedSlots:e._u([{key:"default",fn:function(t){return[[1,2,3,4,15].includes(e.userinfo.roleId)?r("el-button",{attrs:{size:"mini",type:"primary",disabled:e.setIsEditable(t.row)},on:{click:function(r){e.edit(t.row)}}},[e._v("修改")]):e._e(),e._v(" "),[1,2,3,4,15].includes(e.userinfo.roleId)?r("el-button",{attrs:{size:"mini",type:"danger",disabled:e.setIsEditable(t.row)},on:{click:function(r){e.del(t.row)}}},[e._v("删除")]):e._e()]}}])})],1),e._v(" "),r("el-pagination",{attrs:{background:"",layout:"total,prev,pager,next",total:e.pageConfig.total,"current-page":e.pageConfig.current,"page-size":e.pageConfig.pageSize},on:{"update:currentPage":function(t){e.$set(e.pageConfig,"current",t)},"current-change":e.handleCurrentChange}})],1),e._v(" "),e.dialogVisible?r("dialog-form",{attrs:{rollerList:e.rollerList,dialogData:{formType:e.formType,dialogVisible:e.dialogVisible,rowData:e.rowData}},on:{close:e.closeHandler,submit:e.submitHandler}}):e._e()],1)},staticRenderFns:[]},N=r("VU/8")(I,O,!1,null,null,null);t.default=N.exports}});
//# sourceMappingURL=roll.e6a05486c3cc992c5640.js.map