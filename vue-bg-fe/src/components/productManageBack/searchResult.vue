<!--订单搜索结果-->
<template>
  <div class="section-item section-item-no-padding">
    <div class="result-view">
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableList" style="width: 100%;" :row-class-name="tableRowClassName">
        <template v-for="(item,index) in currentSearch.resultItem.option">
          <template v-if="item.fixed == 'left'" >
            <el-table-column   v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center" ></el-table-column>
          </template>
          <template v-else-if="item.fixed == 'right'" >
            <el-table-column    v-if="item.type == 'opera' && !isFreeze" :width="item.width" v-bind:label="item.label"  align="center" >
              <template slot-scope="scope">
                <template v-for="(operaItem,operaIndex) in currentSearch.resultItem.opera.items">
                  <el-button v-if="operaItem.type== 'toDetail'" type="primary" @click="toDetail(scope.row[operaItem.key])" size="small">{{operaItem.label}}</el-button>
                  <el-button v-if="operaItem.type== 'status' && scope.row[operaItem.key] == '1'" @click="submitAudit(scope.row.id,scope.$index)" type="primary" size="small">提交审核</el-button>
                  <!--<el-button v-if="operaItem.type== 'status' && scope.row[operaItem.key] == '2'" @click="revokeAudit(scope.row.id,scope.$index)" size="small">撤销审核</el-button>-->
                  <!--<el-button v-if="operaItem.type== 'status' && scope.row[operaItem.key] == '3'" @click="submitAudit(scope.row.id,scope.$index)" type="primary"size="small">重新审核</el-button>-->
                  <el-button v-if="operaItem.type== 'status' && scope.row[operaItem.key] == '4'" @click="changeStock(scope.row.id,scope.row.surplusStock,scope.$index)" size="small">调整库存</el-button>
                </template>
              </template>
            </el-table-column>
          </template>
          <template v-else >
            <el-table-column v-if="item.type == 'image'" v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center">
              <template slot-scope="scope">
                <div class="el-table-image">
                  <img v-bind:src="scope.row[item.key]" alt="">
                </div>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type == 'title'" v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center">
              <template slot-scope="scope">
                <div class="pd-t-h pd-b-h txt-l">
                  <p>{{scope.row[item.key]}}</p>
                  <p class="mg-t-h">商品编码：{{scope.row.barcode}}</p>
                </div>

              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type == 'status'" v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center">
              <template slot-scope="scope">
                <span class="el-table-title">
                  {{productStatus[scope.row[item.key]]}}
                </span>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.type == 'saleStatus'" v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center">
              <template slot-scope="scope">
                <span class="el-table-title">
                  {{salesStatus[scope.row[item.key]]}}
                </span>
              </template>
            </el-table-column>
            <el-table-column v-else v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center"></el-table-column>
          </template>
        </template>
      </el-table>
      <v-pagination v-if="pagingShow" :paging="paging" />
    </div>
    <el-dialog size="tiny" title="库存调整" :visible.sync="modal.isShow">
      <div style="text-align: center">
        <el-input-number v-model="modal.stock" :min="1" ></el-input-number>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelModal()">取 消</el-button>
        <el-button type="primary" @click="submitModal()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import vPagination from '@/components/tools/Pagination'
//  import Util from '../../assets/js/common/utils'
  export default {
    created (){
//      this.initView();
    },
    mounted(){
      this.initView();
    },
    data: () => ({
      modal: {
        isShow: false,
        stock:0,
        productId:'',
      },
      productStatus: ['','未审核','审核中', '审核未通过','审核通过'],
      salesStatus:['未出售','出售中'],
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
      productIdx:'',
    }),
    computed: {
      ...mapState(['currentSearch', 'currentSearchQuery','isFreeze'])
    },
    methods: {
      ...mapActions(['setCurrentSearchQuery','getProductList','setProductStock','productAudit','productRevokeAudit']),
      initView() {
        this.loading = true
        this.pagingShow = false
        const params = this.$route.query
        this.currentSearchOption = Util.searchQuery(params,this.currentSearch.searchList.public,this.currentSearch.searchList.private)
        this.setCurrentSearchQuery(this.currentSearchOption)

        this.getProductList(this.currentSearchQuery)
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
      toDetail(productId){
        this.$router.push({
          path: '/product/edit',
          query: {
            productId:productId,
            type:'edit'
          }
        })
      },
      submitAudit(productId,idx){
        const opts = {
          sellerProductId:productId
        }
        this.$confirm('是否确认提交审核？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.productAudit(opts)
            .then(()=>{
//              this.initView()
              this.tableList[idx].status = 2
            })
        }).catch(() => {

        });
      },
      revokeAudit(productId,idx){
        const opts = {
          sellerProductId:productId
        }
        this.$confirm('是否确认撤回审核？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.productRevokeAudit(opts)
            .then(()=>{
//              this.initView()
          this.tableList[idx].status = 1
            })
        }).catch(() => {

        });
      },
      changeStock(productId,stock,idx){
        this.productIdx = idx
        this.modal.stock = stock;
        this.modal.productId = productId;
        this.modal.isShow = true;
      },
      cancelModal() {
        this.modal.isShow = false
        this.modal.stock = 0
        this.modal.productId = ''
        this.productIdx = ''
      },
      submitModal() {
        const opts = {
          sellerProductId: this.modal.productId,
          stock: this.modal.stock
        }
        this.setProductStock(opts)
          .then(() => {
//            this.tableList[this.productIdx].surplusStock = this.modal.stock
//            this.tableList[this.productIdx].allStock = this.tableList[this.productIdx].lockStock + this.modal.stock
            this.cancelModal()
            this.initView()
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
