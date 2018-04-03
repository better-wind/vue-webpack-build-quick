<template>
  <div>
    <div class="title">
      <span>入仓订单详情</span>
    </div>
    <div class="section" v-if="dataReady">
      <div class="section-item">
        <div class="base-data">
          <div class="base-data">
            <div class="inline-item">
              <span>订单编号：{{orderDetail.number || '暂无信息'}}</span>
            </div>
            <div class="inline-item">
              <span>销售渠道：{{orderType[orderDetail.type] || '暂无信息'}}</span>
            </div>
            <div class="inline-item">
              <span>下单时间：{{orderDetail.createTime || '暂无信息'}}</span>
            </div>
            <div class="inline-item">
              <span>付款时间：{{orderDetail.payTime || '暂无信息'}}</span>
            </div>
            <div class="inline-item">
            <span>导出时间：
              <template v-if="orderDetail.operationStatus == 1">
                {{orderDetail.operationTime ? orderDetail.operationTime : '未导出'}}
              </template>
              <template v-else >
                未导出
              </template>
            </span>
            </div>
            <div class="inline-item">
              <span>订单状态：{{orderStatus[orderDetail.status]}}</span>
            </div>
            <div class="inline-item">
              <span>冻结状态：{{orderFreeze[orderDetail.isFreeze]?orderFreeze[orderDetail.isFreeze]:'暂无信息'}}</span>
            </div>
          </div>
          <div class="steps">
            <el-steps v-if="orderDetail.status > 4" :space="200" :active="1" center>
              <el-step title="提交订单" description=""></el-step>
              <el-step title="待发货" description=""></el-step>
              <el-step title="已发货" description=""></el-step>
              <el-step title="交易成功" description=""></el-step>
            </el-steps>
            <el-steps v-else :space="200" :active="orderDetail.status" center>
              <el-step title="提交订单" description=""></el-step>
              <el-step title="待发货" description=""></el-step>
              <el-step title="已发货" description=""></el-step>
              <el-step title="交易成功" description=""></el-step>
            </el-steps>
          </div>
        </div>
      </div>
      <div class="section-item">
        <div>
          <div class="section-title">
            <span>商品清单</span>
          </div>
        </div>
      </div>
      <div class="result-view">
        <el-table :data="orderDetail.orderProductList" style="width: 100%;" >
          <template v-for="(item,key) in productConfig">
            <el-table-column v-if="item.type == 'unit'" :label="item.label"  width="item.width" align="center">
              <template slot-scope="scope">
                <div class="el-table-image">

                </div>
              </template>
            </el-table-column>

            <el-table-column v-else :label="item.label" :width="item.width" :prop="item.key" align="center">

            </el-table-column>
          </template>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    created (){
      this.initView()
    },
    data: () => ({
      marketType:{
        1: '仅退款',
        2: '退款退货',
        3: '咨询',
        4: '投诉',
        5: '赔付',
      },
      orderType:{
        1:'格格家',
        2:'格格团',
        3:'格格团全球购',
        4:'环球捕手',
        5:'燕网',
        6:'格格家供应链',
        7:'手q',
        8:'脉宝云店',
        10:'美食买手'
      },
      marketLabel:{
        1: '退款',
        2: '退款',
        5: '赔付',
        3: ''
      },
      orderStatus:{1:'提交订单',2:'待发货',3:'已发货',4:'交易成功',5:'用户取消',6:'超时取消',7:'团购进行中'},
      orderFreeze:{0:'未冻结',1:'已冻结',2:'未冻结'},
      tableList:[],
      productConfig: [
          {
            key:'baseGoodsCode',
            label:'基础商品码',
          },{
            key:'skuCode',
            label:'SKU码',
          },{
            key:'deliverCode',
            label:'发货编码',
          },{
            key:'skuName',
            label:'商品名称-销售属性',
          },{
            key:'count',
            label:'购买数量',
          },{
            key:'refundCount',
            label:'退款数量',
          },
        ],
      dataReady:false,
      orderNumber:'',
      orderDetail:{}
    }),
    computed: {
      ...mapState(['orderDetail'])
    },
    methods: {
      ...mapActions(['setViewImage','getWareHouseOrderDetail']),
      initView() {

        const orderNumber = this.$route.query.operateNumber
        this.orderNumber = orderNumber
        const opts = {
          orderNumber: orderNumber
        }
        this.getWareHouseOrderDetail(opts)
          .then((rs) =>{
            this.setOrderDetail(rs)
          })
      },
      setOrderDetail(rs){
        this.orderDetail = rs
        this.dataReady = true;
      }

    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .result-view{
    margin: 20px 20px 20px 0;
    padding:0 0 0 20px;
  }
  .steps{
    padding: 20px;
  }
  .section-item{
    padding-top: 10px;
    margin-bottom: 10px;
    .base-data{
      .inline-item{
        width: 250px;
        padding-right: 0;
      }
    }
    .el-table-title{
      width: 230px;
    }
    .item-sign{
      padding: 20px 0;
    }
    .detail-box{
      margin:10px 20px 0 0;
      padding-left: 20px;
      background-color: #f5f5f5;
    }
  }
</style>
