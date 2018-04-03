<template>
  <div>
    <div class="title">
      <span>订单下载列表</span>
      <span class="c-red c-tip">注：文件保存有效期为15天，请及时下载！</span>
    </div>
    <div class="section" style="margin: 20px 10px 0">
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableList" style="width: 100%;">
        <el-table-column prop="fileName" label="文件名"  align="center"></el-table-column>
        <el-table-column prop="fileSize" label="文件大小"  align="center">
          <template slot-scope="scope">
            <span>{{scope.row.fileSize | filterFileSize}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"  align="center"></el-table-column>
        <el-table-column  label="下载状态"  align="center">
          <template slot-scope="scope">
            <span>{{mapStatus[scope.row.status]}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="操作"  align="center">
          <template slot-scope="scope">
            <a v-if="scope.row.fileUrl" target="_blank" :href="scope.row.fileUrl">
              <el-button size="small" type="primary">下载</el-button>
            </a>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>
<script>
  import vSearchItem from '@/components/orderManage/searchItem'
  import vSearchMenu from '@/components/orderManage/searchMenu'
  import vSearchResult from '@/components/orderManage/searchResult'
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'orderMarket',
    created (){
      this.initSearch()
    },
    filters:{
      filterFileSize(size){
          let _str = size < 1024
                      ? (size + 'KB')
                      : ((size/1024).toFixed(1).replace(/\.?0+$/,'') + 'M')
          return _str
      }
    },
    data: () => ({
      orderSearch: {
        resultItem: {
          option: [
            {
              label: '文件名',
              key: 'fileName',
            },
            {
              label: '文件大小',
              key: 'fileSize',
            },
            {
              label: '创建时间',
              key: 'createTime',
            },
            {
              label: '下载状态',
              key: 'status',
            },
            {
              label: '操作',
              key: 'fileUrl',
            }
          ]
        }
      },
      tableList:[],
      mapStatus:{
        0 :'正在下载',
        1 :'下载完成',
        2 :'下载失败'
      },
      loading:true
    }),
    methods: {
      ...mapActions(['getOrderExportTaskList']),
      initSearch() {

        this.getOrderExportTaskList()
          .then((rs)=>{
            this.loading = false
            this.tableList = rs
            this.checkDown(rs)
          })
      },
      checkDown(rs){
        if(rs && rs.length && rs[0].status == 0){
          setTimeout(function(){
            if(this.$route.name == 'orderExportTaskList'){
              this.initSearch()
            }
          }.bind(this),3500)
        }
      },
    },
    components: {
      vSearchItem,
      vSearchMenu,
      vSearchResult
    }
  }
</script>
