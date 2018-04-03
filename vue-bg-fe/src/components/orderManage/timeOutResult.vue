<!--订单搜索结果-->
<template>
  <div class="section-item section-item-no-padding">
    <div class="menu pd-l pd-b">
      <el-button type="primary" size="small" @click="callBatchComplaint()">批量申诉</el-button>
    </div>
    <div class="result-view">
      <el-table v-loading="loading"  element-loading-text="拼命加载中" :data="tableList" style="width: 100%;" :row-class-name="tableRowClassName"  @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="55" :selectable="selectable">

        </el-table-column>
        <template v-for="(item,index) in currentSearch.resultItem.option">
          <template v-if="item.fixed == 'left'" >
            <el-table-column  fixed  v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center" >
              <template slot-scope="scope">
                <router-link style="cursor: pointer" tag="span" :to="{path:'orderDetail',query:{orderNumber:scope.row[item.key],source:'search' }}" >
                  {{scope.row[item.key]}}
                </router-link>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="item.fixed == 'right'" >
            <el-table-column  fixed="right"  v-if="item.type == 'opera'" v-bind:label="item.label" :width="item.width" align="center" >
              <template slot-scope="scope">
                <template v-if="scope.row.isAllowComplain == 1">
                  <el-button v-if="scope.row.status == -1" type="primary" @click="callComplaint(scope.row.id,'edit')" size="small">申诉</el-button>
                  <el-button v-else-if="scope.row.status == 1 && scope.row.penaltyAmount != 0" type="primary" @click="callComplaint(scope.row.id,'edit')" size="small">再次申诉</el-button>
                  <el-button v-else-if="scope.row.status == 2 && scope.row.complainCount == 1 " type="primary" @click="callComplaint(scope.row.id,'edit')" size="small">再次申诉</el-button>
                  <el-button v-else type="primary" @click="callComplaint(scope.row.id,'view')" size="small">查看</el-button>
                </template>
                <el-button v-else-if="scope.row.isAllowComplain == 0 " type="primary" @click="callComplaint(scope.row.id,'view')" size="small">查看</el-button>
              </template>
            </el-table-column>
          </template>
          <template v-else >
            <el-table-column v-if="item.type=='time'" v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center">
              <template slot-scope="scope">
                <div class="time-item" style="padding: 5px 20px">
                  {{scope.row[item.key]}}
                </div>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type=='status'" v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center">
              <template slot-scope="scope">
                <div class="time-item" style="padding: 5px 20px">
                  {{mapStatus[scope.row[item.key]]}}
                </div>
              </template>
            </el-table-column>
            <el-table-column v-else v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center"></el-table-column>
          </template>
        </template>
      </el-table>
      <v-pagination v-if="pagingShow" :paging="paging" />
    </div>
    <div class="dialog-view">
      <el-dialog :visible.sync="orderDetailDialog.isShow" size="small" @close="cancelComplaint()">
        <div class="section-title">
          <span v-if="orderDetailDialog.type == 'batch'">发货超时批量申诉</span>
          <span v-else>发货超时申诉</span>
        </div>
        <template v-if="orderDetailDialog.viewReady">
          <div class="section-item">
            <template v-for="item in orderDetailConfig.items">
              <div class="">
                <div class="section-item-sign">
                  <span>{{item.label}}：</span>
                </div>
                <div class="inline-item" v-if="item.type == 'timeoutPeriod'">
                  {{timeOutOrderDetail[item.key] | toDate}}
                </div>
                <div class="inline-item" v-else >
                  {{timeOutOrderDetail[item.key]}}
                </div>
              </div>
            </template>
          </div>
          <template v-if="timeOutOrderDetail.complainList" v-for="item in timeOutOrderDetail.complainList">
            <div class="section-item">
              <div>
                <div class="section-item-sign">
                  <span>申诉原因：</span>
                </div>
                <div class="inline-item">
                  {{item.complainReason}}
                </div>
              </div>
              <div v-if="item.fileUrl">
                <div class="section-item-sign">
                  <span>附件：</span>
                </div>
                <div class="inline-item">
                  <a :href="item.fileUrl" target="_blank">查看附件</a>
                </div>
              </div>
              <div>
                <div class="section-item-sign">
                  <span>申诉状态：</span>
                </div>
                <div class="inline-item">
                  {{mapStatus[item.status]}}
                </div>
              </div>
              <div v-if="item.modifyPenaltyAmount">
                <div class="section-item-sign">
                  <span>修改后金额：</span>
                </div>
                <div class="inline-item">
                  {{item.modifyPenaltyAmount}}
                </div>
              </div>
              <div>
                <div class="section-item-sign">
                  <span>处理备注：</span>
                </div>
                <div class="inline-item">
                  {{item.remark}}
                </div>
              </div>
            </div>
          </template>
        </template>
        <template v-if="orderDetailDialog.type == 'edit' || orderDetailDialog.type == 'batch'">
          <div class="section-item">
            <div>
              <div class="section-item-sign-wrap">
                <div class="section-item-sign">
                  <span><span class="sign-required">*</span>申诉原因：</span>
                </div>

              </div>
              <div class="inline-item" style="width: 300px">
                <el-input  :rows="textAreaRows" v-model="complaintOpt.reason" resize="none"   placeholder="请输入" type="textarea"  class="area-item-large" size="small"></el-input>
              </div>
            </div>
            <div>
              <div class="section-item-sign-wrap">
                <div class="section-item-sign">
                  <span>附件：</span>
                </div>
              </div>
              <div class="inline-item">
                <el-upload :show-file-list="false" action="/sellerAdmin/pic/upload"  ref="imgUpload" :before-upload="beforeUpload">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
                <ul v-if="uploadFileList.isShow" class="el-upload-list el-upload-list--text">
                  <li class="el-upload-list__item is-ready">
                    <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{uploadFileList.name}}</a>
                  </li>
                </ul>
              </div>
            </div>

          </div>
          <div class="menu" style="text-align: right">
            <el-button size="small" type="primary" @click="submitComplaint()">确定</el-button>
            <el-button size="small" type="primary" @click="cancelComplaint()">取消</el-button>
          </div>
        </template>
      </el-dialog>
    </div>

  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import vPagination from '@/components/tools/Pagination'
