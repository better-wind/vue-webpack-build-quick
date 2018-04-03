<template>
  <div class="left-bav panel-item">
    <div style="opacity: 0">fixed-demo</div>
    <el-menu :default-active="onRoutes" class="el-menu-vertical" :unique-opened="true" router>

      <template v-for="item in menuList">
        <template v-if="item == '经营概况'" >
          <el-menu-item  index="/operate/condition"><i class="ggj-nav-icon">&#xe60d;</i>经营概况</el-menu-item>
          <el-menu-item  index="/sale/guidelines"><i class="ggj-nav-icon">&#xe614;</i>联系我们</el-menu-item>
        </template>
        <template v-if="item == '商品管理'">
          <el-submenu  index="8">
              <template slot="title"><i class="ggj-nav-icon">&#xe60b;</i>商品管理</template>
              <el-menu-item-group>
                <el-menu-item index="/product/list">商品列表</el-menu-item>
                <el-menu-item index="/product/audit">审核记录</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
        </template>
        <el-submenu v-if="item == '订单管理'" index="2">
          <template slot="title"><i class="ggj-nav-icon">&#xe60c;</i>订单管理</template>
          <el-menu-item-group>
            <template v-if="menuList.indexOf('订单查询')>-1">
              <el-menu-item  index="/order/search">订单查询</el-menu-item>
              <el-menu-item  index="/order/export/list">订单下载列表</el-menu-item>
            </template>
            <template v-if="menuList.indexOf('售后订单统计')>-1">
              <el-menu-item  index="/order/market/statistics">售后订单统计</el-menu-item>
              <el-menu-item  index="/order/market">售后订单列表</el-menu-item>

            </template>
            <template v-if="menuList.indexOf('超时订单统计')>-1">
              <!--<el-menu-item  index="orderTimeOutStatistics">超时订单统计</el-menu-item>-->
              <el-menu-item  index="/order/timeout">超时订单列表</el-menu-item>
            </template>
            <el-menu-item v-if="menuList.indexOf('超时发货报备')>-1" index="/order/timeout/record">超时发货报备</el-menu-item>

          </el-menu-item-group>

        </el-submenu>
        <el-submenu v-if="item == '商家基本信息'" index="3">
          <template slot="title"><i class="ggj-nav-icon">&#xe615;</i>商家信息</template>
          <el-menu-item-group>
            <el-menu-item  index="/business/info">基本信息</el-menu-item>
            <el-menu-item  index="/delivery/area">发货地管理</el-menu-item>
            <el-menu-item  index="/distribution/template">配送模板管理</el-menu-item>
          </el-menu-item-group>

        </el-submenu>
        <el-submenu v-if="item == '活动提报'" index="4">
          <template slot="title"><i class="ggj-nav-icon">&#xe608;</i>活动提报</template>
          <el-menu-item-group>
            <el-menu-item index="/large/report">大促活动提报</el-menu-item>
            <!--<el-menu-item index="dailyReport">日常活动提报</el-menu-item>-->
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item v-if="item == '运费模板'" index="/freight/temp"><i class="ggj-nav-icon">&#xe618;</i>运费模板</el-menu-item>
        <template v-if="item == '商家入仓'">
          <template v-if="sellerInStorageStatus.status == 2">
            <el-submenu index="9">
              <template slot="title"><i class="ggj-nav-icon">&#xe619;</i>商家入仓</template>
              <el-menu-item-group>
                <el-menu-item index="/manage/warehouse">入仓单管理</el-menu-item>
                <el-menu-item index="/manage/warehouse/product">入仓商品管理</el-menu-item>
                <el-menu-item index="/manage/warehouse/order">入仓订单管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

          </template>
          <el-menu-item v-else index="/warehouse/agreement"><i class="ggj-nav-icon">&#xe619;</i>商家入仓</el-menu-item>
        </template>
        <el-menu-item v-if="item == '发票管理'" index="/invoice/list"><i class="ggj-nav-icon">&#xe608;</i>发票管理</el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    data:()=>({
      menuList:[],
      uniqueOpen:false,
    }),
    created(){
      this.initMenu()
    },
    computed:{
      ...mapState(['loginCheck','sellerInStorageStatus','newGoods']),
      onRoutes(){
        return this.$route.path;
      }
    },
    methods:{
      ...mapActions(['getSellerInStorageStatus']),
      initMenu(){
        let _len = this.loginCheck.functionList.length
        while(_len--){
            var _item = this.loginCheck.functionList[_len].functionName
            this.menuList.push(_item)
        }
        this.menuList.reverse()
        this.getSellerInStorageStatus()
      },
      wareHouse(){
        let newWin = window.open()
        this.getSellerInStorageStatus()
          .then(()=>{
            if(this.sellerInStorageStatus.status == 2){
              newWin.location.href = '/sellerAdmin/page/sellerinstorage/order.html'
            }
            else {
              newWin.close()
              this.$router.push({
                path: '/warehouse/agreement',
              })
            }
          })
      }
    }
  }
</script>

