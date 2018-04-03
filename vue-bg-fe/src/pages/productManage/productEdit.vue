<template>
  <div>
    <div class="title">
      <span v-if="editType == 'new'">新建商品</span>
      <span v-else>商品编辑</span>
      <template v-if="editType == 'new'">
        <div class="copy-wrap">
          <el-input  placeholder="商品ID" class="input-item" v-model="copyProductId" size="small"></el-input>
          <el-button size="small"  type="primary" @click="copyProduct()">复制</el-button>
        </div>

      </template>
    </div>
    <div class="section">
      <div v-if="productDetail.status == 3 && productCheckContent" class="section-item" style="padding-top: 0">
        <div class="block-item">
          审核未通过原因:{{productDetail.checkContent}}
        </div>
      </div>
      <div class="block-item mg-l mg-t primary-color">
        <span>星号为必填写项，其他项根据产品特性选择性特写</span>
      </div>
      <div class="section-item" v-for="item in productConfig.items">

        <div class="section-title">
          <span>{{item.title}}</span>
        </div>
        <div class="block-item" v-for="subItem in item.items">
          <div class="section-item-sign-wrap" style="margin-right: 4px" v-if="subItem.position">
            <span v-if="subItem.type=='cate'" class="section-item-sign section-item-sign-padding">
              <span v-if="subItem.required" class="sign-required">*</span>{{subItem.label}}：
            </span>
            <span v-else class="section-item-sign">
              <span v-if="subItem.required" class="sign-required">*</span>{{subItem.label}}：
            </span>
          </div>
          <span v-else class="section-item-sign">
            <span v-if="subItem.required" class="sign-required">*</span>{{subItem.label}}：
          </span>
          <template v-if="subItem.type=='cate'">
            <div class="inline-item">
              <div v-for="(cateItem,cateIdx) in categoryList">
                <v-cate :disabledEdit="disabledEdit" :categoryDetail="cateItem" :cateIdx="cateIdx" :categoryConfig="categoryConfig"/>
                <el-button type="primary"  :disabled="disabledEdit" @click="addCate()" size="small">增加</el-button>
                <el-button size="small" :disabled="disabledEdit" @click="addDel(cateIdx)">删除</el-button>
              </div>
            </div>
          </template>
          <template v-for="subSubItem in subItem.items">
            <el-input v-if="subSubItem.type == 'input'" :style="subSubItem.width ? 'width:'+subSubItem.width+'px' : ''" :disabled="disabledEdit" v-model="productEdit.sellerProduct[subSubItem.key]" :placeholder="subSubItem.placeholder" class="input-item-large" size="small"></el-input>
            <el-input v-else-if="subSubItem.type == 'input-house'" :maxlength="subSubItem.maxlength ? subSubItem.maxlength : 1000 " :style="subSubItem.width ? 'width:'+subSubItem.width+'px' : ''" :disabled="disabledEdit || disabledHouse" v-model="productEdit.sellerProduct[subSubItem.key]" :placeholder="subSubItem.placeholder" class="input-item-large" size="small"></el-input>
            <el-input v-else-if="subSubItem.type == 'input-whole'" :disabled="wholesalePriceConfig.disabledEdit" v-model="productEdit.sellerProduct[subSubItem.key]" :placeholder="subSubItem.placeholder" class="input-item-large" size="small"></el-input>
            <el-input v-else-if="subSubItem.type == 'textarea'" :maxlength="subSubItem.maxlength ? subSubItem.maxlength : 1000 " :rows="6" resize="none" :disabled="disabledEdit" v-model="productEdit.sellerProduct[subSubItem.key]" :placeholder="subSubItem.placeholder" type="textarea"  class="area-item-large" size="small"></el-input>
            <el-select v-else-if="subSubItem.type == 'select'" :disabled="disabledEdit" v-model="productEdit.sellerProduct[subSubItem.key]" :placeholder="subSubItem.placeholder" class="input-item" size="small" >
              <template v-for="optionItem in subSubItem.options">
                <el-option  :label="optionItem.label" :value="optionItem.value"></el-option>
              </template>
            </el-select>
            <el-select v-else-if="subSubItem.type == 'select-filterable'" filterable  :disabled="disabledEdit" v-model="productEdit.sellerProduct[subSubItem.key]" :placeholder="subSubItem.placeholder" class="input-item" size="small" >
              <template v-for="optionItem in subSubItem.options">
                <el-option  :label="optionItem.label" :value="optionItem.value"></el-option>
              </template>
            </el-select>
            <el-select v-else-if="subSubItem.type == 'select-freight'" :disabled="disabledEdit || (editType == 'edit' && (productDetail.productSourceSellerId > 0 ? true : false))" @change="selectFreight" v-model="productEdit.sellerProduct[subSubItem.key]" :placeholder="subSubItem.placeholder" class="input-item" size="small" >
              <template v-for="optionItem in subSubItem.options">
                <el-option  :label="optionItem.label" :value="optionItem.value"></el-option>
              </template>
            </el-select>
            <template v-else-if="subSubItem.type == 'freightMsg'">
              <span v-if="!isSelectFreight">请选择发货地</span>
              <span v-else :class="disabledEdit ? 'disabled-color' : ''">
                <span v-if="productFreightTemplate.freightTemplateName">【{{productFreightTemplate.freightTemplateName}}】</span>
                <span v-if="productFreightTemplate.freightSubmitType == 2">
                  (按重量、配送区域计价)
                </span>
                <span v-else-if="productFreightTemplate.freightSubmitType == 1">
                  (每订单运费{{productFreightTemplate.freight}}元)
                </span>
                <a v-if="!disabledEdit " href="/#/freight/temp" target="_blank">
                  <el-button class="sub-button-small" type="primary"  size="small">更改运费模板</el-button>
                </a>
              </span>

            </template>

            <!--<el-date-picker :editable="false" v-else-if="subSubItem.type == 'date-picker'":disabled="disabledEdit" @change="checkDate(subSubItem.key,'detail')" v-model="productEdit.sellerProduct[subSubItem.key]" type="date" class="input-item" size="small"  :placeholder="subSubItem.placeholder"></el-date-picker>-->

            <el-date-picker v-else-if="subSubItem.type == 'date-picker'":disabled="disabledEdit" :editable="false" @change="checkDate(subSubItem.key,'detail')" v-model="productEdit.sellerProduct[subSubItem.key]" type="date" class="input-item" size="small"  :placeholder="subSubItem.placeholder"></el-date-picker>

            <template v-else-if="subSubItem.type == 'button'">
              <template v-if="subSubItem.editType == 'edit-whole'" >
                <template  v-if="wholesalePriceConfig.disabledApple">
                  <el-button class="sub-button-small" v-if="subSubItem.name == 'checkWholesaleAudit'"  @click="checkWholesaleAudit()" :type="subSubItem.style"  size="small">{{subSubItem.placeholder}}</el-button>
                  <el-button class="sub-button" v-else-if="subSubItem.name == 'callGetWholesale'"  @click="callGetWholesale()" :type="subSubItem.style"  size="small">{{subSubItem.placeholder}}</el-button>
                </template>
              </template>
              <template v-else>
                <a v-if="!disabledEdit && subSubItem.name == 'managerDeliverAreaTemplateId'" href="/#/distribution/template" target="_blank">
                  <el-button class="sub-button" :type="subSubItem.style"  size="small">{{subSubItem.placeholder}}</el-button>
                </a>
                <a v-if="!disabledEdit && subSubItem.name == 'managerFreightTemplateId'" href="/#/delivery/area" target="_blank">
                  <el-button class="sub-button-small" :type="subSubItem.style"  size="small">{{subSubItem.placeholder}}</el-button>
                </a>
                <!--<el-button v-if="!disabledEdit && subSubItem.name == 'managerDeliverAreaTemplateId'" @click="managerDeliverAreaTemplateId()" :type="subSubItem.style"  size="small">{{subSubItem.placeholder}}</el-button>-->
                <!--<el-button v-if="!disabledEdit && subSubItem.name == 'managerFreightTemplateId'" @click="managerFreightTemplateId()" :type="subSubItem.style"  size="small">{{subSubItem.placeholder}}</el-button>-->
              </template>
            </template>
            <span v-else-if="subSubItem.type == 'sign-tip'" style="color:#9e9e9e">
              <span v-if="subSubItem.layout == 'br'" style="display:block;margin-left: 104px;padding-top: 10px">
                <span>{{subSubItem.label}}</span>
              </span>
              <span v-else style="display:inline-block">
                <span style="margin-left: 20px">{{subSubItem.label}}</span>
              </span>
            </span>

          </template>
        </div>
      </div>
      <div class="section-item">
        <div class="section-title">
          <span>图片信息</span>
        </div>
        <div class="block-item">
          <div slot="tip" v-if="!disabledEdit" class="el-upload__tip">商品主图：2至5张主图,分辨率640x640,文件小于400KB！</div>
          <div class="avatar-wrap" v-for="(item,idx) in productImgList">
            <img :src="item" class="avatar">
            <div class="avatar-menu" v-if="!disabledEdit">
              <i class="el-icon-search" @click="showProductImage(item)"></i>
              <i class="el-icon-delete" @click="delProductImage(idx)"></i>
            </div>
            <!--<i v-if="!disabledEdit" class="close-img el-icon-circle-cross" @click="delProductImage(idx)"></i>-->
          </div>
          <template v-if="!disabledEdit">
            <el-upload v-if="productImgList.length < 5" class="avatar-uploader" :disabled="disabledEdit" action="/sellerAdmin/pic/upload" :data="picUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </template>

        </div>
        <div class="block-item">
          <span>详情图</span>
        </div>
        <div class="block-item detail-edit-img-wrap">
          <template v-if="!disabledEdit">
            <el-upload ref="detailUpload"
              class="detail-upload"
                          action="/sellerAdmin/pic/upload"
                         :data="picUploadWidth"
                         :multiple="true"
                         :on-success="handleDetailSuccess"
                         :on-remove="handleDetailRemove"
                         :before-upload="beforeDetailUpload">
              <el-button size="small" type="primary" :disabled="disabledEdit">点击上传</el-button>
            </el-upload>
            <el-button  class="clear-detail" v-if="productEdit.detailList.length > 0" size="small" @click="delDetailImg()" :disabled="disabledEdit">清除</el-button>
            <!--<div slot="tip"  class="el-upload__tip">只能上传jpg／png文件，宽度要求为620px，且大小不超过500kb</div>-->
            <div slot="tip"  class="el-upload__tip">只能上传jpg／png文件，大小不超过400kb</div>
          </template>
          <div class="detail-wall">
            <template v-for="item in productEdit.detailList">
              <img v-if="item" :src="item.content" alt="">
            </template>
          </div>
        </div>
      </div>
      <div class="menu">
        <!--menuList 1：保存；2：保存审核；3：撤销；4：删除-->
        <template v-for="item in menuList">
          <el-button v-if="item == '1'"  type="primary" @click="saveProduct(0)">保存</el-button>
          <el-button v-if="item == '2'"  type="primary" @click="saveProduct(1)">保存并提交审核</el-button>
          <el-button v-if="item == '3'"  @click="callsWithdrawAudit()">撤回审核</el-button>
          <el-button v-if="item == '4' && !productDetail.productSourceSellerId"  @click="callDeleteProduct()">删除</el-button>
        </template>
      </div>
    </div>
    <el-dialog class="modal-dialog" title="供货价调整" size="tiny" :visible.sync="modal.isShow">
      <el-form :model="modal.opts" :rules="rules" ref="modal.opts">
        <el-form-item v-if="latestWholesale" label="当前供货价"  label-width="100px">
          <span>{{latestWholesale.newPrice}}</span>
        </el-form-item>
        <el-form-item v-if="latestWholesale" label="启用时间"  label-width="100px">
          <span>{{latestWholesale.enableTime}}</span>
        </el-form-item>
        <el-form-item label="调整供货价"  prop="price" label-width="100px">
          <el-input class="input-item" v-model="modal.opts.price" placeholder="请填写供货价"  size="small"></el-input>
        </el-form-item>
        <el-form-item label="待启用时间"  prop="enableDay" label-width="100px">
          <el-date-picker format type="date" :picker-options="pickerOptions" v-model="modal.opts.enableDay" :editable="false" @change="checkDate('enableDay','enableDay')" class="input-item" size="small" placeholder="请填写启用时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="调价原因"  prop="reason" label-width="100px">
          <el-input class="input-item" v-model="modal.opts.reason" placeholder="请填写调价原因"  size="small"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelModal()">取 消</el-button>
        <el-button type="primary" @click="submitModal('modal.opts')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog class="table-dialog" title="调价记录" size="large" :visible.sync="tableWholesale.isShow">
      <div class="whole-table-dialog">
        <el-table :data="tableWholesale.list" height="250">
          <el-table-column prop="createTime" label="提交审核时间" width="160" align="center"></el-table-column>
          <el-table-column prop="status" label="审核状态" width="80" align="center">
            <template slot-scope="scope">
              <span>{{tableWholesaleMap.status[scope.row.status]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="oldPrice" label="原供货价" width="80" align="center"></el-table-column>
          <el-table-column prop="type" label="调价类型" width="80" align="center">
            <template slot-scope="scope">
              <span>{{tableWholesaleMap.type[scope.row.type]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="newPrice" label="调整供货价" width="80" align="center"></el-table-column>
          <el-table-column prop="enableTime" label="待启用时间" width="120" align="center"></el-table-column>
          <el-table-column prop="checkTime" label="审核时间" width="120" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注"  align="center"></el-table-column>
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelModal()">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="productImageDialog.isShow" size="small">
      <img width="100%" :src="productImageDialog.url" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import vCate from '@/components/productManageBack/category'
  import {mapState, mapActions} from 'vuex'
//  import Util from '../../assets/js/common/utils'
  export default {
    name: 'productEdit',
    created (){
      this.initDetail()
    },
    computed: {
      ...mapState(['categoryList'])
    },
    data: () => ({
      productImageDialog:{
        isShow:false,
        url:''
      },
      copyProductId:'',
      productCheckContent:true,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 + 3600 * 1000 * 24 * 2;
        }
      },
      productImgKeyList : ['image1','image2','image3','image4','image5'],
      productImgList:[],
      modal: {
        isShow: false,
        opts:{
          sellerProductId:'',
          price:'',
          enableDay:'',
          reason:''
        },
      },
      rules:{
        price: [
           { required: true, message: '请输入供货价', trigger: 'blur' }
        ],
        enableDay:[
          {type: 'string', required: true, message: '请输入待启用时间', trigger: 'change'},
        ],
        reason:[
          { required: true, message: '请输入调价原因', trigger: 'blur' }
        ],
      },
      tableWholesale: {
        isShow:false,
        list:[],
      },
      tableWholesaleMap: {
        type: {
          0:'提价' ,
          1:'降价'
        },
        status: {
          0:'待审核',
          1:'未通过',
          2:'通过'
        }
      },
      editType:'',
      menuList:[],
      disabledEdit:true,
      disabledHouse:false,
      wholesalePriceConfig:{
        disabledEdit:true,
        disabledApple:false,
      },
      categoryConfig:{
        type: 'Detail',
        label:{
          items:[]
        },
        mapModel:[]
      },
      productConfig:{
          items:[
            {
              title:'基本信息',
              items:[
                {
                  label:'商品分类',
                  type:'cate',
                  required:true,
                  position:true,
                  items:[{
                    key:'categoryList'
                  }]
                },
                {
                  label:'商品名称',
                  required:true,
                  items:[
                    {
                      type:'input-house',
                      placeholder:'名称不合规范不能通过审核！规范【口味】+【份数】+国家(国内不写)+品牌+品名+规格+卖点！44字内',
                      style:'',
                      width:'600',
                      key:'name',
                      maxlength:44
                    },
                    {
                      type:'sign-tip',
                      label:'例如：【青苹果味】【5包装】日本进口卡乐比黄油薯片108g/包 追剧最爱 无法拒绝的美味',
                      layout:'br'
                    }
                  ]
                },
                {
                  label:'卖点',
                  required:true,
                  position:true,
                  items:[
                    {
                      type:'textarea',
                      placeholder:'如果卖点不明显，将不能通过审核！字数限制60—140字',
                      style:'',
                      key:'sellingPoint',
                      maxlength:140
                    }
                  ]
                },
                {
                  label:'品牌',
                  required:true,
                  items:[
                    {
                      type:'select-filterable',
                      placeholder:'请填写品牌',
                      style:'',
                      key:'brandId',
                      options:[],
                    }
                  ]
                },
                {
                  label:'国家信息',
                  required:true,
                  items:[
                    {
                      type:'select',
                      placeholder:'请填写国家信息',
                      style:'',
                      key:'saleFlagId',
                      options:[]
                    }
                  ]
                },
                {
                  label:'商品条码',
                  required:true,
                  items:[
                    {
                      type:'input-house',
                      placeholder:'请填写商品条码',
                      style:'',
                      key:'barcode',
                    }
                  ]
                },
                {
                  label:'供货价',
                  required:true,
                  items:[
                    {
                      type:'input-whole',
                      placeholder:'请填写供货价',
                      style:'',
                      key:'wholesalePrice',
                    },
                    {
                      type:'button',
                      placeholder:'调整供货价',
                      style:'primary',
                      key:'',
                      editType:'edit-whole',
                      name:'checkWholesaleAudit'
                    },
                    {
                      type:'button',
                      placeholder:'调价记录',
                      style:'',
                      key:'',
                      editType:'edit-whole',
                      name:'callGetWholesale'
                    }
                  ]
                },
                {
                  label:'市场价',
                  required:true,
                  items:[
                    {
                      type:'input',
                      placeholder:'请填写市场价',
                      style:'',
                      key:'proposalMarketPrice',
                    }
                  ]
                },
                {
                  label:'建议售价',
                  required:true,
                  items:[
                    {
                      type:'input',
                      placeholder:'请填写建议售价',
                      style:'',
                      key:'proposalPrice',
                    }
                  ]
                },
                {
                  label:'发货地',
                  required:true,
                  items:[
                    {
                      type:'select-freight',
                      placeholder:'请选择发货地',
                      style:'',
//                      key:'sellerFreightTemplateId',
                      key:'useSellerSendAddress',
                      options:[]
                    },
                    {
                      type:'button',
                      placeholder:'管理发货地',
                      style:'primary',
                      key:'',
                      name:'managerFreightTemplateId'
                    },
                  ]
                },
                {
                  label:'运费模板',
//                  required:true,
                  items:[
                    {
                      type:'freightMsg',
                    }
                  ]
                },
                {
                  label:'发货编码',
                  required:true,
                  items:[
                    {
                      type:'input-house',
                      placeholder:'请填写发货编码',
                      style:'',
                      key:'code',
                    }
                  ]
                },
                {
                  label:'区域限制',
                  required:true,
                  items:[
                    {
                      type:'select',
                      placeholder:'请选择配送模板',
                      style:'',
                      key:'sellerDeliverAreaTemplateId',
                      options:[]
                    },
                    {
                      type:'button',
                      placeholder:'管理配送模板',
                      style:'primary',
                      key:'',
                      name:'managerDeliverAreaTemplateId',
                    },
                  ]
                },
              ]
            },
            {
              title: '详细信息',
              items:[
                {
                  label:'规格',
                  required:true,
                  items:[
                    {
                      type:'input',
                      placeholder:'数值+单位/单位*份数（两份及以上必须填写）',
                      style:'',
                      key:'netVolume',
                    },
                    {
                      type:'sign-tip',
                      label:'例如：100g／包，108g/包*5'
                    }
                  ]
                },
                {
                  label:'毛重',
                  required:true,
                  items:[
                    {
                      type:'input',
                      placeholder:'请填写毛重(克)',
                      style:'',
                      key:'grossWeight',
                    },
                    {
                      type:'sign-tip',
                      label:'注：以g为单位，只需填写数字'
                    }
                  ]
                },
                {
                  label:'产地',
                  required:true,
                  items:[
                    {
                      type:'input',
                      placeholder:'国内具体到省份，国外写明国家名称',
                      style:'',
                      key:'placeOfOrigin',
                    }
                  ]
                },
                {
                  label:'储存方式',
//                  required:true,
                  items:[
                    {
                      type:'input',
                      placeholder:'根据实际情况填写，例如：常温储存、冷冻储存',
                      style:'',
                      key:'storageMethod',
                    }
                  ]
                },
                {
                  label:'保质期',
//                  required:true,
                  items:[
                    {
                      type:'input',
                      placeholder:'必须填写具体时长，例如：12个月、365天',
                      style:'',
                      key:'durabilityPeriod',
                    },
                    {
                      type:'sign-tip',
                      label:'注意：如只有到期日，可参考效期推断具体保质期时长'
                    }
                  ]
                },
                {
                  label:'有效期至',
                  required:true,
                  items:[
                    {
                      type:'date-picker',
                      placeholder:'请填写有效期',
                      style:'',
                      key:'expireDate',
                    }
                  ]
                },
                {
                  label:'生产日期',
                  items:[
                    {
                      type:'date-picker',
                      placeholder:'请填写生产日期',
                      style:'',
                      key:'manufacturerDate',
                    }
                  ]
                },
                {
                  label:'适用人群',
                  items:[
                    {
                      type:'input',
                      placeholder:'请填写适用人群',
                      style:'',
                      key:'peopleFor',
                    }
                  ]
                },
                {
                  label:'食用方法',
                  items:[
                    {
                      type:'input',
                      placeholder:'与使用方法至少选择一个填写，30字以内',
                      style:'',
                      key:'foodMethod',
                    }
                  ]
                },
                {
                  label:'使用方式',
                  items:[
                    {
                      type:'input',
                      placeholder:'与食用方法至少选择一个填写，30字以内',
                      style:'',
                      key:'useMethod',
                    }
                  ]
                },
                {
                  label:'温馨提示',
                  items:[
                    {
                      type:'input',
                      placeholder:'请填写温馨提示',
                      style:'',
                      key:'tip',
                    }
                  ]
                },
              ]
            }
          ]
       },
      productDetail:{},
      detailConfig:{},
      productEdit:{
         sellerProduct:{
           id:'', //
           brandId:'', //	品牌id
           sellerId:'', //	商家id(发货地id)
           sellerDeliverAreaTemplateId:'', //	商家配送区域模板id
//           sellerFreightTemplateId:'', //	商家运费模板id
           useSellerSendAddress:'', //	商家运费模板id
           code:'', //	发货编码,不能包含‘%’字符
           barcode:'', //	商品条形码
           name:'', //	商品名称
           wholesalePrice:'', //	供货价
           proposalMarketPrice:'', //	市场价
           proposalPrice:'', //	建议售价
           sellingPoint:'', //	商品卖点
           saleFlagId:'', //	国家Id
           netVolume:'', //	规格
           grossWeight:'', // 毛重
           placeOfOrigin:'', //	产地
           manufacturerDate:'', //	生产日期
           storageMethod:'', //	储藏方法
           durabilityPeriod:'', //	保质期
           peopleFor:'', //	适用人群
           foodMethod:'', //食用方法
           useMethod:'', //	使用方式
           tip:'', //	温馨提示
           expireDate:'', //	有效日期
           image1:'', //	商品图片1访问URL,主图1-5至少要有一张
           image2:'', //	品牌图片2访问URL,主图1-5至少要有一张
           image3:'', //	品牌图片3访问URL,主图1-5至少要有一张
           image4:'', //	品牌图片4访问URL,主图1-5至少要有一张
           image5:'', //	品牌图片5访问URL,主图1-5至少要有一张
           categoryList:[], //
         },
         detailList:[]
       },
      picUpload:{
        picFile:null,
        getSize:1
      },
      picUploadWidth:{
        picFile:null,
        getSize:1,
        width:620
      },
      picUploadList:{
        picFiles:[],
        getSize:1
      },
      checkSubmit:[],
      detailRemoveList:[],
      startRemoveListLength:0,
      isSelectFreight:false,
      productFreightTemplate:{},
      latestWholesale:{} //最后一次供货价调整
    }),
    methods: {
      ...mapActions(['getProductDetail','setCategoryList','saveProductDetail','getDistributionTemplate','getDeliveryArea','getSellerBrand','getCountryList',
      'checkUnAuditWholesale','getLatestWholesale','changeWholesale','getWholesale','withdrawAudit','deleteProduct','callSetNotice','getProductFreightTemplate']),
      //页面初始化
      initDetail() {
        const opts = {
          sellerProductId: this.$route.query.productId
        }
        this.setCategoryList([])
        const type = this.$route.query.type
        this.getDeliveryArea({isAvailable:1})
          .then((rs)=>{
            let opts = [];
            rs.forEach((item,idx)=>{
              const opt = {
                label:item.sendAddress,
                value:item.id
              }
              opts.push(opt)
            })
            this.productConfig.items[0].items[9].items[0].options = opts
          })
        this.getDistributionTemplate()
          .then((rs)=>{
            let opts = [];
            rs.forEach((item,idx)=>{
              const opt = {
                label:item.name,
                value:item.id
              }
              opts.push(opt)
            })
            this.productConfig.items[0].items[12].items[0].options = opts
          })
        this.getSellerBrand()
          .then((rs)=>{
            let opts = [];
            rs.forEach((item,idx)=>{
              const opt = {
                label:item.name,
                value:item.id
              }
              opts.push(opt)
            })
            this.productConfig.items[0].items[3].items[0].options = opts
          })
        this.getCountryList()
          .then((rs) => {
            let opts = [];
            rs.forEach((item,idx)=>{
                const opt = {
                  label:item.name,
                  value:item.id
                }
                opts.push(opt)
            })
            this.productConfig.items[0].items[4].items[0].options = opts
          })
        if(type == 'edit'){
          this.editType = 'edit'
          this.callGetProductDetail(opts,'edit')
        }
        else {
          this.editType = 'new'
          this.addCate()
          this.disabledEdit = false
          this.wholesalePriceConfig.disabledEdit = false
          this.menuList = ['1','2']
        }
        this.initCheckSubmit()
      },
      /*
      * //调用获取商品详情数据
      * opts 参数
      * type new edit
      * */
      callGetProductDetail(opts,type){
        this.getProductDetail(opts)
          .then((rs)=>{
            this.productDetail = rs
            this.editProductInit(type)
          })
      },
      //详情数据渲染
      editProductInit(type){
        this.productImgList = []
        if(type == 'new'){
          let opt = []
          this.setCategoryList(opt)
          this.productDetail.id = ''
        }
        for(let i in this.productEdit.sellerProduct){
          this.productEdit.sellerProduct[i] =  (this.productDetail[i] || this.productDetail[i] == 0)  ? this.productDetail[i] : ''
        }
        for(let i in this.productImgKeyList){
          if(this.productEdit.sellerProduct[this.productImgKeyList[i]]){
            this.productImgList.push(this.productEdit.sellerProduct[this.productImgKeyList[i]])
          }
        }
//            console.log(this.productImgList)
        this.productEdit.detailList = this.productDetail.detailList ? this.productDetail.detailList : []
        this.startRemoveListLength = this.productEdit.detailList.length
        let self = this;
        setTimeout(function(){
          self.setCategoryList(self.productEdit.sellerProduct.categoryList)
        },10)
//              console.log(this.categoryList)
//              console.log(this.productEdit.sellerProduct)
//              console.log(this.productEdit.detailList)
//              disabledEdit
//              saleStatus	销售状态，0：未出售；1：出售中
//              status	商品审核状态；1：未审核；2：审核中；3：审核未通过；4：审核通过
//              disabledEdit   true：修改信息；false: 不能修改信息
//              wholesalePriceConfig.disabledApple true：不能申请修改供货价； false ：可以申请修改供货价
//              wholesalePriceConfig.disabledEdit  true：不能直接修改供货价； false ：可以直接修改供货价
//              menuList 1：保存；2：保存审核；3：撤销；4：删除
//            console.log(this.productDetail.saleStatus)
//            console.log(this.productDetail.status)
//              this.productDetail.saleStatus = 0
//              this.productDetail.status = 1
//        console.log(this.productDetail.saleStatus)
//        console.log(this.productDetail.status)
        if(type=='edit'){
            this.disabledEdit=true,
            this.disabledHouse=false,
            this.wholesalePriceConfig.disabledEdit=true,
            this.wholesalePriceConfig.disabledApple=false
          if(this.productDetail.saleStatus == 1){
//              console.log('未审核 可申请调整供货价 修改任何信息 显示保存审核')
//                未审核 可申请调整供货价 不能修改任何信息 不显示任一按钮
            // 新的 规则 未审核 可申请调整供货价 修改任何信息 显示保存审核
            if(this.productDetail.status == 1){
              this.wholesalePriceConfig.disabledApple = true
              this.disabledEdit = false
              this.menuList = ['2']
            }
//                审核中 不能申请调整供货价 不能修改任何信息 显示撤回审核按钮
            else if(this.productDetail.status == 2){
              this.menuList = ['3']
            }
            else if(this.productDetail.status == 3){
              this.wholesalePriceConfig.disabledEdit = false
              this.disabledEdit = false
              this.menuList = ['1','2','4']
            }
//                审核通过 可申请调整供货价 不能修改任何信息 不显示任一按钮
              // 新规则 审核通过 可申请调整供货价 修改任何信息 显示保存审核
            else if(this.productDetail.status == 4){
              this.wholesalePriceConfig.disabledApple = true
              this.disabledEdit = false
              this.menuList = ['2']
            }
          }
          else if(this.productDetail.saleStatus == 0){
//                未审核 可直接修改供货价 可修改其他所有信息 显示仅保存和保存并审核按钮
            if(this.productDetail.status == 1){
//                console.log('未审核 可直接修改供货价 可修改其他所有信息 显示仅保存和保存并审核按钮')

              this.wholesalePriceConfig.disabledEdit = this.productDetail.productSourceSellerId ? true : false
              this.wholesalePriceConfig.disabledApple = this.productDetail.productSourceSellerId ? true : false


              this.disabledEdit = false
              this.menuList = ['1','2','4']
            }
//                审核中 不能申请调整供货价 不能修改任何信息 显示撤回审核按钮
            else if(this.productDetail.status == 2){
              this.menuList = ['3']
            }
//                审核不通过
//                判断之前是否审核通过一次，如审核通过一次，可申请调整供货价，可修改其他信息，如未审核通过一次，可直接修改供货价和其他信息，
//                显示保存并审核按钮和仅保存按钮，未修改任何信息时保存并审核按钮不可点击，有修改信息时保存并审核按钮可点击，提交审核进入一审流程
            else if(this.productDetail.status == 3){
              if(this.productDetail.productSourceSellerId){
                this.wholesalePriceConfig.disabledEdit = true
                this.wholesalePriceConfig.disabledApple = true
              } else {
                this.wholesalePriceConfig.disabledEdit = false
              }
              this.disabledEdit = false
              this.menuList = ['1','2','4']
            }
//                审核通过 可申请调整供货价 可修改其他信息 显示保存并审核按钮，未修改任何信息时保存并审核按钮不可点击，有修改信息时保存并审核按钮可点击
            else if(this.productDetail.status == 4){
              this.wholesalePriceConfig.disabledApple = true
              this.disabledEdit = false
              this.menuList = ['2']
            }
          }
          if(this.productDetail.isInStorage){
             this.disabledHouse = true
          }
        }
//            console.log(this.disabledEdit)
      },
      //选择发货地
      selectFreight(id){
        this.isSelectFreight = true
        this.getProductFreightTemplate({shippAddressId:id})
          .then((rs)=>{
            this.productFreightTemplate = rs

          })
      },
      //时间格式
      checkDate(key,type) {
          if(type=='detail'){
            this.productEdit.sellerProduct[key] = Util.formatDate('yyyy-mm-dd hh:mm:ss',this.productEdit.sellerProduct[key])
          } else if(type=='enableDay'){
            this.modal.opts[key] = Util.formatDate('yyyy-mm-dd hh:mm:ss',this.modal.opts[key])
          }
      },
      //初始化验证数据
      initCheckSubmit() {
        let list = [];
        this.productConfig.items.forEach((item,idx)=>{
            item.items.forEach((subItem,sunIdx)=>{
              if(subItem.required){
                 const opt ={
                   key:subItem.items[0].key,
                   label:subItem.label
                 }
                 if(opt.label == '有效期至'){
                   opt.label = '有效期'
                 }
                list.push(opt)
              }
            })
        })
        this.checkSubmit = list
      },
      //增加分类
      addCate() {
        if(this.categoryList.length >= 3){
          const label = '最多有三个商品类目' ;
          this.getNotice(label);
          return false
        }
        let opt = {
          id:'', //	商品分类关联Id
          sellerProductId:this.productEdit.sellerProduct.id, //		商品Id
          categoryFirstId:'', //		一级分类Id
          categorySecondId:'', //		二级分类id
          categoryThirdId:'', //		三级分类Id
        }
//        let cateList = this.categoryList.slice(0,this.categoryList.length)
        let cateList = this.categoryList;
        cateList.push(opt)
        this.setCategoryList(cateList)
      },
      //删除分类
      addDel(idx) {
        if(this.categoryList.length <= 1){
          const label = '最少有一个商品类目' ;
          this.getNotice(label);
          return false
        }
        let cateList = this.categoryList
        cateList.splice(idx,1)
        this.setCategoryList([])
        let self = this;
        setTimeout(function(){
          self.setCategoryList(cateList)
        },10)

      },
      //详情图片上传成功
      handleDetailSuccess(res,file) {
        if(res.status != 1){
          this.getNotice(file.name+'图片上传失败');
          return false;
        }
        if(res.width != 620 ){
//          this.getNotice(file.name+'图片尺寸不正确');
//          return false;
        }
        let opt = {
          id:'', //	卖家商品内容详情id
          sellerProductId:this.productEdit.sellerProduct.id, //	int	商品id
          content:res.url, //	String	url地址
//          height:(res.height+'').match(/^\d+$/g) ? res.height : 0, //	int	图片高度
          height:res.height, //	int	图片高度
          width:res.width, //
        }
//        console.log(opt)
        for(let i in this.detailRemoveList){
            if(this.detailRemoveList[i].uid == file.uid){
              let idx = Number(this.startRemoveListLength) + Number(i);
              this.productEdit.detailList[idx] = opt
              this.productEdit.detailList.push('')
              this.productEdit.detailList.pop()
            }
        }
//        this.productEdit.detailList.push(opt)
//        this.detailRemoveList.push(file)
      },
      handleDetailRemove(file,fileList) {
//          console.log(file.uid)
//          console.log(this.detailRemoveList)
//        console.log(file)
//        console.log(this.detailRemoveList)
//        console.log(this.startRemoveListLength)
        let idx = 0,
            rmIdx = 0;
          for(let i in this.detailRemoveList){
              if(this.detailRemoveList[i].uid == file.uid){
                  idx = Number(this.startRemoveListLength) + Number(i);
                  rmIdx =  Number(i);
              }
          }
          this.detailRemoveList.splice(rmIdx,1)
          this.productEdit.detailList.splice(idx,1)
      },
      //清空详情图片
      delDetailImg(){
        this.$refs.detailUpload.clearFiles()
        this.startRemoveListLength = 0
        this.productEdit.detailList = []
      },
      //详情图片上传 文件判断
      beforeDetailUpload(file,fileList) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024  < 400;
        if (!isJPG) {
          this.getNotice('上传图片格式不正确');
        }
        if (!isLt2M) {
          this.getNotice('上传图片大小不能超过 400KB!');
        }
        if(isJPG && isLt2M){
          this.picUploadWidth.picFile=file
          this.detailRemoveList.push(file)
        }
        return isJPG && isLt2M;
      },
      //主图上传成功
      handleAvatarSuccess(res, file) {
        if(res.status != 1){
          this.getNotice(file.name+'图片上传失败');
          return false;
        }
        if(res.width != 640 || res.height != 640){
          this.getNotice('图片尺寸不正确');
            return false;
        }
        this.productImgList.push(res.url);
      },
      //主图上传 文件判断
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024  < 400;
        if (!isJPG) {
          this.getNotice('上传图片格式不正确');
        }
        if (!isLt2M) {
          this.getNotice('上传头像图片大小不能超过 400KB!');
        }
        this.picUpload.picFile=file

        return isJPG && isLt2M;
      },

      handleRemove(file, fileList) {
//        console.log(file, fileList);
      },
      handlePreview(file) {
//        console.log(file);
      },
      //保存商品
      saveProduct(type) {
        this.productEdit.sellerProduct.categoryList = this.categoryList
        let opts =  this.productEdit
        opts.needAudit = type;
//        console.log(opts)
        this.checkItem(opts)
      },
      //验证数据格式
      checkItem(opts) {
        let label = '',
          isCheck = true;
        for(let i in opts.sellerProduct.categoryList){
          if(!opts.sellerProduct.categoryList[i].categoryFirstId || !opts.sellerProduct.categoryList[i].categorySecondId || !opts.sellerProduct.categoryList[i].categoryThirdId){
//            label = '第'+i+'个商品类目' ;
            label = '请选择商品类目' ;
            this.getNotice(label);
//            console.log(label)
            return false;
          }
        }
        for(let i in this.checkSubmit){
          if(opts.sellerProduct[this.checkSubmit[i].key] === '' || !opts.sellerProduct[this.checkSubmit[i].key]){
            label =  this.checkSubmit[i].label;
            this.getNotice('请填写'+label);
//            console.log(label)
//            console.log(this.checkSubmit[i].key)
            return false
          }
        }
//        console.log(opts.sellerProduct.expireDate)
        if(Number(opts.sellerProduct.wholesalePrice) >= Number(opts.sellerProduct.proposalPrice)){
          label =  '供货价需小于建议售价';
          this.getNotice(label);
          return false
        }
        if(Number(opts.sellerProduct.proposalPrice) >= Number(opts.sellerProduct.proposalMarketPrice)){
          label =  '建议售价需小于市场价';
          this.getNotice(label);
          return false
        }
//        proposalMarketPrice //市场价
//        proposalPrice //建议
//        wholesalePrice //供货价
        if(opts.sellerProduct.name.length > 44 ){
          label =  '商品名称字数限制为44以内';
          this.getNotice(label);
          return false
        }
        if(opts.sellerProduct.sellingPoint.length > 140 || opts.sellerProduct.sellingPoint.length < 60){
          label =  '商品卖点字数限制为60~140';
          this.getNotice(label);
          return false
        }
        if(opts.sellerProduct.barcode && opts.sellerProduct.barcode.indexOf('%')>-1){
          label =  '商品条码内不能有%';
          this.getNotice(label);
//          console.log(label)
          return false
        }
        if(opts.sellerProduct.barcode.length > 32){
          label =  '商品条码小于32个字符';
          this.getNotice(label);
//          console.log(label)
          return false
        }
//        const resCode = /\u4e00-\u9fa5]{1,}/g;
        const resCode = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
//        console.log(opts.sellerProduct.barcode.match(resCode))
        if(opts.sellerProduct.barcode && opts.sellerProduct.barcode.match(resCode)){
          label = '商品条码格式不正确不能包含中文'
          this.getNotice(label);
//          console.log(label)
          return false
        }
        if(opts.sellerProduct.code && opts.sellerProduct.code.match(resCode)){
          label = '发货编码格式不正确不能包含中文'
          this.getNotice(label);
//          console.log(label)
          return false
        }

//        if(!opts.sellerProduct.useMethod && !opts.sellerProduct.foodMethod){
//          label =  '商品使用方法和食用方法至少选择一个填写';
//          this.getNotice(label);
//          return false
//        }
        const res = /^[1-9]{1}[0-9]*$/g;
        const resFloat = /^[0-9]{1}[0-9]*(\.[0-9]{1,2})?$/g;
        if(!(opts.sellerProduct.wholesalePrice+'').match(resFloat)){
          label =  '供货价格式不正确';
          this.getNotice(label);
          return false
        }
        if(!(opts.sellerProduct.proposalMarketPrice+'').match(resFloat)){
          label =  '市场价价格式不正确';
          this.getNotice(label);
          return false
        }
        if(!(opts.sellerProduct.proposalPrice+'').match(resFloat)){
          label =  '建议零售价格式不正确';
          this.getNotice(label);
          return false
        }
        if(!(opts.sellerProduct.grossWeight+'').match(res)){
          label =  '毛重格式不正确';
          this.getNotice(label);
          return false
        }
//        wholesalePrice 供货价
//        proposalMarketPrice 市场价
//        proposalPrice 建议零售价
        if(this.productImgList.length < 2){
          label =  '商品主图2-5张';
          this.getNotice(label);
          return false
        }
        for(let i in this.productImgKeyList){
          opts.sellerProduct[this.productImgKeyList[i]] = this.productImgList[i] ? this.productImgList[i] : ''
        }
        if(opts.detailList.length < 1){
          label = '请上传商品详情图片' ;
          this.getNotice(label);
          return false;
        }
        let list = []
        opts.detailList.map((item)=>{
          if(item){
            list.push(item)
          }
        })
        opts.detailList = list
        opts.sellerProduct.sellerId = opts.sellerProduct.useSellerSendAddress
//        console.log(opts)
//        return false
        this.saveProductDetail(opts)
          .then(()=>{
//            this.getNotice('成功','success');
//            this.$router.push({
//              path: '/productSearch',
//            })
            this.$router.back()
//            if(this.editType == 'new'){
//              this.$router.push({
//                path: '/productEdit',
//                query:{
//                  productId:this.productDetail.id,
//                  type:'edit'
//                }
//              })
//              const opt = {
//                sellerProductId: this.productDetail.id
//              }
//              this.callGetProductDetail(opt,'edit')
//            }
//            else {
//              const opt = {
//                sellerProductId: this.productEdit.sellerProduct.id
//              }
//              this.callGetProductDetail(opt,'edit')
//            }
          })
      },
      //判断有无供货价修改
      checkWholesaleAudit(){
        const productId = this.productEdit.sellerProduct.id
        const opts = {
          sellerProductId:productId
        }
        this.checkUnAuditWholesale(opts)
          .then((rs)=>{
            if(rs){
              this.$confirm('存在未审核调价申请，是否确认提交', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(() => {
                this.callChangeWholesale()
              }).catch(() => {
              });
            } else{
              this.callChangeWholesale()
            }


          })
      },
      //调用修改供货价窗口
      callChangeWholesale(){
        const productId = this.productEdit.sellerProduct.id
        const opts = {
          sellerProductId:productId
        }
        this.getLatestWholesale(opts)
          .then((rs)=>{
            this.latestWholesale = rs
            this.modal.isShow = true;
          })
      },
      //取消修改供货价
      cancelModal() {
        this.modal.isShow = false
        this.tableWholesale.isShow = false
      },
      //提交修改供货价
      submitModal(formName) {
        let opts =  this.modal.opts
        opts.sellerProductId = this.productEdit.sellerProduct.id
//        if(!opts.price || !opts.enableDay || !opts.reason){
//          this.getNotice('供货价信息不能为空');
//          return false
//        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.changeWholesale(opts)
              .then(()=>{
                this.cancelModal()
                const opt = {
                  sellerProductId: this.productEdit.sellerProduct.id
                }
                this.callGetProductDetail(opt,'edit')
              })
          } else {
//            console.log('error submit!!');
            return false;
          }
        });
      },
      //获取供货价修改历史
      callGetWholesale() {
        const opts = {
//          sellerProductId:this.productEdit.sellerProduct.id,
          rowsPerPage:100,
          pageIndex:1,
          paramsMap:{
            sellerProductId:this.productEdit.sellerProduct.id,
          }
        }
        this.getWholesale(opts)
          .then((rs)=>{
            this.tableWholesale.list = rs.rows
            this.tableWholesale.isShow = true
          })
      },
      //删除主图
      delProductImage(idx) {
          this.productImgList.splice(idx,1)
      },
      showProductImage(src) {
          this.productImageDialog.url = src
          this.productImageDialog.isShow = true
      },
