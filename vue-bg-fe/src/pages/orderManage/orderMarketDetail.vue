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
            <span>售后类型：{{marketType[orderDetail.workOrderType] || '暂无信息'}}</span>
          </div>
          <div class="inline-item">
            <span>售后原因：{{orderDetail.workOrderProblemDesc || '暂无信息'}}</span>
          </div>
          <!--<div class="inline-item">-->
            <!--<span>售后说明：</span>-->
            <!--<el-button size="small" @click="showOrderProblem(orderDetail.orderProductList[0].refundApplyNumber,orderDetail.workOrderType)" type="primary">查看</el-button>-->
          <!--</div>-->
          <div class="inline-item">
            <span>售后咨询：<span class="c-red">待回复{{waitReplyCount}}条</span></span>
          </div>
          <div class="inline-item">
            <span>订单状态： {{orderStatus[orderDetail.order.status]}}</span>
          </div>
          <div class="inline-item">
            <span>冻结状态：{{orderFreeze[orderDetail.order.isFreeze]?orderFreeze[orderDetail.order.isFreeze]:'暂无信息'}}</span>
          </div>
          <div class="inline-item">
            <span>销售渠道：{{orderType[orderDetail.order.type] || '暂无信息'}}</span>
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
          <!--<div class="inline-item">-->
            <!--<span>发货时间：{{orderDetail.order.sendTime || '暂无信息'}}</span>-->
          <!--</div>-->
          <div class="inline-item" style="padding-left: 510px">
            <el-button @click="viewLogisticsDetail(0)" size="small" >查看收货信息</el-button>
            <el-button @click="viewLogisticsDetail(1)" size="small" >查看物流信息</el-button>
          </div>
        </div>

      </div>


      <div class="section-item">
        <div class="product-list">
          <div class="section-title">
            <span>售后商品</span>
           </div>
          <div v-if="detailType == 'market11' && orderDetail.workOrderType == 4 || orderDetail.workOrderType == 3" class="order-worker-model detail-order-worker-model">
            <div class="block-item ">
              <div class="model-sign-wrap">
                <span class="model-sign">问题类型：</span>
              </div>
              <span class="model-msg">{{orderDetail.workOrderProblemDesc}}</span>
            </div>
            <div class="block-item ">
              <div class="model-sign-wrap">
                <span class="model-sign">问题描述：</span>
              </div>
              <span class="model-msg">{{orderDetail.workOrderDescription}}</span>
            </div>
            <div class="model-msg " v-if="orderDetail.imgUrl1 || orderDetail.imgUrl2 || orderDetail.imgUrl3">
              <template v-for="(item,index) in [1,2,3]">
                <div class="model-msg-img-wrap" v-if="orderDetail['imgUrl'+item]">
                  <div class="el-icon-wrap" @click="showImage(orderDetail['imgUrl'+item])">
                    <i class="el-icon-search" ></i>
                  </div>
                  <img class="model-msg-img"  :src="orderDetail['imgUrl'+item]" alt="">
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="result-view">
        <el-table :data="orderDetail.orderProductList" style="width: 100%;" :row-class-name="tableRowClassName">
          <template v-for="(item,key) in productConfig[orderDetail.workOrderType]">
            <el-table-column v-if="item.type == 'image'" :label="item.label" label="商品主图" width="120" align="center">
              <template slot-scope="scope">
                <div class="el-table-image">
                  <img v-bind:src="scope.row.productImg" alt="">
                </div>
              </template>
            </el-table-column>

            <el-table-column v-else-if="item.type == 'button'" :label="item.label" :width="item.width" :prop="item.key" align="center">
              <template slot-scope="scope">
                <el-button size="small" @click="showOrderProblem(scope.row.refundApplyNumber,orderDetail.workOrderType)" type="primary">查看</el-button>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type == 'hasReparation'" :width="item.width" :label="item.label" :prop="item.key" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.hasReparation ? '是' : '否'}}</span>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type == 'checkNum'" :width="item.width" :label="item.label" :prop="item.key" align="center">
              <template slot-scope="scope">
                <span>{{scope.row[item.key] ? scope.row[item.key] : '0'}}</span>
              </template>
            </el-table-column>
            <el-table-column v-else :label="item.label" :width="item.width" :prop="item.key" align="center">

            </el-table-column>
          </template>
        </el-table>
      </div>

      <div class="section-item" v-if="consultationList.list.length">
        <div class="product-list">
          <div class="section-title">
            <span>售后咨询</span>
          </div>
        </div>
      </div>
      <div class="result-view" v-if="consultationList.list.length">
        <el-table :data="consultationList.list" style="width: 100%;" :row-class-name="tableRowClassName">
          <template v-for="(item,key) in consultationConfig">

            <el-table-column v-if="item.type == 'over'" :label="item.label" :width="item.width" :prop="item.key" align="center">
              <template slot-scope="scope">
                <p style="width: 290px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis">{{scope.row[item.key]}}</p>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type == 'opera'" :label="item.label" :width="item.width" :prop="item.key" align="center">
              <template slot-scope="scope">
                <!--<el-button size="small"  v-if="scope.row.status == 2" @click="showProcessModel(1,3,scope.row.adviceId)" type="primary">查看</el-button>-->
                <!--<el-button size="small " v-else @click="showProcessModel(1,1,scope.row.adviceId)" type="primary">回复</el-button>-->
                <el-button size="small " v-if="scope.row.status == 1" @click="showProcessModel(1,1,scope.row.adviceId)" type="primary">回复</el-button>
                <el-button size="small"  v-else-if="scope.row.status == 2" @click="showProcessModel(1,3,scope.row.adviceId)" type="primary">查看</el-button>
              </template>
            </el-table-column>
            <el-table-column v-else :label="item.label" :width="item.width" :prop="item.key" align="center">

            </el-table-column>
          </template>
        </el-table>
        <el-pagination class="mg-t-h"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="consultationParams.pageNum"
                       :page-sizes="[5]"
                       :page-size="consultationParams.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="consultationList.total">
        </el-pagination>
      </div>


      <div class="section-item" v-if="processList && processList.length">
        <div class="section-title">
          <span>客服跟进</span>
          <el-button size="small" type="primary" @click="showProcessModel(0,0)">提交反馈</el-button>
        </div>
        <div v-for="item in processList" class="process-item">
          <div class="process-msg" style="word-break: break-all;overflow: hidden">
            <span v-if="item.processType == 2 || item.processType == 40" >
              <span style="float: left">{{item.createTime}} {{JSON.parse(item.processDesc).key}}</span> <span  style="display: inline-block;width: 800px;float: left;margin-left: 04px">{{JSON.parse(item.processDesc).userInfo}}</span>
            </span>
            <span v-if="item.processType == 6 || item.processType == 10 || item.processType == 12 || item.processType == 13 || item.processType == 34" >
              <span style="float: left">{{item.createTime}} {{item.processUserRealName}} {{JSON.parse(item.processDesc).key}}</span> <span style="display: inline-block;width: 700px;float: left;margin-left: 4px">{{JSON.parse(item.processDesc).userInfo}}</span>
            </span>
            <span v-if="item.processType == 11 || (item.processType >= 17 &&  item.processType <=26) || (item.processType != 35 && item.processType != 34 && item.processType >= 30 && item.processType <=39)">
              {{item.createTime}} {{JSON.parse(item.processDesc).userInfo}}
            </span>
            <span v-if="item.processType == 14">
              {{item.createTime}} {{item.processUserRealName}} {{JSON.parse(item.processDesc).key}}该订单赔付已审核通过
            </span>
            <span v-if="item.processType == 15">
              {{item.createTime}} {{item.processUserRealName}} {{JSON.parse(item.processDesc).key}}该订单赔付审核不通过，请重新确认赔付
            </span>
          </div>
          <div class="process-img-wrap" v-if="item.processImg" >
            <template v-for="imgItem in JSON.parse(item.processImg)">
              <div class="model-msg-img-wrap">
                <div class="el-icon-wrap" @click="showImage(imgItem.url)">
                  <i class="el-icon-search"></i>
                </div>
                <img class="model-msg-img"  :src="imgItem.url" alt="">
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="modal">
        <el-dialog  title="收货信息" :visible.sync="modalReceive.isShow">
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
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="viewLogisticsDetail(0)">确定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="modal">
        <el-dialog  title="物流信息" :visible.sync="modalLogistics.isShow">
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
              <div style="margin-left: 80px;">
                <template v-if="expressItem.logisticsDetailList && expressItem.logisticsDetailList.length">
                  <div class="log-detail">
                    <template v-for="(item,idx) in expressItem.logisticsDetailList">
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
                </template>
                <span v-else>暂无物流信息</span>
              </div>
            </div>
          </div>

          <div slot="footer" class="dialog-footer">
            <el-button @click="viewLogisticsDetail(1)">确定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="modal">
        <el-dialog size="middle" :title="'查看'+orderWorkerModel.label+'原因'" :visible.sync="orderWorkerModel.isShow">
          <div class="order-worker-model">
            <div class="block-item ">
              <div class="model-sign-wrap" v-if="orderWorkerModel.opts.refundApplyProblemName">
                <span class="model-sign">{{orderWorkerModel.label}}原因：</span>
              </div>
              <span class="model-msg">{{orderWorkerModel.opts.refundApplyProblemName}}</span>
            </div>
            <div class="block-item " v-if="orderWorkerModel.opts.accountRemark">
              <div class="model-sign-wrap">
                <span class="model-sign">{{orderWorkerModel.label}}说明：</span>
              </div>
              <span class="model-msg">{{orderWorkerModel.opts.accountRemark}}</span>
            </div>
            <div class="block-item " v-if="orderWorkerModel.opts.description">
              <div class="model-sign-wrap">
                <span class="model-sign">{{orderWorkerModel.label}}备注：</span>
              </div>
              <span class="model-msg">{{orderWorkerModel.opts.description}}</span>
            </div>
            <div class="block-item" v-if="orderWorkerModel.opts.imgUrl1 || orderWorkerModel.opts.imgUrl2 || orderWorkerModel.opts.imgUrl3">
              <div class="model-sign-wrap">
                <span class="model-sign">附加图片：</span>
              </div>
              <span class="model-msg">
                <template v-for="(item,index) in [1,2,3]">
                  <div class="model-msg-img-wrap" v-if="orderWorkerModel.opts['imgUrl'+item]">
                    <div class="el-icon-wrap" @click="showImage(orderWorkerModel.opts['imgUrl'+item])">
                    <i class="el-icon-search" ></i>
                  </div>
                    <img class="model-msg-img"  :src="orderWorkerModel.opts['imgUrl'+item]" alt="">
                  </div>
                </template>
              </span>
            </div>
          </div>

          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="hideOrderProblem()">确定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="modal process-model" >
        <el-dialog size="middle" :title="processModel.type == 0 ? '新增跟进' : '售后咨询'" :visible.sync="processModel.isShow">
          <template v-if="processModel.type == 1">
            <div class="block-item">
              <div class="section-item-sign-wrap">
                <span class="label-sign">咨询内容：</span>
              </div>
              <div class="process-model-item">
                {{processModel.consultationOpt.text}}
              </div>
            </div>
            <div class="block-item" v-if="processModel.consultationOpt.imgUrlList.length">
              <div class="section-item-sign-wrap">
                <span class="label-sign"></span>
              </div>
              <div class="process-model-item" >
                <div class="avatar-wrap" v-for="(item,idx) in processModel.consultationOpt.imgUrlList">
                  <img :src="item" class="avatar">
                  <div class="avatar-menu">
                    <i class="el-icon-search" @click="showImage(item)"></i>
                  </div>
                </div>

              </div>
            </div>
          </template>
          <template v-if="processModel.type == 1 && processModel.step == 3">
            <div class="block-item">
              <div class="section-item-sign-wrap">
                <span class="label-sign">回复：</span>
              </div>
              <div class="process-model-item">
                {{processModel.contentOpts.text}}
              </div>
            </div>
            <div class="block-item" v-if="processModel.contentOpts.imgUrlList.length">
              <div class="section-item-sign-wrap">
                <span class="label-sign"></span>
              </div>
              <div class="process-model-item" >
                <div class="avatar-wrap" v-for="(item,idx) in processModel.contentOpts.imgUrlList">
                  <img :src="item" class="avatar">
                  <div class="avatar-menu">
                    <i class="el-icon-search" @click="showImage(item)"></i>
                  </div>
                </div>

              </div>
            </div>
          </template>
          <template v-if="processModel.type == 0 || (processModel.type == 1 && processModel.step == 2)">
            <div class="block-item">
              <div class="section-item-sign-wrap">
                <span class="label-sign"><span class="c-red">*</span>{{processModel.type == 0 ? '反馈内容': '回复'}}：</span>
              </div>
              <div class="process-model-item">
                <el-input type="textarea" :rows="6" v-model="processModel.contentOpts.text" :maxlength="processModel.textLength" placeholder="请填写内容"></el-input>
              </div>
              <span><span class="c-red">{{processModel.contentOpts.text.length}}</span>/{{processModel.textLength}}</span>
            </div>
            <div class="block-item">
              <div class="section-item-sign-wrap">
                <span class="label-sign">图片上传：</span>
              </div>
              <div class="process-model-item" >
                <div class="avatar-wrap" v-for="(item,idx) in processModel.contentOpts.imgUrlList">
                  <img :src="item" class="avatar">
                  <div class="avatar-menu">
                    <i class="el-icon-search" @click="showImage(item)"></i>
                    <i class="el-icon-delete" @click="delProductImage(idx)"></i>
                  </div>
                </div>
                <el-upload v-if="processModel.contentOpts.imgUrlList.length < 3" class="avatar-uploader"  action="/sellerAdmin/pic/upload" :data="picUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>

              </div>
            </div>
          </template>

          <div slot="footer" class="dialog-footer">
            <el-button v-if="processModel.step != 3" @click="cancelProcessModel">取消</el-button>

            <el-button @click="controlStep" type="primary">{{mapControlStr[processModel.step]}}</el-button>
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
      waitReplyCount:0,
      modalLogistics:{
        isShow:false,
      },
      modalReceive:{
        isShow:false
      },
      detailType:'',
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
      orderStatus:{1:'未付款',2:'待发货',3:'已发货',4:'交易成功',5:'用户取消',6:'超时取消',7:'团购进行中',9:'部分发货'},
      orderFreeze:{0:'未冻结',1:'已冻结',2:'未冻结'},
      tableList:[],
      productConfig:{
        1:[
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
            key:'salesPrice',
            label:'售价',
          },
          {
            key:'productCount',
            label:'购买数量',
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
            key:'sellerMoney',
            label:'承担货款',
            type:'checkNum'
          },
          {
            key:'freightMoney',
            label:'承担运费',
            type:'checkNum'
          },
          {
            key:'problemTypeName',
            label:'退款原因',
          },
          {
            key:'productId',
            label:'退款说明',
            type:'button'
          }
        ],
        2:[
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
            key:'salesPrice',
            label:'售价',
          },
          {
            key:'productCount',
            label:'购买数量',
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
            key:'sellerMoney',
            label:'承担货款',
            type:'checkNum'
          },
          {
            key:'freightMoney',
            label:'承担运费',
            type:'checkNum'
          },
          {
            key:'problemTypeName',
            label:'退款原因',
          },
          {
            key:'productId',
            label:'退款说明',
            type:'button',
          }
        ],
        3:[
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
            key:'salesPrice',
            label:'售价',
          },
          {
            key:'productCount',
            label:'购买数量',
          }
        ],
        4:[
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
            key:'salesPrice',
            label:'售价',
          },
          {
            key:'productCount',
            label:'购买数量',
          }
        ],
        5:[
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
            key:'salesPrice',
            label:'售价',
          },
          {
            key:'productCount',
            label:'购买数量',
          },
          {
            key:'refundStatusStr',
            label:'赔付状态',
          },
          {
            key:'refundProductCount',
            label:'赔付数量',
          },
          {
            key:'sellerMoney',
            label:'承担货款',
            type:'checkNum'
          },
