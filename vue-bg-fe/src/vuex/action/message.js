import baseFn from './base'
export default {
  /*
   * 消息分页列表
   * /message/page
   * */
  getMsgList({commit}, data){
    let paramsData = baseFn.getParamsData(data)
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/message/page',
      data:paramsData
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 消息搜索选项记录
  *
  * */
  setMsgSearchQuery({commit}, data){
    commit('SET_MSG_SEARCH_QUERY',data)
  },
  /*
  * 消息数据
  * /message/count
  * */
  getMsgNum({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/message/count',
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 获取消息详情
   * /message/detail/{messageId}
   * */
  getMsgDetail({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/message/detail/' + data.messageId
    }
    return baseFn.nextFetch(commit,opts,'SET_MSG_DETAIL')
  },
  /*
   * 弹框消息
   * /message/alert
   * */
  getAlertMsg({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/message/alert'
    }
    return baseFn.nextFetch(commit,opts,'SET_MSG_ALERT_DETAIL')
  },
  /*
   * 阅读消息
   * /message/read/{messageId}
   * */
  readAlertMsg({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/message/read/' + data.messageId
    }
    return baseFn.nextFetch(commit,opts,'SET_ALERT_MSG_READ')
  },
  /*
  * 测试已读
  * */
  demoReadAction({commit}){
    commit('DEMO_SET_ALERT_MSG_READ')
  },
  /*
   * 消息反馈
   * /message/feedback/{messageId}
   * */
  feedBackMsg({commit},data){
    const optData = {
      content:data.content
    }
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/message/feedback/' + data.messageId,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: baseFn.formData(optData)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 消息置顶数据
   * 	/message/topFive
   * */
  getTopMsg({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api + '/message/topFive',
    }
    return baseFn.nextFetch(commit,opts)
  },
}
