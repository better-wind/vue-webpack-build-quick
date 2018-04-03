<!--订单搜索结果-->
<template>
  <div class="section-item section-item-no-padding">
    <div class="section-item">
      <el-button  type="primary" size="small" @click="addRule">新建规则</el-button>
    </div>
    <div class="result-view">
      <el-table v-loading="loading"  element-loading-text="拼命加载中" :data="tableList" style="width: 100%;" :row-class-name="tableRowClassName">
        <template v-for="(item,index) in currentSearch.resultItem.option">
          <el-table-column v-if="item.type == 'opera'" v-bind:label="item.label" :width="item.width" align="center" >
              <template slot-scope="scope">
                <el-button size="small" @click="callDelExportRule(scope.row.id)">删除</el-button>
              </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'mapSellerId'" v-bind:label="item.label" :width="item.width" align="center" >
              <template slot-scope="scope">
                {{mapDeliveryList[scope.row.sellerId]}}
              </template>
          </el-table-column>

          <el-table-column  v-else v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center"></el-table-column>

        </template>
      </el-table>
      <v-pagination v-if="pagingShow" :paging="paging" />
    </div>

    <el-dialog class="edit-model" title="新建导出规则" size="small" :visible.sync="ruleView.isShow" @close="cancelEdit()">
      <div >
        <div class="block-item">
          <span>发货地：</span>
          <el-select  clearable class="edit-input" size="small" v-model="ruleView.params.sellerId" placeholder="请选择内容">
            <template v-for="subItem in deliveryList">
              <el-option  :label="subItem.label" :value="subItem.value"></el-option>
            </template>
          </el-select>
        </div>
        <div class="block-item">
          <span>基础商品码：</span>
          <el-input class="edit-input" v-model.trim="ruleView.params.baseGoodsCode" size="small" placeholder="请输入内容"></el-input>
        </div>
        <div class="block-item">
          <span>发货编码：</span>
          <el-input class="edit-input" v-model.trim="ruleView.params.deliverCode" size="small" placeholder="请输入内容"></el-input>
        </div>
        <div class="block-item">
          <span>每包裹最大件数：</span>
          <el-input class="edit-input" v-model.trim="ruleView.params.maxNumber" size="small" placeholder="请输入内容"></el-input>
        </div>
        <div>
          <span class="c-red c-tip">注：基础商品码与发货编码至少填写一个</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="cancelEdit()">取消</el-button>
        <el-button type="primary" @click="submitEdit()">确定</el-button>
      </div>
    </el-dialog>
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
      loading:true,
      ruleView:{
        isShow:false,
        params:{
          sellerId:'',
          baseGoodsCode:'',
          deliverCode:'',
          maxNumber:''
        },
        initParams:{
          sellerId:'',
          baseGoodsCode:'',
          deliverCode:'',
          maxNumber:''
        }
      },
      mapDeliveryList:{},
    }),
    props:['deliveryList'],
    computed: {
      ...mapState(['currentSearch', 'currentSearchQuery'])
    },
    methods: {
      ...mapActions(['setCurrentSearchQuery','getExportRuleList','addExportRule','delExportRule','callSetNotice']),
      initView() {
        const params = this.$route.query
        this.currentSearchOption = Util.searchQuery(params,this.currentSearch.searchList.public,this.currentSearch.searchList.private)
        this.setCurrentSearchQuery(this.currentSearchOption)
        this.pagingShow = false
        this.deliveryList.forEach((item)=>{
          this.mapDeliveryList[item.value] = item.label
        })
        this.callGetExportRuleList()

      },
      callGetExportRuleList(){
        this.loading = true
        this.getExportRuleList(this.currentSearchQuery)
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
      tableRowClassName(row, index) {
        if (index%2 === 1) {
          return 'info-row';
        }
        return 'positive-row';
      },
      addRule(){
        this.ruleView.isShow = true
      },
      cancelEdit(){
        this.ruleView.isShow = false
        this.ruleView.params = this.ruleView.initParams

      },
      submitEdit(){
        if(!this.ruleView.params.sellerId){
          this.getNotice('请选择发货地')
          return false
        } else if(!(this.ruleView.params.baseGoodsCode+'') &&  !(this.ruleView.params.deliverCode+'')){
          this.getNotice('基础商品码和发货编码至少填写一个')
          return false
        } else if(!(this.ruleView.params.maxNumber+'')){
          this.getNotice('请填写每包裹最大件数')
          return false
        } else if(!(this.ruleView.params.maxNumber+'').match(RegExpType.Num)){
          this.getNotice('每包裹最大件数格式不正确')
          return false
        } else if((this.ruleView.params.maxNumber+'') == 0){
          this.getNotice('每包裹最大件数不能为0')
          return false
        }
        this.addExportRule(this.ruleView.params)
          .then((rs)=>{
            this.cancelEdit()
            this.getNotice('增加成功')
            this.callGetExportRuleList()
          })
      },
      callDelExportRule(id){
        this.$confirm('是否删除此条导出规则？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delExportRule(id)
            .then(()=>{
              this.getNotice('删除成功')
              this.callGetExportRuleList()
            })
        }).catch(() => {

        });


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
<style scoped lang='less' rel="stylesheet/less" scoped>
  .edit-model{
    .block-item{
      span{
        width: 120px;
        display: inline-block;
        margin: 0 10px 0 0;
        text-align: right;
        &:before{
          /*content: '*';*/
          /*color: #fb4b4d;*/
        }
      }
      .edit-input{
        width: 220px;
        margin: 0 0 10px 0;
      }
    }
  }
</style>

