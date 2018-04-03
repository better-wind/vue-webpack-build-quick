<template>
  <div class="section-box">
    <div class="item-table">
      <el-table v-loading="loading" element-loading-text="拼命加载中" border :data="searchResult.rows" style="width: 100%;">
        <template v-for="(item,index) in currentSearch.resultItem.option">
          <el-table-column v-if="item.type == 'image'" :label="item.label" :width="item.width" align="center">
            <template slot-scope="scope">
              <div class="table-image" style="height: 80px;padding: 2px 0">
                <img v-if="scope.row.imageUrl" :src="scope.row.imageUrl" style="width: 80px;height: 80px" alt="">
              </div>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'saleStatus'" :label="item.label" :width="item.width" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.saleStatus == 1">出售中</p>
              <p v-else class="c-red">未出售</p>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'base'" :label="item.label" :width="item.width" align="center">
            <template slot-scope="scope">
              <p>
                <span v-if="scope.row.status == 0" class="c-red">(停用)</span>
                {{scope.row[item.key]}}
              </p>


            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'name'" :label="item.label" :width="item.width" align="center">
            <template slot-scope="scope">
              <p>
                <span v-if="scope.row.auditStatus == 1" class="c-red">(审核中)</span>
                {{scope.row.name}}
              </p>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type == 'operate'" :label="item.label" :width="item.width" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="editProduct(scope.row.baseGoodsCode)" size="small">编辑商品</el-button>
              <p>
                <el-button style="margin-top: 10px" size="small" @click="storageList(scope.row.baseGoodsCode)">调整库存</el-button>
              </p>

            </template>
          </el-table-column>

          <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center">
          </el-table-column>
         </template>
      </el-table>
    </div>
    <v-pagination v-if="pagingShow" :paging="paging" />
    <el-dialog :title="'销量和库存'" size="large"  :visible.sync="storageModel.isShow" :close-on-click-modal="false"  :show-close="false">
      <template v-for="storage in storageModel.storageList">
        <div>
          <span class="mg-r">商品名称：{{storage.name}}</span>
          <span>发货地：{{storage.deliverAreaName}} </span>
        </div>
        <div class="item-table mg-t-h mg-b">
          <el-table  border :data="storage.skuStorageVOList" style="width: 100%;">
            <el-table-column label="SKU码" prop="skuCode" align="center"> </el-table-column>
            <el-table-column label="销售属性值" prop="saleProperties" align="center">
              <template slot-scope="scope">
                <!--{{storage.isSelfSupport}}-->
                <!--{{storage.isInStorage}}-->
                <!--{{storage.disableArea}}-->
                <span v-if="scope.row.status ==0" class="c-red">(停售)</span><span>{{scope.row.saleProperties}}</span>
              </template>
            </el-table-column>
            <el-table-column label="发货编码" prop="deliverCode" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.deliverAreaStatus == 0" class="c-red">(停用)</span><span>{{scope.row.deliverCode}}</span>
              </template>
            </el-table-column>
            <el-table-column label="成本价(不含邮)" prop="costPriceBig" align="center"> </el-table-column>
            <el-table-column label="总库存" prop="qtyStorageStock" align="center"> </el-table-column>
            <el-table-column label="锁定库存" prop="lockStock" align="center"> </el-table-column>
            <el-table-column label="剩余库存" prop="availCount" align="center"> </el-table-column>
            <el-table-column v-if="!storage.isInStorage && storage.disableArea && !storage.isSelfSupport" label="调整剩余库存" prop="skuCode" align="center" width="130">
              <template slot-scope="scope">
                <!--!storage.disableArea-->
                <template v-if="scope.row.deliverAreaStatus == 1">
                  <el-input-number class="mg-t-h el-input-number-border"  :min='0-scope.row.availCount' :debounce=300 size="small" v-model="scope.row.qtyStorageStockChange"></el-input-number>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>

      <div slot="footer" class="dialog-footer">
        <el-button v-if="storageModel.isInStorageMenu && storageModel.isSelfSupportMenu" type="primary"  @click="submitStorageModel">保 存</el-button>
        <el-button @click="cancelStorageModel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import vPagination from '@/components/tools/Pagination'
  import {mapActions,mapState} from 'vuex'
