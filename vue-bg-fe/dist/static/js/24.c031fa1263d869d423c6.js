webpackJsonp([24],{"L/dU":function(e,t){},Yl4p:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=s("mvHQ"),a=s.n(i),l=s("Dd8w"),r=s.n(l),n=s("NYxO"),c={name:"editFreight",computed:r()({},Object(n.d)(["logisticsChannel","allCity","newGoods"])),created:function(){this.initView()},data:function(){return{resultItem:{option:[{type:"single",label:"物流方式",key:"expressId",width:"150"},{label:"省份地区",key:"provinceCodes",width:"400",type:"province"},{label:"首重(克)",key:"firstWeight",width:"90"},{label:"首重金额(元)",key:"firstWeightPrice",width:"100"},{label:"续重(克)",key:"continueWeight",width:"90"},{label:"续重金额(元)",key:"continueWeightPrice",width:"100"},{label:"操作",key:"",type:"opera",width:""}]},saveTemp:{},detailReady:!1,freightSubmitType:"",mapExpressId:{},mapProvince:{},modalArea:{isShow:!1,cityArr:[{name:"华东",cities:[{name:"上海",id:"310000"},{name:"江苏",id:"320000"},{name:"浙江",id:"330000"},{name:"安徽",id:"340000"},{name:"山东",id:"370000"},{name:"福建",id:"350000"},{name:"江西",id:"360000"}],checkAll:!1,checkedCities:[],isIndeterminate:!1,disableAll:!1},{name:"华北",cities:[{name:"北京",id:"110000"},{name:"天津",id:"120000"},{name:"河北",id:"130000"},{name:"山西",id:"140000"},{name:"内蒙古",id:"150000"}],checkAll:!1,checkedCities:[],isIndeterminate:!1,disableAll:!1},{name:"华中",cities:[{name:"湖北",id:"420000"},{name:"湖南",id:"430000"},{name:"河南",id:"410000"}],checkAll:!1,checkedCities:[],isIndeterminate:!1,disableAll:!1},{name:"华南",cities:[{name:"广东",id:"440000"},{name:"广西",id:"450000"},{name:"海南",id:"460000"}],checkAll:!1,checkedCities:[],isIndeterminate:!1,disableAll:!1},{name:"东北",cities:[{name:"辽宁",id:"210000"},{name:"吉林",id:"220000"},{name:"黑龙江",id:"230000"}],checkAll:!1,checkedCities:[],isIndeterminate:!1,disableAll:!1},{name:"西北",cities:[{name:"宁夏",id:"640000"},{name:"新疆",id:"650000"},{name:"青海",id:"630000"},{name:"陕西",id:"610000"},{name:"甘肃",id:"620000"}],checkAll:!1,checkedCities:[],isIndeterminate:!1,disableAll:!1},{name:"西南",cities:[{name:"四川",id:"510000"},{name:"云南",id:"530000"},{name:"贵州",id:"520000"},{name:"西藏",id:"540000"},{name:"重庆",id:"500000"}],checkAll:!1,checkedCities:[],isIndeterminate:!1,disableAll:!1}],line:"",idx:""},disableConfig:{},modalExpress:{isShow:!1,expressCode:""},modalDefaultExpress:{isShow:!1,defaultExpressCode:""},modalTips:{isShow:!1},shipAddressId:"",filterFreightTempExpress:[],isChangeName:!0,checkFreightStatus:!0,freightTempExpress:[]}},methods:r()({},Object(n.b)(["getFreightTempDetail","getAllCity","saveFreightTemp","callSetNotice","getFreightTemplateExpressList","checkFreightName"]),{initView:function(){var e=this,t=this.$route.query;this.shipAddressId=t.shipAddress,this.getFreightTemplateExpressList({shippingAddressId:this.shipAddressId}).then(function(t){e.freightTempExpress=t,e.setMapExpressId()}),!localStorage.getItem("allCityStorage")||localStorage.getItem("allCityStorage").length<1e4?this.getAllCity().then(function(){localStorage.setItem("allCityStorage",a()(e.allCity.data)),e.setMapProvince()}):this.setMapProvince(),this.getFreightTempDetail(t).then(function(t){e.saveTemp=t,e.saveTemp.reason="",2==e.saveTemp.freightSubmitType&&e.setDefaultInit(),e.detailReady=!0})},setDefaultInit:function(){if(this.saveTemp.expressList&&this.saveTemp.expressList.length)for(var e=0;1!=this.saveTemp.expressList[e].defaultTag;)if(++e==this.saveTemp.expressList.length){this.saveTemp.expressList[0].defaultTag=1;break}},setMapExpressId:function(){var e=this;this.freightTempExpress.forEach(function(t,s){e.mapExpressId[t.code]=t.desc}),this.mapExpressReady=!0},setMapProvince:function(){var e=this;JSON.parse(localStorage.getItem("allCityStorage")).provinceList.forEach(function(t,s){e.disableConfig[t.provinceId]=!1,e.mapProvince[t.provinceId]=t.name}),this.mapProvinceReady=!0},addProvince:function(e){var t={id:"",templateExpressId:this.saveTemp.expressList[e].templateExpressId||"",firstWeight:"",firstWeightPrice:"",continueWeight:"",continueWeightPrice:"",provinceCodes:""};this.saveTemp.expressList[e].areaPriceList.push(t)},delProvince:function(e,t){if(this.saveTemp.expressList[e].areaPriceList.length>1)this.saveTemp.expressList[e].areaPriceList.splice(t,1);else{if(!(this.saveTemp.expressList.length>1))return this.getNotice("最后一条别删了"),!1;this.saveTemp.expressList.splice(e,1),this.setDefaultInit()}},callChooseArea:function(e,t){var s=this;this.saveTemp.expressList[e].areaPriceList.map(function(e){e.provinceCodes.split(",").map(function(e){s.disableConfig[e]=!0})});var i=this.saveTemp.expressList[e].areaPriceList[t].provinceCodes.split(",");this.modalArea.line=e,this.modalArea.idx=t,this.modalArea.cityArr.map(function(e){e.cities.map(function(t){i.map(function(i){s.disableConfig[i]=!1,i==t.id&&e.checkedCities.push(i)}),s.disableConfig[t.id]&&(e.disableAll=!0)}),e.isIndeterminate=e.checkedCities.length>0&&e.checkedCities.length<e.cities.length,e.checkAll=e.checkedCities.length===e.cities.length}),this.modalArea.isShow=!0},handleCheckAllChange:function(e,t){var s=this.modalArea.cityArr[e];s.checkedCities=t.target.checked?s.cities.map(function(e){return e.id}):[],s.isIndeterminate=!1},handleCheckedCitiesChange:function(e){var t=this.modalArea.cityArr[e],s=t.checkedCities.length;t.checkAll=s===t.cities.length,t.isIndeterminate=s>0&&s<t.cities.length},saveArea:function(){var e=this,t=[];if(this.modalArea.cityArr.forEach(function(e,s){e.checkedCities.length&&e.checkedCities.forEach(function(e,s){t.push(e)})}),!t.length)return this.getNotice("请选择区域"),!1;var s={};this.saveTemp.expressList[this.modalArea.line].areaPriceList.map(function(t,i){i!=e.modalArea.idx&&t.provinceCodes&&t.provinceCodes.split(",").map(function(e){s[e]=e})});var i=!0,a="";for(var l in t)s[t[l]]&&(i=!1,a+=this.mapProvince[t[l]]+" ");if(!i)return this.getNotice("该物流下已存在"+a),!1;this.saveTemp.expressList[this.modalArea.line].areaPriceList[this.modalArea.idx].provinceCodes=t.join(","),this.cancelArea()},cancelArea:function(){for(var e in this.modalArea.cityArr.map(function(e,t){e.checkedCities=[],e.isIndeterminate=!1,e.checkAll=!1,e.disableAll=!1}),this.modalArea.line="",this.modalArea.idx="",this.disableConfig)this.disableConfig[e]=!1;this.modalArea.isShow=!1},callAddExpress:function(){var e=this;this.saveTemp.expressList&&this.saveTemp.expressList.length,this.freightTempExpress.length?this.filterExpress():this.getFreightTemplateExpressList({shippingAddressId:this.shipAddressId}).then(function(){e.filterExpress()})},filterExpress:function(){if(this.filterFreightTempExpress=JSON.parse(a()(this.freightTempExpress)),this.saveTemp.expressList&&this.saveTemp.expressList.length){var e=[];this.saveTemp.expressList.map(function(t){e.push(t.expressId)}),this.filterFreightTempExpress=this.filterFreightTempExpress.filter(function(t){var s=!0;for(var i in e)if(e[i]==t.code)return s=!1,!1;return s})}this.modalExpress.isShow=!0},saveExpress:function(){if(this.saveTemp.expressList=this.saveTemp.expressList||[],!this.modalExpress.expressCode.length)return this.getNotice("请选择要新增的物流"),!1;for(var e in this.saveTemp.expressList.length,this.modalExpress.expressCode.length,this.modalExpress.expressCode){var t={id:"",templateId:"",expressId:this.modalExpress.expressCode[e],defaultTag:this.saveTemp.expressList.length?0:1,areaPriceList:[]};this.saveTemp.expressList.push(t),this.addProvince(this.saveTemp.expressList.length-1)}this.cancelExpress()},cancelExpress:function(){this.modalExpress.isShow=!1,this.modalExpress.expressCode=[]},callSetDefaultExpress:function(){var e=this;if(!this.saveTemp.expressList||!this.saveTemp.expressList.length)return this.getNotice("暂无物流方式"),!1;this.saveTemp.expressList.forEach(function(t){1==t.defaultTag&&(e.modalDefaultExpress.defaultExpressCode=t.expressId)}),this.modalDefaultExpress.isShow=!0},saveDefaultExpress:function(){var e=this;this.saveTemp.expressList.forEach(function(t){t.defaultTag=t.expressId==e.modalDefaultExpress.defaultExpressCode?1:0}),this.cancelDefaultExpress()},cancelDefaultExpress:function(){this.modalDefaultExpress.isShow=!1,this.modalDefaultExpress.defaultExpressCode=""},callSaveTemp:function(){var e=this,t=/^[1-9]{1}[0-9]*$/g,s=/^[1-9]{1}[0-9]*(\.[0-9]{1,2})?$/g;if(2==this.saveTemp.freightSubmitType&&!this.saveTemp.name)return this.getNotice("请输入运费模板名称"),!1;if(2==this.saveTemp.freightSubmitType&&this.saveTemp.name.length>10)return this.getNotice("运费模板名称长度小于10"),!1;if(2==this.saveTemp.freightSubmitType&&!this.checkFreightStatus)return this.getNotice("运费模板名称重复"),!1;if(1==this.saveTemp.freightSubmitType&&!this.saveTemp.freight)return this.getNotice("请输入每订单运费"),!1;if(1==this.saveTemp.freightSubmitType&&0!=this.saveTemp.freight&&!(this.saveTemp.freight+"").match(s))return this.getNotice("每订单运费支持两位小数"),!1;if(2==this.saveTemp.freightSubmitType&&!this.saveTemp.expressList)return this.getNotice("请添加发货物流"),!1;if(2==this.saveTemp.freightSubmitType)for(var i in this.saveTemp.expressList){var l=this.saveTemp.expressList[i],r=this.mapExpressId[l.expressId],n=0;for(var c in l.areaPriceList){var o=l.areaPriceList[c];if(!o.provinceCodes)return this.getNotice("请选择"+r+"物流的第"+(Number(c)+1)+"条的省份地区"),!1;if(n+=o.provinceCodes.split(",").length,!(o.continueWeight&&o.continueWeightPrice&&o.firstWeight&&o.firstWeightPrice))return this.getNotice("请选择"+r+"物流的第"+(Number(c)+1)+"条的重量金额信息"),!1;if(!(o.continueWeight+"").match(t)||!(o.firstWeight+"").match(t))return this.getNotice(r+"物流的第"+(Number(c)+1)+"条的重量格式不正确"),!1;if(!(o.continueWeightPrice+"").match(s)||!(o.firstWeightPrice+"").match(s))return this.getNotice(r+"物流的第"+(Number(c)+1)+"条的金额格式不正确"),!1}if(n<31)return this.getNotice("请选择"+r+"物流的全部省份"),!1}if(!this.saveTemp.reason)return this.getNotice("请输入原因"),!1;if(this.saveTemp.reason.length>50)return this.getNotice("原因字数大于50字"),!1;var p=JSON.parse(a()(this.saveTemp));delete p.updateTime,delete p.auditStatus,delete p.canUseTemplate,delete p.createTime,delete p.isAvailable,delete p.sendAddress,this.saveFreightTemp(p).then(function(){e.$router.push({path:"/freight/temp"})})},canUseTemplate:function(){this.saveTemp.freightSubmitType=1,this.modalTips.isShow=!0},getNotice:function(e){var t={isShow:!0,msg:e};this.callSetNotice(t)},checkName:function(){var e;return clearTimeout(e),void(e=setTimeout(function(){this.checkNameBlur()},500))},initCheckName:function(){this.checkFreightStatus=!0},checkNameBlur:function(){var e=this;this.saveTemp.name&&this.checkFreightName({name:this.saveTemp.name,shipAddress:this.shipAddressId}).then(function(t){t&&(e.checkFreightStatus=!1)})}}),watch:{"saveTemp.freightSubmitType":function(e,t){2!=e||this.saveTemp.canUseTemplate||this.canUseTemplate()}}},o={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[e._m(0),e._v(" "),e.detailReady?s("div",{staticClass:"section"},[s("div",{staticClass:"section-item"},[s("div",{staticClass:"block-item"},[s("span",{staticClass:"section-item-sign"},[e._v("\n            发货地：\n        ")]),e._v(" "),s("div",{staticClass:"inline-item"},[s("span",[e._v(e._s(e.saveTemp.sendAddress))])])]),e._v(" "),s("div",{staticClass:"block-item"},[s("span",{staticClass:"section-item-sign"},[e._v("\n            运费计算方式：\n        ")]),e._v(" "),s("div",{staticClass:"block-item"},[s("el-radio",{staticClass:"radio",attrs:{label:1},model:{value:e.saveTemp.freightSubmitType,callback:function(t){e.$set(e.saveTemp,"freightSubmitType",t)},expression:"saveTemp.freightSubmitType"}},[e._v("每订单运费 ")]),e._v(" "),1==e.saveTemp.freightSubmitType?s("el-input",{staticClass:"input-item-middle",attrs:{placeholder:"请输入每订单运费",size:"small"},model:{value:e.saveTemp.freight,callback:function(t){e.$set(e.saveTemp,"freight",t)},expression:"saveTemp.freight"}}):e._e(),e._v(" "),s("br")],1),e._v(" "),s("div",{staticClass:"block-item"},[s("el-radio",{staticClass:"radio",attrs:{label:2},on:{click:function(t){e.canUseTemplate()}},model:{value:e.saveTemp.freightSubmitType,callback:function(t){e.$set(e.saveTemp,"freightSubmitType",t)},expression:"saveTemp.freightSubmitType"}},[e._v("按重量、配送区域计价")]),e._v(" "),2==e.saveTemp.freightSubmitType?[s("el-button",{attrs:{size:"small",type:"primary"},on:{click:e.callAddExpress}},[e._v("添加物流方式")]),e._v(" "),s("el-button",{attrs:{size:"small",type:"primary"},on:{click:e.callSetDefaultExpress}},[e._v("设置默认物流")]),e._v(" "),s("div",{staticClass:"mg-t-h"},[e._m(1),e._v(" "),s("div",{staticClass:"inline-item"},[s("el-input",{staticClass:"input-item",attrs:{size:"small"},on:{blur:e.checkNameBlur,focus:e.initCheckName},model:{value:e.saveTemp.name,callback:function(t){e.$set(e.saveTemp,"name",t)},expression:"saveTemp.name"}}),e._v(" "),e.checkFreightStatus?e._e():s("span",{staticClass:"primary-color"},[e._v("运费模板名称重复")])],1)])]:e._e()],2)]),e._v(" "),2==e.saveTemp.freightSubmitType?s("div",{staticClass:"result-view mg-b"},[s("el-table",{staticStyle:{width:"100%"},attrs:{border:"",data:e.saveTemp.expressList}},[e._l(e.resultItem.option,function(t,i){return["single"==t.type?s("el-table-column",{attrs:{fixed:t.fixed,prop:t.key,label:t.label,width:t.width,align:"center"},scopedSlots:e._u([{key:"default",fn:function(i){return[e._v("\n               "+e._s(e.mapExpressId[i.row[t.key]])+" "),i.row.defaultTag?s("span",[e._v("(默认)")]):e._e(),e._v(" "),s("div",[s("el-button",{attrs:{size:"small",type:"primary"},on:{click:function(t){e.addProvince(i.$index)}}},[e._v("添加地区设置")])],1)]}}])}):s("el-table-column",{attrs:{fixed:t.fixed,prop:t.key,label:t.label,width:t.width,align:"center"},scopedSlots:e._u([{key:"default",fn:function(i){return[s("div",{staticClass:"line-wrap"},[e._l(i.row.areaPriceList,function(a,l){return["province"==t.type?s("div",{staticClass:"line-item o-h"},[s("div",{staticClass:"map-province fl-l pd-l pd-r",staticStyle:{width:"300px","min-height":"20px","text-align":"left"}},[s("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:a[t.key].split(",").map(function(t){return e.mapProvince[t]}).join(","),placement:"top"}},[s("p",{staticStyle:{overflow:"hidden","white-space":"nowrap","text-overflow":"ellipsis"}},e._l(a[t.key].split(","),function(t){return s("span",[e._v("\n                            "+e._s(e.mapProvince[t])+"\n                          ")])}))])],1),e._v(" "),s("el-button",{staticClass:"fl-l",attrs:{size:"small",type:"primary"},on:{click:function(t){e.callChooseArea(i.$index,l)}}},[e._v("编辑")])],1):"opera"==t.type?s("div",{staticClass:"line-item"},[s("el-button",{attrs:{size:"small",type:"primary"},on:{click:function(t){e.delProvince(i.$index,l)}}},[e._v("删除")])],1):s("div",{staticClass:"line-item"},[s("el-input",{staticClass:"input-item",attrs:{size:"small"},model:{value:a[t.key],callback:function(s){e.$set(a,t.key,s)},expression:"subItem[item.key]"}})],1)]})],2)]}}])})]})],2)],1):e._e(),e._v(" "),s("div",{staticClass:"block-item"},[e._m(2),e._v(" "),s("div",{staticClass:"inline-item"},[s("el-input",{staticClass:"area-item-large",attrs:{rows:6,resize:"none",placeholder:"50个字以内",type:"textarea",size:"small"},model:{value:e.saveTemp.reason,callback:function(t){e.$set(e.saveTemp,"reason",t)},expression:"saveTemp.reason"}})],1)])]),e._v(" "),s("div",{staticClass:"section-item"},[s("div",{staticClass:"menu pd-r",staticStyle:{"text-align":"right"}},[s("el-button",{attrs:{size:"small",type:"primary"},on:{click:e.callSaveTemp}},[e._v("保存并提交审核")])],1)]),e._v(" "),s("div",{staticClass:"modal"},[s("el-dialog",{staticClass:"area-item",attrs:{visible:e.modalArea.isShow,size:"small"},on:{"update:visible":function(t){e.$set(e.modalArea,"isShow",t)},close:e.cancelArea}},[s("div",{staticClass:"section"},[s("div",{staticClass:"area-title"},[s("span",[e._v("请选择区域")])]),e._v(" "),s("div",{staticClass:"area-view"},e._l(e.modalArea.cityArr,function(t,i){return s("div",{key:i},[[s("el-checkbox",{attrs:{disabled:t.disableAll,indeterminate:t.isIndeterminate},on:{change:function(t){e.handleCheckAllChange(i,t)}},model:{value:t.checkAll,callback:function(s){e.$set(t,"checkAll",s)},expression:"item.checkAll"}},[e._v(e._s(t.name))]),e._v(" "),s("el-checkbox-group",{staticStyle:{display:"inline","margin-left":"20px"},on:{change:function(t){e.handleCheckedCitiesChange(i)}},model:{value:t.checkedCities,callback:function(s){e.$set(t,"checkedCities",s)},expression:"item.checkedCities"}},e._l(t.cities,function(t){return s("el-checkbox",{key:t.id,attrs:{label:t.id,disabled:e.disableConfig[t.id]}},[e._v(e._s(t.name))])}))]],2)})),e._v(" "),s("div",{staticClass:"menu",staticStyle:{"text-align":"right"}},[s("el-button",{attrs:{size:"small",type:"primary"},on:{click:e.saveArea}},[e._v("保存")]),e._v(" "),s("el-button",{attrs:{size:"small"},on:{click:e.cancelArea}},[e._v("取消")])],1)])]),e._v(" "),s("el-dialog",{attrs:{visible:e.modalExpress.isShow,size:"small"},on:{"update:visible":function(t){e.$set(e.modalExpress,"isShow",t)},close:e.cancelExpress}},[s("div",{staticClass:"section"},[s("div",{staticClass:"area-title"},[s("span",[e._v("添加物流方式")])]),e._v(" "),s("div",{staticClass:"section-item"},[s("span",[e._v("添加物流：")]),e._v(" "),s("el-select",{staticClass:"input-item-middle-express",attrs:{size:"small",multiple:"",filterable:"",placeholder:"请选择物流"},model:{value:e.modalExpress.expressCode,callback:function(t){e.$set(e.modalExpress,"expressCode",t)},expression:"modalExpress.expressCode"}},[e._l(e.filterFreightTempExpress,function(e){return[s("el-option",{attrs:{label:e.desc,value:e.code}})]})],2)],1),e._v(" "),s("div",{staticClass:"menu",staticStyle:{"text-align":"right"}},[s("el-button",{attrs:{size:"small",type:"primary"},on:{click:e.saveExpress}},[e._v("保存")]),e._v(" "),s("el-button",{attrs:{size:"small"},on:{click:e.cancelExpress}},[e._v("取消")])],1)]),e._v(" "),s("div",{staticClass:"section-item o-h"},[s("p",{staticClass:"fl-r primary-color"},[e._v("仅能从该发货地已有的发货物流中选择，"),s("br"),e._v("\n            若要新增物流方式，烦请前往商家中心添加；")])])]),e._v(" "),s("el-dialog",{attrs:{visible:e.modalDefaultExpress.isShow,size:"tiny"},on:{"update:visible":function(t){e.$set(e.modalDefaultExpress,"isShow",t)},close:e.cancelDefaultExpress}},[s("div",{staticClass:"section"},[s("div",{staticClass:"area-title"},[s("span",[e._v("设置默认物流方式")])]),e._v(" "),s("div",{staticClass:"section-item"},e._l(e.saveTemp.expressList,function(t){return s("div",[s("el-radio",{staticClass:"radio",attrs:{label:t.expressId},model:{value:e.modalDefaultExpress.defaultExpressCode,callback:function(t){e.$set(e.modalDefaultExpress,"defaultExpressCode",t)},expression:"modalDefaultExpress.defaultExpressCode"}},[e._v(e._s(e.mapExpressId[t.expressId]))])],1)})),e._v(" "),s("div",{staticClass:"menu",staticStyle:{"text-align":"right"}},[s("el-button",{attrs:{size:"small",type:"primary"},on:{click:e.saveDefaultExpress}},[e._v("保存")]),e._v(" "),s("el-button",{attrs:{size:"small"},on:{click:e.cancelDefaultExpress}},[e._v("取消")])],1)])]),e._v(" "),s("el-dialog",{attrs:{visible:e.modalTips.isShow,size:"small"},on:{"update:visible":function(t){e.$set(e.modalTips,"isShow",t)}}},[s("div",{staticClass:"section"},[s("div",{staticClass:"area-title"},[s("span",[e._v("提示")])]),e._v(" "),s("div",{staticClass:"section-item"},[s("p",{staticStyle:{"text-indent":"2rem"}},[e._v("\n              您若想使用按重量计价方式结算运费成本，请先通过“批量设置商品毛重”入口设置商品毛重，待审核通过后，所有商品均具备毛重信息后，方能使用按重量计价的运费模版！\n            ")]),e._v(" "),s("p",{staticStyle:{"text-indent":"2rem"}},[e._v("\n              请注意：商品毛重信息将直接用于计算运费结算，请尽量保证准确；\n            ")])]),e._v(" "),s("div",{staticClass:"menu",staticStyle:{"text-align":"right"}},[e.newGoods?s("router-link",{attrs:{tag:"span",to:"/product/weight/sale"}},[s("el-button",{attrs:{type:"primary"}},[e._v("设置商品毛重")])],1):s("router-link",{attrs:{tag:"span",to:"/product/weight"}},[s("el-button",{attrs:{type:"primary"}},[e._v("设置商品毛重")])],1),e._v(" "),s("el-button",{attrs:{size:"small"},on:{click:function(t){e.modalTips.isShow=!1}}},[e._v("取消")])],1)])])],1)]):e._e()])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"title"},[t("span",[this._v("编辑运费模板")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("span",{staticClass:"section-item-sign"},[t("span",{staticClass:"sign-required"},[this._v("*")]),this._v("模板名称：\n              ")])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"section-item-sign-wrap"},[t("span",{staticClass:"section-item-sign"},[t("span",{staticClass:"sign-required"},[this._v("*")]),this._v("调整原因：\n          ")])])}]};var p=s("VU/8")(c,o,!1,function(e){s("L/dU")},"data-v-d2ff5e86",null);t.default=p.exports}});
//# sourceMappingURL=24.c031fa1263d869d423c6.js.map