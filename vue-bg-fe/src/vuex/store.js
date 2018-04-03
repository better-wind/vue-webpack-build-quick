import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import ware from './module/wareModule'
import activity from './module/activityModule'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    fullscreenLoading:false,
    isFreeze:false, //是否商家冻结
    notice: {}, //提醒配置
    toast: {},
    loading: {
      list:[]
    }, // 加载配置
    modal: {
      isShow: false,
    },
    newGoods:true,
    loginError:'', //登录错误 string
    // 商品库相关商品
    productUpload:{
      detail:'',
      images:[]
    },
    //老版商品
    categoryAll: {}, //所以分类 object
    categoryList:[], //商品详情分类列表 array
    clearSelect:{
      isClear:false
    },  // 重置商品查询类目 临时解决方法
    orderList:[],
    //批量发货
    mockSendOrder:{
      orderSendFile:null, //批量发货文件,
    },
    logisticsChannel:[],//物流

    loginCheck:{}, //商家登录权限
    sellerInfo: {}, //商家信息
    sellerContact: {}, //商家联系人


    sellerQualification:{},//商家资质



    brandList:[], //品牌列表



    allCity: {}, //获取所有省市区

    currentSearch:{}, //当前页面搜索配置
    currentSearchQuery:{}, //当前链接搜索的query 配合currentSearch
    searchParams:{},
    //消息
    msgSearchQuery:{
      isFocus:false
    },
    msgDetail:{},//消息详情



    editBussWithMsg:false, //编辑商家信息弹窗 控制优先级
    alertMsg:false, //弹框提示消息控制
    alertBussMsg:false,
    sellerInStorageStatus:{},//商家入仓
    viewImageConfig:{
      isShow:false,
      url:''
    }

  },
  mutations,  // 修改store方法
  actions,    // 调用修改store方法
  modules: {
    ware,
    activity
  },
})
export default store

