<template>
  <div>
    <div class="title">
      <span>批量设置商品毛重</span>
    </div>
    <div class="section">
      <div class="section-item">
        <p>批量设置商品毛重的流程：</p>
        <p style="text-indent: 1rem">1.完善表格内商品毛重信息；</p>
        <p style="text-indent: 1rem">2.选中并提交审核；</p>
        <p style="text-indent: 1rem">3.待审核通过后再行设置运费模版；</p>
      </div>
      <div class="pd-l">
        <p>当前未设置毛重信息的商品数量：{{productUnSetWeightAmount}}</p>
      </div>
      <div class="title-top">
        <div class="result-view" @scroll="onScroll($event)">
          <el-table :data="productList" ref="multipleTable" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="55" :selectable="selectable"></el-table-column>
            <template v-for="item in configProduct">
              <el-table-column v-if="item.type=='image'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                <template slot-scope="scope">
                  <div class="el-table-image">
                    <img :src="scope.row[item.key]" alt="">
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-else-if="item.type=='input'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                <template slot-scope="scope">
                  <div>
                    <el-input v-if="scope.row.grossWeightAuditStatus == 1" :disabled="true" class="input-item" v-model="scope.row[item.key]" size="small"></el-input>
                    <el-input v-else class="input-item" v-model="scope.row[item.key]" size="small"></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-else-if="item.type=='saleStatus'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                <template slot-scope="scope">
                  {{mapSaleStatus[scope.row[item.key]]}}
                </template>
              </el-table-column>
              <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>
            </template>
          </el-table>
        </div>
      </div>

      <div class="section-item pd-r" style="text-align: right">
        <el-button size="small" @click="callSaveWeight" type="primary">选中商品并提交审核</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    created (){
      this.initView()
    },
    data: ()=>({
      configProduct:[
        {
          label:'商品ID',
          key:'id',
          width:'',
        },
        {
          label:'商品主图',
          key:'image1',
          width:'',
          type:'image',

        },
        {
          label:'商品编码',
          key:'code',
          width:'',
        },
        {
          label:'商品名称',
          key:'name',
          width:'',
        },
        {
          label:'在售状态',
          key:'saleStatus',
          width:'',
          type:'saleStatus'
        },
        {
          label:'规格',
          key:'netVolume',
          width:'',
        },
        {
          label:'原毛重（克）',
          key:'grossWeight',
          width:'',
        },
        {
          label:'更新毛重（克）',
          key:'auditGrossWeight',
          width:'',
          type:'input'
        },
      ],
      productList:[],
      isLoading:false,
      isEnd:false,
      page:1,
      rows:20,
      isFirstLoad:true,
      mapSaleStatus:{
        0:"未出售",
        1:"出售中"
      },
      batchList:[],
      NoWeightAmount:0,
      productUnSetWeightAmount:0
    }),
    methods:{
      ...mapActions(['getProductWeightList','saveProductWeight','callSetNotice','getUnSetWeightAmount']),
      initView(){
        this.getUnSetWeightAmount()
          .then((rs)=>{
           this.productUnSetWeightAmount = rs
          })
        this.scrollPage()
      },
      selectable(row,id){
        let able = true
        if(row.grossWeightAuditStatus == 1)  {
          able = false
        }
        return able
      },
      handleSelectionChange(list){
        this.batchList = list;
      },
      callSaveWeight(){
        if(!this.batchList.length){
          this.getNotice('请选择要修改的商品')
          return false
        }
        const res = /^[1-9]{1}[0-9]*$/g;
        let grossWeightList = []
        for(let i in this.batchList){
          const item = this.batchList[i]
          if(!item.auditGrossWeight){
            this.getNotice('请填写第'+(Number(i)+1)+'个商品的修改毛重')
            return false
          }
          if(!item.auditGrossWeight.match(res)){
            this.getNotice('第'+(Number(i)+1)+'个商品的毛重格式不正确')
            return false
          }
          let opt = {
            sellerProductId:item.id,
            grossWeight:item.auditGrossWeight
          }
          grossWeightList.push(opt)
        }

//        console.log(grossWeightList)
        this.saveProductWeight({grossWeightList:grossWeightList})
          .then(()=>{
              this.getNotice('提交成功')
              this.initScroll()
              this.scrollPage()
          })
      },
      initScroll(){
        this.productList = []
        this.isLoading = false
        this.isEnd = false
        this.isFirstLoad = true
        this.page = 1
        this.rows = 20
        this.batchList = []
        this.$refs.multipleTable.clearSelection()
      },
//      addAmount(list){
//        list.map((item)=>{
//          if(!item.grossWeight){
//            this.NoWeightAmount++
//          }
//        })
//
//      },
      scrollPage(){
        const opt = {
          page:this.page,
          rows:this.rows
        }
        this.getProductWeightList(opt)
          .then((rs)=>{

            Array.prototype.push.apply(this.productList,rs.rows)
            this.productList.push({})
            this.productList.pop()
            let _this = this;
            let tt = setTimeout(function(){
              _this.isLoading = false
              _this.isFirstLoad = false
              clearTimeout(tt)
            },1000)

            if(rs.rows.length < this.rows){
                this.isEnd = true
            }
//            if(this.page > 5){
//              this.isEnd = true
//            }
          })
      },
      callScrollPage(){
        if(this.isEnd || this.isLoading){
          return false;
        }
        this.page++
        this.isLoading = true
        this.scrollPage()
      },
      onScroll(event){
        var offsetHeight = event.currentTarget.offsetHeight,
          scrollHeight = event.target.scrollHeight,
          scrollTop = event.target.scrollTop,
          scrollBottom = offsetHeight + scrollTop
          if(offsetHeight + scrollTop + 50 >= scrollHeight && !this.isFirstLoad){
            this.callScrollPage()
          }
      },
      getNotice(msg){
        const notice = {
          isShow:true,
          msg:msg,
        }
        this.callSetNotice(notice)
      }
    },
  }
</script>
<style lang='less' rel="stylesheet/less" scoped>

  .title-top{
    position: relative;
    padding-top: 40px;
    margin-top: 20px;
  }
  .result-view{
    height: 600px;
    overflow-y: scroll;
    .input-item{
      width: 80px;
    }
  }
</style>
