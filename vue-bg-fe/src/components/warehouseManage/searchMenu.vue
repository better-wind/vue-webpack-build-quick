<!--订单搜索选项-->
<template>
  <div class="section-item section-item-no-padding">
    <div class="menu-item">
      <v-menu />
      <template v-for="(item,index) in currentSearch.searchMenu.private">
        <el-button  v-if="item.type == 'export'" @click="toExport()" v-bind:type="item.style" >{{item.label}}</el-button>
      </template>
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
      ...mapActions(['exportWareHouseOrderList']),
      toExport() {
        let opts = {}
        for(let i in this.currentSearchQuery){
          if(this.currentSearchQuery[i] && this.currentSearchQuery[i]!='all')
            opts[i] = this.currentSearchQuery[i]
        }
        this.exportWareHouseOrderList(opts)
      },
    },
  }
</script>


