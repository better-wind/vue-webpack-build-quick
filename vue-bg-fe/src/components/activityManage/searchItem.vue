<template>
  <div class="section-item">
    <div class="search-item">
      <v-item :searchOption="searchOption" />
      <!--<div v-for="(item,index) in currentSearch.searchList.private" :style="item.split ? 'padding-right:0px' : ''" class="inline-item" >-->
        <!--<span v-if="item.label" class="name-item">{{item.label}}：</span>-->
        <!--<span v-else class="name-item" style="padding-left: 4px;color:#999;">-</span>-->
        <!--<el-select v-if="item.type=='select'" class="input-item-middle" size="small" v-model="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder">-->
          <!--<template v-for="subItem in item.options">-->
            <!--<el-option  :label="subItem.label" :value="subItem.value"></el-option>-->
          <!--</template>-->
        <!--</el-select>-->
        <!--<template v-if="item.type=='date-picker'">-->
          <!--<el-date-picker :picker-options="pickerOptions" type="datetime" class="input-item-middle-large" size="small" v-model="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder" v-if="item.checkPreDate" @change="checkDate(item.key,item.key,currentSearchQuery[item.checkPreDate],currentSearchQuery[item.key])"></el-date-picker>-->
          <!--<el-date-picker :picker-options="pickerOptions" type="datetime" class="input-item-middle-large" size="small" v-model="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder" v-else-if="item.checkNextDate"  @change="checkDate(item.key,item.checkNextDate,currentSearchQuery[item.key],currentSearchQuery[item.checkNextDate])"></el-date-picker>-->
          <!--<el-date-picker :picker-options="pickerOptions" type="datetime" class="input-item-middle-large" size="small" v-model="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder" v-else  @change="checkDate(item.key,'','','')" ></el-date-picker>-->
        <!--</template>-->
      <!--</div>-->

    </div>
  </div>
</template>
<script>
  import vItem from '@/components/searchManage/Item'
//  import Util from '../../assets/js/common/utils'
  import {mapState, mapActions} from 'vuex'
  export default {
    created (){
      this.initSearchItem()
    },
    data: () => ({
      searchOption: {
        page: '1',
        rows: '20',
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now();
        }
      },
    }),
    computed: {
      ...mapState(['currentSearch','currentSearchQuery'])
    },
    methods: {
      ...mapActions(['setCurrentSearchQuery']),
      initSearchItem() {
        this.currentSearchOption = Util.searchQuery(this.$route.query,this.currentSearch.searchList.public,this.currentSearch.searchList.private)
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
      }
    },
    components: {
      vItem
    }
  }
</script>
<style scoped lang='less' rel="stylesheet/less">
  .section-item{
    margin-bottom: 0;
    .input-item-middle-large{
      width: 180px;
    }
  }
</style>
