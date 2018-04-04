webpackJsonp([38],{"1oog":function(t,e){},"7d8b":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=i("Dd8w"),a=i.n(s),l=i("NYxO"),n={created:function(){this.initView()},data:function(){return{invoiceReady:!1,invoiceDetail:{},mapStatus:{status:{0:"待审核",1:"待开票",2:"待修改",3:"开票完成",4:"开票取消"},type:{0:"普通发票",1:"专用发票"},sendType:{0:"纸质发票",1:"电子发票"}},orderList:{total:20,list:[]},orderParams:{page:1,rows:5},invoiceConfig:{billingMsg:[{label:"单位名称",key:"taxHead"},{label:"纳税人识别码",key:"taxpayerCode"},{label:"注册地址",key:"registerAddress"},{label:"注册电话",key:"registerPhone"},{label:"开户银行",key:"bankName"},{label:"银行账户",key:"bankAccount"}],checkMsg:[{label:"收票人姓名",key:"receivePerson"},{label:"收票人手机",key:"receivePhone"},{label:"电子邮箱",key:"receiveEmail"},{label:"收票人省份",key:"provinceCityDistrict"},{label:"详细地址",key:"receiveAddress"}],orderList:[{label:"订单编号",key:"orderNumber"},{label:"发货地",key:"sendingAddress"},{label:"商品实付金额（元）",key:"productRealPrice"},{label:"运费（元）",key:"freightMoney"},{label:"开票金额（元）",key:"applyMoney"}],invoiceMsg:{0:[{label:"快递公司",key:"logisticsChannel"},{label:"快递单号",key:"logisticsNumber"}],1:[{label:"备注",key:"remark"}],2:[{label:"发票代码",key:"code"},{label:"发票号码",key:"number"}]}},modalEdit:{isShow:!1,params:{operateNumber:"",code:"",number:"",sendType:0,logisticsChannel:"",logisticsNumber:"",remark:"已发送用户邮箱"}},logisticsChannelList:[]}},methods:a()({},Object(l.mapActions)(["getLogisticsChannel","getInvoiceOrder","exportInvoice","getInvoiceDetail","callSetNotice","commitInvoice"]),{initView:function(){var t=this.$route.query.operateNumber;this.operateNumber=t,this.setInvoiceDetail(),this.getOrderList()},setInvoiceDetail:function(){var t=this;this.getInvoiceDetail({operateNumber:this.operateNumber}).then(function(e){t.invoiceDetail=e,t.invoiceReady=!0})},getOrderList:function(){var t=this,e=this.operateNumber,i=a()({},this.orderParams,{operateNumber:e});this.getInvoiceOrder(i).then(function(e){t.orderList.list=e.rows,t.orderList.total=e.total})},handleSizeChange:function(t){this.orderParams.rows=t,this.getOrderList()},handleCurrentChange:function(t){this.orderParams.page=t,this.getOrderList()},toExport:function(){this.exportInvoice({operateNumber:this.operateNumber})},editInvoice:function(){var t=this;this.logisticsChannelList.length?this.modalEdit.isShow=!0:this.getLogisticsChannel().then(function(e){t.logisticsChannelList=e,t.modalEdit.isShow=!0})},cancelEdit:function(){var t=this;this.modalEdit.isShow=!1,this.$nextTick(function(){t.modalEdit.params={operateNumber:"",code:"",number:"",sendType:0,logisticsChannel:"",logisticsNumber:"",remark:"已发送用户邮箱"}})},submitEdit:function(){var t=this,e=/^[0-9a-zA-Z]+$/g;return this.modalEdit.params.code?this.modalEdit.params.code.match(e)?this.modalEdit.params.number?this.modalEdit.params.number.match(e)?0!=this.modalEdit.params.sendType||this.modalEdit.params.logisticsChannel?0!=this.modalEdit.params.sendType||this.modalEdit.params.logisticsNumber?0!=this.modalEdit.params.sendType||this.modalEdit.params.logisticsNumber.match(e)?1!=this.modalEdit.params.sendType||this.modalEdit.params.remark?(this.modalEdit.params.operateNumber=this.operateNumber,void this.commitInvoice(this.modalEdit.params).then(function(e){t.cancelEdit(),t.getNotice("开票成功"),t.setInvoiceDetail()})):(this.getNotice("请填写备注"),!1):(this.getNotice("物流单号只能输入字母和数字"),!1):(this.getNotice("请填写物流单号"),!1):(this.getNotice("请填写物流公司"),!1):(this.getNotice("发票号码只能输入字母和数字"),!1):(this.getNotice("请填写发票号码"),!1):(this.getNotice("发票代码只能输入字母和数字"),!1):(this.getNotice("请填写发票代码"),!1)},getNotice:function(t){var e={isShow:!0,msg:t};this.callSetNotice(e)}})},o=i("ZdUH"),c=i.n(o);var r=function(t){i("1oog")},d=i("VU/8")(n,c.a,!1,r,"data-v-7bca350f",null);e.default=d.exports},ZdUH:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("div",{staticClass:"title"},[i("span",[t._v("开票详情")]),t._v(" "),i("div",{staticClass:"fl-r pd-r"},[i("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(e){t.toExport()}}},[t._v("导出开票明细")]),t._v(" "),1==t.invoiceDetail.status?i("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(e){t.editInvoice()}}},[t._v("填写发票信息")]):t._e()],1)]),t._v(" "),t.invoiceReady?i("div",{staticClass:"section"},[i("div",{staticClass:"section-item"},[i("div",{staticClass:"inline-item"},[i("span",[t._v("推送时间："+t._s(t.invoiceDetail.auditTime))])]),t._v(" "),i("div",{staticClass:"inline-item"},[i("span",[t._v("开票进度："+t._s(t.mapStatus.status[t.invoiceDetail.status]))])]),t._v(" "),t._m(0),t._v(" "),i("div",{staticClass:"result-view mg-t-h"},[i("el-table",{staticStyle:{width:"100%"},attrs:{data:t.orderList.list}},[t._l(t.invoiceConfig.orderList,function(t,e){return[i("el-table-column",{attrs:{label:t.label,prop:t.key,align:"center"}})]})],2)],1),t._v(" "),i("el-pagination",{staticClass:"mg-t-h",attrs:{"current-page":t.orderParams.page,"page-sizes":[5],"page-size":t.orderParams.rows,layout:"total, sizes, prev, pager, next, jumper",total:t.orderList.total},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1),t._v(" "),i("div",{staticClass:"section-item"},[t._m(1),t._v(" "),i("div",{staticClass:"detail-box billing-msg"},[i("div",{staticClass:"block-item"},[i("span",{staticClass:"detail-sign"},[t._v("发票类型：")]),t._v("\n          "+t._s(t.mapStatus.type[t.invoiceDetail.type]?t.mapStatus.type[t.invoiceDetail.type]:"暂无信息")+"\n        ")]),t._v(" "),0==t.invoiceDetail.type?[i("div",{staticClass:"block-item"},[i("span",{staticClass:"detail-sign"},[t._v(t._s(0==t.invoiceDetail.headType?"发票抬头(个人)":"发票抬头(单位)")+"：")]),t._v("\n            "+t._s(t.invoiceDetail.taxHead)+"\n          ")]),t._v(" "),1==t.invoiceDetail.headType?i("div",{staticClass:"block-item"},[i("span",{staticClass:"detail-sign"},[t._v("纳税人注册码：")]),t._v("\n            "+t._s(t.invoiceDetail.taxpayerCode)+"\n          ")]):t._e()]:t._l(t.invoiceConfig.billingMsg,function(e,s){return i("div",{staticClass:"block-item"},[i("span",{staticClass:"detail-sign"},[t._v(t._s(e.label)+"：")]),t._v("\n            "+t._s(t.invoiceDetail[e.key]?t.invoiceDetail[e.key]:"暂无信息")+"\n          ")])})],2)]),t._v(" "),i("div",{staticClass:"section-item"},[t._m(2),t._v(" "),i("div",{staticClass:"detail-box"},t._l(t.invoiceConfig.checkMsg,function(e,s){return i("div",{staticClass:"block-item"},[i("span",{staticClass:"detail-sign"},[t._v(t._s(e.label)+"：")]),t._v("\n          "+t._s(t.invoiceDetail[e.key]?t.invoiceDetail[e.key]:"暂无信息")+"\n        ")])}))]),t._v(" "),i("div",{staticClass:"section-item"},[t._m(3),t._v(" "),i("div",{staticClass:"detail-box"},[3==t.invoiceDetail.status?[t._l(t.invoiceConfig.invoiceMsg[2],function(e,s){return i("div",{staticClass:"block-item"},[i("span",{staticClass:"detail-sign"},[t._v(t._s(e.label)+"：")]),t._v("\n            "+t._s(t.invoiceDetail[e.key])+"\n          ")])}),t._v(" "),i("div",{staticClass:"block-item"},[i("span",{staticClass:"detail-sign"},[t._v("出票类型：")]),t._v("\n            "+t._s(t.mapStatus.sendType[t.invoiceDetail.sendType])+"\n          ")]),t._v(" "),t._l(t.invoiceConfig.invoiceMsg[t.invoiceDetail.sendType],function(e,s){return i("div",{staticClass:"block-item"},[i("span",{staticClass:"detail-sign"},[t._v(t._s(e.label)+"：")]),t._v("\n            "+t._s(t.invoiceDetail[e.key])+"\n          ")])})]:i("span",[t._v("暂无")])],2)]),t._v(" "),i("div",{staticClass:"modal"},[i("el-dialog",{staticClass:"edit-model",attrs:{title:"发票信息",visible:t.modalEdit.isShow,size:"middle"},on:{"update:visible":function(e){t.$set(t.modalEdit,"isShow",e)}}},[i("div",{staticClass:"section"},[i("div",{staticClass:"block-item"},[i("span",[t._v("发票代码：")]),t._v(" "),i("el-input",{staticClass:"edit-input",attrs:{size:"small",placeholder:"请输入内容"},model:{value:t.modalEdit.params.code,callback:function(e){t.$set(t.modalEdit.params,"code","string"==typeof e?e.trim():e)},expression:"modalEdit.params.code"}})],1),t._v(" "),i("div",{staticClass:"block-item"},[i("span",[t._v("发票号码：")]),t._v(" "),i("el-input",{staticClass:"edit-input",attrs:{size:"small",placeholder:"请输入内容"},model:{value:t.modalEdit.params.number,callback:function(e){t.$set(t.modalEdit.params,"number","string"==typeof e?e.trim():e)},expression:"modalEdit.params.number"}})],1),t._v(" "),i("div",{staticClass:"block-item"},[i("span",[t._v("出票类型：")]),t._v(" "),i("el-radio",{staticClass:"radio",attrs:{label:0},model:{value:t.modalEdit.params.sendType,callback:function(e){t.$set(t.modalEdit.params,"sendType",e)},expression:"modalEdit.params.sendType"}},[t._v("纸质发票")]),t._v(" "),i("el-radio",{staticClass:"radio",attrs:{label:1},model:{value:t.modalEdit.params.sendType,callback:function(e){t.$set(t.modalEdit.params,"sendType",e)},expression:"modalEdit.params.sendType"}},[t._v("电子发票")])],1),t._v(" "),0==t.modalEdit.params.sendType?[i("div",{staticClass:"block-item"},[i("span",[t._v("快递公司：")]),t._v(" "),i("el-select",{staticClass:"edit-input",attrs:{filterable:"",clearable:"",size:"small",placeholder:"请选择快递公司"},model:{value:t.modalEdit.params.logisticsChannel,callback:function(e){t.$set(t.modalEdit.params,"logisticsChannel",e)},expression:"modalEdit.params.logisticsChannel"}},[t._l(t.logisticsChannelList,function(t){return[i("el-option",{attrs:{label:t.desc,value:t.desc}})]})],2)],1),t._v(" "),i("div",{staticClass:"block-item"},[i("span",[t._v("快递单号：")]),t._v(" "),i("el-input",{staticClass:"edit-input",attrs:{size:"small",placeholder:"请输入内容"},model:{value:t.modalEdit.params.logisticsNumber,callback:function(e){t.$set(t.modalEdit.params,"logisticsNumber","string"==typeof e?e.trim():e)},expression:"modalEdit.params.logisticsNumber"}})],1)]:[i("div",{staticClass:"block-item"},[i("span",[t._v("备注：")]),t._v(" "),i("el-input",{staticClass:"edit-input",attrs:{size:"small",placeholder:"请输入内容"},model:{value:t.modalEdit.params.remark,callback:function(e){t.$set(t.modalEdit.params,"remark","string"==typeof e?e.trim():e)},expression:"modalEdit.params.remark"}})],1)]],2),t._v(" "),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(e){t.cancelEdit()}}},[t._v("取消")]),t._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:function(e){t.submitEdit()}}},[t._v("确定")])],1)])],1)]):t._e()])},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"section-title"},[e("span",[this._v("订单信息")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"section-title"},[e("span",[this._v("开票信息")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"section-title"},[e("span",[this._v("收票信息")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"section-title"},[e("span",[this._v("发票信息")])])}]}}});
//# sourceMappingURL=38.caf10f071ae15d304cfe.js.map