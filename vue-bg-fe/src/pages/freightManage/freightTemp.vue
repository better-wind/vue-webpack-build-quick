<!--运费模板-->
<template>
  <div>
    <div class="title">
      <span>运费模板管理</span>
    </div>
    <div class="section">
      <div class="section-item">
        <p class="pd-r">
          运费模版即运费结算的计算规则，包含每订单运费和按重量计价的两种计算规则；<br>
          <span class="pd-l">1.每订单运费为单笔订单（不计订单内商品数量、重量）按固定金额结算运费成本；</span><br>
          <span class="pd-l">2.按重量计价则根据订单内包含的商品重量、包裹收货地区、发货物流方式计算运费成本，因此按重量计价需要先完善所有商品的毛重信息！</span><br><br>
          注意：运费结算类型默认为每订单运费，您若想使用按重量计价方式结算运费成本，请先通过右侧“批量设置商品毛重”入口设置商品毛重，待审核通过后，所有商品均具备毛重信息后，方能使用按重量计价的运费模版！
        </p>
      </div>
      <div class="section-item pd-r" style="text-align: right">
        <router-link v-if="newGoods" tag="span" to="/product/weight/sale">
          <el-button type="primary">设置商品毛重</el-button>
        </router-link>
        <router-link v-else tag="span" to="/product/weight">
          <el-button type="primary">设置商品毛重</el-button>
        </router-link>

      </div>
      <div class="section-item">
        <div class="temp-item" v-for="(item,idx) in freightTempList">
          <div class="temp-title o-h">
            <span>发货地：{{item.sendAddress}}</span>
            <div class="fl-r">
              <!--<span v-if="item.auditStatus == 1" style="color: #fb4b4d">当前存在待审核的该发货地运费模版修改申请</span>-->
              <!--<span v-if="item.auditStatus == 3" style="color: #fb4b4d">当前存在未通过的该发货地运费模版修改申请</span>-->
              <el-button size="small" v-if="item.auditStatus == 2 || !item.auditStatus" @click="toDetailTemp(item.sellerId)" type="primary">修改</el-button>
              <el-button size="small" v-else type="primary" @click="callGetTempDetail(item)">查看</el-button>
            </div>
          </div>
          <div class="temp-msg pd-l">
            <p v-if="item.freightSubmitType == 2"><span>运费模版名称：</span>【{{item.name ? item.name : item.sendAddress + '运费模板'}}】</p>
            <p><span>运费模版类型：</span>{{mapFreightSubmitType[item.freightSubmitType]}}</p>
            <p v-if="item.freightSubmitType == 1"><span>每订单运费：</span>{{item.freight}}元／单</p>
          </div>
          <div class="result-view" v-if="item.freightSubmitType == 2">
            <v-temp-table :expressList="item.expressList" :areaPriceKey="'areaPriceList'"></v-temp-table>
          </div>
        </div>
      </div>

    </div>
    <el-dialog :visible.sync="tempDetail.isShow" size="large">
      <div class="dialog-view">
        <div class="section-item">
          <div class="temp-item">
            <div class="temp-msg">
              <p><span>状态：</span>{{mapStatus[tempItem.status]}}</p>
              <p><span>发货地：</span>{{tempItemDetail.sendAddress}}</p>
              <p v-if="tempItem.freightSubmitTypeNew == 2"><span>运费模版名称：</span>【{{tempItem.templateName}}】</p>
              <p><span>调整原因：</span>{{tempItem.reason}}</p>
              <p><span>申请更改的运费模版：</span><template v-if="tempItem.freightSubmitTypeNew == 1">每订单运费：{{tempItem.freightNew}}元／单</template></p>
            </div>
            <div class="result-view" v-if="tempItem.freightSubmitTypeNew == 2">
              <v-temp-table :expressList="tempItem.templateExpressList" :areaPriceKey="'templateAreaPriceList'"></v-temp-table>
            </div>
          </div>
        </div>
        <div class="menu" style="text-align: right">
          <el-button v-if="tempItem.status == 1" @click="cancelAudit(tempItem.sellerId,tempItem.id)"  type="primary" size="small">撤销审核</el-button>
          <el-button v-else-if="tempItem.status == 3" @click="againAudit(tempItem.sellerId)" type="primary" size="small">重新审核</el-button>
          <el-button v-else-if="tempItem.status == 4" :disabled="true" type="primary" size="small">待生效</el-button>
          <el-button @click="cancelView" size="small">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import vTempTable from '@/components/freightManage/tempTable'

  import {mapState, mapActions} from 'vuex'
  export default {
    created(){
      this.initView()
    },
    computed:{
      ...mapState(['newGoods'])
    },
    data: ()=>({
      mapFreightSubmitType:{
        1:'每订单运费',
        2:'按重量、配送区域计价'
      },
      mapAuditStatus:{
        1:"待审核",
        2:"审核通过",
        3:"审核不通过",
      },
      tempDetail:{
        isShow:false
      },
      tempItemDetail:{},
      tempItem:{},
      mapStatus:{
        1:"待审核",
        2:"审核通过",
        3:"审核不通过"
      },
      freightTempList:[]
    }),
    methods:{
      ...mapActions(['getFreightTempList','getFreightAudit','cancelFreightAudit']),
      initView(){
         this.getFreightTempList()
           .then((rs)=>{
             this.setList(rs)
           })
      },
      setList(rs){
          this.freightTempList = rs
//         console.log(this.freightTempList)
      },
      callGetTempDetail(item){
        const opt = {
          shipAddress:item.sellerId
        }
        this.tempItemDetail = {
          name:item.name,
          sendAddress:item.sendAddress
        }
        this.getFreightAudit(opt)
          .then((rs)=>{

            this.tempItem = rs
            this.tempDetail.isShow = true
          })

      },
      cancelView(){
        this.tempDetail.isShow = false
        this.tempItem = {}
      },
      cancelAudit(sellerId,id){
        const opt = {
          shipAddress:sellerId,
          auditItemId:id
        }
        this.$confirm('撤销审核状态将变为审核不通过', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.cancelFreightAudit(opt)
            .then(()=>{
              this.cancelView()
            })
        }).catch(() => {
        });

      },
      againAudit(id){
        this.cancelView()
        this.toDetailTemp(id)
      },
      toDetailTemp(id){
        this.$router.push({
          path: '/edit/freight',
          query: {
            shipAddress:id,
          }
        })
      }
    },
    components: {
      vTempTable
    }
  }


</script>
<style lang='less' rel="stylesheet/less" scoped>
  .temp-item{
    margin: 20px 20px 20px 0;
    padding: 20px 10px;
    border-radius: 5px;
    border: 1px solid #eeeeee;
    .temp-title{
      >span{
        font-size: 20px;
      }

    }
    .temp-msg{
      p{
        margin: 10px 0;
        >span{
          display: inline-block;
          width: 120px;
        }
      }

    }
    .result-view{
      margin-top: 20px;
    }
  }
  .dialog-view{
    .section-item{
      padding: 0;
    }
    .temp-item{
      margin: 0;
      padding: 0;
      border:none
    }
    .temp-msg{
      p{
        margin: 10px 0;
        >span{
          display: inline-block;
          width: 140px;
        }
      }
    }
  }


</style>
