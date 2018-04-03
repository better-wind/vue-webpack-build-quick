<template>
  <div class="inline-item">
    <template v-for="(item,index) in currentSearch.searchMenu.public">
      <el-button v-if="item.type == 'submit'" v-bind:type="item.style" @click="submit()">{{item.label}}</el-button>
      <el-button v-if="item.type == 'reset'" v-bind:type="item.style" @click="reset()">{{item.label}}</el-button>
    </template>
   </div>
</template>
<script>
//  import Util from '../../assets/js/common/utils'
  import {mapState, mapActions} from 'vuex'
  export default {
    computed: {
      ...mapState(['currentSearch', 'currentSearchQuery'])
    },
    methods: {
      ...mapActions(['setCurrentSearchQuery']),
      submit() {
        let query = {}
        for(let i in this.currentSearchQuery){
            if(i == 'page'){
                query[i] = 1
            } else {
                query[i] = this.currentSearchQuery[i]
            }
        }
        this.$router.push({
          path: this.$route.path,
          query: Object.assign({},query,{t:new Date().getTime()})
        })
      },
      reset() {
        const searchOption = Util.resetQuery(this.currentSearch.searchList.public,this.currentSearch.searchList.private)
        this.setCurrentSearchQuery(searchOption);
      }
    },
    components: {

    }
  }
</script>
