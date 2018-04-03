<!--订单搜索选项-->
<template>
  <div class="section-item">
    <div class="search-item">
      <v-item :searchOption="searchOption" />
    </div>
  </div>
</template>
<script>
  import vItem from '@/components/searchManage/Item'
  import {mapState, mapActions} from 'vuex'
  export default {
    created (){
    },
    data: () => ({
      searchOption: {
        page: '1',
        rows: '20'
      },
    }),
    computed: {
      ...mapState(['loginCheck','currentSearch','currentSearchQuery'])
    },
    methods:{

    },
    components: {
      vItem
    },
  }
</script>

<style scoped lang='less' rel="stylesheet/less">
  .section-item{
    margin-bottom: 0;
  }
</style>
