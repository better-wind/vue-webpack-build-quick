export default {
  /*
   * 设置store数据
   * @param           state
   * @param {object}  rs
   * */
  /*
  * 商家后台切换
  * */
  CHECK_VERSION:(state,rs)=>{
    state.newGoods = rs
  },
  /*
  * 全局加载
  * */
  SET_FULL_LOADING:(state,rs)=>{
    state.fullscreenLoading = rs
  },
  /*
  * 全局提示
  * */
  SET_NOTICE: (state, rs) => {
    state.notice = rs;
  },
  SET_TOAST: (state, rs) => {
    state.toast = rs;
  },
  SET_LOADING: (state, rs) => {
    if(rs.isShow){
      state.loading.list.push('1')
    }else{
      state.loading.list.pop()
    }
  },
  SET_MODAL: (state, rs) => {
    state.modal = rs;
  },
  /*
   * 搜索相关
   * */
  SET_SEARCH: (state, rs) => {
    state.currentSearch = rs;
  },
  SET_SEARCH_QUERY: (state, rs) => {
    state.currentSearchQuery = rs;
  },
  SET_SEARCH_PARAMS:(state, rs) => {
    state.searchParams = rs
  },
  SET_LOGIN_ERROR: (state, rs) => {
    state.loginError = rs
  },
  /*
  * 商品相关
  * */
  //类目筛选
  SET_CLEAR_SELECT:(state, rs) => {
    state.clearSelect = rs
  },
  SET_CATEGORY_ALL: (state, rs) => {
    state.categoryAll = rs.data
  },
  SET_CATEGORY_LIST: (state, rs) => {
    state.categoryList = rs
  },


  /*
   * 商品详情图片&主图
   * */
  SET_PRODUCT_UPLOAD:(state,rs)=>{
    state.productUpload = JSON.parse(JSON.stringify(rs))
  },
  /*
   * 订单相关
   * */
  SET_ORDER_LIST:(state,rs) => {
    state.orderList = Object.prototype.toString.call(rs.data) === '[object Array]' ? rs.data : rs.data.rows
  },
  SET_BRAND_LIST: (state, rs) => {
    state.brandList = rs.data;
  },
  SET_COUNTRY_LIST: (state, rs) => {
    state.countryList = rs.data;
  },
  SET_LOGISTICS: (state, rs) => {
    state.logisticsChannel = rs.data
  },
  SET_MOCK_SEND_ORDER:(state,rs) => {
    state.mockSendOrder.orderSendFile = rs
  },

  /*
  * 账户相关
  * */
  SET_LOGIN_CHECK: (state, rs) => {
    state.loginCheck = rs.data
    state.isFreeze = rs.data.isFreeze == 1 ? true : false
    state.newGoods = rs.data.useNewGoods == 1 ? true : false
  },
  //基本信息
  SET_SELLER_INFO: (state, rs) => {
    state.sellerInfo = rs.data;
  },
  //联系人
  SET_SELLER_CONTACT: (state, rs) => {
    state.sellerContact = rs.data;
  },



  SET_SELLER_QUALIFICATION: (state,rs) => {
    state.sellerQualification = rs
  },

  /*
  * 消息
  * */
  SET_MSG_SEARCH_QUERY: (state, rs) => {
    state.msgSearchQuery = rs
  },
  /*
   * 编辑商家信息和弹框消息优先
   * */
  SET_EDIT_WITH_MSG:(state,rs)=>{
    state.editBussWithMsg = rs
  },
  SET_ALERT_BUSS_MSG:(state,rs)=>{
    state.alertBussMsg = rs
  },
  //消息弹窗 开启
  SET_MSG_ALERT_DETAIL: (state, rs) => {
    if(rs.data){
      state.alertMsg = true
      state.msgDetail = rs.data
    }
  },
  //消息弹窗关闭
  SET_ALERT_MSG_READ: (state,rs) => {
    state.alertMsg = false
  },
  DEMO_SET_ALERT_MSG_READ: (state,rs) => {
    state.alertMsg = false
  },
  SET_MSG_DETAIL: (state, rs) => {
    state.msgDetail = rs.data
  },

  /*
  * 商家入仓
  * */
  SET_SELLER_STORAGE_STATUS:(state,rs)=>{
    state.sellerInStorageStatus = rs.data
  },
  /*
  *
  * */
  SET_VIEW_IMAGE:(state,rs) => {
    state.viewImageConfig = rs
  },
  GET_ALL_CITY: (state,rs)=>{
    state.allCity = rs;
  },
}
