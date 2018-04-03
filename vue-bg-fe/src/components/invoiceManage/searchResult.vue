
<template>
  <div class="section-item section-item-no-padding">
    <div class="result-view">
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableList" style="width: 100%;" :row-class-name="tableRowClassName">
        <template v-for="(item,index) in currentSearch.resultItem.option">
          <el-table-column v-if="item.type == 'map'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template slot-scope="scope">
              <span :class="item.key == 'status' && scope.row[item.key] == 1 ? 'primary-color' : ''">{{typeMap[item.key][scope.row[item.key]]}}</span>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'opera'"  :label="item.label" :width="item.width" align="center">
            <template slot-scope="scope">
              <el-button @click="toDetail(scope.row.operateNumber)" :type="scope.row.status == '1' ? 'primary' : ''" size="small">{{scope.row.status == '1' ? '开票' : '查看'}}</el-button>
            </template>
          </el-table-column>
          <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>

        </template>
      </el-table>
      <v-pagination v-if="pagingShow" :paging="paging" />
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import vPagination from '@/components/tools/Pagination'
  export default {
    created (){

    },
    mounted(){
      this.initView();
    },
    data: () => ({
      tableList: [],
      pagingShow:false,
      paging:{
        currentPage:1,
        pageSizes:[20,30,50,100],
        pageSize:0,
        total:0,
        query:{}
      },
      loading:true,
      typeMap:{
        status:	{
          0: '待审核',
          1: '待开票',
          2: '待修改',
          3: '开票完成',
          4: '取消'
        },
        type: {
          0: '普通发票',
          1: '专用发票'
        },
        orderType: {
          0: '未知渠道',
          1: '格格家订单',
          4: '环球捕手订单',
          6: '格格家供应链',
          7: '手Q',
          8: '脉宝云店',
          10: '美食买手'
        }
      }
    }),
    computed: {
      ...mapState(['currentSearch', 'currentSearchQuery'])
    },
    methods: {
      ...mapActions(['getInvoiceList','setCurrentSearchQuery']),
      initView() {
        this.loading = true
        this.pagingShow = false
        const params = this.$route.query
        this.currentSearchOption = Util.searchQuery(params,this.currentSearch.searchList.public,this.currentSearch.searchList.private)
        this.setCurrentSearchQuery(this.currentSearchOption)

        this.getInvoiceList(this.currentSearchQuery)
          .then((rs) =>{
            this.pagingShow = true
            this.setList(rs)
          })
      },
      setList(rs) {
        this.tableList = rs.rows;
        this.loading = false
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
      toDetail(number){
        this.$router.push({
          path: '/invoice/detail',
          query: {
            operateNumber:number
          }
        })
      },
    },
    components: {
      vPagination
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
