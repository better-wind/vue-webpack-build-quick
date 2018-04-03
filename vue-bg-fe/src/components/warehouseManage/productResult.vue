
<template>
  <div class="section-item section-item-no-padding">
    <div class="result-view">
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableList" style="width: 100%;" :row-class-name="tableRowClassName">
        <template v-for="(item,index) in currentSearch.resultItem.option">

          <el-table-column :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>

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
      ...mapActions(['getWareHouseProductList','setCurrentSearchQuery']),
      initView() {
        const params = this.$route.query
        this.currentSearchOption = Util.searchQuery(params,this.currentSearch.searchList.public,this.currentSearch.searchList.private)
        this.setCurrentSearchQuery(this.currentSearchOption)

        this.loading = true
        this.pagingShow = false
        this.getWareHouseProductList(this.currentSearchQuery)
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
