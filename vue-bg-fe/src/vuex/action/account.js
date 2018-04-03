import baseFn from './base'
export default {
  /*
   * 账户相关
   * */
  /*
   * 账户权限
   * /login/check
   * */
  getLoginCheck({commit}) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/login/check',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    }
    return baseFn.nextFetch(commit,opts,'SET_LOGIN_CHECK')
  },
  /*
   * 商家基本信息
   * /seller/info
   * */
  getSellerInfo({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/info',
      data: data
    }
    return baseFn.nextFetch(commit,opts,'SET_SELLER_INFO')
  },
  /*
   * 商家联系人
   * /seller/contact
   * */
  getSellerContact({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/seller/contact',
      data: data
    }
    return baseFn.nextFetch(commit,opts,'SET_SELLER_CONTACT')
  },
  /*
   * 保存商家联系人
   * /seller/contact/save
   * */
  saveSellerContact({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/seller/contact/save',
      data: data
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 获取商家配送模板列表
   * /seller/deliverTemplate/list
   * */
  getDistributionTemplate({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/seller/deliverTemplate/list',
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 商家发货地列表
   * /seller/shippingAddress/list
   * */
  getDeliveryArea({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/seller/shippingAddress/list',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 商家商品列表
   * /seller/brand
   * */
  getSellerBrand({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/seller/brand/v2',
    }
    return baseFn.nextFetch(commit,opts,'SET_BRAND_LIST')
  },
  /*
   * 所有国家
   * /country/available
   * */
  getCountryList({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/country/available',
    }
    return baseFn.nextFetch(commit,opts,'SET_COUNTRY_LIST')
  },
  /*
   * 获取帐号列表
   * /account/list
   * */
  getAccountList({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/account/list',
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 修改密码
   * /account/changePwd
   * */
  changeAccountPwd({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/account/changePwd',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },

  /*
   * 获取角色列表
   * /account/role/list
   * */
  getAccountRoleList({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/account/role/list',
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 保存角色
   * /account/role/save
   * */
  saveAccountRole({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/account/role/save',
      data:data
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 删除角色
   * /account/role/delete
   * */
  delAccountRole({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/account/role/delete',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 添加账号
   * /account/add
   * */
  addAccount({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/account/add',
      data:data
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 配置账号角色
   * /account/changeRole
   * */
  changeAccountRole({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/account/changeRole',
      data:data
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 删除账号
   * /account/delete
   * */
  delAccount({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/account/delete',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 获取所有权限列表
   * /account/function/list
   * */
  getAccountFunctionList({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/account/function/list',
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 管理发货地
   * */
  modifyPrice({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/seller/changeFreight',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  modifyTips({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/seller/changeHolidayTip',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  modifyAddress({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/seller/changeReceiveInfo',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  getAllCity({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/area/all',
    }
    return baseFn.nextFetch(commit,opts,'GET_ALL_CITY')
  },
  getSendType({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/send/address/available',
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 发货地物流跟新
  * /seller/sellerExpressAudit
  * */
  sellerExpressAudit({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/seller/sellerExpressAudit',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: baseFn.formData(data)
      // data:data
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 管理配送模板
   * */
  deleteDeliverTpl({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/seller/deliverTemplate/delete',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  saveDeliverTpl({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/seller/deliverTemplate/save',
      data: data
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 获取完善基本信息的页面初始值
  * /seller/findBaseInfo
  * */
  getSellerBaseInfo({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/findBaseInfo',
    }
    // const opts = {
    //   method: 'GET',
    //   url: '/static/data/businessInfo.json',
    //   params:data
    // }
    return baseFn.nextFetch(commit,opts)
  },
  setSellerQualification({commit},data){
    commit('SET_SELLER_QUALIFICATION',data)
  },
  /*
  * 保存基本信息
  * /seller/perfectSellerBaseInfo
  * */
  saveSellerBaseInfo({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/perfectSellerBaseInfo',
      data:data
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 获取基本资质图片
  * /seller/findSellerImgList
  * */
  getSellerImgList({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/findSellerImgList',
    }
    // const opts = {
    //   method: 'GET',
    //   url: '/static/data/businessInfo.json',
    //   params:data
    // }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 保存基本资质图片
   * /seller/updateSellerImgList
   * */
  saveSellerImgList({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/updateSellerImgList',
      data:data
    }
    return baseFn.nextFetch(commit,opts)
  },
}