//  import Util from '../../assets/js/common/utils'

  export default{
    computed:{
      ...mapState(['currentSearch','currentSearchQuery'])
    },
    created(){
      this.initView()
    },
    filters:{
      skuArrayFilter(rs){
        let _max,_min
        rs.map((item,idx)=>{
          if(idx == 0){
              _max = _min = item.costPrice
          } else {
            _max = Math.max(_max,item.costPrice)
            _min = Math.min(_min,item.costPrice)
          }
        })
        return _max == _min ? _max/100 : _min/100 + ' ~ ' + _max/100
      },
    },
    data:()=>({
      loading:false,
      paging:{
        currentPage:1,
        pageSizes:[20,30,50,100],
        pageSize:0,
        total:0
      },
      pagingShow:false,
      searchResult:{},
      mapChannels:{
        1:'格格家',
        2:'环球捕手',
        3:'燕网',
        4:'第三方',
        5:'B2B',
        6:'脉宝云店',
        7:'燕窝酵素'
      },
      strongHtml: '',
      bgColor: '',
      storageModel:{
        isShow:false,
        storageList:[],
//        isInStorage:false,
        isInStorageMenu:false,
        isInStorageId:'',
        isSelfSupportMenu:false,
      }
    }),
    methods:{
      ...mapActions(['callSetNotice','getBaseGoodsList','setCurrentSearchQuery','getProductStorageList','saveProductStorage']),
      initView(){
        const params = this.$route.query
        this.currentSearchOption = Util.searchQuery(params,this.currentSearch.searchList.public,this.currentSearch.searchList.private)
        this.setCurrentSearchQuery(this.currentSearchOption)

        this.searchList(this.currentSearchQuery)
      },
      searchList(params){
        this.loading = true
        this.getBaseGoodsList(params)
          .then((item)=>{
              this.searchResult = item
              this.setPage()
          })
      },
      setPage(){
        this.paging.pageSize = Number(this.currentSearchQuery.rows)
        this.paging.currentPage = Number(this.currentSearchQuery.page)
        this.paging.total = this.searchResult.total
        this.pagingShow = true
        this.loading = false
      },
      getToast(msg){
        this.callSetNotice({
          isShow:true,
          msg:msg,
          type:'warning'
        })
      },
      editProduct(baseGoodsCode){
        this.$router.push({
          name: 'productDetail',
          query: {
            goodsId: baseGoodsCode
          }
        })
      },
      storageList(code){
        const _opt = {
          baseGoodsCode:code
        }
//        var data = [
//          {
//            "name": "发货地 别动q",
//            "deliverAreaId": 100845,
//            "deliverAreaName": "杭州-旺店通",
//            "sellerMainName": "杭州维度贸易有限公司",
//            "isSelfSupport": false,
//            "skuStorageVOList": [
//              {
//                "skuId": 87091,
//                "skuCode": "SKU80037_81232",
//                "saleProperties": "大-黑色",
//                "deliverCode": "11111xxx",
//                "deliverAreaStatus": 1,
//                "costPrice": 1200,
//                "deliverAreaId": 100845,
//                "qtyPresell": 0,
//                "qtyStorageStock": 0,
//                "availCount": 0,
//                "notDeliverLock": 0,
//                "notPayLock": 0,
//                "status": 1,
//                "percent": 5,
//                "costPriceBig": 12,
//                "lockStock": 0,
//                "isInStorage": 1
//              },
//
//            ]
//          },
//          {
//            "name": "发货地 别动q",
//            "deliverAreaId": 100846,
//            "deliverAreaName": "宿迁",
//            "sellerMainName": "杭州维度贸易有限公司",
//            "isSelfSupport": false,
//            "skuStorageVOList": [
//              {
//                "skuId": 87091,
//                "skuCode": "SKU80037_81232",
//                "saleProperties": "大-黑色",
//                "deliverCode": "11111yyy",
//                "deliverAreaStatus": 0,
//                "costPrice": 1200,
//                "deliverAreaId": 100846,
//                "qtyPresell": 0,
//                "qtyStorageStock": 0,
//                "availCount": 0,
//                "notDeliverLock": 0,
//                "notPayLock": 0,
//                "status": 1,
//                "percent": 5,
//                "costPriceBig": 12,
//                "lockStock": 0,
//                "isInStorage": 0
//              },
//              {
//                "skuId": 87092,
//                "skuCode": "SKU80037_81233",
//                "saleProperties": "大-白色白色白色白色白色白色",
//                "deliverCode": "22222yyy",
//                "deliverAreaStatus": 0,
//                "costPrice": 1200,
//                "deliverAreaId": 100846,
//                "qtyPresell": 0,
//                "qtyStorageStock": 0,
//                "availCount": 0,
//                "notDeliverLock": 0,
//                "notPayLock": 0,
//                "status": 1,
//                "percent": 5,
//                "costPriceBig": 12,
//                "lockStock": 0,
//                "isInStorage": 0
//              }
//            ]
//          }
//          ]
//        this.setStorageShow(data)
//        return false
        this.getProductStorageList(_opt)
          .then((rs)=>{
            this.setStorageShow(rs)
          })
      },
      setStorageShow(rs){
        var _storageList = JSON.parse(JSON.stringify(rs))

        _storageList.map((item)=>{
          item.skuStorageVOList.map((subItem)=>{
            subItem.qtyStorageStockChange = 0
            if(subItem.isInStorage == 1){
              item.isInStorage = true
            }
            if(subItem.deliverAreaStatus == 1){
              item.disableArea = true
            }
          })
          if(!item.isSelfSupport){
            this.storageModel.isSelfSupportMenu = true
          }
          if(!item.isInStorage && item.disableArea){
            this.storageModel.isInStorageMenu = true
//            this.storageModel.isInStorageId = item.deliverAreaId
          }

        })

        this.storageModel.storageList = _storageList
        this.storageModel.isShow = true
//        console.log(this.storageModel)

      },
      submitStorageModel(){
        var _storageList = []
        for(let i=0,j=this.storageModel.storageList.length;i<j;i++){
          var _item = this.storageModel.storageList[i]
          let _saveItem = {}
          _saveItem.deliverAreaId = _item.deliverAreaId
          _saveItem.adjustSku = []
          for(let n = 0,m = _item.skuStorageVOList.length;n<m;n++){
            let _subItem = _item.skuStorageVOList[n]
//            库存是否 >= (订单占用 +下单锁库存)，
            if(_subItem.qtyStorageStock+_subItem.qtyStorageStockChange < _subItem.lockStock){
//              this.getToast('发货地：'+_item.sellerMainName+'-'+_item.deliverAreaName +_subItem.skuCode+'实物库存应大于锁定库存')
              this.getToast('剩余库存应大于等于锁定库存')
              _subItem.qtyStorageStockChange = -(_subItem.availCount)
              return false
            }
            let _opt = {
              skuId:_subItem.skuId,
              qtyStorageStockChange:_subItem.qtyStorageStockChange,
            }
            _saveItem.adjustSku.push(_opt)
          }
          _storageList.push(_saveItem)
        }
        const _saveOpt = {
          stockFormList:_storageList
        }
//        console.log(_storageList)
//        return false
        this.saveProductStorage(_saveOpt)
          .then((rs)=>{

            this.cancelStorageModel()
            this.initView()
          })
      },
      cancelStorageModel(){
        this.storageModel.isShow = false
        this.storageModel.storageList = []
//        this.storageModel.isInStorage = false
        this.storageModel.isSelfSupportMenu = false
        this.storageModel.isInStorageMenu = false
//        this.storageModel.isInStorageId = ''
      }
    },
    watch: {
      '$route' (to, from) {
        if (to.fullPath !== from.fullPath) {
          this.initView();
        }
      }
    },
    components: {
      vPagination,
    },
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .t-l{
    padding-left: 20px;
    p{
      /*overflow: hidden;*/
      /*text-overflow: ellipsis;*/
      /*white-space: nowrap;*/
    }
  }
  .line-wrap{
    .line{
      padding: 10px 0;
      border-top:1px solid rgb(236, 223, 223);
      &:nth-child(1){
        border-top: none;
      }
      >p{
        display: inline-block;
        width: 94px;
        height: 100%;
        /*border-right: 1px solid rgb(236, 223, 223);*/
        &:last-child{
          /*border-right: none;*/
        }
      }
    }
  }
  .label-sign{
    width: 120px;
  }
  .el-input-number-border{
    /*border: 1px solid rgb(217, 193, 191);*/
    /*border-radius: 4px;*/
    .el-input__inner{
      /*border: none;*/
    }
  }
</style>
