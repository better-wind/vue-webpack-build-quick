<template>
  <div class="inline-item cate-box" style="margin-bottom: 0;padding-top: 0;padding-bottom: 0">
    <template v-if="cateType == 'activity'">
      <div class="inline-box" style="margin-bottom: 0;margin-right: 20px">
          <span class="sign-name-item">{{categoryConfig.label}}：</span>
          <template v-for="(cate,idx) in categoryConfig.items">
            <el-select style="margin-right: 20px" @visible-change="visibleSelectLevel" @change="selectLevel(idx,'update')" v-if="cate.type =='select'" v-model="currentSearchQuery[cate.key]" class="input-item-middle" size="small"  :placeholder="cate.placeholder">
              <template v-for="subItem in levelList[idx].options">
                <el-option :label="subItem.name" :value="subItem.id"></el-option>
              </template>
            </el-select>
          </template>
        </div>
    </template>
    <template v-else v-for="item in currentSearch.searchList.public">
      <div v-if="item.type == 'cate'" class="inline-box" style="margin-bottom: 0;">
        <span class="sign-name-item">{{item.label}}：</span>
        <template v-for="(cate,idx) in item.items">
          <el-select style="margin-right: 20px" @visible-change="visibleSelectLevel" @change="selectLevel(idx,'update')" v-if="cate.type =='select'" v-model="currentSearchQuery[cate.key]" class="input-item-middle" size="small"  :placeholder="cate.placeholder">
            <template v-for="subItem in levelList[idx].options">
              <el-option :label="subItem.name" :value="subItem.id"></el-option>
            </template>
          </el-select>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
  import {mapActions,mapState} from 'vuex'
  export default{
    computed:{
      ...mapState(['currentSearch','currentSearchQuery'])
    },
    props:['categoryConfig'],
    created(){
      this.initView()
    },
    data:()=>({
      levelList:[
        {
          mapId:'0',
          key:'firstCategoryId',
          options:[]
        },
        {
          mapId:'1',
          key:'secondCategoryId',
          options:[]
        },
        {
          mapId:'2',
          key:'thirdCategoryId',
          options:[]
        },
        {
          mapId:'3',
          key:'fourthCategoryId',
          options:[]
        }
      ],
      visSelect:false,
      cateType:''
    }),
    methods:{
      ...mapActions(['getCateList','setCurrentSearchQuery','setStartToast']),
      initView(){
        if(this.categoryConfig){
            this.cateType = 'activity'
        }
        const query = this.$route.query
        this.callCateList(0)
          .then((rs)=>{
            rs.map((item)=>{
              item.id += ''
            })
            this.levelList[0].options = rs
          })
        this.levelList.map((item,idx)=>{
          let id = 0
          if(query[item.key]){
            id = query[this.levelList[idx].key]
            this.callCateList(id)
              .then((rs)=>{
                rs.map((item)=>{
                  item.id += ''
                })
                if(idx != 3){
                  this.levelList[idx+1].options = rs
                }
              })
          }
        })
      },
      callCateList(type){
        const _self = this;
        let id = type ? type : 0
        return new Promise(function(resolve){
          _self.getCateList({categoryId:id})
            .then((rs)=>{
              resolve(rs)
            })
        })
      },
      visibleSelectLevel(val){
        this.visSelect = true
      },
      selectLevel(idx,type){
        if(!this.visSelect || !this.currentSearchQuery[this.levelList[idx].key])
          return false
        this.callCateList(this.currentSearchQuery[this.levelList[idx].key])
          .then((rs)=>{
            let i = idx
            let keyList = []
            while(i < 3){
              i++
              this.levelList[i].options = []
              keyList.push(this.levelList[i].key)
            }
            this.setParams(keyList)
            idx < 3 ? this.levelList[idx+1].options = rs : ''
          })

      },
      setParams(list){
        let params = Object.assign({},this.currentSearchQuery)
        list.map((item)=>{
          params[item] = ''
        })
        this.setCurrentSearchQuery(params)
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .inline-item{
    .input-item-middle{
      width: 180px;
      margin-right: 10px;
    }
  }

</style>
