<template>
  <div>
    <div class="title">
      <span>商品列表</span>
      <div class="fl-r pd-r">
        <el-button  @click="createProduct()" type="primary" size="small">新建商品</el-button>
      </div>
    </div>
    <div class="section search-goods-box">
      <div class="section-item">
        <div class="search-item">
          <v-search>
            <template slot="private-item">
              <v-cate />
            </template>
            <template slot="private-sellerMainId">
              <div>
                <span class="sign-name-item">货品归属商家：</span>
                <el-select filterable v-model="currentSearchQuery.sellerMainId" @change="selectSellerMainId" class="input-item-middle" size="small"  placeholder="货品归属商家">
                  <template v-for="subItem in sellerMainIdList">
                    <el-option :label="subItem.label" :value="subItem.value"></el-option>
                  </template>
                </el-select>
              </div>
            </template>
            <template slot="deliver-item">
              <div>
                <span class="sign-name-item">发货地：</span>
                <el-select filterable :disabled="sellerDeliverList.length ? false : true" v-model="currentSearchQuery.deliverAreaId" class="input-item-middle" size="small"  :placeholder="sellerDeliverList.length ? '请选择发货地' : '请先选择货品归属商家'">
                  <template v-for="subItem in sellerDeliverList">
                    <el-option :label="subItem.label" :value="subItem.value"></el-option>
                  </template>
                </el-select>
              </div>
            </template>
            <template slot="brand-item">
              <div style="position: relative;display: inline">
                <span class="sign-name-item">品牌：</span>
                <el-input v-model.trim="currentSearchQuery.brandId" @focus="callPropertyValCheck(true)" @blur="callPropertyValCheck(false)" @change="changeBrand"  class="input-item-middle" size="small" placeholder="请选择品牌"></el-input>
                <div v-if="propertyList.length && remoteMethodFocus" class="match-box">
                  <p v-for="subItem in propertyList">
                    <span>{{subItem.name}}</span>
                  </p>
                </div>
              </div>
            </template>
            <!--<template slot="private-menu">-->
              <!--<el-button size="small" @click="exportSearch">导出结果</el-button>-->
            <!--</template>-->
          </v-search>
        </div>
      </div>

      <v-menu />
      <v-result />
    </div>
  </div>
  </div>
