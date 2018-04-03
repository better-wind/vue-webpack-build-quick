import baseFn from './base'
export default {
  /*
  * 开票列表
  * */
  getInvoiceList({commit},data){

    let paramsData = baseFn.getParamsData(data)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/invoice/list',
      data:paramsData
      // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 开票订单列表
  * */
  getInvoiceOrder({commit},data){
    let paramsData = baseFn.getParamsData(data)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/invoice/list/order',
      // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:paramsData
    }
    return baseFn.nextFetch(commit,opts)
  },

  /*
  * 开票详情
  * */
  getInvoiceDetail({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/invoice/detail/'+data.operateNumber,
      // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 开票提交
  * */
  commitInvoice({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/invoice/confirm',
      data:data,
      // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 开票订单导出
  * */
  exportInvoice({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/invoice/detail/export/'+data.operateNumber,
      // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    }
    baseFn.fromPost(opts.url);
    // return baseFn.nextFetch(commit,opts)
    // baseFn.fromPost(baseFn.Api+'/order/exportMockResult');
  }
}
