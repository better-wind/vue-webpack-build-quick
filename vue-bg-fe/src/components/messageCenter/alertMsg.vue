<template>
  <div>
    <el-dialog size="large" title="消息" :close-on-press-escape="dialogClose" :show-close="dialogClose" :close-on-click-modal="dialogClose" :visible.sync="alertConfig.isModal">
      <template >
        <v-detail-view :detailConfig="detailConfig"/>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import vDetailView from '@/components/messageCenter/detailView'
  export default {
    created(){
      this.initView()
    },
    computed: {
      ...mapState(['alertMsg','loginCheck'])
    },
    data: () => ({
      ...mapActions(['getAlertMsg','setEditWithMsg','setAlertBussMsg']),
      dialogClose:false,
      alertConfig:{
        isModal:false
      },
      dataReady:false,
      detailConfig:{
        type:'alert'
      }
    }),
    methods: {
      initView(){
        this.alertConfig.isModal = this.alertMsg
        this.getAlertMsg()
            .then(()=>{
              if(!this.alertMsg){
                  this.businessInfo()
              }
            })
      },
      businessInfo(){
        if(!this.loginCheck.isInformation){
          this.setEditWithMsg(true)
          this.setAlertBussMsg(true)
        }
      },
    },
    components: {
      vDetailView
    },
    watch: {
      'alertMsg': function(newVal,oldVal){
        if (newVal) {
          this.alertConfig.isModal = true
        } else{
          this.alertConfig.isModal = false
          this.businessInfo()
        }
      }
    }
  }
</script>

