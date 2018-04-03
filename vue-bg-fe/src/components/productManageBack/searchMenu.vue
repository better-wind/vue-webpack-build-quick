<!--订单搜索选项-->
<template>
  <div class="section-item section-item-no-padding">
    <div class="menu-item">
      <v-menu />
      <div class="inline-item" v-for="(item,index) in currentSearch.searchMenu.private">
        <el-button  v-if="item.type == 'export'" @click="toExport()" v-bind:type="item.style" >{{item.label}}</el-button>
        <el-button v-else-if="item.type == 'reset'" v-bind:type="item.style" @click="reset()">{{item.label}}</el-button>
      </div>
    </div>
  </div>

</template>
<script>
//  import Util from '../../assets/js/common/utils'
  import vMenu from '@/components/searchManage/Menu'
  import {mapState, mapActions} from 'vuex'
  export default {
    computed: {
      ...mapState(['currentSearch', 'currentSearchQuery'])
    },
    components: {
      vMenu
    },
    methods: {
      ...mapActions(['setCurrentSearchQuery','setClearSelect','exportProductList']),
      reset() {
        const searchOption = Util.resetQuery(this.currentSearch.searchList.public,this.currentSearch.searchList.private)
        this.setCurrentSearchQuery(searchOption);
        this.setClearSelect({isClear:true})
      },
      toExport(){
        let opts = {}
        for(let i in this.currentSearchQuery){
          if(this.currentSearchQuery[i] && this.currentSearchQuery[i]!='all')
            opts[i] = this.currentSearchQuery[i]
        }
        this.exportProductList(opts)
      },
    },
  }
</script>


