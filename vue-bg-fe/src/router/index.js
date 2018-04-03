import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// const Home = resolve => require.ensure([],()=>{resolve(require('@/components/common/Home'))}),
const Home = resolve => require(['@/components/common/Home'], resolve),
      Login = resolve => require(['@/pages/login/login'], resolve),
      // operateCondition = resolve => require.ensure([],()=>{resolve(require('@/pages/operateCondition/index'))},'Demo'),
      operateCondition = resolve => require(['@/pages/operateCondition/index'], resolve),
      saleGuidelines = resolve => require(['@/pages/operateCondition/saleGuidelines'], resolve),
      activityReport = resolve => require(['@/pages/activityReport/index'], resolve),
      productSearch = resolve => require(['@/pages/productManage/productSearch'], resolve),
      productEdit = resolve => require(['@/pages/productManage/productEdit'], resolve),
      orderSearch = resolve => require(['@/pages/orderManage/orderSearch'], resolve),
      orderExportTaskList = resolve => require(['@/pages/orderManage/orderExportTaskList'], resolve),
      orderMarket = resolve => require(['@/pages/orderManage/orderMarket'], resolve),
      orderTimeOut = resolve => require(['@/pages/orderManage/orderTimeOut'], resolve),
      orderTimeOutRecord = resolve => require(['@/pages/orderManage/orderTimeOutRecord'], resolve),
      orderAbnormalRecord = resolve => require(['@/pages/orderManage/orderAbnormalRecord'], resolve),
      editTimeOutRecord = resolve => require(['@/pages/orderManage/editTimeOutRecord'], resolve),
      orderDetail = resolve => require(['@/pages/orderManage/orderDetail'], resolve),
      orderMarketDetail = resolve => require(['@/pages/orderManage/orderMarketDetail'], resolve),
      batchDeliver = resolve => require(['@/pages/orderManage/batchDeliver'], resolve),
      orderExportRule = resolve => require(['@/pages/orderManage/orderExportRule'], resolve),
      orderMarketStatistics = resolve => require(['@/pages/orderManage/orderMarketStatistics'], resolve),
      orderTimeOutStatistics = resolve => require(['@/pages/orderManage/orderTimeOutStatistics'], resolve),
      authority = resolve => require(['@/pages/accountManage/authority'], resolve),
      businessInfo = resolve => require(['@/pages/accountManage/businessInfo'], resolve),
      editBusinessInfo = resolve => require(['@/pages/accountManage/editBusinessInfo'], resolve),
      deliveryArea = resolve => require(['@/pages/accountManage/deliveryArea'], resolve),
      distributionTemplate = resolve => require(['@/pages/accountManage/distributionTemplate'], resolve),
      rulesCenter = resolve => require(['@/pages/rulesCenter/rulesCenter'], resolve),
      messageCenter = resolve => require(['@/pages/messageCenter/messageCenter'], resolve),
      messageDetail = resolve => require(['@/pages/messageCenter/messageDetail'], resolve),
      largeReport = resolve => require(['@/pages/activityReport/largeReport'], resolve),
      dailyReport = resolve => require(['@/pages/activityReport/dailyReport'], resolve),
      activityDetailBack = resolve => require(['@/pages/activityReport/activityDetailBack'], resolve),
      activityDetail = resolve => require(['@/pages/activityReport/activityDetail'], resolve),
      autonomousSettlement = resolve => require(['@/pages/autonomousSettlement/autonomousSettlement'], resolve),
      freightTemp = resolve => require(['@/pages/freightManage/freightTemp'], resolve),
      editFreight = resolve => require(['@/pages/freightManage/editFreight'], resolve),
      productWeight = resolve => require(['@/pages/freightManage/productWeight'], resolve),
      productWeightSale = resolve => require(['@/pages/freightManage/productWeightSale'], resolve),
      warehouseAgreement = resolve => require(['@/pages/businessWarehousing/warehouseAgreement'], resolve),
      applyWarehouse = resolve => require(['@/pages/businessWarehousing/applyWarehouse'], resolve),
      manageWarehouse = resolve => require(['@/pages/businessWarehousing/manageWarehouse'], resolve),
      manageWarehouseDetail = resolve => require(['@/pages/businessWarehousing/manageWarehouseDetail'], resolve),
      manageWarehouseProduct = resolve => require(['@/pages/businessWarehousing/manageWarehouseProduct'], resolve),
      manageWarehouseOrder = resolve => require(['@/pages/businessWarehousing/manageWarehouseOrder'], resolve),
      manageWarehouseOrderDetail = resolve => require(['@/pages/businessWarehousing/manageWarehouseOrderDetail'], resolve),


      invoiceList = resolve => require(['@/pages/invoiceManage/invoiceList'], resolve),
      invoiceDetail = resolve => require(['@/pages/invoiceManage/invoiceDetail'], resolve),
      productList = resolve => require(['@/pages/productManage/productList'], resolve),
      productAudit = resolve => require(['@/pages/productManage/productAudit'], resolve),
      productConsult = resolve => require(['@/pages/productManage/productConsult'], resolve),
      productDetail = resolve => require(['@/pages/productManage/productDetail'], resolve);
