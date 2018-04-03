<template>
  <div>
    <div class="title">
      <span>开票详情</span>
      <div class="fl-r pd-r">
        <el-button type="primary" @click="toExport()" size="small">导出开票明细</el-button>
        <el-button v-if="invoiceDetail.status == 1" type="primary" @click="editInvoice()" size="small">填写发票信息</el-button>
      </div>
    </div>
    <div class="section" v-if="invoiceReady">
      <div class="section-item">
        <div class="inline-item">
          <span>推送时间：{{invoiceDetail.auditTime}}</span>
        </div>
        <div class="inline-item">
          <span>开票进度：{{mapStatus.status[invoiceDetail.status]}}</span>
        </div>
        <div class="section-title">
          <span>订单信息</span>
        </div>
        <div class="result-view mg-t-h">
          <el-table :data="orderList.list" style="width: 100%;">
            <template v-for="(item,key) in invoiceConfig.orderList">
              <el-table-column :label="item.label"  :prop="item.key" align="center"></el-table-column>
            </template>
          </el-table>
        </div>
        <el-pagination class="mg-t-h"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="orderParams.page"
          :page-sizes="[5]"
          :page-size="orderParams.rows"
          layout="total, sizes, prev, pager, next, jumper"
          :total="orderList.total">
        </el-pagination>
      </div>

      <div class="section-item">
        <div class="section-title">
          <span>开票信息</span>
        </div>
        <div class="detail-box billing-msg">
          <div class="block-item">
            <span class="detail-sign">发票类型：</span>
            {{mapStatus.type[invoiceDetail.type] ? mapStatus.type[invoiceDetail.type] : '暂无信息'}}
          </div>
          <!--普通发票-->
          <template v-if="invoiceDetail.type == 0">
            <!--个人&&单位-->
            <div  class="block-item">
              <span class="detail-sign">{{invoiceDetail.headType == 0 ? '发票抬头(个人)' : '发票抬头(单位)'}}：</span>
              {{invoiceDetail.taxHead}}
            </div>
            <!--单位-->
            <div  class="block-item" v-if="invoiceDetail.headType == 1">
              <span class="detail-sign">纳税人注册码：</span>
              {{invoiceDetail.taxpayerCode}}
            </div>
          </template>
          <!--专用发票-->
          <template v-else>
            <div v-for="(item,key) in invoiceConfig.billingMsg" class="block-item">
              <span class="detail-sign">{{item.label}}：</span>
              {{invoiceDetail[item.key] ? invoiceDetail[item.key] : '暂无信息'}}
            </div>
          </template>
        </div>
      </div>
      <div class="section-item">
        <div class="section-title">
          <span>收票信息</span>
        </div>
        <div class="detail-box">
          <div v-for="(item,key) in invoiceConfig.checkMsg" class="block-item">
            <span class="detail-sign">{{item.label}}：</span>
            {{invoiceDetail[item.key] ? invoiceDetail[item.key] : '暂无信息'}}
          </div>
        </div>
      </div>
      <div class="section-item">
        <div class="section-title">
          <span>发票信息</span>
        </div>
        <div class="detail-box">
          <template v-if="invoiceDetail.status == 3">
            <div v-for="(item,key) in invoiceConfig.invoiceMsg[2]" class="block-item">
              <span class="detail-sign">{{item.label}}：</span>
              {{invoiceDetail[item.key]}}
            </div>
            <div  class="block-item">
              <span class="detail-sign">出票类型：</span>
              {{mapStatus.sendType[invoiceDetail.sendType]}}
            </div>
            <div v-for="(item,key) in invoiceConfig.invoiceMsg[invoiceDetail.sendType]" class="block-item">
              <span class="detail-sign">{{item.label}}：</span>
              {{invoiceDetail[item.key]}}
            </div>

          </template>
          <span v-else>暂无</span>
        </div>
      </div>
      <div class="modal">
        <el-dialog class="edit-model" title="发票信息" :visible.sync="modalEdit.isShow" size="middle">
          <div class="section">
            <div class="block-item">
              <span>发票代码：</span>
              <el-input class="edit-input" v-model.trim="modalEdit.params.code" size="small" placeholder="请输入内容"></el-input>
            </div>
            <div class="block-item">
              <span>发票号码：</span>
              <el-input class="edit-input" v-model.trim="modalEdit.params.number" size="small" placeholder="请输入内容"></el-input>
            </div>
            <div class="block-item">
              <span>出票类型：</span>
              <el-radio class="radio" v-model="modalEdit.params.sendType" :label=0>纸质发票</el-radio>
              <el-radio class="radio" v-model="modalEdit.params.sendType" :label=1>电子发票</el-radio>
            </div>
            <template v-if="modalEdit.params.sendType == 0">
              <div class="block-item">
                <span>快递公司：</span>
                <el-select filterable clearable class="edit-input" size="small" v-model="modalEdit.params.logisticsChannel" placeholder="请选择快递公司">
                  <template v-for="subItem in logisticsChannelList">
                    <el-option  :label="subItem.desc" :value="subItem.desc"></el-option>
                  </template>
                </el-select>
                <!--<el-input class="edit-input" v-model.trim="modalEdit.params.logisticsChannel" size="small" placeholder="请输入内容"></el-input>-->
              </div>
              <div class="block-item">
                <span>快递单号：</span>
                <el-input class="edit-input" v-model.trim="modalEdit.params.logisticsNumber" size="small" placeholder="请输入内容"></el-input>
              </div>
            </template>
            <template v-else>
              <div class="block-item">
                <span>备注：</span>
                <el-input class="edit-input" v-model.trim="modalEdit.params.remark" size="small" placeholder="请输入内容"></el-input>
              </div>
            </template>

          </div>
          <div slot="footer" class="dialog-footer">
            <el-button  @click="cancelEdit()">取消</el-button>
            <el-button type="primary" @click="submitEdit()">确定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default{
    created(){
      this.initView()
    },
    data:()=>({
      invoiceReady:false,
      invoiceDetail:{},
      mapStatus:{
        status:{
          0:'待审核',
          1:'待开票',
          2:'待修改',
          3:'开票完成',
          4:'开票取消'
        },
        type:{
          0:'普通发票',
          1:'专用发票'
        },
        sendType:{
          0:'纸质发票',
          1:'电子发票'
        }
      },
      orderList:{
        total:20,
        list:[]
      },
      orderParams:{
        page:1,
        rows:5
      },
      invoiceConfig:{
        billingMsg:[
          {
            label:'单位名称',
            key:'taxHead'
          },{
            label:'纳税人识别码',
            key:'taxpayerCode'
          },{
            label:'注册地址',
            key:'registerAddress'
          },{
            label:'注册电话',
            key:'registerPhone'
          },{
            label:'开户银行',
            key:'bankName'
          },{
            label:'银行账户',
            key:'bankAccount'
          },
        ],
        checkMsg:[
          {
            label:'收票人姓名',
            key:'receivePerson'
          },{
            label:'收票人手机',
            key:'receivePhone'
          },{
            label:'电子邮箱',
            key:'receiveEmail'
          },{
            label:'收票人省份',
            key:'provinceCityDistrict'
          },{
            label:'详细地址',
            key:'receiveAddress'
          }
        ],
        orderList:[
          {
            label:'订单编号',
            key:'orderNumber'
          },{
            label:'发货地',
            key:'sendingAddress'
          },{
            label:'商品实付金额（元）',
            key:'productRealPrice'
          },{
            label:'运费（元）',
            key:'freightMoney'
          },{
            label:'开票金额（元）',
            key:'applyMoney'
          },
        ],
        invoiceMsg:{
          0:[
            {
              label:'快递公司',
              key:'logisticsChannel'
            },{
              label:'快递单号',
              key:'logisticsNumber'
            }
          ],
          1:[
            {
              label:'备注',
              key:'remark'
            }
          ],
          2:[
            {
              label:'发票代码',
              key:'code'
            },{
              label:'发票号码',
              key:'number'
            },
          ],
        }
      },
      modalEdit:{
        isShow:false,
        params:{
          operateNumber:'',
          code:'',
          number:'',
          sendType:0,
          logisticsChannel:'',
          logisticsNumber:'',
          remark:'已发送用户邮箱'
        },
      },
      logisticsChannelList:[]
    }),
    methods:{
      ...mapActions(['getLogisticsChannel','getInvoiceOrder','exportInvoice','getInvoiceDetail','callSetNotice','commitInvoice']),
      initView(){
        const operateNumber = this.$route.query.operateNumber
        this.operateNumber = operateNumber
        this.setInvoiceDetail()
        this.getOrderList()
      },
      setInvoiceDetail(){
        this.getInvoiceDetail({operateNumber:this.operateNumber})
          .then((rs)=>{
            this.invoiceDetail = rs
            this.invoiceReady = true
          })
      },
      getOrderList(){
        let operateNumber = this.operateNumber
        let _opts = {
          ...this.orderParams,
          operateNumber
        }
        this.getInvoiceOrder(_opts)
          .then((rs)=>{
            this.orderList.list = rs.rows
            this.orderList.total = rs.total
          })
      },
      handleSizeChange(val) {
        this.orderParams.rows = val;
        this.getOrderList()
      },
      handleCurrentChange(val) {
        this.orderParams.page = val;
        this.getOrderList()
      },
      toExport(){
        this.exportInvoice({operateNumber:this.operateNumber})
      },
      editInvoice(){
        if(this.logisticsChannelList.length){
          this.modalEdit.isShow = true
          return
        }
        this.getLogisticsChannel()
          .then((rs)=>{
            this.logisticsChannelList = rs
            this.modalEdit.isShow = true
          })
      },
      cancelEdit(){
        this.modalEdit.isShow = false
        this.$nextTick(()=>{
          this.modalEdit.params = {
            operateNumber:'',
            code:'',
            number:'',
            sendType:0,
            logisticsChannel:'',
            logisticsNumber:'',
            remark:'已发送用户邮箱'
          }
        })
      },
      submitEdit(){
        const reg = /^[0-9a-zA-Z]+$/g
        if(!this.modalEdit.params.code){
          this.getNotice('请填写发票代码')
          return false
        }
        else if(!this.modalEdit.params.code.match(reg)){
          this.getNotice('发票代码只能输入字母和数字')
          return false
        }
        else if(!this.modalEdit.params.number){
          this.getNotice('请填写发票号码')
          return false
        }
        else if(!this.modalEdit.params.number.match(reg)){
          this.getNotice('发票号码只能输入字母和数字')
          return false
        }
        if(this.modalEdit.params.sendType == 0 && !this.modalEdit.params.logisticsChannel){
          this.getNotice('请填写物流公司')
          return false
        }
        if(this.modalEdit.params.sendType == 0 && !this.modalEdit.params.logisticsNumber){
          this.getNotice('请填写物流单号')
          return false
        }
        if(this.modalEdit.params.sendType == 0 && !this.modalEdit.params.logisticsNumber.match(reg)){
          this.getNotice('物流单号只能输入字母和数字')
          return false
        }
        if(this.modalEdit.params.sendType == 1 && !this.modalEdit.params.remark){
          this.getNotice('请填写备注')
          return false
        }
        this.modalEdit.params.operateNumber = this.operateNumber
        this.commitInvoice(this.modalEdit.params)
          .then((rs)=>{
            this.cancelEdit()
            this.getNotice('开票成功')
            this.setInvoiceDetail()
          })
//        this.$store.dispatch('commitInvoice',this.modalEdit.params)

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
  .detail-box{
    margin:10px 20px 0 0;
    padding-left: 20px;
    background-color: #f5f5f5;
    .detail-sign{
      display: inline-block;
      max-width: 110px;
      min-width: 84px;
    }
  }
  .billing-msg{
    .detail-sign{
      /*width: 100px;*/
      /*text-align: right;*/
    }
  }
  .edit-model{
     .block-item{
       span{
         width: 80px;
         display: inline-block;
         margin: 0 0 10px 0;
         &:before{
           content: '*';
           color: #fb4b4d;
         }
       }
       .edit-input{
         width: 220px;
         margin: 0 0 10px 0;
       }
     }
  }
</style>
