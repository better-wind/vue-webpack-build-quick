import baseFn from './base'
export default {
  /*
   * 活动提报
   * */

  /*
   * 活动列表
   * /activity/page/promotion 大
   * /activity/page/daily 日常
   *
   * */
  getActivityList ({commit},data) {
    let paramsData = baseFn.getParamsData(data.data)
    paramsData.paramsMap.newGoods = data.isNewGoods
    const opts = {
      method: 'POST',
      url: baseFn.Api+data.link,
      data: paramsData
    }
    // const opts = {
    //   method: 'GET',
    //   url: '/static/data/activity.json',
    //   params:data.data
    // }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 活动详情
   * /activity/detail
   * */
  getActivityDetail({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/activity/detail',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: baseFn.formData(data)
    }
    // const opts = {
    //   method: 'GET',
    //   url: '/static/data/activityDetail.json',
    //   params:data
    // }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 已参报的活动列表
   * /activity/join/list
   * */
  getActivityJoinList({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/activity/join/list',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: baseFn.formData(data)
    }
    // const opts = {
    //   method: 'GET',
    //   url: '/static/data/activityJoinList.json',
    //   params:data
    // }
    return baseFn.nextFetch(commit,opts,'SET_ACTIVITY_JOIN_LIST')
  },
  /*
  * 已参报的活动分页
  * /activity/join/page
  * */
  getActivityJoinPageList({commit},data){
    let paramsData = baseFn.getParamsData(data)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/activity/join/page',
      data: paramsData
    }
    // const opts = {
    //   method: 'GET',
    //   url: '/static/data/activity.json',
    //   params:data.data
    // }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 申报活动
   * /activity/join
   * */
  joinActivity({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/activity/join',
      data: data
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 撤销审核
   * /activity/join/cancel
   * */
  cancelJoin({commit},data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/activity/join/cancel',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  }
}
