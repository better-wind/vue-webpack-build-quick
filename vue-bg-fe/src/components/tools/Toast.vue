<!--消息提示模块-->
<template>
	<transition name="fade">
		<!--<div class="c-toast" v-show="toast.isShow">{{toast.msg}}</div>-->
		<div class="c-toast" v-show="toast.isShow">
      <div>
        {{toast.msg}}
      </div>
    </div>
	</transition>
</template>
<script>
  	import {mapState,mapActions} from 'vuex'
  	export  default {
	    computed: {
	      ...mapState(['toast'])
	    },
      created(){
        if(this.toast.isShow){
          this.hideToast()
        }
      },
	    methods: {
	      ...mapActions(['callSetToast']),
        hideToast(){
          var _this = this
          setTimeout(function(){
            const toast = {
              isShow:false,
              msg:'',
            }
            _this.callSetToast(toast)
          },2000)
        },
	    },
	    watch: {
	    	'toast.isShow': function(newVal,oldVal){
	    		if (newVal) {
		    		this.hideToast()
		    	}
	    	}
	    }
  	}
</script>
<style scoped lang='less' rel="stylesheet/less">
	.c-toast{
	    position:fixed;
	    left:50%;
	    top:50%;
      margin-left: 90px;
	    color:#fff;
	    border-radius:4px;
	    padding: 10px 20px;
	    min-width: 1.3333rem;
      max-width: 400px;
      line-height: 1.4;
      text-align: center;
      /*white-space: nowrap;*/
      /*text-overflow: ellipsis;*/
      /*overflow: hidden;*/
	    background-color:rgba(0,0,0,0.6);
	    transform:translate(-50%,-50%);
	    -webkit-transform:translate(-50%,-50%);
	    z-index:9999;
	    font-size: 16px;
      div{
        width: 100%;
        word-break: break-all;
        text-align: left;
      }
	}
	.fade-enter-active, .fade-leave-active {
	  	transition: opacity .5s;
	  	-webkit-transition: opacity .5s;
	}
	.fade-enter, .fade-leave-active {
	  	opacity: 0
	}

</style>