//      managerDeliverAreaTemplateId(){
//        this.$router.push({
//              path: '/distributionTemplate',
//          })
//      },
//      managerFreightTemplateId(){
//          this.$router.push({
//              path: '/deliveryArea',
//          })
//      },
      //撤销审核
      callsWithdrawAudit() {
        const opts = {
          sellerProductId:this.productEdit.sellerProduct.id
        }
        this.$confirm('确认撤回审核吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.withdrawAudit(opts).
          then(()=>{
            const opt = {
              sellerProductId: this.productEdit.sellerProduct.id
            }
            this.callGetProductDetail(opt,'edit')
          })
        }).catch(() => {
        });
      },
      //删除商品
      callDeleteProduct() {
        const opts = {
          sellerProductId:this.productEdit.sellerProduct.id
        }
        this.$confirm('确认删除商品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.deleteProduct(opts)
            .then(()=>{
//              this.$router.push({
//                path: '/productSearch',
//              })
              this.$router.back()
            })
        }).catch(() => {
        });
      },
//      复制商品
      copyProduct(){
        const opts = {
          sellerProductId: this.copyProductId
        }
        if(!this.copyProductId){
            this.getNotice('商品ID不能为空')
            return false;
        }
        this.callGetProductDetail(opts,'new')
        this.productCheckContent = false

      },
      getNotice(msg){
        this.$alert(msg, '提示', {
          confirmButtonText: '确定',
          callback: () => {

          }
        });
//        const notice = {
//          isShow:true,
//          msg:msg,
//        }
//        this.callSetNotice(notice)
      },
    },
    components: {
      vCate
    }
  }