// 经营概况 /operateCondition
// 商品管理 /productSearch
// 订单查询 /orderSearch
// 售后订单统计 /orderMarketStatistics
// 商家基本信息 /businessInfo
// 账户与权限 /authority
// 规则中心 /rulesCenter
// 消息中心 /messageCenter
// 大型活动提报 /largeReport
// 日常活动提报 /dailyReport
// 超时订单统计 /orderTimeOutStatistics
// 超时发货报备 /orderTimeOutRecord
export default new Router({
  routes: [
    {
      path:'/login',
      name:'Login',
      component: Login
    },
    {
      path: '/manage/warehouse/detail',
      name: 'manageWarehouseDetail',
      component: manageWarehouseDetail,
    },
    {
      path: '/',
      redirect: '/operate/condition',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/operate/condition',
          name: 'operateCondition',
          component: operateCondition,
        },
        {
          path: '/sale/guidelines',
          name: 'saleGuidelines',
          component: saleGuidelines,
        },
        {
          path: '/large/report',
          name: 'largeReport',
          component: largeReport,
        },
        {
          path: '/daily/report',
          name: 'dailyReport',
          component: dailyReport,
        },
        {
          path: '/activity/detail/goods',
          name: 'activityDetail',
          component: activityDetail,
        },
        {
          path: '/activity/detail',
          name: 'activityDetailBack',
          component: activityDetailBack,
        },
        {
          path: '/product/search',
          name: 'productSearch',
          component: productSearch,
        },
        {
          path: '/product/edit',
          name: 'productEdit',
          component: productEdit,
        },
        {
          path: '/product/list',
          name: 'productList',
          component: productList,
        },
        {
          path: '/product/audit',
          name: 'productAudit',
          component: productAudit,
        },{
          path: '/product/consult',
          name: 'productConsult',
          component: productConsult,
        },
        {
          path: '/product/detail',
          name: 'productDetail',
          component: productDetail,
        },
        {
          path: '/order/search',
          name: 'orderSearch',
          component: orderSearch,
        },
        {
          path: 'order/export/list',
          name: 'orderExportTaskList',
          component: orderExportTaskList,
        },
        {
          path: '/order/market',
          name: 'orderMarket',
          component: orderMarket,
        },
        {
          path: '/order/timeout',
          name: 'orderTimeOut',
          component: orderTimeOut,
        },
        {
          path: '/order/timeout/record',
          name: 'orderTimeOutRecord',
          component: orderTimeOutRecord,
        },
        {
          path: '/order/abnormal/record',
          name: 'orderAbnormalRecord',
          component: orderAbnormalRecord,
        },
        {
          path: '/edit/timeout/record',
          name: 'editTimeOutRecord',
          component: editTimeOutRecord,
        },
        {
          path: '/order/market/statistics',
          name: 'orderMarketStatistics',
          component: orderMarketStatistics,
        },
        {
          path: '/order/timeout/statistics',
          name: 'orderTimeOutStatistics',
          component: orderTimeOutStatistics,
        },
        {
          path: '/batch/deliver/:type',
          name: 'batchDeliver',
          component: batchDeliver,
        },
        {
          path: '/order/export/rule',
          name: 'orderExportRule',
          component: orderExportRule,
        },
        {
          path: '/order/detail/:orderNumber',
          name: 'orderDetail',
          component: orderDetail,
        },
        {
          path: '/order/market/detail/:orderNumber',
          name: 'orderMarketDetail',
          component: orderMarketDetail,
        },
        {
          path: '/business/info',
          name: 'businessInfo',
          component: businessInfo,
        },
        {
          path: '/edit/business/info',
          name: 'editBusinessInfo',
          component: editBusinessInfo,
        },
        {
          path: '/authority',
          name: 'authority',
          component: authority,
        },
        {
          path: '/delivery/area',
          name: 'deliveryArea',
          component: deliveryArea,
        },
        {
          path: '/distribution/template',
          name: 'distributionTemplate',
          component: distributionTemplate,
        },
        {
          path: '/rules/center',
          name: 'rulesCenter',
          component: rulesCenter,
        },
        {
          path: '/message/center',
          name: 'messageCenter',
          component: messageCenter,
        },
        {
          path: '/message/detail',
          name: 'messageDetail',
          component: messageDetail,
        },
        {
          path: '/autonomous/settlement',
          name: 'autonomousSettlement',
          component: autonomousSettlement,
        },
        {
          path: '/freight/temp',
          name: 'freightTemp',
          component: freightTemp,
        },
        {
          path: '/edit/freight',
          name: 'editFreight',
          component: editFreight,
        },
        {
          path: '/product/weight',
          name: 'productWeight',
          component: productWeight,
        },
        {
          path: '/product/weight/sale',
          name: 'productWeightSale',
          component: productWeightSale,
        },
        {
          path: '/warehouse/agreement',
          name: 'warehouseAgreement',
          component: warehouseAgreement,
        },
        {
          path: '/apply/warehouse',
          name: 'applyWarehouse',
          component: applyWarehouse,
        },
        {
          path: '/manage/warehouse',
          name: 'manageWarehouse',
          component: manageWarehouse,
        },
        {
          path: '/manage/warehouse/product',
          name: 'manageWarehouseProduct',
          component: manageWarehouseProduct,
        },
        {
          path: '/manage/warehouse/order',
          name: 'manageWarehouseOrder',
          component: manageWarehouseOrder,
        },
        {
          path: '/manage/warehouse/order/detail',
          name: 'manageWarehouseOrderDetail',
          component: manageWarehouseOrderDetail,
        },
        {
          path: '/invoice/list',
          name: 'invoiceList',
          component: invoiceList,
        },
        {
          path: '/invoice/detail',
          name: 'invoiceDetail',
          component: invoiceDetail,
        },
      ],
    },
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
});
