<template>
  <div class="section" v-if="dataReady">
    <div class="section-item">
      <div class="msg-header primary-bg">
        {{msgDetail.theme}} <span class="fl-r pd-r">{{msgDetail.createTime}}</span>
      </div>
      <div class="msg-body" v-html="msgDetail.content">
      </div>
    </div>
    <div v-if="msgDetail.attachmentList.length" class="section-item ">
      <div class="msg-header primary-bg">
        附件({{msgDetail.attachmentList.length}})
      </div>
      <div class="msg-body">
        <p class="msg-p-content" v-for="item in msgDetail.attachmentList">
          《{{item.name}}》
          <a :href="item.url" target="_blank">下载</a>
        </p>
      </div>
    </div>
    <!--&& msgDetail.feedbackList-->
    <div v-if="msgDetail.feedback" class="section-item">
      <template v-if="msgDetail.feedbackList && msgDetail.feedbackList.length">
        <div class="msg-header primary-bg">
          反馈
        </div>
        <div class="msg-body" >
          <div v-for="item in msgDetail.feedbackList">
            <p class="msg-p-content" v-if="item.content">商家反馈内容：{{item.content}}</p>
            <p class="msg-p-content" v-if="item.replyContent">平台回复：{{item.replyContent}}</p>
          </div>
        </div>
      </template>
      <div class="msg-body" v-if="detailConfig.type=='alert'">
        <el-input type="textarea" v-model="feedOpts.content" :rows="feedRows" placeholder="请填写反馈内容" resize="none"></el-input>
        <!--<el-button  style="margin-top: 10px" @click="submitFeed()">提交反馈</el-button>-->
      </div>
    </div>
    <div class="menu mg-t">
      <template v-if="detailConfig.type=='view'">
        <el-button v-if="msgDetail.feedback" @click="feedBack()">反馈问题</el-button>
        <el-button type="primary" @click="backCenter()">返回消息中心</el-button>
      </template>
      <template v-else-if="detailConfig.type=='alert'">
        <template v-if="msgDetail.forceRead == 0">
          <el-button  type="primary" @click="readMsg()">已读</el-button>
        </template>
        <template v-else-if="msgDetail.forceRead == 1">
          <el-button v-if="alertRead.isTimeOut">已读({{alertRead.readTime}})</el-button>
          <el-button v-else type="primary" @click="readMsg()">已读</el-button>
        </template>

      </template>

    </div>
    <div class="modal">
      <el-dialog size="tiny" title="提交反馈" :visible.sync="feedConfig.isModal">
        <div>
          <el-input type="textarea" v-model="feedOpts.content" :rows="feedRows" placeholder="请填写反馈内容" resize="none"></el-input>
        </div>
        <div class="dialog-menu">
          <el-button size="small" @click="submitFeed()">提交反馈</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    name:'messageDetail',
    created(){
      this.initView()
    },
    props:['detailConfig'],
    computed: {
      ...mapState(['msgDetail'])
    },
    data: () => ({
      feedRows:6,
      dataReady:false,
      alertRead:{
        readTime:3,
        isTimeOut:true
      },
      feedOpts:{
        content:''
      },
      feedConfig:{
        isModal:false,
      }
    }),
    methods: {
      ...mapActions(['getMsgDetail',,'getAlertMsg','feedBackMsg','readAlertMsg','callSetNotice','demoReadAction']),
      initView(){
        if(this.detailConfig.type=='view'){
          const opts = {
            messageId:this.$route.query.messageId
          }
          this.getMsgDetail(opts)
            .then((rs)=>{
              this.dataReady = true
            })
        }
        else {
          this.dataReady = true
          this.setReadTime()
        }
      },
      setReadTime(){
        let self = this;
        self.alertRead.readTime = this.msgDetail.forceReadTime
        let readInter = setInterval(function(){
          if(self.alertRead.readTime<2){
            self.alertRead.isTimeOut = false
            clearInterval(readInter)
          }
          self.alertRead.readTime --;
        },1000)
      },
      feedBack(){
        this.feedConfig.isModal = true
      },
      submitFeed(){
        const opts = {
          messageId:this.msgDetail.id,
          content:this.feedOpts.content
        }
        if(!opts.content){
            this.getNotice('请输入反馈内容')
            return false
        }
        this.feedBackMsg(opts)
          .then(()=>{
            this.feedOpts.content=''
            this.feedConfig.isModal = false
            this.initView()
          })
      },
      backCenter(){
        this.$router.push({
          path: '/message/center',
        })
      },
      readMsg(){
        const opts = {
          messageId:this.msgDetail.id
        }
        if(this.feedOpts.content){
          this.submitFeed()
        }
        this.readAlertMsg(opts)
      },
      getNotice(msg){
        const notice = {
          isShow:true,
          msg:msg,
        }
        this.callSetNotice(notice)
      },
    }
  }
</script>
<style scoped lang='less' rel="stylesheet/less">
  .section-item{
    padding:20px 10px 0;
  }
  .msg-header{
    font-size: 18px;
    line-height: 50px;
    padding-left: 20px;
  }
  .msg-body{
    padding: 20px;
    border:1px solid #eee;
  }
  .msg-p-content{
    margin-bottom: 10px;
  }
  .menu{
    text-align: center;
  }
  .dialog-menu{
    margin-top: 20px;
    text-align: center;
  }
</style>
