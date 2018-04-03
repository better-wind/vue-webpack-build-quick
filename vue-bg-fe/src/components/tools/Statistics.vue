<!--统计数据列表-->
<template>
  <div class="sta-item">
    <div v-for="(item,index) in statisticsList.items" class="inline-item item-wrap">
      <div class="inline-item item-detail">
        <template v-if="item.type == 'click-export'">
          <div @click="callExportUnEmbraceCount" class="inline-item item cur-pt" v-bind:style="'width:'+statisticsList.configs.width">
            <template v-if="statisticsList.configs.sort == 'start'">
              <span class="val">{{item.val}}</span>
              <br />
              <span>{{item.label}}</span>
            </template>
            <template v-else>
              <span>{{item.label}}</span>
              <br />
              <span class="val">{{item.val}}</span>
            </template>
          </div>

        </template>
        <template v-else>
          <router-link v-if="item.router" :to="{path:item.router,query:item.query}" class="inline-item item cur-pt" tag="div" v-bind:style="'width:'+statisticsList.configs.width">
            <template v-if="statisticsList.configs.sort == 'start'">
              <span class="val">{{item.val}}</span>
              <br />
              <span>{{item.label}}</span>
            </template>
            <template v-else>
              <span>{{item.label}}</span>
              <br />
              <span class="val">{{item.val}}</span>

            </template>

          </router-link>
          <div v-else class="inline-item item" v-bind:style="'width:'+statisticsList.configs.width">
            <template v-if="statisticsList.configs.sort == 'start'">
              <span class="val">{{item.val}}</span>
              <br />
              <span>{{item.label}}</span>
            </template>
            <template v-else>
              <span>{{item.label}}</span>
              <br />
              <span class="val">{{item.val}}</span>
            </template>
          </div>
        </template>
      </div>

    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
export default {
  props: ['statisticsList'],
  methods: {
    ...mapActions(['exportUnEmbraceCount']),
    callExportUnEmbraceCount(){
      this.exportUnEmbraceCount()
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
  @import "../../assets/css/common/config";
  .sta-item{
    width: 1005px;
    margin: 0 auto;
    background-color: #f5f5f5;
    .inline-item{
      display: inline-block;
    }
    .item-wrap{
      padding: 10px 0;
      &:hover{
        background-color: #fff3f2;
      }
      .item-detail{
        box-sizing: border-box;
        border-left: 1px dashed #cccccc;
      }
      &:nth-child(1){
        .item-detail{
          border-left: none;
        }

      }
    }
    .item{
      padding: 20px 0;
      text-align: center;
      color:rgb(255,255,255);
      span{
        font-size: 16px;
        color:#666;
        &.val{
          font-size: 20px;
          color:#333;
        }
      }
    }
  }
</style>
