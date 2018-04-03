<!--订单搜索结果-->
<template>
  <template class="section-item">
    <template class="result-view">
      <el-table :data="tableList" style="width: 100%;" :row-class-name="tableRowClassName">
        <template v-for="(item,index) in currentSearch.resultItem.option">
          <template v-if="item.fixed == 'left'" >
            <el-table-column  fixed  v-bind:prop="item.key" v-bind:label="item.label" width="180" >
          </template>
          <template v-else-if="item.fixed == 'right'" >
            <el-table-column v-else-if="item.fixed == 'right'" fixed="right"  v-bind:label="item.label" width="180" >
              <!--<template slot-scope="scope">-->
                <!--<template v-for="(operaItem,operaIndex) in currentSearch.resultItem.opera.items">-->
                  <!--<el-button v-if="operaItem.type== 'toDetail'" type="primary" @click="toDetail(scope.row[operaItem.key])" size="small">{{operaItem.label}}</el-button>-->
                  <!--<el-button v-if="operaItem.type== 'orderStatus' && scope.row[operaItem.key]" size="small">{{operaItem.label}}</el-button>-->
                <!--</template>-->
              <!--</template>-->
            <!--</el-table-column>-->
          </template>
          <template v-else >
            <el-table-column v-bind:prop="item.key" v-bind:label="item.label" width="180" >
          </template>

          </el-table-column>
        </template>
      </el-table>
      <v-pagination :paging="paging" />
    </div>
  </div>
</template>
</template>
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
      }
    }),
    computed: {
      ...mapState(['orderList', 'currentSearch', 'currentSearchQuery'])
    },
    methods: {
      ...mapActions(['getOrderList']),
      initView() {
        this.getOrderList(this.currentSearchQuery)
          .then(() =>{
            this.setOrderList()
          })
      },
      setOrderList() {
        this.tableList = this.orderList.orderList;
        this.paging.pageSize = Number(this.currentSearchQuery.size);
        this.paging.currentPage = Number(this.currentSearchQuery.page);
        this.paging.total = this.orderList.total;
        this.paging.query = this.currentSearchQuery;
      },
      tableRowClassName(row, index) {
        if (index%2 === 1) {
          return 'info-row';
        }
        return 'positive-row';
      },
      toDetail(orderId){
        this.$router.push({
          path: '/order/detail',
          query: {
            orderId:orderId
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
