webpackJsonp([26],{OXj7:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("Dd8w"),a=s.n(i),l=s("NYxO"),p={name:"",created:function(){this.initView()},computed:a()({},Object(l.mapState)(["deliveryList"])),data:function(){return{pickerOptions:{disabledDate:function(t){return t.getTime()<Date.now()-864e5}},applyOpts:{file:null,applyType:"1",sellerId:"",startTime:"",endTime:"",extendType:"",extendValue:"",reason:""},picUpload:{picFile:null,getSize:1},uploadFileList:{isShow:!1,name:""},deliverySelectList:[],disabled:!0,radioReason:"",mapRadioReason:{1:"缺货",2:"清关异常",3:""},showFileList:!1,mapShippingValid:{},extendValueShippingValid:"0"}},methods:a()({},Object(l.mapActions)(["getDeliveryArea","callSetNotice","downApplyTemplate","addOrderExtendApply"]),{initView:function(){var t=this;this.getDeliveryArea().then(function(e){t.setDeliveryListOpt(e)})},setDeliveryListOpt:function(t){var e=[],s={};t.forEach(function(t,i){var a={label:t.sendAddress,value:t.id};s[t.id]=t.shippingValid,e.push(a)}),this.deliverySelectList=e,this.mapShippingValid=s},selectLevel:function(){this.extendValueShippingValid=this.mapShippingValid[this.applyOpts.sellerId]},checkDate:function(t,e,s,i){if("startTime"==t&&this.applyOpts[t]&&this.applyOpts[t].getTime()<(new Date).getTime()+36e5)return this.getNotice("开始时间大于当前时间1小时"),this.applyOpts[t]="",!1;this.applyOpts[t]=Util.formatDate("yyyy-mm-dd hh:mm:ss",this.applyOpts[t]),s&&i&&(s=Util.formatDate("yyyy-mm-dd hh:mm:ss",s),i=Util.formatDate("yyyy-mm-dd hh:mm:ss",i),Util.formatDateCom(s,i)&&(this.applyOpts[e]=""))},beforeDownUpload:function(t){t.type;return{xls:"xls",xlsx:"xlsx"}[t.name.split(".").pop()]?(this.applyOpts.file=t,this.uploadFileList.isShow=!0,this.uploadFileList.name=t.name,!1):(this.getNotice("上传文件格式不正确"),!1)},beforeUpload:function(t){var e="image/jpeg"===t.type||"image/png"===t.type,s=t.size/1024<400;return e?s?(e&&s&&(this.applyOpts.file=t,this.uploadFileList.isShow=!0,this.uploadFileList.name=t.name),!1):(this.getNotice("上传头像图片大小不能超过 400KB!"),!1):(this.getNotice("上传图片格式不正确"),!1)},callDownApplyTemplate:function(){this.downApplyTemplate()},submitApply:function(){var t=this;if(1==this.applyOpts.applyType&&!this.applyOpts.sellerId)return this.getNotice("请选择发货地"),!1;if(!this.applyOpts.reason)return this.getNotice("请填写原因"),!1;if(1==this.applyOpts.applyType&&this.applyOpts.reason.length>100)return this.getNotice("申诉原因长度小于100字"),!1;if(2==this.applyOpts.applyType&&this.applyOpts.reason.length>20)return this.getNotice("申诉原因长度小于20字"),!1;if(!this.applyOpts.extendType)return this.getNotice("请选择类型"),!1;if(!this.applyOpts.extendValue&&1==this.applyOpts.extendType)return this.getNotice("请填写承诺时间点"),!1;if(!this.applyOpts.extendValue&&2==this.applyOpts.extendType)return this.getNotice("请填写延长揽件时效"),!1;if(!this.applyOpts.extendValue.match(/^[1-9]{1}[0-9]*$/g)&&2==this.applyOpts.extendType)return this.getNotice("延长揽件时效请输入整数"),!1;if(1==this.applyOpts.applyType){if(!this.applyOpts.startTime)return this.getNotice("请选择开始时间"),!1;if(!this.applyOpts.endTime)return this.getNotice("请选择结束时间"),!1}else if(2==this.applyOpts.applyType&&!this.applyOpts.file)return this.getNotice("请选择附件"),!1;this.addOrderExtendApply(this.applyOpts).then(function(){t.$router.push({path:"/order/timeout/record"})})},getNotice:function(t){var e={isShow:!0,msg:t};this.callSetNotice(e)}}),watch:{"applyOpts.extendType":function(t,e){this.applyOpts.extendValue=""},extendValueShippingValid:function(t,e){this.applyOpts.extendType},"applyOpts.applyType":function(t,e){this.applyOpts.extendValue="",this.applyOpts.extendType="",this.applyOpts.reason="",this.applyOpts.sellerId="",this.applyOpts.startTime="",this.applyOpts.endTime="",this.extendValueShippingValid="",this.applyOpts.file=null,this.uploadFileList.isShow=!1,this.uploadFileList.name=""},radioReason:function(t,e){this.applyOpts.reason=this.mapRadioReason[t]}}},n=s("qwnn"),c=s.n(n);var o=function(t){s("xFrh")},r=s("VU/8")(p,c.a,!1,o,"data-v-e5f4bb5e",null);e.default=r.exports},qwnn:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[t._m(0),t._v(" "),s("div",{staticClass:"section"},[s("div",{staticClass:"section-item"},[s("div",{staticClass:"block-item"},[t._m(1),t._v(" "),s("div",{staticClass:"inline-item"},[s("el-radio",{staticClass:"radio",attrs:{label:"1"},model:{value:t.applyOpts.applyType,callback:function(e){t.$set(t.applyOpts,"applyType",e)},expression:"applyOpts.applyType"}},[t._v("申请延长发货时效(未产生订单)")]),t._v(" "),s("el-radio",{staticClass:"radio",attrs:{label:"2"},model:{value:t.applyOpts.applyType,callback:function(e){t.$set(t.applyOpts,"applyType",e)},expression:"applyOpts.applyType"}},[t._v("报备已产生订单异常情况(仅能报备未发货订单)")])],1)]),t._v(" "),1==t.applyOpts.applyType?[s("div",{staticClass:"block-item"},[t._m(2),t._v(" "),s("div",{staticClass:"inline-item"},[s("el-select",{staticClass:"input-item-middle",attrs:{placeholder:"请选择",size:"small"},on:{change:function(e){t.selectLevel()}},model:{value:t.applyOpts.sellerId,callback:function(e){t.$set(t.applyOpts,"sellerId",e)},expression:"applyOpts.sellerId"}},[t._l(t.deliverySelectList,function(t){return[s("el-option",{attrs:{label:t.label,value:t.value}})]})],2)],1)]),t._v(" "),s("div",{staticClass:"block-item"},[t._m(3),t._v(" "),s("div",{staticClass:"inline-item"},[s("el-date-picker",{staticClass:"input-item-middle",attrs:{"picker-options":t.pickerOptions,type:"datetime",size:"small",placeholder:"请选择"},on:{change:function(e){t.checkDate("startTime","endTime",t.applyOpts.startTime,t.applyOpts.endTime)}},model:{value:t.applyOpts.startTime,callback:function(e){t.$set(t.applyOpts,"startTime",e)},expression:"applyOpts.startTime"}})],1)]),t._v(" "),s("div",{staticClass:"block-item"},[t._m(4),t._v(" "),s("div",{staticClass:"inline-item"},[s("el-date-picker",{staticClass:"input-item-middle",attrs:{"picker-options":t.pickerOptions,type:"datetime",size:"small",placeholder:"请选择"},on:{change:function(e){t.checkDate("endTime","endTime",t.applyOpts.startTime,t.applyOpts.endTime)}},model:{value:t.applyOpts.endTime,callback:function(e){t.$set(t.applyOpts,"endTime",e)},expression:"applyOpts.endTime"}})],1)]),t._v(" "),s("div",{staticClass:"block-item"},[t._m(5),t._v(" "),s("div",{staticClass:"inline-item"},[s("el-radio",{staticClass:"radio l-h-30",attrs:{label:"1"},model:{value:t.applyOpts.extendType,callback:function(e){t.$set(t.applyOpts,"extendType",e)},expression:"applyOpts.extendType"}},[t._v("承诺时间点")]),t._v(" "),1==t.applyOpts.extendType?[s("span",[t._v("预计完成发货时间：")]),t._v(" "),s("el-date-picker",{staticClass:"input-item-middle",attrs:{"picker-options":t.pickerOptions,type:"datetime",size:"small",placeholder:"请选择"},on:{change:function(e){t.checkDate("extendValue","extendValue",t.applyOpts.startTime,t.applyOpts.extendValue)}},model:{value:t.applyOpts.extendValue,callback:function(e){t.$set(t.applyOpts,"extendValue",e)},expression:"applyOpts.extendValue"}})]:t._e(),t._v(" "),s("br"),t._v(" "),s("el-radio",{staticClass:"radio",attrs:{label:"2"},model:{value:t.applyOpts.extendType,callback:function(e){t.$set(t.applyOpts,"extendType",e)},expression:"applyOpts.extendType"}},[t._v("延长揽件时效")]),t._v(" "),2==t.applyOpts.extendType?[s("span",[t._v("付款当天剩余时间+ "+t._s(t.extendValueShippingValid)+"天揽件时效  +")]),t._v(" "),s("el-input",{staticClass:"input-item",attrs:{size:"small"},model:{value:t.applyOpts.extendValue,callback:function(e){t.$set(t.applyOpts,"extendValue",e)},expression:"applyOpts.extendValue"}}),t._v(" "),s("span",[t._v("天揽件时效")])]:t._e()],2)]),t._v(" "),s("div",{staticClass:"block-item"},[t._m(6),t._v(" "),s("div",{staticClass:"inline-item"},[s("el-input",{staticClass:"area-item-large",attrs:{rows:6,resize:"none",placeholder:"请输入申请原因",type:"textarea",size:"small"},model:{value:t.applyOpts.reason,callback:function(e){t.$set(t.applyOpts,"reason",e)},expression:"applyOpts.reason"}})],1)]),t._v(" "),s("div",{staticClass:"block-item"},[t._m(7),t._v(" "),s("div",{staticClass:"inline-item"},[s("el-upload",{ref:"imgUpload",attrs:{"show-file-list":!1,action:"/sellerAdmin/pic/upload","before-upload":t.beforeUpload}},[s("el-button",{attrs:{size:"small",type:"primary"}},[t._v("点击上传")])],1),t._v(" "),t.uploadFileList.isShow?s("ul",{staticClass:"el-upload-list el-upload-list--text"},[s("li",{staticClass:"el-upload-list__item is-ready"},[s("a",{staticClass:"el-upload-list__item-name"},[s("i",{staticClass:"el-icon-document"}),t._v(t._s(t.uploadFileList.name))])])]):t._e()],1)])]:2==t.applyOpts.applyType?[s("div",{staticClass:"block-item"},[t._m(8),t._v(" "),s("div",{staticClass:"inline-item"},[s("el-radio",{staticClass:"radio l-h-30",attrs:{label:"1"},model:{value:t.applyOpts.extendType,callback:function(e){t.$set(t.applyOpts,"extendType",e)},expression:"applyOpts.extendType"}},[t._v("承诺时间点")]),t._v(" "),1==t.applyOpts.extendType?[s("span",[t._v("预计发货完成时间：")]),t._v(" "),s("el-date-picker",{staticClass:"input-item-middle",attrs:{"picker-options":t.pickerOptions,type:"datetime",size:"small",placeholder:"请选择"},on:{change:function(e){t.checkDate("extendValue","","","")}},model:{value:t.applyOpts.extendValue,callback:function(e){t.$set(t.applyOpts,"extendValue",e)},expression:"applyOpts.extendValue"}})]:t._e(),t._v(" "),s("br"),t._v(" "),s("el-radio",{staticClass:"radio",attrs:{label:"2"},model:{value:t.applyOpts.extendType,callback:function(e){t.$set(t.applyOpts,"extendType",e)},expression:"applyOpts.extendType"}},[t._v("+")]),t._v(" "),2==t.applyOpts.extendType?s("el-input",{staticClass:"input-item",attrs:{size:"small"},model:{value:t.applyOpts.extendValue,callback:function(e){t.$set(t.applyOpts,"extendValue",e)},expression:"applyOpts.extendValue"}}):s("el-input",{staticClass:"input-item",attrs:{disabled:"",size:"small"}}),t._v(" "),s("span",[t._v("天揽件时效")]),t._v(" "),s("br"),t._v(" "),s("el-radio",{staticClass:"radio",attrs:{label:"3"},model:{value:t.applyOpts.extendType,callback:function(e){t.$set(t.applyOpts,"extendType",e)},expression:"applyOpts.extendType"}},[t._v("无法发货")])],2)]),t._v(" "),s("div",{staticClass:"block-item"},[t._m(9),t._v(" "),s("div",{staticClass:"inline-item"},[s("el-radio",{staticClass:"radio",attrs:{label:"1"},model:{value:t.radioReason,callback:function(e){t.radioReason=e},expression:"radioReason"}},[t._v("缺货")]),t._v(" "),s("el-radio",{staticClass:"radio",attrs:{label:"3"},model:{value:t.radioReason,callback:function(e){t.radioReason=e},expression:"radioReason"}},[t._v("其他")]),t._v(" "),3==t.radioReason?s("el-input",{staticClass:"input-item-middle",attrs:{size:"small"},model:{value:t.applyOpts.reason,callback:function(e){t.$set(t.applyOpts,"reason",e)},expression:"applyOpts.reason"}}):t._e()],1)]),t._v(" "),s("div",{staticClass:"block-item"},[t._m(10),t._v(" "),s("div",{staticClass:"inline-item",staticStyle:{position:"relative"}},[s("el-button",{staticClass:"down-btn",attrs:{size:"small",type:"primary"},on:{click:function(e){t.callDownApplyTemplate()}}},[t._v("下载模板")]),t._v(" "),s("el-upload",{ref:"xmlUpload",staticStyle:{display:"inline-block",width:"500px"},attrs:{"show-file-list":!1,action:"/sellerAdmin/pic/upload","before-upload":t.beforeDownUpload}},[s("el-button",{attrs:{size:"small",type:"primary"}},[t._v("上传")])],1),t._v(" "),t.uploadFileList.isShow?s("ul",{staticClass:"el-upload-list el-upload-list--text"},[s("li",{staticClass:"el-upload-list__item is-ready"},[s("a",{staticClass:"el-upload-list__item-name"},[s("i",{staticClass:"el-icon-document"}),t._v(t._s(t.uploadFileList.name))])])]):t._e()],1)])]:t._e()],2),t._v(" "),s("div",{staticClass:"menu",staticStyle:{"text-align":"center"}},[s("el-button",{attrs:{type:"primary"},on:{click:function(e){t.submitApply()}}},[t._v("提交")])],1)])])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"title"},[e("span",[this._v("报备超时发货")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("span",{staticClass:"section-item-sign"},[e("span",{staticClass:"sign-required"},[this._v("*")]),this._v("报备类型：\n        ")])},function(){var t=this.$createElement,e=this._self._c||t;return e("span",{staticClass:"section-item-sign"},[e("span",{staticClass:"sign-required"},[this._v("*")]),this._v("发货地：\n          ")])},function(){var t=this.$createElement,e=this._self._c||t;return e("span",{staticClass:"section-item-sign"},[e("span",{staticClass:"sign-required"},[this._v("*")]),this._v("付款开始时间：\n          ")])},function(){var t=this.$createElement,e=this._self._c||t;return e("span",{staticClass:"section-item-sign"},[e("span",{staticClass:"sign-required"},[this._v("*")]),this._v("付款结束时间：\n          ")])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"section-item-sign-wrap"},[e("span",{staticClass:"section-item-sign"},[e("span",{staticClass:"sign-required l-h-30"},[this._v("*")]),this._v("申请类型：\n            ")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"section-item-sign-wrap"},[e("span",{staticClass:"section-item-sign"},[e("span",{staticClass:"sign-required"},[this._v("*")]),this._v("申请原因：\n            ")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"section-item-sign-wrap"},[e("span",{staticClass:"section-item-sign"},[this._v("\n            附件：\n          ")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"section-item-sign-wrap"},[e("span",{staticClass:"section-item-sign"},[e("span",{staticClass:"sign-required l-h-30"},[this._v("*")]),this._v("申请类型：\n            ")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("span",{staticClass:"section-item-sign"},[e("span",{staticClass:"sign-required"},[this._v("*")]),this._v("申请原因：\n          ")])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"section-item-sign-wrap"},[e("span",{staticClass:"section-item-sign"},[e("span",{staticClass:"sign-required"},[this._v("*")]),this._v("附件：\n            ")])])}]}},xFrh:function(t,e){}});
//# sourceMappingURL=26.52321f027fe5159946ca.js.map