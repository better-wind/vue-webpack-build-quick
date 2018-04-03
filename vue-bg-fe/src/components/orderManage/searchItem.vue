<!--订单搜索选项-->
<template>
  <div class="section-item">
    <div class="search-item">

      <!--<v-item :searchOption="searchOption" />-->
      <v-item />

    </div>
  </div>
</template>
<script>
  import vItem from '@/components/searchManage/Item'
//  import Util from '../../assets/js/common/utils'
  import {mapState, mapActions} from 'vuex'
  export default {
    created (){
      this.initSearchItem()
    },
    data: () => ({
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now();
        }
      },
    }),
    computed: {
      ...mapState(['currentSearch','currentSearchQuery'])
    },
    methods: {
      ...mapActions(['setCurrentSearchQuery']),
      initSearchItem() {
        this.currentSearchOption = Util.searchQuery(this.$route.query,this.currentSearch.searchList.public,this.currentSearch.searchList.private)
        this.setCurrentSearchQuery(this.currentSearchOption)
      },
      checkDate(key,nextkey,pre,cur) {
        let query = this.currentSearchQuery;
        query[key] = Util.formatDate('yyyy-mm-dd hh:mm:ss',query[key])
        if(pre && cur){
          pre = Util.formatDate('yyyy-mm-dd hh:mm:ss',pre)
          cur = Util.formatDate('yyyy-mm-dd hh:mm:ss',cur)

          if(Util.formatDateCom(pre,cur)){
            query[nextkey] = ''
          }
        }
        this.setCurrentSearchQuery(query)
      }
    },
    components: {
      vItem
    }
  }
</script>
<style scoped lang='less' rel="stylesheet/less">
  .section-item{
    margin-bottom: 0;
    .input-item-middle{
      width: 180px;
    }
  }
</style>
