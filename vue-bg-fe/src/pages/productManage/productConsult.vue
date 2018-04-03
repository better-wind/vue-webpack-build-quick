<template>
	<div>
	    <div class="title">
        <span >商品审核记录</span>
      </div>
    <div class="section-box">
      <div class="item-box">
        <div class="block-item">
          <span class="label-sign">当前选择类目</span>
          {{cateTitle}}
        </div>
      </div>
      <div class="item-box ">
        <div class="sub-title-box mg-b">
          基本信息
        </div>
        <div class="block-box base-box">
          <span class="label-sign"><span class="c-red">*</span>商品名称</span>
          <span>{{saveProductEdit.name}}</span>
        </div>
        <div class="block-box base-box label-float-layout">
          <div class="label-sign-wrap">
            <span class="label-sign"><span class="c-red">*</span>卖点文案</span>
          </div>
          <div class="inline-box" style="width: 600px">
            <span>{{saveProductEdit.sellingPoint}}</span>
          </div>
        </div>
        <div class="block-box base-box">
          <span class="label-sign"><span class="c-red">*</span>品牌</span>
          <span>{{saveProductEdit.brandId ? mapBrandList[saveProductEdit.brandId] : ''}}</span>
        </div>
        <template v-for="(item,idx) in goodsPropertyConfig.filter((item)=>item.propertyType == 1)">
          <div class="block-box property-box label-float-layout">
            <div class="label-sign-wrap">
              <span class="label-sign">{{item.propertyName}}</span>
            </div>
            <div class="inline-box">
              <span>{{item.select.join(',')}}</span>
            </div>

          </div>
        </template>
        <div class="block-box base-box">
          <span class="label-sign">发货地</span>
          <div class="inline-box" :style="{'width':'80%'}" v-if="shipAreaOptions.length > 0">
            <template v-for="(item,i) in shipAreaOptions">
              <span v-if="mapShipAreaOptions[item.deliverAreaId]">
                {{mapShipAreaOptions[item.deliverAreaId] + (i != shipAreaOptions.length-1 ? '，' : '')}}
              </span>
            </template>
          </div>
          <div class="inline-box" v-else="shipAreaOptions.length == 0">
            暂无发货地
          </div>
        </div>
        <template v-for="item in shipAreaOptions">
          <div class="block-box base-box" v-if="mapShipAreaOptions[item.deliverAreaId]">
            <span class="label-sign">配送地区({{mapShipAreaOptions[item.deliverAreaId]}})</span>
            {{item.deliverAreaTemplateId ? mapShipAreaTemp[item.deliverAreaTemplateId] : '全国发货'}}
          </div>

        </template>
      </div>

      <div class="item-box" v-if="goodsPropertyConfig.filter((item)=>item.propertyType == 3).length">
        <div class="sub-title-box mg-b">
          商品属性
        </div>
        <template v-for="(item,idx) in goodsPropertyConfig.filter((item)=>item.propertyType == 3)">
          <div class="block-box property-box label-float-layout">
            <div class="label-sign-wrap">
              <span class="label-sign">{{item.propertyName}}</span>
            </div>
            <div class="inline-box">
              <span>{{item.select.join(',')}}</span>
            </div>

          </div>
        </template>
      </div>
      <div class="item-box">
        <div class="sub-title-box mg-b">
          销售属性
        </div>
        <div class="item-table">
          <el-table :data="goodsSkuConfig" style="width: 100%;" >
            <el-table-column align="center" label="销售状态">
              <template slot-scope="scope" >
                <span v-if="scope.row.status == 1">可售</span>
                <span v-else class="c-red">停售</span>
              </template>
            </el-table-column>
            <el-table-column  prop="skuName" label="销售属性值"  align="center">
              <template slot-scope="scope">
                <span class="key-item">{{scope.row.skuName}}</span>
              </template>
            </el-table-column>
            <!--<el-table-column prop="barcode" align="center" label="商品条码" width="120">-->
            <!--</el-table-column>-->
            <el-table-column prop="grossWeight" align="center" label="毛重(g)" width="120">
            </el-table-column>
            <el-table-column prop="marketPrice" align="center" label="市场价" width="120">
            </el-table-column>
            <el-table-column prop="retailPrice" align="center" label="建议售价" width="120">
            </el-table-column>
            <el-table-column prop="costPrice" align="center" label="供货价(不含邮费)" width="120">
            </el-table-column>
            <template v-if="shipAreaOptions.length > 0" v-for="(item,i) in shipAreaOptions">
              <el-table-column align="center"
                               v-if="mapShipAreaOptions[item.deliverAreaId]"
                               :label="'发货编码('+mapShipAreaOptions[item.deliverAreaId]+')'"
                               width="120"
                               :key="i" >
                <template slot-scope="scope">
                  {{scope.row['code'+item.deliverAreaId]}}
                </template>
              </el-table-column>
            </template>

          </el-table>
        </div>
      </div>
      <div class="item-box" v-if="configSaleUnitImages.isRequiredImage">
        <div class="sub-title-box mg-b">
          SKU主图（销售属性项：{{configSaleUnitImages.skuImagePropertyName}}）
        </div>
        <div class="block-box c-dis">SKU主图：必填，分辨率640x640，文件小于400KB！</div>
        <div class="block-box" v-if="goodsPropertyConfig[configSaleUnitImages.idx]">
          <div class="inline-box mg-r" style="overflow: hidden" v-for="item in goodsPropertyConfig[configSaleUnitImages.idx].select">
            <span class="label-sign" style="display: inline-block;width: 60px;word-break:break-all;">{{item}}</span>
            <div class="avatar-wrap" >
              <template v-if="configSaleUnitImages.list[item]">
                <img :src="configSaleUnitImages.list[item].url" class="avatar">
                <div class="avatar-menu">
                  <i class="el-icon-search" @click="showProductImage(configSaleUnitImages.list[item].url)"></i>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <v-upload :uploadConfig="uploadConfig">
      </v-upload>

    </div>
	</div>
