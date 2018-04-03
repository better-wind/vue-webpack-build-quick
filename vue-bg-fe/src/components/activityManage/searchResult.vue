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
                <template v-for="(operaItem,operaIndex) in currentSearch.resultItem.opera.items">
                  <template v-if="operaItem.type== 'toDetail'">
                    <template v-if="resultType == 'daily'">
                      <template v-if="scope.row.isAvailable == 1">
                        <el-button type="primary" @click="toDetail(scope.row.id,scope.row.joinCount)" size="small">提报</el-button>
                      </template>
                      <template v-else>
                        <el-button type="primary" @click="toDetail(scope.row.id,scope.row.joinCount)" size="small">详情</el-button>
                      </template>
                    </template>
                    <template v-else >
                      <template v-if="scope.row.isAvailable == 1  && getLargeAvailable(scope.row.applyStartTime,scope.row.applyEndTime,'opera') == 1">
                        <el-button type="primary" @click="toDetail(scope.row.id,scope.row.joinCount)" size="small">提报</el-button>
                      </template>
                      <template v-else>
                        <el-button type="primary" @click="toDetail(scope.row.id,scope.row.joinCount)" size="small">详情</el-button>
                      </template>
                    </template>
                  </template>
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
            <el-table-column v-else-if="item.type == 'frequency'" :prop="item.key" :label="item.label" :width="item.width" align="center">
              <template slot-scope="scope">
                <span>{{mapFrequency[scope.row.frequency]}}</span>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type == 'type'" :prop="item.key" :label="item.label" :width="item.width" align="center">
              <template slot-scope="scope">
                <span v-for="item in scope.row.type.split(',')" style="display: block">
                  {{mapType[item]}}
                </span>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type == 'joinCount'" :prop="item.key" :label="item.label" :width="item.width" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.joinCount">已提报</span>
                <span v-else >未提报</span>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type == 'dailyAvailable'" :prop="item.key" :label="item.label" :width="item.width" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.isAvailable == 1">日常进行中</span>
                <span v-else >已停用</span>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type == 'largeAvailable'" :prop="item.key" :label="item.label" :width="item.width" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.isAvailable == 1">
                  {{getLargeAvailable(scope.row.activityStartTime,scope.row.activityEndTime,'status')}}
                </template>
                <span v-else >已停用</span>
              </template>
            </el-table-column>

            <el-table-column v-else v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center"></el-table-column>
          </template>
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
      mapFrequency:{
        0:'一日一次',
        1:'一日两次',
        2:'一日三次',
        3:'一周一次',
        4:'一周两次',
        5:'一周三次',
        6:'一月一次',
        7:'一月两次',
        8:'一月三次'
      },
      mapType:{
        1:'格格家',
        2:'环球捕手',
        5:'格格家供应链',
        6:'脉宝云店',
        8:'美食买手'
      },
      resultType:'',
    }),
    computed: {
      ...mapState(['currentSearch', 'currentSearchQuery','newGoods'])
    },
    methods: {
      ...mapActions(['setCurrentSearchQuery','getActivityList']),
      initView() {
        const params = this.$route.query
        this.currentSearchOption = Util.searchQuery(params,this.currentSearch.searchList.public,this.currentSearch.searchList.private)
        this.setCurrentSearchQuery(this.currentSearchOption)

        this.loading = true
        this.resultType = this.currentSearch.resultItem.type;
        let sLink = ''
        if(this.resultType == 'large'){
            sLink = '/activity/page/promotion'
        } else if(this.resultType == 'daily'){
            sLink = '/activity/page/daily'
        }
        const opts = {
          link: sLink,
          data:this.currentSearchQuery,
          isNewGoods:this.newGoods ? 1 : 0,
        }
        this.getActivityList(opts)
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
      toDetail(id,key,type){
          let _type = 'new'
         if(key > 0){
             _type = 'edit'
         }
        this.$router.push({
//          path: '/activityDetail',
//          path: '/activityDetailGoods',
          path:this.newGoods ? '/activity/detail/goods' : '/activity/detail',
          query: {
            id:id,
            type:_type,
            source:this.resultType
          }
        })

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
      getLargeAvailable(start,end,type){
          const tStart = new Date(start),
                tEnd = new Date(end),
                tNow = new Date();
          let status = '',
              opera = 0;
          if(tNow < tStart){
            status = '未开始'
//            opera = 0
          } else if(tNow >= tStart && tNow < tEnd) {
              status = '进行中'
              opera = 1
          } else if(tNow >= tEnd){
              status = '已结束'
          }
          return type == 'status' ? status : opera
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
