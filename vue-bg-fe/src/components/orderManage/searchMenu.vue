<!--订单搜索选项-->
<template>
  <div class="section-item section-item-no-padding">
    <div class="menu-item" style="overflow: hidden">
      <v-menu />
      <template v-for="(item,index) in currentSearch.searchMenu.private">
        <el-button  v-if="item.type == 'exportRule'" @click="toExportRule()" v-bind:type="item.style" >{{item.label}}</el-button>
        <el-button :disabled="orderList && orderList.length ? false : true" v-else-if="item.type == 'export'" @click="toExport()" v-bind:type="item.style" >{{item.label}}</el-button>
        <el-button  v-else-if="item.type == 'batchDeliver'" style="float: left;margin-top: 10px;" @click="batchDeliver(0)" v-bind:type="item.style" >{{item.label}}</el-button>
        <el-button  v-else-if="item.type == 'batchReDeliver'" style="float: left;margin-top: 10px;" @click="batchDeliver(1)" v-bind:type="item.style" >{{item.label}}</el-button>
        <el-button  v-else-if="item.type == 'editTimeOutRecord'" @click="callEditTimeOutRecord()" v-bind:type="item.style" >{{item.label}}</el-button>
        <el-button  v-else-if="item.type == 'AbnormalRecord'"  @click="callAbnormalRecord()" v-bind:type="item.style" >{{item.label}}</el-button>
        <el-button  v-else  v-bind:type="item.style" >{{item.label}}</el-button>
      </template>
    </div>
    <el-dialog class="modal-dialog" title="批量发货" size="tiny" :visible.sync="modal.isShow">
      <div style="text-align: center">
        <el-upload style="display: inline-block" :show-file-list="false" action="/" :before-upload="handleBeforeUpload">
          <el-button type="primary">{{modal.type == 0 ? '批量发货' : '重新批量发货' }}</el-button>
        </el-upload>
        <el-button @click="downTemplate()">下载发货模板</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
  import vMenu from '@/components/searchManage/Menu'
  import {mapState, mapActions} from 'vuex'
//  import Util from '../../assets/js/common/utils'
  export default {
    computed: {
      ...mapState(['currentSearch', 'currentSearchQuery','mockSendOrder','orderList'])
    },
    components: {
      vMenu
    },
    created(){
      this.pathName = this.$route.name;
    },
    data:() => ({
      modal:{
        isShow:false,
        type:''
      },
      pathName:''
    }),
    methods: {
      ...mapActions(['downLoadSendTemplate','exportOrderList','callSetNotice','setMockSendOrder','exportOrderListCheck']),
      toExport() {
        const name = this.$route.name;
        this.pathName = name
//        console.log(this.pathName)
        let sLink = '',sType = '';
        if(name == 'orderSearch'){
            sLink = '/order/exportOrderListWithParams'
            sType = 'search'
        } else if(name == 'orderMarket'){
          sLink = '/order/afterSale/export'
          sType = 'market'
        }
        let opts = {
          link:sLink,
          type:sType,
          data:{}
        }
        for(let i in this.currentSearchQuery){
          if(this.currentSearchQuery[i] && this.currentSearchQuery[i]!='all')
          opts.data[i] = this.currentSearchQuery[i]
        }
        if(opts.data.payTimeEnd){
          let _nowTime = new Date().getTime(),
              _selTime = new Date(opts.data.payTimeEnd).getTime()

          if(_selTime + 1000 * 60 * 30 >= _nowTime){
            this.getNotice('付款结束时间需小于当前时间半小时');
            return false
          }
        }
//        return false
//        console.log(opts.data)
//        if(!opts.data.payTimeStart || !opts.data.payTimeEnd){
//          this.getNotice('订单支付时间不能为空');
//            return false
//        }
        if(name == 'orderSearch'){
//            console.log(opts)
//          this.exportOrderList(opts)
          this.$confirm('当前仅支持同时下载一个导出文件，是否确定导出？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            this.callExportOrderListCheck(opts)
          }).catch(() => {
          });
        } else {
          this.exportOrderList(opts)
        }

      },
      callExportOrderListCheck(opts){
        this.exportOrderListCheck(opts.data)
          .then((rs)=>{
            if(rs){
              this.callExportOrderList(opts)
            } else {
              this.$confirm('导出的订单中包含已冻结订单，是否继续导出？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(() => {
                this.callExportOrderList(opts)
              }).catch(() => {
              });
            }
          })
      },
      callExportOrderList(opts){
        this.exportOrderList(opts)
          .then(()=>{
            this.$router.push({
              path: '/order/export/list',
            })
          })
      },
      toExportRule() {
        this.$router.push({
          path: '/order/export/rule',
        })
      },
      batchDeliver(type) {
        this.modal.isShow = true
        this.modal.type = type
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
        this.setMockSendOrder(file)
        this.modal.isShow = false
        this.$router.push({
          name: 'batchDeliver',
          params: { type: this.modal.type == 0 ? 'send' : 'resend'}
        })
        this.modal.type = ''
        return false
      },
      callEditTimeOutRecord() {
        this.$router.push({
          path: '/edit/timeout/record'
        })
      },
      callAbnormalRecord() {
        this.$router.push({
          path: '/order/abnormal/record'
        })
      },
      downTemplate() {
        this.downLoadSendTemplate({type:this.modal.type});
      },
      getNotice(msg){
        const notice = {
          isShow:true,
          msg:msg,
        }
        this.callSetNotice(notice)
      },

    },
  }
</script>
