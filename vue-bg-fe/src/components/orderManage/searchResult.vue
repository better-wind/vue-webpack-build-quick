<!--订单搜索结果-->
<template>
  <div class="section-item section-item-no-padding">
    <div class="result-view">
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableList" style="width: 100%;" :row-class-name="tableRowClassName">
        <template v-for="(item,index) in currentSearch.resultItem.option">
          <template v-if="item.fixed == 'left'" >
            <el-table-column  fixed  v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center" ></el-table-column>
          </template>
          <template v-else-if="item.fixed == 'right'" >
            <el-table-column  fixed="right"  v-if="item.type == 'opera'" v-bind:label="item.label" :width="item.width" align="center" >
              <template slot-scope="scope">
                <div style="padding: 0 20px;text-align: left">
                  <template v-for="(operaItem,operaIndex) in currentSearch.resultItem.opera.items">
                    <el-button v-if="operaItem.type== 'toDetail'" type="primary" @click="toDetail(scope.row[operaItem.val],operaItem.source)" size="small">{{operaItem.label}}</el-button>
                    <el-button v-if="operaItem.type== 'sendOrder' && scope.row[operaItem.key] == '待发货'" @click="setSendOrder(scope.row[operaItem.val],'','',scope.$index)" size="small">{{operaItem.label}}</el-button>
                    <el-button v-if="operaItem.type== 'reloadOrder' && scope.row[operaItem.key] == '已发货'" @click="setSendOrder(scope.row.orderNumber,scope.row.logisticsChannel,scope.row.logisticsNumber,scope.$index)" size="small">{{operaItem.label}}</el-button>
                  </template>
                </div>
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
            <el-table-column v-else v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center"></el-table-column>
          </template>
        </template>
      </el-table>
      <v-pagination v-if="pagingShow" :paging="paging" />
    </div>
    <div class="modal">
      <el-dialog title="订单发货" size="tiny" :visible.sync="modal.isShow">
        <el-form :model="form.params" :rules="rules" ref="form.params">
          <template v-for="item in form.item">
            <el-form-item  :label="item.label" :prop="item.key" label-width="100px">
              <el-select v-if="item.type == 'select'"  v-model="form.params[item.key]" filterable placeholder="物流公司">
                <template v-for="subItem in item.options">
                  <el-option  :label="subItem.desc" :value="subItem.desc"></el-option>
                </template>
              </el-select>
              <el-input v-if="item.type == 'input'"  v-model="form.params[item.key]" auto-complete="off"></el-input>
            </el-form-item>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelModal()">取 消</el-button>
          <el-button type="primary" @click="submitModal()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import vPagination from '@/components/tools/Pagination'
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
      pagingShow:false,
      modal: {
        isShow: false,
        orderNumber: '',
      },
      form: {
        params:{
          expressChannel: '',
          expressNumber: '',
        },
        item: [
          {
            type: 'select',
            key: 'expressChannel',
            label: '物流公司',
            options: [
              {
                label: '中通',
                val: ''
              }
            ]
          },
          {
            type: 'input',
            key: 'expressNumber',
            label: '物流单号',
          }
        ]
      },
      rules:{
        expressChannel: [
          { required: true, message: '请输入物流公司', trigger: 'blur' }
        ],
        expressNumber:[
          { required: true, message: '请输入物流单号', trigger: 'blur' }
        ],
      },
      loading:true,
      curIndex:0,
    }),
    computed: {
      ...mapState(['currentSearch', 'currentSearchQuery'])
    },
    methods: {
      ...mapActions(['setCurrentSearchQuery','getOrderList','sendOrder','getOrderPageCount','callSetNotice','getOrderExpressList']),
      initView() {
        const params = this.$route.query
        this.currentSearchOption = Util.searchQuery(params,this.currentSearch.searchList.public,this.currentSearch.searchList.private)
        this.setCurrentSearchQuery(this.currentSearchOption)

        this.pagingShow = false
        const resultType = this.currentSearch.resultItem.type;
        let sLink = '';
        if(resultType == 'search'){
          sLink = '/order/getOrderPageList'
        }
        else if(resultType == 'market'){
          sLink = '/order/afterSale/getAfterSaleOrderList'
        }
        const opts = {
          link: sLink,
          data:JSON.parse(JSON.stringify(this.currentSearchQuery))
        }
        this.loading = true
        this.getOrderList(opts)
          .then((rs) =>{
            this.pagingShow = true
            this.setOrderList(rs,resultType,opts.data)
          })
      },
      setOrderList(rs,resultType,opts) {
        this.loading = false
        if(resultType == 'search'){
          this.tableList = rs;
          this.paging.pageSize = Number(this.currentSearchQuery.rows);
          this.paging.currentPage = Number(this.currentSearchQuery.page);
          this.getOrderPageCount(opts)
            .then((_rs)=>{
              this.paging.total = _rs;
            })
          this.paging.query = this.currentSearchQuery;
        }
        else if(resultType == 'market'){
          this.tableList = rs.rows;
          this.paging.pageSize = Number(this.currentSearchQuery.rows);
          this.paging.currentPage = Number(this.currentSearchQuery.page);
          this.paging.total = rs.total;
          this.paging.query = this.currentSearchQuery;
        }
      },
      tableRowClassName(row, index) {
        if (index%2 === 1) {
          return 'info-row';
        }
        return 'positive-row';
      },
      toDetail(orderId,source){
        this.$router.push({
          name: source == 'search' ? 'orderDetail' : 'orderMarketDetail',
          params:{orderNumber:orderId}
        })
      },
      setSendOrder(orderId,channel,number,index) {
         this.curIndex = index
        const currentModal = {
          isShow: true,
          orderNumber: orderId
        }
        let form = {
          params:{
            expressChannel: channel,
            expressNumber: number,
          },
          item:[
            {
              type: 'select',
              key: 'expressChannel',
              val: '',
              label: '物流公司',
              options: []
            },
            {
              type: 'input',
              key: 'expressNumber',
              val: '',
              label: '物流单号',
            }
          ]
        }
        this.getOrderExpressList({orderNumber:orderId})
          .then((rs)=>{
            form.item[0].options = rs
            this.setModal(currentModal, form)
          })
      },
      cancelModal() {
        const currentModal = {
          isShow: false,
          orderNumber: ''
        }
        let form = {
          params:{
            expressChannel: '',
            expressNumber: '',
          },
          item:[]
        }
        this.setModal(currentModal, form)
      },
      submitModal() {
        let option = {};
        for (let i in this.form.params){
          option[i] = this.form.params[i]
        }
        option.orderNumber = this.modal.orderNumber;
        if(!option.expressChannel){
            this.getNotice('物流公司不能为空')
            return false
        }
        if(!option.expressNumber){
          this.getNotice('物流单号不能为空')
            return false
        }
        this.sendOrder(option)
          .then(() => {
            this.getNotice('发货成功')
            this.cancelModal()
            let _self = this;
            setTimeout(function(){
              _self.initView()
            },1000)

          })
      },
      setModal(rs, items) {
        this.modal = rs;
        this.form = items;
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
</style>

