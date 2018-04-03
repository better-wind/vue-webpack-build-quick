<template>
  <div style="display: inline">
    <div class="inline-item">
      <span class="sign-name-item" v-if="categoryConfig.label.items[0]">{{categoryConfig.label.items[0]}}</span>
      <el-select class="input-item-middle" :disabled="disabledEdit" v-model="levelOneList.value" @visible-change="visibleSelectLevel" @change="selectLevel('levelOneList','update')" size="small">
        <template v-for="item in levelOneList.options">
          <el-option  :label="item.label" :value="item.value"></el-option>
        </template>
      </el-select>
    </div><div class="inline-item">
      <span class="sign-name-item" v-if="categoryConfig.label.items[1]">{{categoryConfig.label.items[1]}}</span>
      <el-select class="input-item-middle" :disabled="disabledEdit" v-model="levelTwoList.value" @visible-change="visibleSelectLevel" @change="selectLevel('levelTwoList','update')" size="small">
        <template  v-for="item in levelTwoList.options">
          <el-option  :label="item.label" :value="item.value"></el-option>
        </template>
      </el-select>
    </div><div class="inline-item">
      <span class="sign-name-item" v-if="categoryConfig.label.items[2]">{{categoryConfig.label.items[2]}}</span>
      <el-select class="input-item-middle" :disabled="disabledEdit" v-model="levelThreeList.value" @visible-change="visibleSelectLevel"  @change="selectLevel('levelThreeList','update')" size="small">
        <template v-for="item in levelThreeList.options">
          <el-option  :label="item.label" :value="item.value"></el-option>
        </template>
      </el-select>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    computed: {
      ...mapState(['currentSearch','categoryAll','currentSearchQuery','categoryList','clearSelect'])
    },
    props:['categoryConfig','categoryDetail','cateIdx','disabledEdit'],
    created (){
      if(this.categoryAll.levelOneList){
        this.setCategory();
      }else{
        this.getCategoryAll()
          .then(() =>{
            this.setCategory();
          })
      }
    },
    data: () => ({
      visSelect:false,
      levelOneList:{
        value:'',
        options:[],
        level:'firstCategoryId',
        nextKey:'levelTwoList'
      },
      levelTwoList:{
        value:'',
        options:[],
        level:'secondCategoryId',
        nextKey:'levelThreeList',
      },
      levelThreeList:{
        value:'',
        options:[]
      },
    }),
    methods: {
      ...mapActions(['setSearch','getCategoryAll','setCurrentSearchQuery','setCategoryList','setClearSelect']),
      setCategory() {
        this.levelOneList.options = this.getCategoryItem(this.categoryAll.levelOneList)
        this.updateCategory();
      },
      updateCategory(){
          if(this.categoryConfig.type == 'search'){
//              const query = this.$route.query
              const query = this.currentSearchQuery
              if(query.levelOne){
                  this.levelOneList.value = Number(query.levelOne)
              }
              if(query.levelTwo){
                this.selectLevel('levelOneList','reset')
                this.levelTwoList.value = Number(query.levelTwo)
              }
              if(query.levelThree){
                  this.selectLevel('levelTwoList','reset')
                  this.levelThreeList.value = Number(query.levelThree)
              }
          }
          else{
              if(this.categoryDetail.categoryFirstId){
                  this.levelOneList.value = Number(this.categoryDetail.categoryFirstId)
              }
              if(this.categoryDetail.categorySecondId){
                  this.selectLevel('levelOneList','reset')
                  this.levelTwoList.value = Number(this.categoryDetail.categorySecondId)
              }
              if(this.categoryDetail.categoryThirdId){
                  this.selectLevel('levelTwoList','reset')
                  this.levelThreeList.value = Number(this.categoryDetail.categoryThirdId)
              }
          }
      },
      getCategoryItem(rs,id,level) {
        let opts=[];
        rs.forEach((item,idx) => {
          let opt = null
          if(id){
            if(id == item[level]){
              opt = {
                value:item.id,
                label:item.name
              }
            }
          }
          else{
            opt = {
              value:item.id,
              label:item.name
            }
          }
          if(opt){
            opts.push(opt);
          }

        })
        return opts;
      },
      visibleSelectLevel(val){
        this.visSelect = true
      },
      selectLevel(item,type) {
        if(type == 'update' && this.visSelect) {
          if(item == 'levelOneList'){
            this.levelTwoList.value = ''
            this.levelThreeList.value = ''
          } else if (item == 'levelTwoList') {
            this.levelThreeList.value = ''
          }
          const curCategory = this[item];
          if(curCategory.value){
            if(curCategory.nextKey){
              let nextList =  this.getCategoryItem(this.categoryAll[curCategory.nextKey],curCategory.value,curCategory.level)
              this[curCategory.nextKey].options = nextList
            }
            if(this.categoryConfig.type == 'search'){
              this.mapSeachQuery()
            } else{
              this.mapCateList()
            }

          }
        }
        if(type == 'reset'){
          const curCategory = this[item];
          if(curCategory.value){
            if(curCategory.nextKey){
              let nextList =  this.getCategoryItem(this.categoryAll[curCategory.nextKey],curCategory.value,curCategory.level)
              this[curCategory.nextKey].options = nextList
            }
          }
        }

      },
      mapCateList(){
        let cateList = this.categoryList,
             idx = this.cateIdx;
          if(this.levelOneList.value){
              cateList[idx].categoryFirstId = this.levelOneList.value
          }
          if(this.levelTwoList.value){
              cateList[idx].categorySecondId = this.levelTwoList.value
          }
          if(this.levelThreeList.value){
              cateList[idx].categoryThirdId = this.levelThreeList.value
          }
        this.setCategoryList(cateList)
      },
      mapSeachQuery(){
        let query = this.currentSearchQuery
        query.levelOne = this.levelOneList.value
        query.levelTwo = this.levelTwoList.value
        query.levelThree = this.levelThreeList.value
        this.setCurrentSearchQuery(query);
      },
    },
    watch: {
      'clearSelect.isClear': function(newVal,oldVal){
        if (newVal) {
            if(this.categoryConfig.type == 'search'){
              this.levelOneList.value = ''
              this.levelTwoList.value = ''
              this.levelTwoList.options= []
              this.levelThreeList.value = ''
              this.levelThreeList.options = []
              this.setClearSelect({isClear:false})
            }
        }
      }
    }
  }
</script>
