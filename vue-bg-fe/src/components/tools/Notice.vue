<!--消息提示模块-->
<template>
	<div></div>
</template>
<script>
  import {mapState,mapActions} from 'vuex'
  export  default {
    computed: {
      ...mapState(['notice'])
    },
    methods: {
      ...mapActions(['callSetNotice'])
    },
    watch: {
    	'notice.isShow': function(newVal,oldVal){
    		var _this = this
    		if (newVal) {
    		   if(_this.notice.type && _this.notice.type == 'success'){
             _this.$message.success(_this.notice.msg)
           } else {
             _this.$message.error(_this.notice.msg)
           }

          const notice = {
            isShow:false,
            msg:'',
          }
          _this.callSetNotice(notice)
    		}
    	}
    }
  }
</script>
<style scoped lang='less' rel="stylesheet/less">

</style>
