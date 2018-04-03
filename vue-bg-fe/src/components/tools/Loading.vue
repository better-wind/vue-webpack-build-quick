<!--请求加载loading-->
<template>
  <!--<div v-loading.fullscreen.lock="isLoading" class="fixed-view">-->

  <!--</div>-->
      <div>
        <div v-if="isLoading" class="fixed-view"></div>
        <div v-loading.fullscreen.lock="fullscreenLoading"></div>
      </div>

</template>
<script>
import {mapState} from 'vuex'
export  default {
  computed: {
    ...mapState(['loading','fullscreenLoading'])
  },
  data:()=>({
     isLoading:false,
  }),
  watch: {
    'loading.list': function(newVal,oldVal){
      if (newVal) {
        if(newVal.length >= 1){
            this.isLoading = true
        } else{
          this.isLoading = false
        }
      }
    }
  }
}
</script>
<style scoped lang='less' rel="stylesheet/less">
  .fixed-view{
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    /*background-color: #000;*/
    z-index: 9999;
  }
</style>
