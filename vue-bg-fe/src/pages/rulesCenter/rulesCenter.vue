<template>
  <div>
    <div class="title">
      <span>规则中心</span>
    </div>
    <div class="section">
      <div class="nav-tab">
        <div class="tab-header">
          <template v-for="(item,idx) in tabRules">
            <span :class="idx == tanCurIdx ? 'tab-sign current' : 'tab-sign' " :ruleId="item.id" @click="changeTab(idx)">{{item.ruleName}}</span>
          </template>
        </div>
        <div class="tab-body">
          <template v-if="viewType == 'list'" >
            <template v-for="(item,idx) in rulesSubList">
              <div class="item-rule-name" @click="changeRuleView(idx)">
                {{idx + 1}}、{{item.ruleName}}
              </div>
            </template>
          </template>
          <template v-else-if="viewType == 'view'">
            <div class="rule-title">{{ruleViewDetail.ruleName}}</div>
            <div class="rule-content" v-html="ruleViewDetail.ruleContent"></div>
          </template>
        </div>
      </div>
      <div class="menu" v-if="viewType == 'view'">
        <el-button type="primary" @click="backPre()">返回上一级</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    name:'ruleCenter',
    created (){
      this.initView()
    },
    data: () => ({
      tabRules:[],
      tanCurIdx:0,
      rulesSubList:[],
      ruleViewDetail:{},
      viewType:'list',
      ruleFirstId:'',
      ruleSecondId:'',
      query:{},
    }),
    methods: {
      ...mapActions(['getRuleFirstList','getRuleList','getRuleDetail']),
      initView() {
          this.getRuleFirstList()
            .then((rs)=>{
              if(!rs.length)
                  return ;
              this.tabRules = rs
              this.query = this.$route.query
              let firstId = 0
              if(this.query.ruleFirstId){
                this.query.isView = true
                  for(let i in this.tabRules){
                      if(this.tabRules[i].id == this.query.ruleFirstId){
                        firstId = i
                      }
                  }
              }
              this.changeTab(firstId)
            })
      },
      //切换Tab
      changeTab(idx) {
        this.viewType = 'list'
        this.tanCurIdx = idx
        const ruleId = this.tabRules[idx].id
        this.ruleFirstId = ruleId
        this.callGetRuleList(ruleId)
      },
      //切换详情
      changeRuleView(idx) {
        this.viewType = 'view'
        const ruleId = this.rulesSubList[idx].id
        this.ruleSecondId = ruleId
        this.callGetRuleDetail(ruleId)
      },
      //二级规则列表
      callGetRuleList(id){
        const opts = {
          ruleFirstId:id
        }
        this.getRuleList(opts)
          .then((rs)=>{
            this.rulesSubList = rs
            if(this.query.id && this.query.isView){
              this.query.isView = false
              this.viewType = 'view'
              this.callGetRuleDetail(this.query.id)
            }
          })
      },
      //规则详情
      callGetRuleDetail(id){
        const opts = {
          ruleSecondId:id
        }
        this.getRuleDetail(opts)
          .then((rs)=>{
            this.ruleViewDetail = rs
//            console.log(this.ruleViewDetail)
          })

      },
      //返回上一级
      backPre(){
        this.viewType = 'list'
      },
    }
  }
</script>
<style scoped lang='less' rel="stylesheet/less">
  .nav-tab{
    margin: 20px;
    border:1px solid #e0e0e0;
    .tab-header{
      background-color: #eeeeee;
    }
    .tab-sign{
      display: inline-block;
      /*width: 100px;*/
      padding:0 20px;
      line-height: 40px;
      text-align: center;
      font-size: 18px;
      /*color: #999;*/
      /*border:1px solid rgb(246, 239, 238);*/
      /*border-radius: 5px;*/
      cursor: pointer;
      &.current{
        color: #fb4b4d;
        background-color: #fff;
      }
    }
    .tab-body{
      min-height: 600px;
      padding: 20px;
      .rule-title{
        text-align: center;
        font-size: 20px;
        margin-bottom: 20px;
      }
      .item-rule-name{
        padding: 10px 0 0 20px;
        &:hover{
          text-decoration: underline;
        }
        cursor: pointer;
        /*font-weight: bold;*/
      }
    }
  }
  .menu{
    text-align: center;
    padding: 20px 0;
  }
</style>