//  import Util from '../../assets/js/common/utils'

  export default {
    created (){
      this.initView();
    },
    data: () => ({
      tableList: [],
      paging:{
        currentPage:1,
        pageSizes:[20,30,50,100],
        pageSize:0,
        total:0,
        query:{}
      },
      mapStatus:{
        '-1':'未申诉',
        '0':'处理中',
        '1':'申诉成功',
        '2':'申诉失败'
      },
      pagingShow:false,
      loading:true,
      orderDetailDialog:{
        isShow:false,
        type:'view',
        viewReady:false
      },
      textAreaRows:4,
      orderDetailConfig:{
        items:[
          {
            label:'订单编号',
            key:'orderNumber'
          },
          {
            label:'订单实付金额',
            key:'orderRealPrice'
          },
          {
            label:'付款时间',
            key:'orderPayTime'
          },
          {
            label:'超时时间点',
            key:'orderExpireTime'
          },
          {
            label:'物流揽件时间',
            key:'collectLogisticsTime'
          },
          {
            label:'超时时间',
            key:'timeoutPeriod',
            type:'timeoutPeriod'
          },
          {
            label:'罚款金额',
            key:'penaltyAmount'
          }
        ]
      },
      picUpload:{
        picFile:null,
        getSize:1
      },
      uploadFileList:{
        isShow:false,
        name:''
      },
      complaintOpt:{
        file:null,
        reason:'',
        orderDeliveryExpireId:''
      },
      batchList:[],
      timeOutOrderDetail:{}
    }),
    computed: {
      ...mapState(['currentSearch', 'currentSearchQuery'])
    },
    methods: {
      ...mapActions(['setCurrentSearchQuery','getOrderList','getTimeOutOrderList','callSetNotice','getTimeOutOrderDetail','complainTimeOutOrder']),
      initView() {
        const params = this.$route.query
        this.currentSearchOption = Util.searchQuery(params,this.currentSearch.searchList.public,this.currentSearch.searchList.private)
        this.setCurrentSearchQuery(this.currentSearchOption)

        this.pagingShow = false
        this.loading = true
        this.getTimeOutOrderList(this.currentSearchQuery)
          .then((rs) =>{
            this.pagingShow = true
            this.setOrderList(rs)
          })
      },
      setOrderList(rs) {
        this.loading = false
        this.tableList = rs.rows;
        this.paging.pageSize = Number(this.currentSearchQuery.rows);
        this.paging.currentPage = Number(this.currentSearchQuery.page);
        this.paging.total = rs.total;
        this.paging.query = this.currentSearchQuery;

      },
      callBatchComplaint(){
        if(!this.batchList.length){
            this.getNotice('请选择申诉订单')
            return false
        }
        const batchIdList = []
        for(let i in this.batchList){
            batchIdList.push(this.batchList[i].id)
        }
        this.complaintOpt.orderDeliveryExpireId = batchIdList.join(',')
        this.orderDetailDialog.isShow = true
        this.orderDetailDialog.type = 'batch'
      },
      callComplaint(id,type) {
        const opts = {
          orderDeliveryExpireId:id
        }
        this.getTimeOutOrderDetail(opts)
          .then((rs)=>{
//            this.timeOutOrderDetail
            this.timeOutOrderDetail = rs
            this.orderDetailDialog.isShow = true
            this.orderDetailDialog.viewReady = true
            this.orderDetailDialog.type = type
            if(type == 'edit'){
              this.complaintOpt.orderDeliveryExpireId = id
            }
          })
      },
      submitComplaint(){
        if(!this.complaintOpt.reason){
          this.getNotice('原因不能为空')
          return false
        }
        if(this.complaintOpt.reason.length > 50){
          this.getNotice('原因字数不能超过50')
          return false
        }
//        console.log(this.complaintOpt)
        this.complainTimeOutOrder(this.complaintOpt)
          .then(()=>{
            this.cancelComplaint()
            this.initView()
          })
      },
      cancelComplaint(){
        this.orderDetailDialog.isShow = false
        this.orderDetailDialog.viewReady = false
        this.orderDetailDialog.type = 'new'
        this.complaintOpt = {
          file:null,
          reason:'',
          orderDeliveryExpireId:''
        }
        this.uploadFileList.isShow = false
        this.uploadFileList.name = ''
      },
      beforeUpload(file){
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024  < 400;
        if (!isJPG) {
          this.getNotice('上传图片格式不正确');
//          this.$refs.imgUpload.clearFiles()
          return false
        }
        if (!isLt2M) {
          this.getNotice('上传头像图片大小不能超过 400KB!');
//          this.$refs.imgUpload.clearFiles()
          return false
        }
        if(isJPG && isLt2M){
          this.complaintOpt.file = file
          this.uploadFileList.isShow = true
          this.uploadFileList.name = file.name
        }
        return false
      },
      tableRowClassName(row, index) {
        if (index%2 === 1) {
          return 'info-row';
        }
        return 'positive-row';
      },
      selectable(row,id){
        let able = false
        if(row.isAllowComplain == 1 && ( row.status == -1 ||
          (row.status == 1 && row.penaltyAmount != 0) ||
          (row.status == 2 && row.complainCount <= 1)))  {
          able = true
        }
        return able

      },
      handleSelectionChange(list){
        this.batchList = list;
      },
      getNotice(msg){
        const notice = {
          isShow:true,
          msg:msg,
        }
        this.callSetNotice(notice)
      },
    },
    components: {
      vPagination,
    },
    watch: {
      '$route' (to, from) {
        if (to.fullPath !== from.fullPath) {
          this.initView();
        }
      }
    }
  }
</script>
<style scoped lang='less' rel="stylesheet/less">
  .modal{
    .input-item-middle{
      width: 250px;
    }
  }
  .dialog-view{
    .inline-item{
      padding: 5px;
    }
    .section-item-sign-wrap{
      margin-top: 8px;
    }
    .section-item{
      padding-top: 0px;
    }
  }

</style>

