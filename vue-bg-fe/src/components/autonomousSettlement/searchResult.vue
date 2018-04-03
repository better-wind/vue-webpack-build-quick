<template>
  <div class="section-item section-item-no-padding">
    <div class="result-view">
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableList" style="width: 100%;" :row-class-name="tableRowClassName">
        <template v-for="(item,index) in currentSearch.resultItem.option">
          <template v-if="item.fixed == 'left'" >
            <el-table-column v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center" ></el-table-column>
          </template>
          <template v-else-if="item.fixed == 'right'" >
            <el-table-column   v-if="item.type == 'opera'" v-bind:label="item.label" :width="item.width" align="center" >
              <template slot-scope="scope">
                <!--<template v-for="(operaItem,operaIndex) in currentSearch.resultItem.opera.items">-->

                <!--</template>-->
              </template>
            </el-table-column>
          </template>
          <el-table-column v-else v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center"></el-table-column>

        </template>
      </el-table>
      <v-pagination :paging="paging" />
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
      loading:true,
    }),
    computed: {
      ...mapState(['currentSearch', 'currentSearchQuery'])
    },
    methods: {
      ...mapActions(['getSettlementList']),
      initView() {
        this.loading = true
        this.setList()
        this.getSettlementList(this.currentSearchQuery)
          .then((rs) =>{
            this.setList(rs)
          })
      },
      setList(rs) {
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