</template>
<script>
  import vSearch from '@/components/searchManage/Item'
  import vMenu from '@/components/productManage/searchMenu'
  import vCate from '@/components/productManage/category'
  import vResult from '@/components/productManage/searchResult'

  import {mapActions,mapState} from 'vuex'
  export default{
    created(){
      this.initView()
    },
    data:()=>({
      sellerMainIdList:[],
      sellerDeliverList:[],
      searchPage:{
        searchList: {
          public: [
            {
              type:'',
              key:'page',
              intKey:1
            },
            {
              type:'',
              key:'rows',
              intKey:20
            },
            {
              private:true,
              type:'cate',
              label:'类目',
              isSlot:true,
              slotName:'private-item',
              items:[
                {
                  type:'select',
                  label:'',
                  key:'firstCategoryId',
                  intKey:'',
                  placeholder:'一级分类',
                  options:[]
                },
                {
                  type:'select',
                  label:'',
                  key:'secondCategoryId',
                  intKey:'',
                  placeholder:'二级分类',
                  options:[]
                },
                {
                  type:'select',
                  label:'',
                  key:'thirdCategoryId',
                  intKey:'',
                  placeholder:'三级分类',
                  options:[]
                },
                {
                  type:'select',
                  label:'',
                  key:'fourthCategoryId',
                  intKey:'',
                  placeholder:'四级分类',
                  options:[]
                }
              ],
            },
            {
              type:'select',
              label:'销售状态',
              placeholder:'销售状态',
              key:'saleStatus',
              intKey:'',
              selectType:'selectAll',
              options:[
                {
                  value: 'all',
                  label: '全部'
                },
                {
                  label:'出售中',
                  value:'1'
                },
                {
                  label:'未出售',
                  value:'0'
                }
              ]
            },
            {
              type:'select',
              label:'是否可用',
              placeholder:'是否可用',
              key:'status',
              intKey:'',
              selectType:'selectAll',
              options:[
                {
                  value: 'all',
                  label: '全部'
                },
                {
                  label:'可用',
                  value:'1'
                },
                {
                  label:'停用',
                  value:'0'
                }
              ]
            },
            {
              type:'input',
              label:'基础商品码',
              placeholder:'基础商品码',
              key:'baseGoodsCode',
              intKey:'',

            },
            {
              type:'input',
              label:'商品名称',
              placeholder:'商品名称',
              key:'name',
              intKey:''
            },
//            {
//              type:'select',
//              label:'商品类目分组',
//              placeholder:'商品类目分组',
//              key:'managerGroupId',
//              intKey:'',
//              options:[]
//            },
            {
              type:'select',
              filterable:true,
              label:'发货地',
              placeholder:'发货地',
              key:'deliverAreaId',
              intKey:'',
              options:[]
            },
            {
              type:'select',
              filterable:true,
              label:'品牌',
              placeholder:'品牌',
              key:'brandId',
              intKey:'',
              options:[
              ]
            },
            {
              type:'input',
              label:'SKU码',
              placeholder:'SKU码',
              key:'skuCode',
              intKey:''
            },
            {
              type:'input',
              label:'发货编码',
              placeholder:'发货编码',
              key:'deliverCode',
              intKey:''
            },
          ],
          private: []
        },
        searchMenu: {
          public: [
            {
              label:'查询',
              type:'submit',
              style:'primary',
            },
            {
              label:'重置',
              type:'reset',
            },
          ],
          private:[
            {
              label: '导出',
              type: 'new-export',
            },
          ],
        },
        resultItem: {
          option: [
            {
              label:'主图',
              key:'imageUrl',
              width:'100',
              type:'image'
            },
            {
              label:'基础商品码',
              key:'baseGoodsCode',
              width:'160',
              type:'base'
            },
            {
              label:'销售状态',
              key:'saleStatus',
              width:'80',
              type:'saleStatus'
            },
            {
              label:'商品名称',
              key:'name',
              width:'',
              type:'name',
            },
            {
              label:'供货价(不含邮)',
              key:'costPriceRange',
              width:'120',
              type:'costPrice',
            },
            {
              label:'可发库存',
              key:'availCountRange',
              width:'120',
              type:'',
            },
            {
              label:'操作',
              key:'operate',
              width:'100',
              type:'operate'
            }
          ]
        },

      },
      propertyList:[],
      labelIdsListFocus:false,
      remoteMethodFocus:false
    }),
    computed:{
      ...mapState(['currentSearchQuery'])
    },
    methods:{
       ...mapActions(['setSearch','getManagerGroupList','getGoodsBelong','getGoodsSellerDeliver','getBrandSearchList','getBrandSearchList','getGoodsDeliver']),
      initView(){
        this.getGoodsDeliver()
          .then((rs)=>{
            let list = []
            rs.map((item)=>{
              let _opt = {
                label:item.name,
                value:item.code+''
              }
              list.push(_opt)
            })
            this.searchPage.searchList.public[this.mapSearchIdx('deliverAreaId')].options = list
          })
        this.getBrandSearchList()
          .then((rs)=>{
            let list = []
            rs.map((item)=>{
              let _opts = {
                label:item.name,
                value:item.id+''
              }
              list.push(_opts)
            })
            this.searchPage.searchList.public[this.mapSearchIdx('brandId')].options = list
          })
        this.setSearch(this.searchPage)
      },
      mapSearchIdx(key){
        let i = this.searchPage.searchList.public.findIndex((item)=>item.key == key)
//        let i = 0;
//        while(this.searchPage.searchList.public[i].key != key){
//          i++
//        }
        return i
      },
      selectSellerMainId(id){
        if(id == null || id == ''){
          return false
        }
        this.getGoodsSellerDeliver({sellerMainId:id})
          .then((rs)=>{
            this.sellerDeliverList = []
            this.currentSearchQuery.deliverAreaId = ''
            rs.map((item)=>{
              let _opt = {
                label:item.deliverAreaName,
                value:item.deliverAreaId
              }
              this.sellerDeliverList.push(_opt)
            })
          })
      },
      callPropertyValCheck(type){
        this.remoteMethodFocus = type
      },
      debounce(func, wait, immediate) {
        var timeout;
        return function() {
          var context = this, args = arguments;
          var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
        };
      },
      changeBrand(val){
        if(!val){
          this.propertyList = []
          return false
        }
        this.debounce(this.remoteMethodBrand(val),300)
      },
      remoteMethodBrand(query){
        if(!query){
          this.propertyList = []
          return false
        }
//        console.log(query)

        let opts ={
          brandName:query
        }
        this.getBrandSearchList(opts)
          .then((rs)=>{
            this.propertyList = rs
          })
      },
      createProduct() {
        this.$router.push({
          path: '/product/detail',
        })
      }
    },
    components:{
      vSearch,
      vMenu,
      vCate,
      vResult
    },
  }
</script>
<style lang="less" rel="stylesheet/less" >
  .search-goods-box{
    .sign-name-item{
      display: inline-block;
      width: 120px!important;
      padding-right: 5px;
      text-align: right;
    }
    .input-item-middle{
      width: 174px!important;
    }
  }
  .match-box{
    position: absolute;
    top:24px;
    right:0;
    width: 180px;
    max-height: 120px;
    overflow-y: scroll;
    border: 1px solid rgb(229, 211, 209);
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
    box-sizing: border-box;
    margin: 5px 0;
    z-index: 99;
    p{
      padding: 4px 0 4px 20px;
    }
  }

</style>
