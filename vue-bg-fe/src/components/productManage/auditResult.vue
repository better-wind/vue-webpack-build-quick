<template>
  <div class="section-box">
    <div class="item-table">
      <el-table v-loading="loading" element-loading-text="拼命加载中" border :data="searchResult.rows" style="width: 100%;" >
        <template v-for="(item,index) in currentSearch.resultItem.option">
          <el-table-column fixed v-if="item.type == 'auditMsg'"  :label="item.label" :width="item.width" align="center">
            <template slot-scope="scope">
              <div class="msg-item">
                <p>提交审核时间：{{scope.row.createTime}}</p>
                <p>审核状态：{{mapType.status[scope.row.status]}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'goodsMsg'"  :label="item.label" :width="item.width" align="center">
            <template slot-scope="scope">
              <div class="msg-item">
                <p>基础商品码：{{scope.row.baseGoodsCode}}</p>
                <p>商品名称：{{scope.row.name}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'auditFir'"  :label="item.label" :width="item.width" align="center">
            <template slot-scope="scope">
              <div class="msg-item">
                <p>初审结果：{{mapType.firstStatus[scope.row.firstAudit]}} <span v-if="scope.row.firstAudit > 0 && scope.row.firstAuditPerson">({{scope.row.firstAuditPerson}})</span>  </p>
                <p v-if="scope.row.firstAuditTime">初审时间：{{scope.row.firstAuditTime}}</p>
                <p v-if="scope.row.firstAudit == 2 && scope.row.comment">原因：{{scope.row.comment}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'auditSec'"  :label="item.label" :width="item.width" align="center">
            <template slot-scope="scope">
              <div class="msg-item">
                <p>复审结果：{{mapType.secondStatus[scope.row.secondAudit]}} <span v-if="scope.row.secondAudit > 0 && scope.row.secondAuditPerson">({{scope.row.secondAuditPerson}})</span>  </p>
                <p v-if="scope.row.secondAuditTime">复审时间：{{scope.row.secondAuditTime}}</p>
                <p v-if="scope.row.secondAudit == 2 && scope.row.comment">原因：{{scope.row.comment}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" v-else-if="item.key == 'opera'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status == 0 || scope.row.status == 1"  size="small" type="primary" @click="callWithDrawGoodsAudit(scope.row.id)">撤回</el-button>

              <el-button size="small" @click="editShow(scope.row.id,scope.row.status,scope.row.baseGoodsCode)">查看</el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <v-pagination v-if="pagingShow" :paging="paging" />



  </div>
</template>
<script>
  import vPagination from '@/components/tools/Pagination'
//  import Util from '../../assets/js/common/utils'
  import {mapActions,mapState} from 'vuex'
  export default{
    computed:{
      ...mapState(['currentSearch','currentSearchQuery'])
    },
    created(){
      this.initView()
    },
    data:()=>({
      loading:false,
      mapType:{
        status:{
          0:'待初审',
          1:'待复审',
          2:'通过',
          4:'失败',
        },
        firstStatus:{
          0:'--',
          1:'通过',
          2:'失败',
        },
        secondStatus:{
          0:'--',
          1:'通过',
          2:'失败',
        }
      },
      paging:{
        currentPage:1,
        pageSizes:[20,30,50,100],
        pageSize:0,
        total:0
      },
      pagingShow:false,
      searchResult:{},

    }),
    methods:{
      ...mapActions(['withDrawGoodsAudit','getGoodsAuditList','callSetNotice','setCurrentSearchQuery']),
      initView(){
        const params = this.$route.query
        for(let i in params){
          if(params[i] == 'true'){
            params[i] = true
          } else if(params[i] == 'false'){
            params[i] = false
          }
        }
        this.currentSearchOption = Util.searchQuery(params,this.currentSearch.searchList.public,this.currentSearch.searchList.private)
//        if(Util.isEmptyObject(params)){
//          this.currentSearchOption.isAudit = true
//          this.currentSearchOption.isAuditAgain = true
//        }
        this.setCurrentSearchQuery(this.currentSearchOption)
        this.searchList(this.currentSearchQuery)
      },
      searchList(params){
        this.loading = true
        this.getGoodsAuditList(params)
          .then((item)=>{
            this.searchResult = item
            this.setPage()
          })
      },
      setPage(){
        this.paging.pageSize = Number(this.currentSearchQuery.rows)
        this.paging.currentPage = Number(this.currentSearchQuery.page)
        this.paging.total = this.searchResult.total
        this.pagingShow = true
        this.loading = false
      },
      editShow(code,status,baseGoodsCode){
        if(status == 4){
          this.$router.push({
            name: 'productDetail',
            query: {
              goodsId: code,
              type: 'consult',
              baseGoodsCode: baseGoodsCode
            }
          })
        } else {
          this.$router.push({
            name: 'productConsult',
            query: {
              goodsId: code
            }
          })
        }

      },
      callWithDrawGoodsAudit(id){
        this.$confirm('商品审核撤回后将变为审核失败状态，如需重新提交审核请在审核失败记录中查找。是否确认撤回？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          }).then(() => {
            this.withDrawGoodsAudit({auditId:id})
              .then(()=>{
                this.initView()
              })
          })
          .catch(() => {
        });

      },
      getToast(msg){
        this.callSetNotice({
          isShow:true,
          msg:msg,
          type:'warning'
        })
      },
    },
    watch: {
      '$route' (to, from) {
        if (to.fullPath !== from.fullPath) {
          this.initView();
        }
      }
    },
    components: {
      vPagination,
    },

  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .msg-item{
    padding: 10px;
    text-align: left;
  }
</style>
