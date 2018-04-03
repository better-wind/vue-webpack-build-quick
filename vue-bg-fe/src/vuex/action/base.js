import axios from 'axios';
export default {
  Api : '/sellerAdmin',
  // Api : '/sellerAdminDev',
  fromPost : (url, params, target) => {
    // 生成form
    var form = document.createElement('form');
    form.action = url;
    form.method = 'post';
    form.style.display = 'none';
    if (target) {
      form.target = target;
    }

    // 添加参数
    for(var key in params) {
      var opt = document.createElement('input');
      opt.name = key;
      opt.value = params[key];
      form.appendChild(opt);
    }

    // 提交form并移除
    var submit = document.createElement('input');
    submit.type = 'submit';
    form.appendChild(submit);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  },
  nextFetch:(commit,opts,fn) => {
    /*
     * 请求回调处理 判断状态
     * @param  {Object}    rs     返回数据
     * @param  {Function} resolve 请求成功回调
     * */
    const next = (rs,resolve) => {
      // 判断返回 code
      // commit('SET_FULL_LOADING',false)
      if(rs.data.code == '10003'){
        location.href = '/#/login'
        return false
      }
      else if(rs.data.code == 1){
        fn && commit(fn,rs.data)
        resolve && resolve(rs.data.data)
      }
      else if(rs.data.code == '20262'){
        let _opt = {
          code:rs.data.code,
          msg:rs.data.message
        }
        resolve && resolve(_opt)
      }
      else if(rs.data.code == '30600004'){
        let _opt = {
          code:rs.data.code,
          msg:rs.data.message
        }
        resolve && resolve(_opt)
      }
      //供货价
      else if(rs.data.code == '20221'){
        resolve && resolve(rs.data.code)
      }
      else if(rs.data.code == '20220'){
        resolve && resolve(rs.data.code)
      }
      else{
        if(opts.url == '/sellerAdmin/login'){
          // console.log(rs.data.message)
          commit('SET_LOGIN_ERROR',rs.data.message)
        } else {
          const notice = {
            isShow:true,
            msg:rs.data.message,
          }
          setNotice(commit, notice)
        }
      }

    }
    return fetch(commit,opts,next)
  },
  formData:(opts) => {
    let data = [];
    for(let i in opts){
      // data.push(i + '='+trim(opts[i]))
      data.push(encodeURIComponent(i) + '='+encodeURIComponent(trim(opts[i])))
    }
    return data.join('&');
  },
  getParamsData:(data) => {
    let paramsData = {
      paramsMap: {}
    }
    let opt = JSON.parse(JSON.stringify(data))
    for(let i in opt){
      opt[i] = opt[i] == 'all' ? null : opt[i]
      if(i != 'page' && i != 'rows'){
        paramsData.paramsMap[i] = opt[i]
      } else {
        paramsData[i] = opt[i]
      }
    }
    return paramsData
  },
  pageOpts:(opts) => {
    let _opts = {},
      p_opts = Object.assign({},opts)
    if(p_opts.page || p_opts.rows){
      _opts.page = p_opts.page
      _opts.rows = p_opts.rows
      _opts.paramsMap = Object.assign({},p_opts)
      if(_opts.paramsMap.hasOwnProperty('firstCategoryId')){
        _opts.paramsMap.categoryId = _opts.paramsMap.fourthCategoryId || _opts.paramsMap.thirdCategoryId || _opts.paramsMap.secondCategoryId || _opts.paramsMap.firstCategoryId
        delete _opts.paramsMap.fourthCategoryId
        delete _opts.paramsMap.thirdCategoryId
        delete _opts.paramsMap.secondCategoryId
        delete _opts.paramsMap.firstCategoryId
      }
      delete _opts.paramsMap.page
      delete _opts.paramsMap.rows
      for(let i in _opts.paramsMap){
        _opts.paramsMap[i] = _opts.paramsMap[i] ? (_opts.paramsMap[i] == 'all' ? null : _opts.paramsMap[i]) : null
      }
    }
    else {
      _opts = Object.assign({},p_opts)
    }
    return _opts
  },
  setNotice:(commit, rs) => {
    commit('SET_TOAST',rs)
  },
  setToast:(commit, rs) => {
    commit('SET_TOAST',rs)
  }
}
const startLoad = (commit, rs) => {
  const loading = {
    isShow:true,
  }
  commit('SET_LOADING',loading)
}
const stopLoad = (commit, rs) => {
  const loading = {
    isShow:false,
  }
  commit('SET_LOADING',loading)
}
const setNotice = (commit, rs) => {
  commit('SET_TOAST',rs)
}
const setToast = (commit, rs) => {
  commit('SET_TOAST',rs)
}
const trim = (s) => {
  const sT = (s+'').replace(/(^\s*)|(\s*$)/g, '');
  // return sT ? sT : null;
  return sT;
}
const checkTrim = (opt) =>{
  if(opt == null){
    return null
  }
  if(Object.prototype.toString.call(opt) === '[object Date]'){
    return opt
  }
  let obj = Object.prototype.toString.call(opt) === '[object Array]' ? [] : {}
  for(let i in opt){
    if(typeof opt[i] == 'object'){
      obj[i] = checkTrim(opt[i])
    } else {
      obj[i] = trim(opt[i])
    }
  }
  return obj
}
const checkLoading = [
  '/sellerAdmin/order/getOrderPageList', //订单详情
  '/sellerAdmin/order/getOrderPageCount', //订单详情
  '/sellerAdmin/order/afterSale/getStatistics',//售后订单
  '/sellerAdmin/order/delivery/getStatistic',//超时订单统计
  '/sellerAdmin/order/delivery/getExpireOrderList',//超时订单列表
  '/sellerAdmin/order/delivery/getApplyPageList',//超时发货报备
  '/sellerAdmin/goods/list',//商品管理
  // '/sellerAdmin/summary/goodsDetailData',//经营概况
]
const fetch = (commit,opts,fn) => {
  // console.log(opts)
  if(!opts.headers || !opts.headers['Content-Type'] == 'application/x-www-form-urlencoded' ){
    if(opts && opts.data && typeof opts.data == 'object'){
      opts.data = checkTrim(opts.data)
    }
  }
  return new Promise((resolve, reject) => {
    if(checkLoading.includes(trim(opts.url))){
      startLoad(commit);
    }
    axios(opts).then(response => {
      stopLoad(commit);
      fn && fn(response,resolve)
    }).catch((err) => {
      stopLoad(commit);
      commit('SET_FULL_LOADING',false)
    })
  })
}


