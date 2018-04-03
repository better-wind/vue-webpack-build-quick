import baseFn from './../action/base'
const state = {
  demoWareStore:'345'
}
const getters = {
  getDemoWareStore: state => state.demoWareStore
}
const actions = {
  demoWareAction({commit,state},rs){
    console.log(rs)
    commit('DEMO_WARE_MUT',rs)
  },
  getStorageList({commit},rs){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/in/storage/getAllStorageList',
      // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      // method: 'GET',
      // url: '/static/data/wareStorageList.json'
    }
    return baseFn.nextFetch(commit,opts)
  },
  //入仓单列表
  getStorageOrderList({commit},rs){
    let paramsData = baseFn.getParamsData(rs)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/in/storage/list',
      data:paramsData,
      // method: 'GET',
      // url: '/static/data/wareList.json'
    }
    return baseFn.nextFetch(commit,opts)
  },
  //入仓单列表提交审核
  auditStorageOrder({commit},rs){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'	/seller/in/storage/check/'+rs.code,
    }
    return baseFn.nextFetch(commit,opts)
  },
  //入仓单列表删除
  delStorageOrder({commit},rs){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/in/storage/del/'+rs.code,
    }
    return baseFn.nextFetch(commit,opts)
  },
  //入仓单仅保存的入仓单详情
  getWarePreStoreDetail({commit},rs){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/in/storage/pre/mod/'+rs.code,
      // method: 'GET',
      // url: '/static/data/wareDetail.json'
    }
    return baseFn.nextFetch(commit,opts)
  },
  //入仓单详情
  getWareStoreDetail({commit},rs){
    const opts = {
      method: 'GET',
      url: baseFn.Api+'/seller/in/storage/detail/'+rs.code,
      // method: 'GET',
      // url: '/static/data/wareDetail.json'
    }
    return baseFn.nextFetch(commit,opts)
  },
  //保存入仓单
  addWareStorage({commit},rs){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/in/storage/add',
      data:rs
    }
    return baseFn.nextFetch(commit,opts)
  },
  // 保存入仓单 仅保存 /seller/in/storage/mod/{code}
  addWarePreStorage({commit},rs){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/in/storage/mod/'+rs.code,
      data:rs.opts
    }
    return baseFn.nextFetch(commit,opts)
  },
  //入仓商品
  getWareStoreProduct({commit},rs){
    let _opts = JSON.parse(JSON.stringify(rs.opts))
    for(let i in _opts){
      _opts[i] = (_opts[i]+'') ? _opts[i] : null
    }
    let paramsData = baseFn.getParamsData(_opts)
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/in/storage/getSkuList/'+rs.storageId,
      data:paramsData,
      // method: 'GET',
      // url: '/static/data/wareDetailProduct.json'
    }
    return baseFn.nextFetch(commit,opts)
  },
  //可发货详情
  getWareDeliverDetail({commit},rs){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/in/storage/pre/send/'+rs.code,
      // method: 'GET',
      // url: '/static/data/wareDetailDeliver.json'
    }
    return baseFn.nextFetch(commit,opts)
  },
  //发货详情
  getSendStorageDeliverDetail({commit},rs){
    console.log(rs)
    const opts = {
      method: 'POST',
      url: baseFn.Api+`/seller/in/storage/order/push/detail/${rs.code}/${rs.number}`,
      // method: 'GET',
      // url: '/static/data/sendStorageDeliverDetail.json'
    }
    return baseFn.nextFetch(commit,opts)
  },
  //发货 /seller/in/storage/send/{code
  sendStorageDelivery({commit},rs){

    const opts = {
      method: 'POST',
      url: baseFn.Api+`/seller/in/storage/send/${rs.code}`,
      data:rs.opts
    }
    return baseFn.nextFetch(commit,opts)
  },
  //确认入仓
  getCommitStorage({commit},rs){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/seller/in/storage/confirm/'+rs.code,
    }
    return baseFn.nextFetch(commit,opts)
  },
  //采购单位
  getAllSkuUnit({commit},rs){
    const opts = {
      method: 'POST',
      url: baseFn.Api+'/dic/getAllSkuUnit',
    }
    return baseFn.nextFetch(commit,opts)
  }

}
const mutations = {
  DEMO_WARE_MUT(state,rs){
    console.log(rs)
    state.demoWareStore = '123'
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
