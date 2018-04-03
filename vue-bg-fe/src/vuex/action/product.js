import baseFn from './base'
export default {
  /*
   * 清除商品类目选择
   *
   * */
  setClearSelect ({commit}, data){
    commit('SET_CLEAR_SELECT',data)
  },
  /*
   * 商品列表
   * /seller/product/page
   * */
  getProductList ({commit}, data){
    let paramsData = baseFn.getParamsData(data)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/product/page',
      data: paramsData
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 商品列表提交审核
   * /seller/product/audit
   * */
  productAudit ({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/product/audit',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 撤销审核
   * /seller/product/audit/withdraw
   * */
  productRevokeAudit ({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/product/audit/withdraw',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 修改库存
   * /seller/product/stock
   * */
  setProductStock ({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/product/stock',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 所有分类
   * /category/all
   * */
  getCategoryAll ({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/category/all',
      data:data
    }
    return baseFn.nextFetch(commit,opts,'SET_CATEGORY_ALL')
  },
  /*
   * 设置详情页分类列表
   * */
  setCategoryList ({commit},data){
    commit('SET_CATEGORY_LIST',data)
  },

  /*
   * 商品详情
   * application/x-www-form-urlencoded
   * /seller/product/detail
   * */
  getProductDetail ({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/product/detail',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 保存商品
   * /seller/product/save
   * */
  saveProductDetail ({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/product/save',
      data:data
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 撤销审核
   * /seller/product/audit/withdraw
   * */
  withdrawAudit ({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/product/audit/withdraw',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 删除商品
   * /seller/product/delete
   * */
  deleteProduct ({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/product/delete',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 获取当前供货价
   * /seller/product/wholesale/latest
   * */
  getLatestWholesale ({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/product/wholesale/latest',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 检查是否有未审核供货价
   * /seller/product/wholesale/checkUnAudit
   * */
  checkUnAuditWholesale ({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/product/wholesale/checkUnAudit',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 分页获取供货价审核历史
   * /seller/product/wholesale/page
   * */
  getWholesale ({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/product/wholesale/page',
      data:data
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 修改供货价
   * /seller/product/wholesale/change
   * */
  changeWholesale ({commit}, data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/product/wholesale/change',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(data)
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 批量图片上传
  * /pic/upload/multi
  * */

  /*
  * 获取发货地运费模板或者每订单运费
  * /seller/product/getFreightTemplate
  * */
  getProductFreightTemplate ({commit}, data) {
    const opts = {
      method: 'GET',
      url: baseFn.Api+'/seller/product/getFreightTemplate',
      // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      // data:baseFn.formData(data)
      params:data
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 商品列表导出
  * /seller/product/export
  * */
  exportProductList({commit},data){
    baseFn.fromPost(baseFn.Api+'/seller/product/export',data);
  }
}
