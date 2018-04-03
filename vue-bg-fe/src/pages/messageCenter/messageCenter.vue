<template>
  <div>
    <div class="title">
      <span>消息中心</span>
    </div>
    <div class="section">
      <div class="section-item" style="text-align: right">
        <div class="inline-item fl-l">共{{msgNum.messageCount}}条，其中未读消息{{msgNum.unReadCount}}条</div>
        <div v-for="item in searchList" class="inline-item">
          <span class="name-item">{{item.label}}：</span>
          <el-select  v-model="searchOpts[item.key]" class="input-item-middle" size="small" :placeholder="item.placeholder">
            <div class="inline-item" v-for="subItem in item.options">
              <el-option  :label="subItem.label" :value="subItem.value"></el-option>
            </div>
          </el-select>
        </div>
        <div class="inline-item">
          <el-button type="primary" @click="searchMsg()" size="small">搜索</el-button>
        </div>
      </div>
      <div class="section-item section-item-no-padding">
        <div v-if="tableReady" class="result-view">
          <el-table  :data="tableList" style="width: 100%;" :row-class-name="tableRowClassName" @row-click="ruleDetail" row-key="id">
            <el-table-column  prop="attachmentCount" label="提示" width="120" align="center" >
              <template slot-scope="scope">
                <i v-if="scope.row.readState" class="ggj-nav-icon">&#xe612;</i>
                <i v-else class="ggj-nav-icon">&#xe613;</i>
                <i v-if="scope.row.attachmentCount > 0" class="ggj-nav-icon">&#xe611;</i>
              </template>
            </el-table-column>
            <el-table-column  prop="type" label="消息类型" width="120" align="center" >
              <template slot-scope="scope">
                {{mapType[scope.row.type]}}
              </template>
            </el-table-column>
            <el-table-column  prop="theme" label="主题"  align="center" ></el-table-column>
            <el-table-column  prop="pushTime" label="时间" width="240" align="center" ></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="pagination-item">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="paging.currentPage"
          :page-sizes="paging.pageSizes"
          :page-size="paging.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="paging.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    name:'messageCenter',
    created () {
      this.initView()
    },
    computed: {
      ...mapState(['alertMsg','msgSearchQuery'])
    },
    data: () => ({
      searchList:[
          {
            type:'select',
            label:'消息状态',
            placeholder:'请选择',
            key:'readState',
            selectType:'selectAll',
            options:[
              {
                value: 'all',
                label: '全部'
              },
              {
                value:'0',
                label:'未读'
              },
              {
                value:'1',
                label:'已读'
              }
            ]
          },
          {
            type:'select',
            label:'消息类型',
            placeholder:'请选择',
            key:'type',
            selectType:'selectAll',
            options:[
              {
                value: 'all',
                label: '全部'
              },
              {
                value:'0',
                label:'规则变更'
              },
              {
                value:'1',
                label:'业务通知'
              },
              {
                value:'2',
                label:'活动通知'
              },
              {
                value:'3',
                label:'协议变更'
              },
              {
                value:'4',
                label:'系统功能'
              },
              {
                value:'5',
                label:'问卷调研'
              },
              {
                value:'6',
                label:'其他'
              }
            ]
          }
        ],
      mapType:{
        0:'规则变更',
        1:'业务通知',
        2:'活动通知',
        3:'协议变更',
        4:'系统功能',
        5:'问卷调研',
        6:'其他',
      },
      tableList:[],
      tableReady:false,
      searchOpts:{
        rows:'20',
        page:'1',
        readState:null,
        type:null
      },
      msgSize:{
        total:0,
        noRead:0
      },
      paging:{
        currentPage:1,
        pageSizes:[20,30,50,100],
        pageSize:0,
        total:0,
      },
      msgNum:{
        messageCount:0,
        unReadCount:0
      },//消息数据
    }),
    methods: {
      ...mapActions(['getMsgList','getMsgNum','setMsgSearchQuery']),
      initView() {
        if(this.msgSearchQuery.isFocus){
            this.searchOpts = this.msgSearchQuery.query
        }
        this.searchMsg()
      },
      searchMsg() {
        this.getMsgList(this.searchOpts)
          .then((rs)=>{
            this.tableList = rs.rows || []
//            this.msgSize.total = this.msgList.total
            this.paging.currentPage = Number(this.searchOpts.page)
            this.paging.pageSize = Number(this.searchOpts.rows)
            this.paging.total = Number(rs.total)
            this.getMsgNum()
              .then((rs)=>{
               this.msgNum = rs
              })
            this.tableReady = true
          })
      },
      handleSizeChange(val) {
        this.searchOpts.rows = val
        this.searchMsg()
      },
      handleCurrentChange(val) {
        this.searchOpts.page = val
        this.searchMsg()
      },
      tableRowClassName(row, index) {
        if (index%2 === 1) {
          return 'info-row';
        }
        return 'positive-row';
      },
      ruleDetail(row, event, column){
        const opts = {
          isFocus:true,
          query:this.searchOpts
        }
        this.setMsgSearchQuery(opts)
        this.$router.push({
          path: '/message/detail',
          query: {
            messageId:row.id,
          }
        })
      },
    },
    watch: {
       'alertMsg':function(newVal){
           if(!newVal){
               this.initView()
           }
       }
    },
  }
</script>
<style scoped lang='less' rel="stylesheet/less">
  .ggj-nav-icon{
    margin-right: 0px;
  }
</style>
