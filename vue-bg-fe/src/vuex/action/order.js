import baseFn from './base'
export default {
  /*
   * 订单相关
   * */
  /*
  * 设置批量发货文件
  *
  * */
  setMockSendOrder ({commit},data){
    commit('SET_MOCK_SEND_ORDER',data)
  },
  getMockOrderList({commit},{type,data}){
    var formData = new FormData();
    for(let i in data){
      formData.append(i, data[i]);
    }
    const opts = {
      method: 'POST',
      url: baseFn.Api+ (type == 0 ? '/order/mockSendOrder' : '/order/mockSendOrder'),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:formData
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * /order/batchSendOrder
  * 批量发货
  * */
  submitBatchSendOrder({commit},{type,data}){
    var formData = new FormData();
    for(let i in data){
      formData.append(i, data[i]);
    }
    const opts = {
      method: 'POST',
      url: baseFn.Api+ (type == 0 ? '/order/batchSendOrder' : '/order/batchSendOrder'),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:formData
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * /getIfTaskOver
  * 批量发货检查
  * */
  getIfTaskOver({commit}){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/getIfTaskOver',
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 导出订单
   * 搜索订单 /order/exportOrderListWithParams
   * 售后订单 /order/afterSale/export
   * */
  exportOrderList ({commit},{link,type,data}){
    // let paramsData = baseFn.getParamsData(data.data)
    // const opts = {
    //   method: 'POST',
    //   url: baseFn.Api+data.link,
    //   headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    //   data:data.data
    // }
    // for(let i in data.data){
    //   data.data[i] = data.data[i] == 'all' ? null : data.data[i]
    // }
    let _opt = JSON.parse(JSON.stringify(data))
    delete _opt.page
    delete _opt.rows
    if(type == 'search'){
      const opts = {
        method: 'POST',
        url: baseFn.Api+link,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data:baseFn.formData(_opt)
      }
      return baseFn.nextFetch(commit,opts)

    } else {
      baseFn.fromPost(baseFn.Api+link,_opt);
    }

    // return baseFn.nextFetch(commit,opts)
  },
  /*
  * 导出订单下载列表 /order/getOrderExportTaskList
  * */
  getOrderExportTaskList({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/getOrderExportTaskList',
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 导出规则
  * */
  getExportRuleList({commit},data){
    let paramsData = baseFn.getParamsData(data)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/orderSendRule/pageList',
      data: paramsData
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 新建导出规则
  * */
  addExportRule({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/orderSendRule/add',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 删除 /order/orderSendRule/delete/{id}
  * */
  delExportRule({commit},id){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/orderSendRule/delete/'+id,
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 导出校验
  * /order/checkFreeze
  * */
  exportOrderListCheck({commit},data){
    // let paramsData = baseFn.getParamsData(data.data)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/checkFreeze',
      data: data
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 订单列表
   * 售后订单  /order/afterSale/getAfterSaleOrderList
   * 订单搜索 /order/getOrderPageList
   * */
  getOrderList ({commit},{link,data}) {
    let paramsData = baseFn.getParamsData(data)
    const opts = {
      method: 'POST',
      url: baseFn.Api+link,
      data: paramsData
    }
    return baseFn.nextFetch(commit,opts,'SET_ORDER_LIST')
  },
  /*
   * 订单总数
   * /order/getOrderPageCount
   * */
  getOrderPageCount({commit},data){
    let paramsData = baseFn.getParamsData(data)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/getOrderPageCount ',
      data: paramsData
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 获取所有工单售后问题类型
  * */
  getAllWorkOrderProblemForSelect({commit}){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/dic/getAllWorkOrderProblemForSelect',
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 订单详情
   * 售后订单   /order/afterSale/getAfterSaleDetail/{workOrderNumber}
   * 订单搜索  /order/getOrderDetail/{orderNumber}
   * */
  getOrderDetail ({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+data.link+data.data,
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 售后订单咨询列表
  * */
  getConsultationList ({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/afterSale/getAdvicePageList',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 售后咨询待回复数量
  * /order/afterSale/getWaitReplyCount/
  * */
  getWaitReplyCount({commit}, {workOrderNumber}){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/afterSale/getWaitReplyCount/'+workOrderNumber,
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 售后咨询详情
  * */
  getConsultationDetail ({commit}, {adviceId}){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/afterSale/getAdviceDetail/'+adviceId,
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 客服跟进列表
  * */
  getProcessList ({commit}, {workOrderNumber}) {
    const opts = {
      method: 'POST',
      url:baseFn.Api+'/order/afterSale/getWorkOrderProcessList/'+workOrderNumber,
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 售后提交 咨询回复
  * */
  updateProcess ({commit}, {type,data}) {
    const opts = {
      method: 'POST',
      url:baseFn.Api+ (type == 0 ? '/order/afterSale/insertWorkOrderProcess' : '/order/afterSale/replyTheAdvice'),
      data: data
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 下载身份证
   * /order/download
   * */
  downLoadIdCardImg ({commit},data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/download',
      data:data
    }
    baseFn.fromPost(baseFn.Api+'/order/download',data);
    // return baseFn.nextFetch(commit,opts)
  },
  /*
   * 获取身份证信息
   * /order/getIdcardByNum/{number}/{name}
   * */
  getIdCardMsg({commit}, data){
    const opts ={
      method: 'POST',
      url: baseFn.Api+'/order/getIdcardByNum/'+data.number+'/'+data.name
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 获取所有物流公司
   * /dic/getAllLogisticsChannel
   * */
  getLogisticsChannel({commit}) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/dic/getAllLogisticsChannel'
    }
    return baseFn.nextFetch(commit,opts,'SET_LOGISTICS')
  },
  /*
  *  获取售后订单原因
  *  /order/afterSale/getRefundApplyReason
  * */
  getRefundApplyReason({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/afterSale/getRefundApplyReason',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts,)
  },
  /*
  * 获取订单物流公司
  * /order/expressList
  * */
  getOrderExpressList({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/expressList',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },

  /*
   * 下载发货模板
   * /order/exportSendTemplate
   * */
  downLoadSendTemplate({commit},{type}) {
    const opts = {
      method: 'GET',
      url: baseFn.Api+'/order/exportSendTemplate'
    }
    console.log(type)
    let _url = baseFn.Api + (type == 0 ? '/order/exportSendTemplate' : '/order/exportReSendTemplate')
    console.log(_url)
    baseFn.fromPost(_url);
    // return baseFn.nextFetch(commit,opts)
  },
  /*
   * 导出模拟发货结果
   * /order/exportMockResult
   * */
  exportMockResult({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/exportMockResult'
    }
    baseFn.fromPost(baseFn.Api+'/order/exportMockResult');
    // return baseFn.nextFetch(commit,opts)
  },
  /*
   * 批量发货
   * /order/batchSendOrder
   * */
  batchSendOrder({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/batchSendOrder',
      headers: {'Content-Type': 'multipart/form-data;'},
      data:data
    }
    return baseFn.nextFetch(commit,opts)
    // baseFn.fromPost(baseFn.Api+'/order/batchSendOrder',data);
  },
  /*
   * 单笔订单发货
   * /order/sendOrder
   * */
  sendOrder({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/sendOrder',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
      // data: data
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 售后订单统计
   * /order/afterSale/getStatistics
   * */
  getAfterSaleStatistics({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/afterSale/getStatistics',
      // method: 'GET',
      // url: '/static/data/orderMarketStatis.json',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 订单发货概况
   * /order/delivery/getStatistic
   *
   * */
  getDeliveryStatistic({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/delivery/getStatistic',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    // const opts = {
    //   method: 'GET',
    //   url: '/static/data/deliveryStatistic.json',
    // }
    return baseFn.nextFetch(commit,opts,'SET_AFTER_SALE_STATISTICS')
  },
  /*
   * 超时订单列表
   *  /order/delivery/getExpireOrderList
   * */
  getTimeOutOrderList({commit}, data) {
    if(data.penaltyAmountEnd < data.penaltyAmountStart){
      baseFn.setNotice(commit,{
        isShow:true,
        msg:'罚款金额起始金额应大于截止金额',
      })
      return false
    }
    let paramsData = baseFn.getParamsData(data)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/delivery/getExpireOrderList',
      data: paramsData
    }
    // const opts = {
    //   method: 'GET',
    //   url: '/static/data/timeOut.json',
    //   params:data
    // }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * /order/delivery/getDetailById/{orderDeliveryExpireId}
   * 超时订单详情
   * */
  getTimeOutOrderDetail({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/delivery/getDetailById/'+data.orderDeliveryExpireId,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 超时订单申诉
   * /order/delivery/addExpireComplain
   * */
  complainTimeOutOrder({commit}, data){
    var formData = new FormData();
    for(let i in data){
      formData.append(i, data[i]);
    }
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/delivery/addExpireComplain',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:formData
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 超时报备记录列表
   * /order/delivery/getApplyPageList
   * */
  getTimeOutOrderRecordList({commit}, data){
    let paramsData = baseFn.getParamsData(data)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/delivery/getApplyPageList',
      data: paramsData
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 异常订单报备记录列表
   * /order/delivery/getApplyPageList
   * */
  getAbnormalOrderRecordList({commit},data){
    let paramsData = baseFn.getParamsData(data)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/delivery/exceptionApplyRecordPageList',
      data: paramsData
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   *  新增超时报备
   * /order/delivery/addOrderExtendApply
   * */
  addOrderExtendApply({commit}, data){
    var formData = new FormData();
    for(let i in data){
      formData.append(i, data[i]);
    }
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/order/delivery/addOrderExtendApply',
      // headers: {'Content-Type': 'multipart/form-data'},
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:formData
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 下载上传模板
   * /order/delivery/downApplyTemplate
   * */
  downApplyTemplate({commit}, data){
    const opts = {
      method: 'GET',
      url: baseFn.Api+'/order/exportSendTemplate'
    }
    baseFn.fromPost(baseFn.Api+'/order/delivery/downApplyTemplate');
  },

}
