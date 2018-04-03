import baseFn from './base'
export default {
  /*
  * 运费模板
  * */
  getFreightTempList ({commit},data) {

    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/freight/template/list',
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 获取最新一条审核信息
  * /seller/freight/template/audit/{shipAddress}
  * */
  getFreightAudit ({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/freight/template/audit/'+data.shipAddress,
    }
    // const opts = {
    //   method: 'GET',
    //   url: '/static/data/freightAudit.json',
    //   params:data
    // }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 撤销审核
  * /seller/freight/template/audit/cancel/
  * */
  cancelFreightAudit({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/freight/template/audit/cancel/'+data.shipAddress,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: baseFn.formData({
        auditItemId:data.auditItemId
      })

    }
    // const opts = {
    //   method: 'GET',
    //   url: '/static/data/freightAudit.json',
    //   params:data
    // }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 运费模板详情
  * /seller/freight/template/{shipAddress}
  * */
  getFreightTempDetail ({commit},data) {

    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/freight/template/'+data.shipAddress,
    }
    // const opts = {
    //   method: 'GET',
    //   url: '/static/data/freightTempDetail.json',
    //   params:data
    // }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 根据发货地id获取物流列表
  * /seller/freight/template/expressList
  * */
  getFreightTemplateExpressList({commit},data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/freight/template/expressList',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: baseFn.formData(data)

    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 保存运费模板详情
  * /seller/freight/template/audit/save
  * */
  saveFreightTemp ({commit},data) {
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/freight/template/audit/save',
      data:data,
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 获取所以商品分页列表（带毛重）
  * /seller/product/simple/page
  * */
  getProductWeightList ({commit}, data){
    let paramsData = baseFn.getParamsData(data)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/product/simple/page',
      data: paramsData
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 获取所以sku分页列表（带毛重）
   * /seller/product/simple/page
   * */
  getSkuWeightList ({commit}, data){
    let paramsData = baseFn.getParamsData(data)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/goods/grossweight/sku/page',
      data: paramsData
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * /seller/product/qrossweight/set
  * 批量修改毛重
  * */
  saveProductWeight ({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/product/qrossweight/set',
      data:data,
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * /seller/product/qrossweight/set
   * 批量修改Sku毛重
   * */
  saveSkuWeight ({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/goods/grossweight/set',
      data:data,
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * /seller/product/qrossweight/unsetted
  * 获取未设置毛重商品
  * */
  getUnSetWeightAmount ({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/product/qrossweight/unsetted',
    }
    return baseFn.nextFetch(commit,opts)

  },
  /*
  * /seller/product/qrossweight/unsetted
  * 获取未设置毛重商品
  * */
  getUnSetSkuWeightAmount ({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/goods/grossweight/unsetted',
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * /seller/freight/template/check/name
  * 确认发货模板名称是否可用
  * */
  checkFreightName({commit}, data){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/freight/template/check/name',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: baseFn.formData(data)

    }
    return baseFn.nextFetch(commit,opts)
  },

}
