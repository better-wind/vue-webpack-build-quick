webpackJsonp([17],{"3D7q":function(t,a){},QlWu:function(t,a,s){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var e=s("Dd8w"),i=s.n(e),n=s("GgDs"),o=s("sYyc"),c=s.n(o);var r=function(t){s("3D7q")},l=s("VU/8")(null,c.a,!1,r,"data-v-d5db5dfa",null).exports,v=s("/dWb"),d=s("NYxO"),g={name:"Login",data:function(){return{validateSrc:"/sellerAdmin/verify/getCode",loginRs:{account:"",password:"",validateCode:""},config:{type:"Login",menu:!1}}},created:function(){this.setValidateCode()},computed:i()({},Object(d.mapState)(["loginError"])),methods:i()({},Object(d.mapActions)(["getLogin","setLoginError"]),{clearError:function(){this.loginError&&this.setLoginError("")},keyDown:function(t){13==t.keyCode&&this.login()},clearOpt:function(t){this.loginRs[t]=""},login:function(){var t=this,a=this.loginRs;return a.account?a.password?a.validateCode?void this.getLogin(a).then(function(){t.$router.push({path:"/"})}):(this.setLoginError("请输入验证码"),!1):(this.setLoginError("请输入密码"),!1):(this.setLoginError("请输入用户名"),!1)},forgetPwd:function(){this.$confirm("请联系商家运营人员重置密码","提示",{confirmButtonText:"确定",cancelButtonText:"取消"}).then(function(){})},setValidateCode:function(){var t=(new Date).getTime();this.validateSrc="/sellerAdmin/verify/getCode?t="+t}}),components:{vHead:n.a,vToast:v.a,vFoot:l},watch:{loginError:function(t){t&&"请输入验证码"!=t&&"请输入用户名"!=t&&"请输入密码"!=t&&(this.setValidateCode(),this.loginRs.validateCode="")}}},u=s("hqcO"),p=s.n(u);var _=function(t){s("nce9")},f=s("VU/8")(g,p.a,!1,_,"data-v-5baffa14",null);a.default=f.exports},hqcO:function(t,a){t.exports={render:function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",[s("v-head",{attrs:{config:t.config}}),t._v(" "),s("div",{staticClass:"login-view"},[s("div",{staticClass:"login-pain"},[s("div",{staticClass:"login-img"}),t._v(" "),s("div",{staticClass:"login-box"},[t._m(0),t._v(" "),s("div",{staticClass:"item-wrap"},[s("div",{staticClass:"item"},[t._m(1),s("input",{directives:[{name:"model",rawName:"v-model",value:t.loginRs.account,expression:"loginRs.account"}],attrs:{id:"username",type:"text",placeholder:"请输入账户"},domProps:{value:t.loginRs.account},on:{focus:function(a){t.clearError()},input:function(a){a.target.composing||t.$set(t.loginRs,"account",a.target.value)}}}),t._v(" "),t.loginRs.account?s("i",{staticClass:"el-icon-circle-cross login-close",on:{click:function(a){t.clearOpt("account")}}}):t._e()]),t._v(" "),s("div",{staticClass:"item"},[t._m(2),s("input",{directives:[{name:"model",rawName:"v-model",value:t.loginRs.password,expression:"loginRs.password"}],attrs:{id:"password",type:"password",placeholder:"请输入密码"},domProps:{value:t.loginRs.password},on:{focus:function(a){t.clearError()},input:function(a){a.target.composing||t.$set(t.loginRs,"password",a.target.value)}}}),t._v(" "),t.loginRs.password?s("i",{staticClass:"el-icon-circle-cross login-close",on:{click:function(a){t.clearOpt("password")}}}):t._e()]),t._v(" "),s("div",{staticClass:"item item-no-border"},[s("div",{staticClass:"item small-item"},[t._m(3),s("input",{directives:[{name:"model",rawName:"v-model",value:t.loginRs.validateCode,expression:"loginRs.validateCode"}],attrs:{type:"text",placeholder:"请输入验证码"},domProps:{value:t.loginRs.validateCode},on:{keydown:function(a){t.keyDown(a)},focus:function(a){t.clearError()},input:function(a){a.target.composing||t.$set(t.loginRs,"validateCode",a.target.value)}}}),t._v(" "),t.loginRs.validateCode?s("i",{staticClass:"el-icon-circle-cross login-close",on:{click:function(a){t.clearOpt("validateCode")}}}):t._e()]),s("img",{attrs:{src:t.validateSrc,alt:""},on:{click:function(a){t.setValidateCode()}}})])]),t._v(" "),s("div",{staticClass:"error"},[t.loginError?[s("span",{staticClass:"error-sign"}),t._v(" "),s("span",{staticClass:"error-msg"},[t._v(t._s(t.loginError))])]:t._e(),t._v(" "),s("span",{staticClass:"f-r cur-pt",on:{click:function(a){t.forgetPwd()}}},[t._v("忘记密码？")])],2),t._v(" "),s("div",{staticClass:"menu"},[s("button",{staticClass:"cur-pt",on:{click:t.login}},[t._v("登录")])])])])]),t._v(" "),s("v-Foot"),t._v(" "),s("v-toast")],1)},staticRenderFns:[function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"title"},[a("span",[this._v("登录")])])},function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"sign"},[a("i",{staticClass:"user"})])},function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"sign"},[a("i",{staticClass:"pwd"})])},function(){var t=this.$createElement,a=this._self._c||t;return a("div",{staticClass:"sign"},[a("i",{staticClass:"valid"})])}]}},nce9:function(t,a){},sYyc:function(t,a){t.exports={render:function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"footer-wrap"},[s("div",{staticClass:"footer"},[s("el-row",{attrs:{gutter:134}},[s("el-col",{attrs:{span:12}},[s("div",{staticClass:"foot-item"},[s("div",{staticClass:"fl-l item contact"},[s("div",{staticClass:"item-title"}),t._v(" "),s("div",{staticClass:"item-contact"},[s("a",{attrs:{href:"http://www.gegejia.com/",target:"_blank"}},[s("span",[t._v("格格家")])]),t._v(" "),s("a",{attrs:{href:"http://www.gegejia.com/#page3",target:"_blank"}},[s("span",[t._v("招商合作")])]),t._v(" "),s("a",{attrs:{href:"http://www.gegejia.com/#page4",target:"_blank"}},[s("span",[t._v("商务合作")])]),t._v(" "),s("a",{attrs:{href:"http://www.gegejia.com/#page5",target:"_blank"}},[s("span",[t._v("诚聘英才")])]),t._v(" "),s("a",{attrs:{href:"http://www.gegejia.com/#page6",target:"_blank"}},[s("span",[t._v("联系我们")])])])]),t._v(" "),s("div",{staticClass:"fl-r item er-code"},[s("div",{staticClass:"item-title"},[s("p",{staticClass:"title"},[t._v("格格家APP")]),t._v(" "),s("p",[t._v("下载格格家APP")])]),t._v(" "),s("div",{staticClass:"item-code ggj"})])])]),t._v(" "),s("el-col",{attrs:{span:12}},[s("div",{staticClass:"foot-item"},[s("div",{staticClass:"fl-r item contact"},[s("div",{staticClass:"item-title"}),t._v(" "),s("div",{staticClass:"item-contact"},[s("a",{attrs:{href:"http://www.globalscanner.com/#globalScanner",target:"_blank"}},[s("span",[t._v("环球捕手")])]),t._v(" "),s("a",{attrs:{href:"http://www.globalscanner.com/#public",target:"_blank"}},[s("span",[t._v("公众号")])]),t._v(" "),s("a",{attrs:{href:"http://www.globalscanner.com/#service",target:"_blank"}},[s("span",[t._v("服务保障")])]),t._v(" "),s("a",{attrs:{href:"http://www.globalscanner.com/#aboutMe",target:"_blank"}},[s("span",[t._v("关于我们")])]),t._v(" "),s("a",{attrs:{href:"http://www.globalscanner.com/#contact",target:"_blank"}},[s("span",[t._v("联系我们")])])])]),t._v(" "),s("div",{staticClass:"fl-l item er-code"},[s("div",{staticClass:"item-title"},[s("p",{staticClass:"title"},[t._v("环球捕手APP")]),t._v(" "),s("p",[t._v("下载环球捕手APP")])]),t._v(" "),s("div",{staticClass:"item-code hqbs"})])])])],1),t._v(" "),s("div",{staticClass:"setUp-view"},[t._v("\n      Copyright 2016-2017 浙江格家网络技术有限公司 浙ICP备10030838号-6\n    ")])],1)])},staticRenderFns:[]}}});
//# sourceMappingURL=17.4ad421b435f240fc19b8.js.map