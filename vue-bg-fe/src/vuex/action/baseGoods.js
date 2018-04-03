import baseFn from './base'
const API = 'goodsAdmin'
const API2 = 'sellerAdmin'
export default {
  /*
   * 基本商品相关
   * */
  /*
   * 商品详情图&主图
   * */
  setProductUpload({commit},rs){
    commit('SET_PRODUCT_UPLOAD',rs)
  },
  /*
   * 类目
   * /goods/category/name/list/code/
   * */
  getCateList({commit},rs) {
    const opts = {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url: API2+'/category/available/list/'+rs.categoryId,
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 商品类目分组管理
   * /goods/managerGroup/list/code
   * */
  getManagerGroupList({commit},rs){
    // console.log(rs)
    const opts = {
      method: 'GET',
      url: API+'/goods/managerGroup/list/code',
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 货品商家归属
   * /goods/seller/sellerMain/list/code
   * */
  getGoodsBelong({commit},rs){
    const opts = {
      method: 'GET',
      url: API+'/goods/seller/sellerMain/list/code',
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 获取主体商家发货地
   * /goods/seller/deliverAreas/
   * */
  getGoodsSellerDeliver({commit},rs){
    // console.log(rs)
    const opts = {

      method:'GET',
      url:API+'/goods/seller/deliverAreas/'+rs.sellerMainId,
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 获取发货地
  * */
  getGoodsDeliver({commit}){
    const opts = {

      method:'POST',
      url:API2+'/seller/shippingAddress/code/list',
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 获取品牌下拉框
   * */
  getBrandSearchList({commit},rs){
    // console.log(rs)
    const opts = {
      // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      // data:baseFn.formData(Object.assign({},rs)),
      method:'POST',
      url:API2+'/brand/available/list/v2',
      // url:fetchUrl.SALE_PRODUCT_DETAIL.url+rs.baseGoodsId
    }
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 后台商品列表
   * */
  getBaseGoodsList({commit},rs){
    // console.log(rs)
    let paramsData = baseFn.pageOpts(rs)
    const params = {
      method: 'POST',
      url: API2+'/goods/list',
      data:paramsData
    }
    const opts = Object.assign({},params)
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 商品库存获取
  * */
  getProductStorageList({commit},rs){
    const params = {
      method: 'POST',
      url: API2 + '/goods/list/deliver/sku',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(Object.assign({},rs)),
      // data: rs
    }
    const opts = Object.assign({},params)
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 商品库库存保存
   * */
  saveProductStorage({commit},rs){
    const params = {
      method:'POST',
      url:API2+'/goods/stock',
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},params)
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 类目属性项明细
   * */
  getPropertyDetail({commit},rs){
    const params = {
      method: 'POST',
      url: API2+'/category/properties/'+rs.categoryId,
    }
    const opts = Object.assign({},params)
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 商品详情
  * */
  getBaseGoodsDetail({commit},rs){
    const params = {
      method: 'POST',
      url: API2+'/goods/detail/'+rs.baseGoodsId
    }
    const opts = Object.assign({},params)
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 审核详情
  * */
  getBaseGoodsAuditDetail({commit},rs){
    const params = {
      method: 'POST',
      url: API2+'/goods/audit/detail/'+rs.baseGoodsId
    }
    const opts = Object.assign({},params)
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 类目path
  * */
  getCategoryPath({commit},rs){

    const params = {
      method:'POST',
      url:API2+'/category/detail/'+rs.categoryId
    }
    const opts = Object.assign({},params)
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 获取发货地
  * */
  getShipArea({commit},rs){
    const params = {
      method: 'POST',
      url: API +'/goods/seller/deliverAreas/'+rs.sellerMainId


    }
    const opts = Object.assign({},params)
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 保存后台商品
  * */
  saveBaseGoods({commit},rs){
    const params = {
      method: 'POST',
      url: API2+'/goods/save',
      data:Object.assign({},rs)
    }
    const opts = Object.assign({},params)
    return baseFn.nextFetch(commit,opts)
  },
  /*
   * 校验是否而已修改类目
   * */
  validCategoryIdChange({commit},rs){
    // console.log(rs)
    const params = {
      method:'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(Object.assign({},rs)),
      // data:rs,
      url:API2+'/category/valid/changeToBaseGoods',
      // url: API+'/goods/baseGoods/validCategoryIdChange/'+rs.baseGoodsId+'/'+rs.categoryId
    }
    const opts = Object.assign({},params)
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 检查是否可以调整供货价 /goods/costPrice/audit/check
  * */
  checkCostPriceAudit({commit},rs){
    const params = {
      method:'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(Object.assign({},rs)),
      url:API2+'/goods/costPrice/audit/check',
      // url: API+'/goods/baseGoods/validCategoryIdChange/'+rs.baseGoodsId+'/'+rs.categoryId
    }
    const opts = Object.assign({},params)
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 提交供货价审核 /goods/costPrice/audit/save
  * */
  saveCostPriceAudit({commit},rs){
    const params = {
      method:'POST',
      url:API2+'/goods/costPrice/audit/save',
      data:rs
    }
    // const opts = Object.assign({},params)
    return baseFn.nextFetch(commit,params)
  },
  /*
  * 供货价审核记录分页列表 /goods/costPrice/audit/page
  * */
  costPricePageList({commit},rs){
    let paramsData = baseFn.getParamsData(rs)
    const params = {
      data:Object.assign({},paramsData),
      method:'POST',
      url:API2+'/goods/costPrice/audit/page'
    }
    const opts = Object.assign({},params)
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 撤回供货价审核 /goods/costPrice/audit/withdraw
  * */
  withdrawCostPriceAudit({commit},rs){
    const params = {
      method:'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(Object.assign({},rs)),
      url:API2+'/goods/costPrice/audit/withdraw',
      // url: API+'/goods/baseGoods/validCategoryIdChange/'+rs.baseGoodsId+'/'+rs.categoryId
    }
    const opts = Object.assign({},params)
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 商品审核列表
  * */
  getGoodsAuditList({commit},rs){
    let _list = []
    if(rs.isAudit){
      _list.push(0)
    }
    if(rs.isAuditAgain){
      _list.push(1)
    }
    if(rs.isPass){
      _list.push(2)
    }
    if(rs.isFail){
      _list.push(4)
    }
    let _rs = JSON.parse(JSON.stringify(rs))
    delete _rs.isAudit
    delete _rs.isAuditAgain
    delete _rs.isPass
    delete _rs.isFail
    _rs.status = _list.length ? _list : null
    let paramsData = baseFn.getParamsData(_rs)
    const params = {
      data:Object.assign({},paramsData),
      method:'POST',
      url:API2+'/goods/audit/page'
    }
    const opts = Object.assign({},params)
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 撤销商品审核 /goods/audit/withdraw auditId
  * */
  withDrawGoodsAudit({commit},rs){
    const params = {
      method:'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data:baseFn.formData(Object.assign({},rs)),
      url:API2+'/goods/audit/withdraw',
      // url: API+'/goods/baseGoods/validCategoryIdChange/'+rs.baseGoodsId+'/'+rs.categoryId
    }
    const opts = Object.assign({},params)
    return baseFn.nextFetch(commit,opts)
  },
  /*
  * 商品列表导出
  * */
  exportBaseProduct({commit},data){
    let _opt = JSON.parse(JSON.stringify(data))
    _opt.categoryId = _opt.fourthCategoryId || _opt.thirdCategoryId || _opt.secondCategoryId || _opt.firstCategoryId
    delete _opt.fourthCategoryId
    delete _opt.thirdCategoryId
    delete _opt.secondCategoryId
    delete _opt.firstCategoryId
    delete _opt.page
    delete _opt.rows
    if(typeof(_opt.categoryId) === 'undefined'){
      delete _opt.categoryId
    }
    baseFn.fromPost(API2+'/goods/export',_opt);
  },
  /*
  * 获取配送地区模板列表  /seller/sellerDeliverAreaTemplateList
  * */
  sellerDelTempList({commit},data){
    const params = {
      method:'POST',
      url:API2+'/seller/sellerDeliverAreaTemplateList'
    }
    const opts = Object.assign({},params)
    return baseFn.nextFetch(commit,opts)
  }

}