//          {
//            key:'freightMoney',
//            label:'承担运费',
//            type:'checkNum'
//          },
          {
            key:'problemTypeName',
            label:'赔付原因',
          },
          {
            key:'productId',
            label:'赔付说明',
            type:'button'
          }
        ],
      },
      dataReady:false,
      orderNumber:'',
      sLink:'',
      orderWorkerModel:{
        isShow:false,
        label:'',
        opts:{
          refundApplyProblemName:'',
          accountRemark:'',
          description:'',
          imgUrl1:'',
          imgUrl2:'',
          imgUrl3: ''
        }
      },
      mapControlStr:{
          0:'提交', //取消
          1:'回复', //关闭
          2:'提交', //取消
          3:'确定'  //
      },
      processModel:{
        isShow:false,
        type:0, //0 新增跟进 1 售后咨询
        step:0,//0 新增跟进 1 售后咨询 2 售后咨询回复 3 售后咨询已回复
        adviceId:'',
        textLength:0,
        consultationOpt:{
          text:'',
          imgUrlList:[]
        }, //咨询 信息
        contentOpts:{
          text:'',
          imgUrlList:[]
        },
      },
      picUpload:{
          picFile:null
      },
      consultationList:{
          list:[],
          total:0
      },
      consultationParams:{
        pageNum:1,
        pageSize:5
      },
      consultationConfig:[
        {
          key:'createTime',
          label:'咨询时间',
        },
        {
          key:'text',
          type:'over',
          label:'售后咨询内容',
          width:'290'
        },
        {
          key:'statusStr',
          label:'回复状态',
        },
        {
          key:'replyTime',
          label:'回复时间',
        },
        {
          key:'isExpireStr',
          label:'是否超时',
        },
        {
          type:'opera',
          key:'',
          label:'操作',
        },
      ],
      processList:[]
    }),
    computed: {

    },
    methods: {
      ...mapActions(['setViewImage','getRefundApplyReason','getOrderDetail','callSetNotice','getConsultationList','getProcessList','updateProcess','getConsultationDetail','getWaitReplyCount']),
      initView() {
        const orderNumber = this.$route.params.orderNumber
        this.orderNumber = orderNumber
        this.sLink = '/order/afterSale/getAfterSaleDetail/'
        this.detailType = 'market'
        this.callOrderDetail()
        this.callGetWaitReplyCount()
        this.callConsultationList()
        this.callProcessList()
      },
      callOrderDetail(){
        const opts = {
          link: this.sLink,
          data: this.orderNumber
        }
        this.getOrderDetail(opts)
          .then((rs) =>{
            this.orderDetail = rs
            this.dataReady = true;
          })
      },
      callGetWaitReplyCount(){
        let workOrderNumber = this.orderNumber
        let _opts = {
          workOrderNumber
        }
        this.getWaitReplyCount(_opts)
          .then((rs)=>{
            this.waitReplyCount = rs
          })
      },
      callConsultationList(){
        let workOrderNumber = this.orderNumber
        let _opts = {
          ...this.consultationParams,
          workOrderNumber
        }
        this.getConsultationList(_opts)
            .then((rs)=>{
              this.consultationList.list = rs.rows
              this.consultationList.total = rs.total
        })
      },
      callProcessList(){
        let workOrderNumber = this.orderNumber
        let _opts = {
          workOrderNumber
        }
        this.getProcessList(_opts)
          .then((rs)=>{
            this.processList = rs
          })
      },
      handleSizeChange(val) {
        this.consultationParams.pageSize = val;
        this.callConsultationList()
      },
      handleCurrentChange(val) {
        this.consultationParams.pageNum = val;
        this.callConsultationList()
      },
      viewLogisticsDetail(type){
        switch (type){
          case 0:
            this.modalReceive.isShow = !this.modalReceive.isShow
            break;
          case 1:
            this.modalLogistics.isShow = !this.modalLogistics.isShow
            break;
        }

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
      getNotice(msg){
        const notice = {
          isShow:true,
          msg:msg,
        }
        this.callSetNotice(notice)
      },
      showOrderProblem(number,type){
        const opts = {
          refundApplyNumber:number
        }
        this.orderWorkerModel.label = type == 5 ? '赔付' : '退款'
        this.getRefundApplyReason(opts)
          .then((rs)=>{
            this.orderWorkerModel.opts = rs
            this.orderWorkerModel.isShow = true


          })
      },
      hideOrderProblem(){
        this.orderWorkerModel.isShow = false
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
      showProcessModel(type,step,adviceId){

        this.processModel.type = type
        this.processModel.step = step
        this.processModel.textLength = type == 0 ? 300 : 500
        if(type == 1 && adviceId){
          this.processModel.adviceId = adviceId
          this.getConsultationDetail({adviceId})
            .then((rs)=>{
              this.processModel.consultationOpt.imgUrlList = rs.adviceContent.imgUrlList
              this.processModel.consultationOpt.text = rs.adviceContent.text
              if(step == 3){
                this.processModel.contentOpts.imgUrlList = rs.replyContent ? rs.replyContent.imgUrlList || []  : []
                this.processModel.contentOpts.text = rs.replyContent ? rs.replyContent.text || '' : ''
              }

              this.processModel.isShow = true
            })
        }
        else {
          this.processModel.isShow = true
        }

      },
      //主图上传成功
      handleAvatarSuccess(res, file) {
        if(res.status != 1){
          this.getNotice(file.name+'图片上传失败');
          return false;
        }
        this.processModel.contentOpts.imgUrlList.push(res.url);
      },
      //主图上传 文件判断
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024  < 400;
        if (!isJPG) {
          this.getNotice('上传图片格式不正确');
        }
        if (!isLt2M) {
          this.getNotice('上传图片大小不能超过 400KB!');
        }
        this.picUpload.picFile=file

        return isJPG && isLt2M;
      },

      delProductImage(idx) {
        this.processModel.contentOpts.imgUrlList.splice(idx,1)
      },
      controlStep(){

        if(this.processModel.step == 0 || this.processModel.step == 2){
            if(!this.processModel.contentOpts.text){
                this.getNotice('请填写内容')
                return false
            }
        }
        switch (this.processModel.step){
          case 0:
              this.callUpdateProcess()

              break;
          case 1:
            this.processModel.step = 2
              break;
          case 2:
            this.processModel.step = 4
            this.callUpdateProcess()
            break;
          case 3:
            this.cancelProcessModel()
            break;
        }
      },
      cancelProcessModel(){
        if(this.processModel.step == 2){
          this.processModel.contentOpts.text = ''
          this.processModel.contentOpts.imgUrlList = []
          this.processModel.step = 1
          return false
        }
        this.processModel.isShow = false
        this.processModel.type = 0
        this.processModel.step = 0
        this.processModel.adviceId = ''
        this.processModel.textLength = 0
        this.processModel.contentOpts.text = ''

        this.processModel.contentOpts.imgUrlList = []
      },
      callUpdateProcess(){
        let _opts = {
            type:this.processModel.type,
            data:{
              ...this.processModel.contentOpts
            }
        }
        if(this.processModel.type == 0){
          _opts.data.workOrderNumber = this.orderNumber
        }else{
          _opts.data.adviceId = this.processModel.adviceId
        }
        this.updateProcess(_opts)
          .then((rs)=>{
            this.getNotice('提交成功')
            if(this.processModel.type == 0){
              this.callProcessList()
            } else if(this.processModel.type == 1){
              this.callConsultationList()
              this.callGetWaitReplyCount()
            }
            this.cancelProcessModel()
          })

      },
      getNotice(msg){
        const notice = {
          isShow:true,
          msg:msg,
        }
        this.callSetNotice(notice)
      },
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .result-view{
    margin: 20px 20px 20px 0;
    padding:0 0 0 20px;
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
  .modal .detail-box .block-item{
    padding: 10px 0px;
  }
  .process-model{
    .block-item{
      margin-bottom: 20px;
    }
    .label-sign{
      display: inline-block;
      width: 100px;
    }
    .process-model-item{
      display: inline-block;
      width: 340px;
    }
  }
  .avatar-wrap{
    display: inline-block;
    position: relative;
    width: 100px;
    height: 100px;
    line-height: 100px;
    margin-right: 5px;
    text-align: center;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    overflow: hidden;
    .avatar {
      max-width: 100px;
      max-height: 100px;
      vertical-align: middle;
    }
    .close-img{
      position: absolute;
      top:0;
      right:0;
    }
    .avatar-menu{
      position: absolute;
      display: none;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      top:0;
      right:0;
      background-color: rgba(0,0,0,.5);
      i{
        cursor: pointer;
        padding: 0 10px;
        font-size: 20px;
        color: #8c939d;
      }
    }
    &:hover{
      .avatar-menu{
        display: block;
      }
    }
  }
  .avatar-uploader{
    display: inline-block;
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
    line-height: 100px;
    position: relative;
    overflow: hidden;
    vertical-align: top;
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
    }

  }
</style>
