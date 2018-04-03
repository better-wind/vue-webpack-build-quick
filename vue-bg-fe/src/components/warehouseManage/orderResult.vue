
<template>
  <div class="section-item section-item-no-padding">
    <div class="result-view">
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableList" style="width: 100%;" :row-class-name="tableRowClassName">
        <template v-for="(item,index) in currentSearch.resultItem.option">
          <el-table-column v-if="item.type == 'unit'" :prop="item.key" :label="item.label" :width="item.width" align="center">
            <template slot-scope="scope">
              <!--<span :class="item.key == 'status' && scope.row[item.key] == 1 ? 'primary-color' : ''">{{typeMap[item.key][scope.row[item.key]]}}</span>-->
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'opera'"  :label="item.label" :width="item.width" align="center">
            <template slot-scope="scope">
              <el-button @click="toDetail(scope.row.orderNumber)" type="primary" size="small">查看详情</el-button>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'type'"  :label="item.label" :width="item.width" align="center">
            <template slot-scope="scope">
              <span>{{item.map[scope.row[item.key]]}}</span>
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
//  import Util from '../../assets/js/common/utils'
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
      loading:true
    }),
    computed: {
      ...mapState(['currentSearch', 'currentSearchQuery'])
    },
    methods: {
      ...mapActions(['getWareHouseOrderList','getWareHouseOrderListCount','setCurrentSearchQuery']),
      initView() {
        const params = this.$route.query
        this.currentSearchOption = Util.searchQuery(params,this.currentSearch.searchList.public,this.currentSearch.searchList.private)
        this.setCurrentSearchQuery(this.currentSearchOption)

        this.loading = true
        this.pagingShow = false
        this.getWareHouseOrderList(this.currentSearchQuery)
          .then((rs) =>{
            this.pagingShow = true
            this.setList(rs)
          })
      },
      setList(rs) {
        this.tableList = rs;
        this.loading = false
        this.paging.pageSize = Number(this.currentSearchQuery.rows);
        this.paging.currentPage = Number(this.currentSearchQuery.page);
        this.getWareHouseOrderListCount(this.currentSearchQuery)
          .then((_rs)=>{
          this.paging.total = _rs;
        })
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
          path: '/manage/warehouse/order/detail',
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
