<!--订单搜索选项-->
<template>
  <div class="section-item section-item-no-padding">
    <div class="menu-item">
      <v-menu />
    </div>
  </div>

</template>
<script>
//  import Util from '../../assets/js/common/utils'
  import vMenu from '@/components/searchManage/Menu'
  import {mapState, mapActions} from 'vuex'
  export default {
    computed: {

    },
    components: {
      vMenu
    },
    methods: {

    },
  }
</script>


