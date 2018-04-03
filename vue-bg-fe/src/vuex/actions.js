import baseFn from './action/base'
import productAction from './action/product'
import orderAction from './action/order'
import accountAction from './action/account'
import ruleAction from './action/rule'
import messageAction from './action/message'
import activityAction from './action/activity'
import freightAction from './action/freight'
import warehouseAction from './action/warehouse'
import invoiceAction from './action/invoice'
import baseGoodsAction from './action/baseGoods'


export default {
  ...productAction,
  ...orderAction,
  ...accountAction,
  ...ruleAction,
  ...messageAction,
  ...activityAction,
  ...freightAction,
  ...warehouseAction,
  ...invoiceAction,
  ...baseGoodsAction,

  /*
  * 新老商家后台切换
  * */
  checkVersion({commit},data){
    commit('CHECK_VERSION',data)
  },
  /*
  * 弹出优先级控制
  * */
  setEditWithMsg({commit},data) {
    commit('SET_EDIT_WITH_MSG',data)
  },
  setAlertBussMsg({commit},data) {
    commit('SET_ALERT_BUSS_MSG',data)
  },
  /*
  * 全局加载
  * */
  setFullLoading({commit},data) {
    commit('SET_FULL_LOADING',data)
  },
  /*
   * 经营概况
   *
   * */
  getSurvey ({commit},data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+data.url,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      // data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 导出发货未揽件订单
  * /summary/express/noinfo/export
  * */
  exportUnEmbraceCount({commit},data){
    baseFn.fromPost(baseFn.Api+'/summary/express/noinfo/export');
  },
  /*
   * 登录相关
   * */
  /*
   * 登录
   * /login
   * */
  getLogin({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/login',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 登出
   * /logout
   * */
  outLogin({commit}, data) {
    const opts = {
      method: 'GET',
      url: baseFn.Api+'/logout',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 自主结算
  * */
  getSettlementList({commit}, data) {
    const opts = {
      method: 'GET',
      url: '/static/data/settlement.json',
      params:data.data
    }
    return baseFn.nextFetch(commit,opts)
  }
  ,
  /*
   * 搜索相关
   * */
  setSearch ({commit},data) {
    commit('SET_SEARCH', data)
  },
  setCurrentSearchQuery ({commit},data) {
    commit('SET_SEARCH_QUERY', data)
  },
  /*设置搜索初始值*/
  setSearchParams ({commit},rs){
    commit('SET_SEARCH_PARAMS',rs)
  },
  setModal ({commit}, data) {
    commit('SET_MODAL', data)
  },
  callSetNotice ({commit}, data) {
    baseFn.setNotice(commit,data)
  },
  callSetToast ({commit}, data) {
    baseFn.setToast(commit,data)
  },
  setLoginError ({commit},data) {
    commit('SET_LOGIN_ERROR',data)
  },
  setViewImage ({commit},data) {
    commit('SET_VIEW_IMAGE',data)
  }
}
