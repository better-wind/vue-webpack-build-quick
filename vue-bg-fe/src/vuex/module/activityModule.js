import baseFn from './../action/base'
const state = {

}
const getters = {

}
const actions = {

  //活动sku列表
  getActivitySkuList({commit},rs){
    let paramsData = baseFn.pageOpts(rs)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/activity/sku/page',
      // method: 'GET',
      // url: '/static/data/goodsSku.json',
      data:paramsData
    }
    return baseFn.nextFetch(commit,opts)
  },
  activitySkuJoin({commit},rs){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/activity/sku/join',
      // method: 'GET',
      // url: '/static/data/goodsSku.json',
      data:rs
    }
    return baseFn.nextFetch(commit,opts)
  },
  //已加入活动
  getActivityJoinSkuList({commit},rs){
    let paramsData = baseFn.pageOpts(rs)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/activity/sku/join/page',
      data:paramsData
    }
    return baseFn.nextFetch(commit,opts)
  },
  //撤回
  cancelSkuJoin({commit},data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/activity/sku/join/cancel',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  }
}
const mutations = {

}
export default {
  state,
  getters,
  actions,
  mutations
}
