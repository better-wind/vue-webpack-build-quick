<template>
  <div class="section-item section-item-no-padding ware-box">
    <div class="menu pd-l pd-b">
      <el-button type="primary" size="small" @click="wareStorageModel.isShow = true" >创建入仓单</el-button>
    </div>
    <div class="section-item">
      <div v-if="!tableList.length" class="ware-item" style="line-height: 60px;text-align: center">
        暂无数据
      </div>
      <template v-for="item in tableList">
        <div class="ware-item">
          <div class="ware-header">
            <span>入仓单编号：{{item.code}}</span>
            <span>状态：{{item.statusDesc}}</span>
            <span>入库仓库：{{item.storageName}}</span>
            <span> 报价币种：{{item.currencyDesc}}</span>
          </div>
          <div class="ware-msg-position">
            <div class="ware-msg">
              <div class="ware-msg-warp">
                <template v-for="configItem in listConfig">
                  <div class="ware-msg-item">
                    <div class="ware-col-item">
                      <p v-for="listItem in configItem.items">
                        <template v-if="listItem.type == 'error'">
                          <template v-if="item.status == 3">
                            <span class="c-red">{{listItem.label}}:</span>
                            <span class="c-red">{{item[listItem.key] ? item[listItem.key] : '--'}}</span>
                          </template>
                        </template>
                        <template v-else>
                          <span>{{listItem.label}}:</span>
                          <span>{{item[listItem.key] ? item[listItem.key] : '--'}}</span>
                        </template>

                      </p>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div class="ware-msg-menu-item">
              <div class="menu menu-list" v-if="item.status == 0 || item.status == 3">
                <p>
                  <a :href="'/#/manage/warehouse/detail?code='+item.code" target="_blank">
                    <el-button class="menu-btn" size="small" type="primary">编辑商品</el-button>
                  </a>
                  <!--<el-button class="menu-btn" size="small" @click="codeDetail(item)">编辑商品</el-button>-->
                </p>
                <p><el-button class="menu-btn" size="small" @click="submitAudit(item.code)">提交审核</el-button></p>
                <p><el-button class="menu-btn" size="small" @click="delOrder(item.code)">删除</el-button></p>
              </div>
              <div class="menu" v-else-if="item.status == 1 || item.status == 4 || item.status == 6">
                <p>
                  <a :href="'/#/manage/warehouse/detail?code='+item.code" target="_blank">
                    <el-button class="menu-btn" size="small" type="primary">查看明细</el-button>
                  </a>
                  <!--<el-button class="menu-btn" size="small" type="primary" @click="codeDetail(item)">查看明细</el-button>-->
                </p>
              </div>
              <div class="menu" v-else-if="item.status == 2 ">
                <p>
                  <a :href="'/#/manage/warehouse/detail?code='+item.code" target="_blank">
                    <el-button class="menu-btn" size="small" type="primary">发货</el-button>
                  </a>
                  <!--<el-button class="menu-btn" size="small" type="primary" @click="codeDetail(item)">发货</el-button>-->
                </p>
              </div>
              <div class="menu" v-else-if="item.status == 5 ">
                <p>
                  <a :href="'/#/manage/warehouse/detail?code='+item.code" target="_blank">
                    <el-button class="menu-btn" size="small" type="primary">确认入仓</el-button>
                  </a>
                  <!--<el-button class="menu-btn" size="small" type="primary" @click="codeDetail(item)">确认入仓</el-button>-->
                </p>
              </div>
            </div>
          </div>

        </div>
      </template>

      <v-pagination v-if="pagingShow" :paging="paging" />

    </div>
    <el-dialog :visible.sync="wareStorageModel.isShow" title="请选择入仓仓库">
      <div class="section-item">
        <div class="block-item">
          <span class="sign">入仓仓库：</span>
          <el-select class="input-item-middle" size="small" v-model="wareStorageModel.opts.storage" placeholder="请选择入仓仓库">
            <template v-for="subItem in storageList">
              <el-option  :label="subItem.name" :value="subItem.code"></el-option>
            </template>
          </el-select>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <a v-if="wareStorageModel.opts.storage" :href="'/#/manage/warehouse/detail?storageId='+wareStorageModel.opts.storage" target="_blank">
          <el-button type="primary" size="small" @click="wareStorageModel.isShow = false" >确认</el-button>
        </a>
        <el-button v-else type="primary" size="small" disabled >确认</el-button>
        <el-button @click="wareStorageModel.isShow = false" size="small">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import vPagination from '@/components/tools/Pagination'
  export default {
    created(){
      this.initView()
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
      listConfig:[
        {
          col:6,
          items:[
            {
              label:'申请入仓SKU',
              key:'applySkuCount'
            },
            {
              label:'申请入仓总数',
              key:'applyTotalCount'
            },
            {
              label:'合计价值',
              key:'applyTotalMoney'
            }

          ]
        },
        {
          col:6,
          items:[
            {
              label:'实际发货SKU',
              key:'sendSkuCount'
            },
            {
              label:'实际发货总数',
              key:'sendTotalCount'
            },
            {
              label:'合计价值',
              key:'sendTotalMoney'
            }

          ]
        },
        {
          col:6,
          items:[
            {
              label:'真实入库SKU',
              key:'actualInSkuCount'
            },
            {
              label:'真实入库总数',
              key:'actualInTotalCount'
            },
            {
              label:'合计价值',
              key:'actualInTotalMoney'
            }

          ]
        },
        {
          col:4,
          items:[
            {
              label:'入仓备注',
              key:'note'
            },
            {
              label:'不通过原因',
              key:'reason',
              type:'error'
            },
          ]
        }
      ],
      wareStorageModel:{
        isShow:false,
        opts:{
          storage:''
        }
      },
      storageList:[],
    }),
    computed: {
      ...mapState(['currentSearch', 'currentSearchQuery'])
    },
    methods:{
      ...mapActions(['setCurrentSearchQuery','getStorageOrderList','getStorageList',
      'auditStorageOrder','delStorageOrder','callSetNotice']),
      initView(){
        const params = this.$route.query
        this.currentSearchOption = Util.searchQuery(params,this.currentSearch.searchList.public,this.currentSearch.searchList.private)
        this.setCurrentSearchQuery(this.currentSearchOption)
        this.loading = true
        this.pagingShow = false
        this.getStorageList()
          .then((rs)=>{
            this.storageList = rs
          })
        this.getStorageOrderList(this.currentSearchQuery)
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
      codeDetail(item) {
        this.$router.push({
          path:'/manage/warehouse/detail',
          query:{
            code:item.code
          }
        })
      },
      submitAudit(code){
        this.$confirm('是否确认提交入仓申请？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.callAuditStorageOrder({code})
        }).catch(() => {

        });

      },
      callAuditStorageOrder(rs){
          this.auditStorageOrder(rs)
            .then(()=>{
              this.getToast('提交成功')
              this.initView()
          })
      },
      delOrder(code){
        this.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.callDelStorageOrder({code})
        }).catch(() => {

        });
      },
      callDelStorageOrder(rs){
          this.delStorageOrder(rs)
            .then(()=>{
              this.getToast('删除成功')
              this.initView()
            })
      },
      getToast(msg){
        const notice = {
          isShow:true,
          msg:msg,
        }
        this.callSetNotice(notice)
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
<style lang="less" rel="stylesheet/less" scoped>
  .ware-box{
    .ware-item{
      width: 1030px;
      margin-bottom: 10px;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid #e0e0e0;
      >.ware-header{
        line-height: 30px;
        background-color: #eee;
        padding-left: 20px;
        span{
          margin-right: 20px;
        }
      }
      .ware-msg-position{
        position: relative;
        width: 1030px;
        .ware-msg{
          width: 1030px;
          box-sizing: border-box;
          /*overflow-x: scroll;*/
          &::-webkit-scrollbar {
            width: 1030px;
            height:10px;
            border-top: 1px solid #e0e0e0;
          }
          //webkit 下 滚动条优化
          //两边样式
          &::-webkit-scrollbar-button    {
            /*background-color:#AAA;*/
          }
          //滚动槽样式
          &::-webkit-scrollbar-track     {
            /*background:#AAA;*/
          }
          //滚动条样式
          &::-webkit-scrollbar-thumb{
            /*background:#FFA711;*/
            background: #ddd;
            border-radius:0 0 4px 4px;
          }
          .ware-msg-warp{
            width: 1300px;
            width: 1030px;
            overflow: hidden;
          }
          .ware-msg-item{
            float: left;
            height:120px;
            width: 300px;
            width: 210px;
            line-height: 120px;
            border-right:1px solid #e0e0e0;
            &:nth-child(4){
              width: 300px;
            }
            .ware-col-item{
              display: inline-block;
              line-height: normal;
              vertical-align: middle;
              /*transform: translate(0,50%);*/
              >p{
                margin: 0 10px;
                overflow: hidden;
                span{
                  &:nth-child(1){
                    display: inline-block;
                    /*width: 90px;*/
                  }
                }
              }
            }
          }
        }
        .ware-msg-menu-item{
          height:120px;
          width: 100px;
          position: absolute;
          top:0;
          right: 0;
          background-color: rgb(255,255,255);
          line-height: 13;
          text-align: center;
          box-shadow: -1px 0 8px #d3d4d6;
          .menu{
            text-align: center;
            line-height: 120px;
            &.menu-list{
              display: inline-block;
              p{
                line-height: normal;
                margin: 2px 0;
              }
            }
          }
        }
      }


    }
  }

</style>
