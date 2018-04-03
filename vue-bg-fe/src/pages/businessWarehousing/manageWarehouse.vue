<template>
  <div>
    <div class="title">
      <span>入仓单管理</span>
    </div>
    <div class="section search-ware-box">
      <v-search-item />
      <v-search-menu />
      <v-search-result />
    </div>
  </div>
</template>
<script>
  import vSearchItem from '@/components/warehouseManage/searchItem'
  import vSearchMenu from '@/components/warehouseManage/searchMenu'
  import vSearchResult from '@/components/warehouseManage/result'
  import {mapState, mapActions} from 'vuex'
  export default{
    name:'',
    created(){
      this.initView()
    },
    computed: {
      ...mapState(['currentSearch'])
    },
    data: ()=>({
      searchPage:{
        searchList:{
          public:[
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
              type: 'input',
              label: '入仓单编号',
              placeholder:'请输入内容',
              key: 'code'
            },
            {
              type: 'select',
              label: '入仓单状态',
              placeholder:'请选择',
              key: 'status',
              selectType:'selectAll',
              options:[
                {
                  value: 'all',
                  label: '全部'
                },
                {
                  value: '0',
                  label: '新建'
                },
                {
                  value: '1',
                  label: '待审核'
                },
                {
                  value: '2',
                  label: '审核通过待发货'
                },
                {
                  value: '3',
                  label: '审核不通过'
                },
                {
                  value: '4',
                  label: '待入库'
                },
                {
                  value: '5',
                  label: '已入库'
                },
                {
                  value: '6',
                  label: '完结'
                },
              ]
            },
            {
              type: 'input',
              label: '商品条码',
              placeholder:'请输入内容',
              key: 'deliveryCode'
            },
            {
              type: 'input',
              label: '商品名称',
              placeholder:'请输入内容',
              key: 'skuName'
            },
          ],
        },
        searchMenu: {
          public: [
            {
              label: '查询',
              style: 'primary',
              type: 'submit'
            },
            {
              label: '重置',
              type: 'reset',
            }
          ],
        },
      }
    }),
    methods:{
      ...mapActions(['setSearch']),
      initView(){
        this.setSearch(this.searchPage)
      }
    },
    components: {
      vSearchItem,
      vSearchMenu,
      vSearchResult
    }
  }
</script>
<style lang="less" rel="stylesheet/less" >
  .search-ware-box{
    .sign-name-item{
      /*display: inline-block;*/
      width: 86px!important;
      /*padding-right: 5px;*/
      /*text-align: right;*/
    }
    .input-item-middle{
      width: 174px!important;
    }
  }

</style>
