<!--订单详情-->
<template>
  <div>
    <div class="title">
      <span>订单详情</span>
    </div>
    <div class="section" v-if="dataReady">
      <div class="section-item">
        <div class="base-data">
          <div class="inline-item">
            <span>订单编号：{{orderDetail.order.number || '暂无信息'}}</span>
          </div>
          <div class="inline-item">
            <span>销售渠道：{{orderType[orderDetail.order.type] || '暂无信息'}}</span>
          </div>
          <div class="inline-item">
            <span>下单时间：{{orderDetail.order.createTime || '暂无信息'}}</span>
          </div>
          <div class="inline-item">
            <span>付款时间：{{orderDetail.order.payTime || '暂无信息'}}</span>
          </div>
          <div class="inline-item">
            <span>导出时间：
              <template v-if="orderDetail.order.operationStatus == 1">
                {{orderDetail.operationTime ? orderDetail.operationTime : '未导出'}}
              </template>
              <template v-else >
                未导出
              </template>
            </span>
          </div>
          <div class="inline-item">
            <span>订单状态： {{orderStatus[orderDetail.order.status]}}</span>
          </div>
          <div class="inline-item">
            <span>冻结状态：{{orderFreeze[orderDetail.order.isFreeze]?orderFreeze[orderDetail.order.isFreeze]:'暂无信息'}}</span>
          </div>
        </div>
        <div class="steps">
          <el-steps :space="200" :active="orderDetail.order.status > 4 ? (orderDetail.order.status == 9 ? 3 : 1) : orderDetail.order.status" center>
            <el-step title="提交订单" description=""></el-step>
            <el-step title="待发货" description=""></el-step>
            <el-step title="已发货" description=""></el-step>
            <el-step title="交易成功" description=""></el-step>
          </el-steps>
        </div>
      </div>
      <div class="section-item">
        <div class="receiving-msg">
          <div class="section-title">
            <span>收货信息</span>
          </div>
          <div class="detail-box" v-if="orderDetail.orderReceiveAddress">
            <div class="block-item">
              <span>收货人：{{orderDetail.orderReceiveAddress.fullName}}</span>
            </div>
            <div class="block-item">
              <span>收货手机号：{{orderDetail.orderReceiveAddress.mobileNumber}}</span>
            </div>
            <div class="block-item">
              <span v-if="orderDetail.order.status == 3 || (orderDetail.order.operationStatus == 1 && orderDetail.operationTime)">收货地址：{{orderDetail.orderReceiveAddress.totalAddress}}</span>
              <span v-else>收货地址：{{starString(orderDetail.orderReceiveAddress.totalAddress,6)}}</span>
            </div>
            <div class="block-item" v-if="orderDetail.isNeedIdCardNumber || orderDetail.isNeedIdCardImage">
              <span>身份证号：
                <span v-if="orderDetail.isNeedIdCardNumber">{{orderDetail.orderReceiveAddress.idCard}}</span>
              </span>
              <el-button v-if="orderDetail.isNeedIdCardImage" type="primary" size="small"  @click="getIdCard(orderDetail.orderReceiveAddress.fullName,orderDetail.orderReceiveAddress.idCard)">获取身份证信息</el-button>
            </div>
          </div>

        </div>
      </div>
      <div class="section-item">
        <div class="logistics-msg">
          <div class="section-title">
            <span>物流信息</span>
          </div>
          <template v-if="orderDetail.orderLogisticsShipmentList && orderDetail.orderLogisticsShipmentList.length">
            <div v-for="(expressItem,expressKey) in orderDetail.orderLogisticsShipmentList" class="detail-box">
              <div class="block-item">
                <span>发货时间：{{expressItem.sendTime ? expressItem.sendTime : '待发货'}}</span>
              </div>
              <div class="block-item">
                <span>物流公司：</span>
                <span>{{expressItem.logisticsChannel ? expressItem.logisticsChannel : '暂无信息'}}</span>


              </div>
              <div class="block-item">
                <span>物流单号：</span>
                <span>{{expressItem.logisticsNumber ? expressItem.logisticsNumber : '暂无信息'}}</span>
              </div>
              <div class="block-item">
                <div class="section-item-sign-wrap">
                  <span>物流追踪：</span>
                </div>
                <div style="display: inline-block">
                  <template v-if="expressItem.logisticsDetailList && expressItem.logisticsDetailList.length">
                    <template v-for="(item,idx) in expressItem.logisticsDetailList">
                      <div v-if="idx < 3">
                        {{item.operateTime}} {{item.content}}
                      </div>
                    </template>
                    <template v-if="expressItem.logisticsDetailList.length > 3">
                      <el-button type="primary" size="small" @click="showLogisticsDetail(expressItem.logisticsDetailList)">查看完整物流</el-button>
                    </template>
                  </template>
                  <span v-else>暂无物流信息</span>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="detail-box">
              <div class="block-item">
                <span>发货时间：待发货</span>
              </div>
              <div class="block-item">
                <span>物流公司：</span>
                <template v-if="orderDetail.order.status == 2">
                      <el-select  v-model="sendOrderConfig.opts.expressChannel"  class="input-item" size="small"  placeholder="请选择">
                        <template v-for="subItem in sendOrderConfig.options">
                          <el-option  :label="subItem.desc" :value="subItem.desc"></el-option>
                        </template>
                      </el-select>
                    </template>
                <span v-else>暂无信息</span>


              </div>
              <div class="block-item">
                <span>物流单号：</span>
                <template v-if="orderDetail.order.status == 2">
                      <el-input v-model="sendOrderConfig.opts.expressNumber" class="input-item-middle" size="small" placeholder="请输入内容" ></el-input>
                      <el-button type="primary" size="small" @click="setSendOrder()" >发货</el-button>
                    </template>
                <template v-else>
                      <span>暂无信息</span>
                    </template>

              </div>
              <div class="block-item">
                <div class="section-item-sign-wrap">
                  <span>物流追踪：</span>
                </div>
                <div style="display: inline-block">
                  <span >暂无物流信息</span>
                </div>
              </div>
            </div>
          </template>

        </div>
      </div>
      <div class="section-item">
        <div class="product-list">
          <div class="section-title">
            <span >商品清单</span>
          </div>
        </div>
      </div>

      <div class="result-view">
        <el-table :data="orderDetail.orderProductList" style="width: 100%;" :row-class-name="tableRowClassName">
          <template v-for="(item,key) in productConfig[0]">
            <el-table-column v-if="item.type == 'image'" :label="item.label" label="商品主图" width="120" align="center">
              <template slot-scope="scope">
                <div class="el-table-image">
                  <img v-bind:src="scope.row.productImg" alt="">
                </div>
              </template>
            </el-table-column>


            <el-table-column v-else-if="item.type == 'hasReparation'" :width="item.width" :label="item.label" :prop="item.key" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.hasReparation ? '是' : '否'}}</span>
              </template>
            </el-table-column>

            <el-table-column v-else :label="item.label" :width="item.width" :prop="item.key" align="center">

            </el-table-column>
          </template>
        </el-table>
      </div>

      <div class="modal">
        <!--:style="modal.isOpacity ? 'opacity:0' : ''"-->
        <el-dialog size="tiny" title="重新发货"  :visible.sync="modal.isShow">
          <el-form :model="sendOrderConfig.opts" :rules="rules" ref="sendOrderConfig.opts">
            <el-form-item  label="物流公司" prop="expressChannel" label-width="100px">
              <el-select v-model="sendOrderConfig.opts.expressChannel" filterable placeholder="物流公司">
                <template v-for="subItem in sendOrderConfig.options">
                  <el-option  :label="subItem.desc" :value="subItem.desc"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item  label="快递单号" prop="expressNumber" label-width="100px">
              <el-input  v-model="sendOrderConfig.opts.expressNumber" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelModal()">取 消</el-button>
            <el-button type="primary" @click="setSendOrder()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="modal">
        <el-dialog  title="物流信息" :visible.sync="modalLogistics.isShow">
          <div class="log-detail">
            <template v-for="(item,idx) in modalLogistics.list">
              <div v-if = 'idx == 0' class="log-item cur-log">
                <p class="log-msg">{{item.content}}</p>
                <p class="log-time">{{item.operateTime}}</p>
                <i class="sign"></i>
              </div>
              <div v-else class="log-item">
                <p class="log-msg">{{item.content}}</p>
                <p class="log-time">{{item.operateTime}}</p>
                <i class="sign"></i>
              </div>
            </template>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelLogisticsModal()">确定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="modal">
        <el-dialog  title="身份证信息" :visible.sync="IdCardModal.isShow">
          <div class="card-item">
            <span>身份证正面:</span>
            <img :src="IdCardDetail.imgFront" alt="">
          </div>
          <div class="card-item">
            <span>身份证反面:</span>
            <img :src="IdCardDetail.imgBack" alt="">
          </div>
          <div slot="footer" class="dialog-footer">
            <!--<a :href="IdCardDetail.imgBack" :download="IdCardDetail.imgBack">-->
            <!--<el-button type="primary">下载</el-button>-->
            <!--</a>-->
            <el-button type="primary" @click="callDownLoadIdCardImg(IdCardDetail.imgFront,IdCardDetail.imgBack)">下载</el-button>

          </div>
        </el-dialog>
      </div>
    </div>

  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'orderDetail',
    created (){
      this.initView()
    },
    data: () => ({
      orderDetail:{},
      modal:{
        isShow:false,
        isOpacity:false
      },
      modalLogistics:{
        isShow:false,
        list:[]
      },
      IdCardModal:{
        isShow:false
      },
      sendOrderConfig:{
        opts:{
          expressChannel: '',
          expressNumber: '',
          orderNumber:''
        },
        options:[]
      },
      orderExpress:[],
      rules:{
        expressChannel: [
          { required: true, message: '请输入物流公司', trigger: 'blur' }
        ],
        expressNumber:[
          { required: true, message: '请输入物流单号', trigger: 'blur' }
        ],
      },
      detailType:'',
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
      orderStatus:{1:'未付款',2:'待发货',3:'已发货',4:'交易成功',5:'用户取消',6:'超时取消',7:'团购进行中',9:'部分发货'},
      orderFreeze:{0:'未冻结',1:'已冻结',2:'未冻结'},
      tableList:[],
      productConfig:{
        0:[
          {
            key:'productImg',
            label:'商品主图',
            type:'image',
          },
          {
            key:'productName',
            label:'商品名称',
          },
          {
            key:'sendAddress',
            label:'发货地',
          },
          {
            key:'productCode',
            label:'发货编码',
          },
          {
            key:'productCount',
            label:'购买数量',
          },
          {
            key:'logisticsNumbers',
            label:'物流单号'
          },
          {
            key:'refundStatusStr',
            label:'退款状态',
          },
          {
            key:'refundProductCount',
            label:'退款数量',
          },
          {
            key:'hasReparation',
            label:'是否产生赔付',
            type:'hasReparation'
          },
        ],
      },
      dataReady:false,
      orderNumber:'',
      IdCardDetail:{}
    }),
    computed: {

    },
    methods: {
      ...mapActions(['setViewImage','getRefundApplyReason','getOrderDetail','sendOrder','getIdCardMsg','downLoadIdCardImg','callSetNotice','getOrderExpressList']),
      initView() {
        const orderNumber = this.$route.params.orderNumber
        this.orderNumber = orderNumber
        let sLink = '';
        this.detailType = 'search'
        sLink = '/order/getOrderDetail/'

        const opts = {
          link: sLink,
          data: orderNumber
        }
        this.getOrderDetail(opts)
          .then((rs) =>{
            this.orderDetail = rs
            if(this.orderDetail.order.status == 2){
              this.sendOrderData((rs)=>{
                this.orderExpress = rs
                this.sendOrderConfig.options = this.orderExpress
              })
            }
            this.dataReady = true;
          })
      },
      showLogisticsDetail(rs){
        this.modalLogistics.list = rs
        this.modalLogistics.isShow = true
      },
      cancelLogisticsModal(){
        this.modalLogistics.isShow = false
        this.modalLogistics.list = []
      },
      sendOrderData(fn) {
        this.getOrderExpressList({orderNumber:this.orderDetail.order.number})
          .then((rs)=>{
            fn(rs)
          })


      },
      setReloadSendOrder() {
        this.sendOrderData((rs)=>{
          this.orderExpress = rs
          this.sendOrderConfig.options = this.orderExpress
          this.sendOrderConfig.opts.expressChannel = this.orderDetail.logisticsChannel
          this.sendOrderConfig.opts.expressNumber = this.orderDetail.logisticsNumber
          this.sendOrderConfig.opts.orderNumber = this.orderDetail.order.number
          this.modal.isShow = true
          this.modal.isOpacity = false
        })
      },
      cancelModal(){
        this.sendOrderConfig.opts.expressChannel = ''
        this.sendOrderConfig.opts.expressNumber = ''
        this.sendOrderConfig.opts.orderNumber = ''
        this.modal.isShow = false
        this.modalLogistics.isShow = false
      },
      setSendOrder() {
        if(!this.sendOrderConfig.opts.expressChannel ) {
          this.getNotice('请选择物流公司');
          return false
        }
        if(!this.sendOrderConfig.opts.expressNumber) {
          this.getNotice('请填写物流单号');
          return false
        }
        this.sendOrderConfig.opts.orderNumber = this.orderDetail.order.number;
        this.modal.isOpacity = true
        this.$confirm('物流公司：'+this.sendOrderConfig.opts.expressChannel+'，快递单号：'+this.sendOrderConfig.opts.expressNumber,
          '是否确认发货', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
          this.sendOrder(this.sendOrderConfig.opts)
            .then(() => {
              this.cancelModal()
              this.initView()
            })
        }).catch(() => {
//          console.log('------')
          this.modal.isOpacity = false
        });

      },
      showImage(src) {
        const opts = {
          url:src,
          isShow:true
        }
        this.setViewImage(opts)
      },
      tableRowClassName(row, index) {
        if (index%2 === 1) {
          return 'info-row';
        }
        return 'positive-row';
      },
      getIdCard(name,id){
        if(!name || !id){
          this.getNotice('身份证信息不存在');
          return false
        }
        const opts = {
          number:id,
          name:name
        }
        this.getIdCardMsg(opts)
          .then((rs)=>{
            this.IdCardDetail = rs
            this.IdCardModal.isShow = true
          })
      },
      callDownLoadIdCardImg(url,url2){
        const opts = {
          fileUrl:url+','+url2,
          orderNumber:this.orderDetail.order.number
        }
        this.downLoadIdCardImg(opts)
      },
      getNotice(msg){
        const notice = {
          isShow:true,
          msg:msg,
        }
        this.callSetNotice(notice)
      },
      starString(msg,num){
        let s = '',
          star = ''
        if(msg){
          if(msg.length < num){
            s = msg
          }
          else {
            star = new Array(msg.length - num + 1).join('*')
            s = msg.substring(0,num) + star
          }
        }

        return s
      },
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .result-view{
    margin: 20px 20px 20px 0;
    padding:0 0 0 20px;
  }
  .steps{
    padding: 10px;
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
  .section-item-sign-wrap{
    width: auto;
  }
  .card-item{
    width: 400px;
    margin: 20px 0;
    /*text-align: left;*/
    img{
      width: 200px;
    }
  }
  .log-detail{
    box-sizing: border-box;
    border-left: 2px solid #DDD;
    padding: 0 20px;
    .log-item{
      position: relative;
      padding: 10px 0px;
      border-top:1px solid #EEE;
      .log-msg{

      }
      .log-time{

      }
      .sign{
        position: absolute;
        display: block;
        top:10px;
        left: -26px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #CCC;
      }
      &:nth-child(1){
        border-top:none;
      }
      &.cur-log{
        color:#fb4b4d;
        .sign{
          left: -28px;
          width: 15px;
          height: 15px;
          box-shadow: 0 0 10px 0px rgb(251,75,77);
          background-color: #fb4b4d;
        }
      }
    }
  }
  .process-item{
    margin: 10px 0;
    .process-msg{
      /*padding: 20px 0;*/
    }
    .process-img-wrap{
      .img-item{
        display: inline-block;
        width: 100px;
        height: 100px;
        line-height: 100px;
        margin-right: 10px;
        img{
          width: 100px;
        }
      }
    }
  }
  .order-worker-model{
    .block-item{
      margin-bottom: 5px;
      overflow: hidden;
    }
    .model-sign-wrap{
      float: left;
      .model-sign{
        display: inline-block;
        width: 80px;
      }
    }
    .model-msg{
      display: inline-block;
      width: 430px;
    }
  }
  .model-msg-img-wrap{
    position: relative;
    display: inline-block;
    width: 100px;
    height: 100px;
    line-height: 100px;
    margin: 10px 20px 0 0;
    text-align: center;
    overflow: hidden;
    &:hover{
      .el-icon-wrap{
        display: block;
      }
    }
  }
  .el-icon-wrap{
    position: absolute;
    display: none;
    top:0;
    left: 0;
    width: 100px;
    height: 100px;
    line-height: 100px;
    background-color: rgba(0,0,0,.5);
    i{
      cursor: pointer;
      padding: 0 10px;
      font-size: 20px;
      color: #8c939d;
    }
  }
  .model-msg-img{
    max-width: 100px;
    max-height: 100px;
    vertical-align: middle;
  }
  .detail-order-worker-model{
    .block-item{
      padding: 0;
      margin: 10px 0 0 0 ;
    }
    .model-msg{

      width: 830px;
    }
  }
</style>
基础商品码

SKU码

发货编码

商品名称-销售属性

购买数量

退款数量
