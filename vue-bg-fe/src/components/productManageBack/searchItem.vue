<!--订单搜索选项-->
<template>
  <div class="section-item">
    <div class="search-item">
      <v-cate :categoryConfig="categoryConfig"/>
      <v-item />
    </div>
  </div>
</template>
<script>
  import vItem from '@/components/searchManage/Item'
  import vCate from '@/components/productManageBack/category'
  import {mapState, mapActions} from 'vuex'
  export default {
    created (){
    },
    data: () => ({
      cateUpdate:true,
      categoryConfig:{
        type: 'search',
        label:{
          items:[
            '一级分类：',
            '二级分类：',
            '三级分类：',
          ]
        },
        mapModel:[
          {
            key:'levelOne'
          },
          {
            key:'levelTwo'
          },
          {
            key:'levelThree'
          }
        ]
      },
    }),
    computed: {
      ...mapState(['loginCheck','currentSearch','currentSearchQuery'])
    },
    methods:{

    },
    components: {
      vItem,
      vCate
    },
  }
</script>

<style scoped lang='less' rel="stylesheet/less">
  .section-item{
    margin-bottom: 0;
  }
</style>
