<!--订单搜索结果-->
<template>
  <div class="section-item section-item-no-padding">
    <div class="result-view">
      <el-table v-loading="loading"  element-loading-text="拼命加载中" :data="tableList" style="width: 100%;" :row-class-name="tableRowClassName">
        <template v-for="(item,index) in currentSearch.resultItem.option">
          <template v-if="item.fixed == 'left'" >
            <el-table-column  fixed  v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center">
              <template slot-scope="scope">
                <router-link style="cursor: pointer" v-if="item.type == 'router'" tag="span" :to="{path:'orderDetail',query:{orderNumber:scope.row[item.key],source:'search' }}" >
                  {{scope.row[item.key]}}
                </router-link>
                <span v-else>
                  {{scope.row[item.key]}}
                </span>
              </template>
            </el-table-column>
          </template>
          <template v-else-if="item.fixed == 'right'" >
            <el-table-column  fixed="right"  v-if="item.type == 'opera'" v-bind:label="item.label" :width="item.width" align="center" >
              <template slot-scope="scope">
                <template v-for="subItem in currentSearch.resultItem.opera.items">
                  <a v-if="subItem.type == 'download' && scope.row.fileUrl && scope.row.applyType == 1" target="_blank" :href="scope.row.fileUrl">
                   <el-button type="primary" size="small">预览</el-button>
                  </a>
                  <a v-if="subItem.type == 'download' && scope.row.fileUrl && scope.row.applyType == 2" target="_blank" :href="scope.row.fileUrl">
                    <el-button type="primary" size="small">下载</el-button>
                  </a>
                 </template>
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
            <el-table-column v-else-if="item.type=='InterValTime'" v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center">
              <template slot-scope="scope" >
                <div class="time-item" v-if="scope.row.startTime" style="padding: 5px 20px 0">
                  {{scope.row.startTime}}
                </div>
                <div class="time-item" v-if="scope.row.endTime" style="padding: 0px 20px 5px">
                  ~{{scope.row.endTime}}
                </div>
                {{scope.row.startTime && scope.row.endTime ? '' : '--'}}

              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type=='sendAddress'" v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center">
              <template slot-scope="scope" >
                <span v-if="scope.row.sendAddress" style="padding: 5px 20px">
                  {{scope.row.sendAddress}}
                </span>
                <span v-else> -- </span>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type=='diffTime'" v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center">
              <template slot-scope="scope" >
                <span v-if="scope.row.applyType == 1">{{scope.row.diffTime | toDate}}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column v-else v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center"></el-table-column>
          </template>
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
    }),
    computed: {
      ...mapState(['currentSearch', 'currentSearchQuery'])
    },
    methods: {
      ...mapActions(['setCurrentSearchQuery','getTimeOutOrderRecordList','getAbnormalOrderRecordList','callSetNotice']),
      initView() {
        const params = this.$route.query
        this.currentSearchOption = Util.searchQuery(params,this.currentSearch.searchList.public,this.currentSearch.searchList.private)
        this.setCurrentSearchQuery(this.currentSearchOption)

        this.pagingShow = false
        this.loading = true
        const type = this.currentSearch.resultItem.type
        if(type == 'abnormal'){
          this.getAbnormalOrderRecordList(this.currentSearchQuery)
            .then((rs) =>{
              this.pagingShow = true
              this.setOrderList(rs)
            })
        } else if (type == 'timeout'){
          this.getTimeOutOrderRecordList(this.currentSearchQuery)
            .then((rs) =>{
              this.pagingShow = true
              this.setOrderList(rs)
            })
        }

      },
      setOrderList(rs) {
        this.loading = false
        this.tableList = rs.rows;
        this.paging.pageSize = Number(this.currentSearchQuery.rows);
        this.paging.currentPage = Number(this.currentSearchQuery.page);
        this.paging.total = rs.total;
        this.paging.query = this.currentSearchQuery;

      },
      downloadFile(file) {
//        console.log(file)
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