</template>
<script>
  import vUpload from '@/components/productManage/uploadImage'
  import {mapActions,mapState} from 'vuex'
  export default{
    created(){
      this.initView()
    },
    computed:{
      ...mapState(['productUpload'])
    },

    data:()=>({
      goodsId:'',
      goodsProperty:[],
      goodsSaleUnit:[],
      saveProductEdit:{
        name:'',
        sellingPoint:'',
        detail:'',
        brandId:''
      },
      cateTitle:'',
      configSaleUnitImages :{
        idx:'',
        isRequiredImage:false,
        skuImagePropertyNameId:'',
        list:{},
        saleUnitImages:[],
        currentSkuImage:''
      },
      uploadConfig:{
        detailConfig:{
          isShow:true, // 是否有详情
          editType:1,// 1 不可修改  2 可修改 3 弹框修改
        },
        imageConfig:{
          isShow:true, // 是否有主图
          editType:1, // 1不可修改 2可修改
        }
      },
      goodsPropertyConfig:[],
      goodsSkuConfig:[],
      goodsDetailFetch:{
          rs:{}
      },
      shipAreaOptions: [

      ],
      mapShipAreaOptions:{},
      mapShipAreaTemp:{},
      mapBrandList:{}
    }),
    methods:{
      ...mapActions(['getGoodsDeliver','sellerDelTempList',
        'getBaseGoodsAuditDetail','setViewImage','setProductUpload',
        'getBaseGoodsDetail','getCategoryPath','getBrandSearchList',
        'callSetNotice']),
      initView(){
        const query = this.$route.query
        this.goodsId = query.goodsId
        this.callGetProductDetail()
          .then(()=>{
            this.checkProperty()
          })
        this.getBrandSearchList()
          .then((rs)=>{
              rs.map((item)=>{
                  this.mapBrandList[item.id] = item.name
              })

          })
        this.sellerDelTempList()
          .then((rs)=>{
            rs.map((item)=>{
              this.$set(this.mapShipAreaTemp, item.id, item.desc);
            })
          })
        this.getGoodsDeliver()
          .then((rs)=>{
            rs.map((item)=>{
              this.$set(this.mapShipAreaOptions, item.code, item.name);
            })
          })
      },
      callGetProductDetail(){
        const _this = this
        return new Promise(function(resolve){
          _this.getBaseGoodsAuditDetail({baseGoodsId:_this.goodsId})
            .then((rs)=>{
              _this.goodsDetailFetch.rs = rs
              _this.initDetail(rs,resolve)
            })
        })
      },
      //详情初始化
      initDetail(rs,resolve){
        let _this = this
        _this.goodsProperty = rs.properties
        //详情销售单元
        _this.goodsSaleUnit = rs.skuArray
        //同步基本信息
        _this.saveProductEdit.name= rs.name
        _this.saveProductEdit.sellingPoint = rs.sellingPoint
        _this.saveProductEdit.brandId = rs.brandId

        _this.shipAreaOptions = rs.deliverAreas
//        _this.shipAreaOptions.map((item)=>{
//            _this.mapShipAreaOptions[item.deliverAreaId] = item.deliverAreaName
//        })
        //同步商品图片详情
        _this.saveProductEdit.detail = rs.detail
        _this.setProductUpload({detail:rs.detail,images:rs.images})
        if(rs.skuImages.length){
          _this.configSaleUnitImages = {
            idx:'',
            isRequiredImage:true,
            skuImagePropertyNameId:rs.skuImages[0].pnNameId,
            skuImagePropertyName:rs.skuImages[0].pnName,
            list:{},
            saleUnitImages:rs.skuImages
          }
        }
        //同步商品已选择类目
        _this.selectCategoryId = _this.selectCategoryId ? _this.selectCategoryId : rs.categoryId
        _this.getCategoryPath({categoryId:_this.selectCategoryId})
          .then((_rs)=>{
            _this.cateTitle = _rs.pathName.split(',').join(' > ')
          })
        resolve()
      },
      checkProperty(){
        //根据类目初始化
        this.mapCateProperty = {}
        this.goodsPropertyConfig = []
        this.goodsSkuConfig = []
        this.goodsProperty.map((item,idx)=>{
          let opts = {
              propertyName : item.propertyName,
              propertyNameId : item.propertyNameId,
              select:[],
              propertyType:item.propertyType
            }
          this.mapCateProperty[item.propertyNameId] = idx
          if(item.propertyPairs && item.propertyPairs.length){
            item.propertyPairs.map((subItem)=>{
              opts.select.push(subItem.pvName)
            })
          }
          this.goodsPropertyConfig.push(opts)
        })
        let saleUnit = this.goodsSaleUnit
//        console.log(this.goodsSaleUnit)
        saleUnit.map((item)=>{
            let arr = [];
            item.properties.map((subItem)=>{
              arr.push(subItem.pvName)
            })
            let _opts = {
              id:item.id,
              skuName:arr.length > 0 ? arr.join('-') : '默认',
              status:item.status,
              barcode:item.barcode,
              costPrice:item.costPrice/100,
              grossWeight:item.grossWeight,
              marketPrice:item.marketPrice/100,
              retailPrice:item.retailPrice/100,
              skuCode:item.skuCode
            }
            item.deliverAreas.map((area,i)=>{
              _opts['code'+area.deliverAreaId] = area.deliverCode
            })
            this.goodsSkuConfig.push(_opts)
          })


        this.configSaleUnitImages.idx = this.mapCateProperty[this.configSaleUnitImages.skuImagePropertyNameId]
        this.mapSKUImage()
      },
      mapSKUImage(){
        if(this.configSaleUnitImages.isRequiredImage){
          this.configSaleUnitImages.list = {}
          this.goodsPropertyConfig[this.configSaleUnitImages.idx].select.map((unit,u_idx)=>{
              let _propertyPairs = []
              this.goodsProperty.map((item)=>{
                if(item.propertyNameId == this.configSaleUnitImages.skuImagePropertyNameId){
                  _propertyPairs = item.propertyPairs
                }
              })
              let _pairsId = ''
              _propertyPairs.map((item)=>{
                if(item.pvName == unit){
                  _pairsId = item.id
                }
              })
              this.configSaleUnitImages.list[unit] = this.configSaleUnitImages.saleUnitImages.filter((item)=>item.propertyPairId == _pairsId)[0]
          })
        }
      },
      showProductImage(src) {
        const opts = {
          url:src,
          isShow:true
        }
        this.setViewImage(opts)
      },
      getToast(msg){
        const notice = {
          isShow:true,
          msg:msg,
        }
        this.callSetNotice(notice)
      },
    },
    components:{
      vUpload
    },
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
	.mg-r {
		span {
			text-align: right;
		}
	}
  .input-item-large{
    width: 300px;
  }
  .input-item-large-select{
    width: 280px;
  }
  .mg-b-h{
    margin: 0px 10px 0px 0px;
  }
  .avatar-wrap{
    position: relative;
    display: inline-block;
    width: 100px;
    height: 100px;
    margin-right: 5px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    .avatar {
      width: 100px;
      height: 100px;
    }
    .avatar-menu{
      position: absolute;
      display: none;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      top:0;
      right:0;
      background-color: rgba(0,0,0,.5);
      i{
        cursor: pointer;
        padding: 0 10px;
        font-size: 20px;
        color: #8c939d;
      }
    }
    &:hover{
      .avatar-menu{
        display: block;
      }
    }
  }
  .avatar-uploader{
    width: 100px;
    cursor: pointer;
    text-align: center;
    line-height: 100px;
    overflow: hidden;
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
    }

  }
  .property-box{
    position: relative;
    display: block;
    .inline-box{
      max-width: 85%;
    }
    .label-sign{
      width: 120px;
      text-align: right;
      padding-right: 5px;
    }
  }
  .property-layout-box{
    .label-sign{
      width: 120px;
      text-align: right;
      padding-right: 5px;
    }
  }
  .base-box{
    .label-sign{
      display: inline-block;
      width: 120px;
      text-align: right;
      padding-right: 5px;
    }
  }
  .block-box{
    padding: 10px 0;
  }
  .inline-box{
    margin-bottom: 0;
  }
  .label-float-layout{
    position: relative;
    overflow: hidden;
    .label-sign-wrap{
      float: left;
      .label-sign{
        display: inline-block;
        /*line-height: 30px;*/
      }
    }
  }
  .detail-wrap{
    width: 600px;
  }
  .show-check{
    margin-left: 20px;
    display: inline-block;
    font-size: 14px;
  }
</style>
