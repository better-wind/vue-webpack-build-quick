import baseFn from './base'

/*
* 商家入仓
* */
export default {
  /*
   * 申请入仓
   * 	/sellerInStorage/apply
   * */
  applySellerInStorage({commit},data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/sellerInStorage/apply',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 入仓状态判断
  * /sellerInStorage/status
  * */
  getSellerInStorageStatus({commit}){
    const opts = {
      method: 'GET',
      url: baseFn.Api+'/sellerInStorage/status',
      // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      // data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts,'SET_SELLER_STORAGE_STATUS')
  },
  /*
  * 入仓商品管理列表
  * */
  getWareHouseProductList({commit},data){
    let paramsData = baseFn.getParamsData(data)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/in/storage/sku/list',
      data:paramsData
      // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 入仓订单管理列表
  * */
  getWareHouseOrderList({commit},data){
    let paramsData = baseFn.getParamsData(data)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/in/storage/getOrderPageList',
      data:paramsData
      // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    }
    return baseFn.nextFetch(commit,opts)
  },
  getWareHouseOrderListCount({commit},data){
    let paramsData = baseFn.getParamsData(data)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/in/storage/getOrderPageCount',
      data: paramsData
    }
    return baseFn.nextFetch(commit,opts)
  },
  //导出订单列表
  exportWareHouseOrderList({commit},data){
    baseFn.fromPost(baseFn.Api+'/seller/in/storage/export/orderList',data);
  },
  /*
  * 入仓订单管理列表 详情
  * */
  getWareHouseOrderDetail({commit},data){

    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/in/storage/order/detail/'+data.orderNumber,
      // method: 'GET',
      // url: '/static/data/warehouseOrderDetail.json',
      data:baseFn.formData(data),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    }
    return baseFn.nextFetch(commit,opts)
  },

}
