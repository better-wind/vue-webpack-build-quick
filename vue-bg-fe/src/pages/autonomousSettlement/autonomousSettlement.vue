<!--自主结算-->
<template>
  <div>
    <div class="title">
      <span>自主结算</span>
    </div>
    <div class="section">
      <div class="section-item">
        <div class="search-item">
          <v-search-item />
        </div>
      </div>
      <div class="section-item section-item-no-padding">
        <div class="menu-item">
          <v-search-menu />
        </div>
      </div>

      <v-search-result />
    </div>
  </div>
</template>
<script>
  import vSearchItem from '@/components/searchManage/Item'
  import vSearchMenu from '@/components/searchManage/Menu'
  import vSearchResult from '@/components/autonomousSettlement/searchResult'
  import {mapState, mapActions} from 'vuex'
  export default {
    created (){
      this.initSearch()
    },
    computed: {
      ...mapState(['currentSearch'])
    },
    data: ()=>({
       settlementSearch:{
         searchList: {
           public: [
             {
               type:'input',
               label:'结算单号',
               placeholder:'请输入结算单号',
               key:'danhao'
             },
             {
               type: 'select',
               label: '结算状态',
               placeholder:'请选择',
               key: 'orderNumber',
               selectType:'selectAll',
               options:[
                 {
                   value: 'all',
                   label: '全部'
                 },
                 {
                   value: '0',
                   label: '待确认'
                 },
                 {
                   value: '1',
                   label: '已确认'
                 },
                 {
                   value: '2',
                   label: '已结算'
                 },

               ]
             },
             {
               type: 'date-picker-date',
               label: '结算日',
               placeholder:'请选择',
               key: 'createTimeStart',
             },
           ]
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
         resultItem: {
           option: [
             {
               fixed: 'left',
               label: '结算单编号',
               key: 'orderNumber',
               width:'150'
             },
             {
               label: '结算状态',
               key: 'status',
               width:'90'
             },
             {
               label: '结算日',
               key: 'status',
               width:'180'
             },
             {
               label: '时间范围',
               key: 'status',
               width:'200'
             },
             {
               label: '发货地',
               key: 'status',
               width:'90'
             },
             {
               label: '结算金额',
               key: 'status',
               width:'70'
             },
             {
               label: '更新时间',
               key: 'status',
               width:'180'
             },
             {
               fixed:'right',
               type: 'opera',
               label: '操作',
               width:''
             }
           ],
           opera: {
             items:[]
           },
         },
       }
    }),
    methods: {
      ...mapActions(['setSearch']),
      initSearch() {
        this.setSearch(this.settlementSearch)
      }
    },
    components: {
      vSearchItem,
      vSearchMenu,
      vSearchResult
    }
  }
</script>
