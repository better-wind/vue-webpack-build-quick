<!--订单搜索选项-->
<template>
  <div style="display: inline">
    <template  v-for="(item,index) in currentSearch.searchList.public">
      <div v-if="item.type" :class="[
      'inline-item',
      item.split ? 'inline-item-no-padding' : '',
      item.breakLine ? 'inline-item-margin-right' :''
      ]">
        <span v-if="item.label && !item.isSlot" class="sign-name-item">{{item.label}}：</span>
        <!--<span v-if="item.label" class="name-item">{{item.label}}：</span>-->
        <span v-else-if="!item.label" class="name-item" style="padding-left: 4px;color:#999;">-</span>
        <template v-if="item.type=='input'">
          <el-input v-if="item.width"  class="input-item-middle" :style="'width:'+item.width+'px'" size="small" v-model.trim="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder"></el-input>
          <el-input v-else class="input-item-middle" size="small" v-model.trim="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder"></el-input>
        </template>

        <el-select v-else-if="item.type=='select'" :filterable="item.filterable ? true : false" class="input-item-middle" size="small" v-model="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder">
          <template v-for="subItem in item.options">
            <el-option  :label="subItem.label" :value="subItem.value"></el-option>
          </template>
        </el-select>

        <template v-else-if="item.type == 'check-group'">
          <template v-for="subItem in item.items">
            <el-checkbox v-model="currentSearchQuery[subItem.key]">{{subItem.label}}</el-checkbox>
          </template>
        </template>
        <el-date-picker @change="checkDay(item.key)" v-else-if="item.type=='date-picker-date'" :picker-options="pickerOptions" type="date" class="input-item-middle" size="small" v-model="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder"></el-date-picker>
        <template v-else-if="item.type=='date-picker'">
      <el-date-picker :picker-options="pickerOptions" type="datetime" class="input-item-middle-large" size="small" v-model="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder" v-if="item.checkPreDate" @change="checkDate(item.key,item.key,currentSearchQuery[item.checkPreDate],currentSearchQuery[item.key])"></el-date-picker>
      <el-date-picker :picker-options="pickerOptions" type="datetime" class="input-item-middle-large" size="small" v-model="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder" v-else-if="item.checkNextDate"  @change="checkDate(item.key,item.checkNextDate,currentSearchQuery[item.key],currentSearchQuery[item.checkNextDate])"></el-date-picker>
      <el-date-picker :picker-options="pickerOptions" type="datetime" class="input-item-middle-large" size="small" v-model="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder" v-else  @change="checkDate(item.key,'','','')" ></el-date-picker>
    </template>
        <template v-if="item.isSlot">
          <slot :name="item.slotName"></slot>
        </template>
      </div>
    </template>


    <div v-for="(item,index) in currentSearch.searchList.private"  :class="['inline-item',item.split ? 'inline-item-no-padding' : '']" >
      <span v-if="item.label" class="name-item">{{item.label}}：</span>
      <span v-else class="name-item" style="padding-left: 4px;color:#999;">-</span>
      <el-input v-if="item.type=='input'" class="input-item-middle" size="small" v-model.trim="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder"></el-input>
      <el-select v-else-if="item.type=='select'" class="input-item-middle" size="small" v-model="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder">
        <template v-for="subItem in item.options">
          <el-option  :label="subItem.label" :value="subItem.value"></el-option>
        </template>
      </el-select>
      <template v-else-if="item.type=='date-picker'">
        <el-date-picker :picker-options="pickerOptions" type="datetime" class="input-item-middle-large" size="small" v-model="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder" v-if="item.checkPreDate" @change="checkDate(item.key,item.key,currentSearchQuery[item.checkPreDate],currentSearchQuery[item.key])"></el-date-picker>
        <el-date-picker :picker-options="pickerOptions" type="datetime" class="input-item-middle-large" size="small" v-model="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder" v-else-if="item.checkNextDate"  @change="checkDate(item.key,item.checkNextDate,currentSearchQuery[item.key],currentSearchQuery[item.checkNextDate])"></el-date-picker>
        <el-date-picker :picker-options="pickerOptions" type="datetime" class="input-item-middle-large" size="small" v-model="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder" v-else  @change="checkDate(item.key,'','','')" ></el-date-picker>
      </template>
    </div>
    <br>
  </div>
</template>
<script>
//  import Util from '../../assets/js/common/utils'
  import {mapState, mapActions} from 'vuex'
  export default {
    created (){
//        this.initSearchItem()
    },
    computed: {
      ...mapState(['currentSearch','currentSearchQuery'])
    },
    data: () => ({
      currentSearchOption: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now();
        }
      },
    }),
    methods: {
      ...mapActions(['setCurrentSearchQuery']),
      initSearchItem() {

//        this.currentSearchOption = Util.searchQuery(this.$route.query,this.currentSearch.searchList.public,this.currentSearch.searchList.private)
//        this.setCurrentSearchQuery(this.currentSearchOption)

        const params = this.$route.query
        for(let i in params){
          if(params[i] == 'true'){
            params[i] = true
          } else if(params[i] == 'false'){
            params[i] = false
          }
        }
        this.currentSearchOption = Util.searchQuery(params,this.currentSearch.searchList.public,this.currentSearch.searchList.private)
        this.setCurrentSearchQuery(this.currentSearchOption)
      },
      checkDate(key,nextkey,pre,cur) {
        let query = this.currentSearchQuery;
        query[key] = Util.formatDate('yyyy-mm-dd hh:mm:ss',query[key])
        if(pre && cur){
          pre = Util.formatDate('yyyy-mm-dd hh:mm:ss',pre)
          cur = Util.formatDate('yyyy-mm-dd hh:mm:ss',cur)
          if(Util.formatDateCom(pre,cur)){
            query[nextkey] = ''
          }
        }
        this.setCurrentSearchQuery(query)
      },
      checkDay(key) {
        let query = this.currentSearchQuery;
        query[key] = Util.formatDate('yyyy-mm-dd',query[key])
        this.setCurrentSearchQuery(query)
      }
    },
    watch: {
      '$route' (to, from) {
        if (to.fullPath !== from.fullPath) {
//          this.initSearchItem()
        }
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .inline-item-no-padding{
    padding-right:0px!important;
  }
  .inline-item-margin-right{
    margin-right: 200px!important;
  }
</style>
