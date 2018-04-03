<template>
  <div>
    <div class="title">
      商品审核列表
    </div>
    <div class="section audit-goods-box">
      <div class="section-item">
        <div class="search-item">
          <v-search />
        </div>
      </div>
      <v-menu />
      <v-result />
    </div>
  </div>
</template>
<script>
  import vSearch from '@/components/searchManage/Item'
  import vMenu from '@/components/productManage/searchMenu'
  import vResult from '@/components/productManage/auditResult'
  import {mapActions,mapState} from 'vuex'
  export default{
    computed:{
      ...mapState(['currentSearchQuery'])
    },
    created(){
      this.initView()
    },
    data:()=>({
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
              type:'input',
              label:'基础商品码',
              placeholder:'请输入基础商品码',
              key:'baseGoodsCode',
              intKey:'',
            },
            {
              type:'input',
              label:'商品名称',
              placeholder:'请输入商品名称',
              key:'name',
              intKey:'',
            },
            {
              type:'check-group',
              label:'审核状态',
              placeholder:'',
              items:[
                {
                  label:'待初审',
                  placeholder:'待初审',
                  key:'isAudit',
                  intKey:true,
                  isClear:true

                },
                {
                  label:'待复审',
                  placeholder:'待复审',
                  key:'isAuditAgain',
                  intKey:true,
                  isClear:true
                },
                {
                  label:'通过',
                  placeholder:'通过',
                  key:'isPass',
                  intKey:'',
                },
                {
                  label:'失败',
                  placeholder:'失败',
                  key:'isFail',
                  intKey:'',
                }
              ],
            }
          ],
          private:[]
        },
        searchMenu:{
          public: [
            {
              label:'查询',
              type:'submit',
              style:'primary',
            },
            {
              label:'重置',
              type:'reset',
            }
          ]
        },
        resultItem:{
            option: [
              {
                label: '提交审核信息',
                type: 'auditMsg',
                width: '260'
              },
              {
                label: '基础商品信息',
                type: 'goodsMsg',
                width: '300'
              },
              {
                label: '初审信息',
                type: 'auditFir',
                width:'240'
              },
              {
                label: '复审信息',
                type: 'auditSec',
                width:'240'
              },
              {
                label: '操作',
                key: 'opera',
                width:'120'
              }
            ]
        }
      },
    }),
    methods:{
      ...mapActions(['setSearch']),
      initView(){
        this.setSearch(this.searchPage)

      },
    },
    components:{
      vSearch,
      vResult,
      vMenu
    },
  }
</script>
<style lang="less" rel="stylesheet/less">
  .audit-goods-box {
    .sign-name-item{
      display: inline-block;
      width: 90px!important;
    }

  }
</style>