</script>
<style lang='less' rel="stylesheet/less" scoped>
  .section-item{
    .input-item{
      width: 200px;
    }
    .input-item-large{
      width: 400px;
    }
    .area-item-large{
      width: 600px;
    }
    .disabled-color{
      color:#999;
    }
    .detail-wall{
     width: 500px;
      img{
        width: 100%;
      }
    }
    .section-item-sign-padding{
      padding: 23px 0;
    }
    .sub-button{
      margin-left: 10px;
    }
    .sub-button-small{
      margin-left: 8px;
    }
  }
  .menu{
    padding-right: 10px;
    text-align: right;
  }
  .detail-edit-img-wrap{
    position: relative;
    .detail-upload{
      display: inline-block;
      width: 400px;
    }
    .clear-detail{
      position: absolute;
      top:10px;
      left: 100px;
    }
  }
  .avatar-wrap{
    display: inline-block;
    position: relative;
    width: 100px;
    height: 100px;
    margin-right: 5px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    .avatar {
      width: 100px;
      height: 100px;
    }
    .close-img{
      position: absolute;
      top:0;
      right:0;
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
    display: inline-block;
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
    line-height: 100px;
    position: relative;
    overflow: hidden;
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
    }

  }
  .modal-dialog{
    .block-item{
      padding: 10px 0;
    }
    .input-item{
      width: 200px;
    }
    .sign-item{
      display: inline-block;
      width: 100px;
      text-align: left;
    }
  }
  .copy-wrap{
    float: right;
    padding-right: 20px;
    .input-item{
      width: 200px;
    }
  }

</style>

