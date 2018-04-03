<template>
  <div>
    <div class="title">
      <span>{{mapBatchType[batchType]}}</span>
    </div>
    <div class="section">
      <div class="section-item export-config">
        <div class="left-item">
          <el-upload
            ref="uploadMock"
            :show-file-list="false"
            :action="batchType == 0 ? '/sellerAdmin/order/mockSendOrder' : '/sellerAdmin/order/mockSendOrder'"
            :data="batchMockSendOrder"
            :before-upload="handleBeforeUpload"
            :on-success="handSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <ul v-if="uploadFileList.isShow" class="el-upload-list el-upload-list--text">
            <li class="el-upload-list__item is-ready">
              <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{uploadFileList.name}}</a>
            </li>
          </ul>
          <div v-if="isReady">导入结果：成功：{{uploadList.successNumber}} <span v-if="uploadList.failNumber" class="primary-color">失败：{{uploadList.failNumber}}</span>  <span v-if="uploadList.warnNumber" class="warn-color">提醒：{{uploadList.warnNumber}}</span> </div>
        </div>
        <div class="right-item">
          <div class="export-menu">
            <el-button size="small" type="primary" @click="downTemplate('send')">下载{{mapBatchType[batchType]}}模板</el-button>

          </div>
          <div class="export-menu" v-if="isReady">
            <el-button size="small" :disabled="uploadList.list && uploadList.list.length ? false : true" type="primary" @click="exportMock()">导出发货数据</el-button>
          </div>
        </div>
      </div>
      <div class="section-item" v-if="isReady">
        <div class="result-view">
          <el-table :data="uploadList.list" style="width: 100%;" >
            <template v-for="(item,index) in currentSearch.option">
              <el-table-column v-if="item.key == 'statusStr'" v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.statusStr == '失败'" class="primary-color">{{scope.row.statusStr}}</span>
                    <span v-else-if="scope.row.statusStr == '提醒'" class="warn-color">{{scope.row.statusStr}}</span>
                    <span v-else>{{scope.row.statusStr}}</span>
                  </template>
                </el-table-column>
              <el-table-column v-else-if="item.key == 'msg'" v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.statusStr == '失败'" class="primary-color">{{scope.row.msg}}</span>
                    <span v-else-if="scope.row.statusStr == '提醒'" class="warn-color">{{scope.row.msg}}</span>
                    <span v-else>{{scope.row.msg}}</span>
                  </template>
                </el-table-column>
              <template v-else-if="item.key == 'shipmentCode'">
                <el-table-column  v-if="batchType == 1" v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center"></el-table-column>

              </template>
              <el-table-column v-else v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center"></el-table-column>
            </template>
          </el-table>
        </div>
      </div>
      <div class="section-item" v-if="isReady">
        <div class="export-result-menu">
          <el-button :disabled="(uploadList.successNumber + uploadList.warnNumber) > 0 && uploadList.failNumber < 1 ? false : true" size="small" type="primary" @click="batchSend()">确认导入发货</el-button>
        </div>
      </div>
    </div>
    <el-dialog class="modal-dialog" title="" size="tiny" :visible.sync="modal.isShow" @close="cancelModal">
      <div>完成发货，存在发货失败的数据是否下载？</div>
      <div style="text-align: center;margin-top: 20px">
        <a target="_blank" :href="modal.href">
          <el-button  type="primary"  size="small">下载</el-button>
        </a>
        <el-button style="margin-left: 20px" @click="cancelModal" size="small">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'batchDeliver',
    computed:{
      ...mapState(['mockSendOrder'])
    },
    created() {
      this.initBatch()
    },
    data: () => ({
      batchMockSendOrder: {
        orderSendFile:null,
        isReSend:false
      },
      uploadList: {},
      uploadFileList:{
        isShow:false,
        name:''
      },
      isReady: false,
      currentSearch: {
        option:[
            {
              label: '订单编号',
              key: 'orderNumber',
            },
           {
             label: '发货编码',
             key: 'deliverCode',

           },
           {
             label: '发货件数',
             key: 'count',

           },
            {
              label: '物流公司',
              key: 'expressChannel',

            },
            {
              label: '运单编号',
              key: 'expressNumber',
            },
          {
            label: '发货单号',
            key: 'shipmentCode',
          },
            {
              label: '状态',
              key: 'statusStr',

            },
            {
              label: '说明',
              key: 'msg',

            }
          ]
      },
      batchType:0, // 0 批量发货 1 重新发货,
      modal:{
        isShow:false,
        href:''
      },
      mapBatchType:{
        0:'批量发货',
        1:'重新批量发货'
      }
    }),
    methods: {
      ...mapActions(['downLoadSendTemplate','exportMockResult','batchSendOrder','callSetNotice','getMockOrderList','setMockSendOrder','submitBatchSendOrder',
        'getIfTaskOver','setFullLoading']),
      initBatch(){
        this.batchType = this.$route.params.type == 'resend' ? 1 : 0
        this.batchMockSendOrder.isReSend = this.batchType == 1 ? true : false
        if(this.mockSendOrder.orderSendFile){
          this.uploadFileList.isShow = true
          this.uploadFileList.name = this.mockSendOrder.orderSendFile.name
          this.batchMockSendOrder.orderSendFile = this.mockSendOrder.orderSendFile

          this.setFullLoading(true)
          this.getMockOrderList({type:this.batchType,data:this.batchMockSendOrder})
            .then((rs)=>{
              this.uploadList = rs
              this.isReady = true;
              this.setMockSendOrder(null)
              this.setFullLoading(false)
            })
        }
      },
      batchSend(){
        this.submitBatchSendOrder({type:this.batchType,data:{orderSendFile:this.batchMockSendOrder.orderSendFile}})
          .then(()=>{
            this.setFullLoading(true)
            setTimeout(function(){
              this.checkBatchSend()
            }.bind(this),1500)
          })
      },
      checkBatchSend(){
          this.getIfTaskOver()
            .then((rs)=>{
              if(rs == 0){
//                this.setFullLoading(true)
                setTimeout(function(){
                  this.checkBatchSend()
                }.bind(this),1500)
              }
              else if (rs == 1){
                this.setFullLoading(false)
                this.getNotice('批量发货成功');
                this.$router.push({
                  path: '/order/search'
                })
              }
              else {
                this.setFullLoading(false)
                this.setFailLink(rs)
              }
//              if((rs+'')){
//                if(rs == 0){
//                  this.getNotice('正在发货中');
//                }
//                else if (rs == 1){
//                  this.getNotice('批量发货成功');
//                  this.$router.push({
//                    path: '/order/search'
//                  })
//                }
//                else {
//                  this.setFailLink(rs)
//                }
//              }
//              else {
//                  let _self = this
//                  setTimeout(function(){
//                    _self.checkBatchSend()
//                  },3000)
//              }
            })

      },
      setFailLink(rs){
          this.modal.isShow = true
        this.modal.href = rs
      },
      cancelModal(){
        this.modal.isShow = false
        this.modal.href = ''
      },
      handleBeforeUpload(file){
        const isXML = file.type === 'application/vnd.ms-excel'
        const sType = file.name.split('.').pop()
        let typeOpt = {
          xls:'xls',
          xlsx:'xlsx',
        }
        if(!typeOpt[sType]){
          this.getNotice('格式错误');
          return false
        }
        this.uploadFileList.isShow = true
        this.uploadFileList.name = file.name
        this.batchMockSendOrder.orderSendFile = file;
        this.setFullLoading(true)
      },
      handSuccess(file) {
        this.successReady(file)
      },
      successReady(data){
        if(data.code == 1){
          this.uploadList = data.data;
          this.isReady = true;
        }
        else{
          this.getNotice('格式错误');
          this.isReady = false;
          this.uploadList = {}
        }
        this.setFullLoading(false)
      },
      downTemplate() {
        this.downLoadSendTemplate({type:this.batchType});
      },
      exportMock() {
        this.exportMockResult()
      },
      getNotice(msg,type){
        const notice = {
          isShow:true,
          msg:msg,
          type:type
        }
        this.callSetNotice(notice)
      },
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .left-item{
    float: left;
  }
  .right-item{
    float: right;
    margin-right: 20px;
  }
  .export-config{
    overflow: hidden;
    .export-menu{
      margin-bottom: 10px;
    }
  }
  .export-result-menu{
    text-align: center;
  }
  .warn-color{
    color: #FF9900;
  }
</style>
<style scoped lang='less' rel="stylesheet/less">
  .section-item{
    background-color: transparent;
  }
</style>
