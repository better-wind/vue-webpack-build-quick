<template>
  <div v-if="isReady" id="operateCondition">
    <v-head :config="config" />
    <div class="main-container" v-if="isDetailReady">
      <div class="section" v-if="!editProduct">
        <div class="title">
          <span>入仓单明细 </span>
        </div>
        <div class="section-item msg-wrap">
          <div class="block-item">
            <span>入仓单编号：{{wareStoreDetail.code}}</span>
          </div>
          <div class="block-item" v-for="(item,index) in detailMsg">
            <div>
              <span class="msg-title">{{item.title}}</span>
            </div>
            <div class="msg-item">
              <div class="inline-item msg-inline-item" v-for="(subItem,index) in item.detail">
                <p v-for="msgItem in subItem">
                  <span>{{msgItem.label}}:</span>
                  <span>{{wareStoreDetail[msgItem.key]}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--申请入仓&&入仓单明细-->

      <div class="section">
        <div class="title">
          <span> {{editProduct ?  '新建入仓单' : '申请入仓单明细'}}</span>
        </div>
        <div class="section-item" >
          <!--根据入仓状态 判断-->
          <div class="block-item" v-if="editProduct">
            <el-button  @click="addWareProduct" size="small" type="primary">增加商品</el-button>
          </div>
        </div>
        <div class="section-item ware-store-list">
          <el-table  :data="wareProductList" style="width: 100%;" >
              <template v-for="(item,index) in wareProductConfig">
                <el-table-column v-if="item.type == 'input'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                  <template slot-scope="scope">
                    <el-input v-if="scope.row.edit" :disabled="item.disabled?true:false" class="input-item-middle" v-model.trim="scope.row[item.key]" size="small"></el-input>
                    <span v-else>{{scope.row[item.key]}}</span>
                  </template>
                </el-table-column>
                <el-table-column v-else-if="item.type == 'date'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                  <template slot-scope="scope">
                    <el-date-picker v-if="scope.row.edit" v-model="scope.row[item.key]" type="date"
                                    placeholder="选择日期"
                                    class="input-item-middle" size="small">
                    </el-date-picker>
                    <span v-else>{{scope.row[item.key]}}</span>
                  </template>
                </el-table-column>
                <el-table-column v-else-if="item.type == 'purchaseUnit'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                  <template slot-scope="scope">
                    <el-select v-if="scope.row.edit" filterable v-model="scope.row[item.key]" class="input-item-middle" size="small"  :placeholder="item.label">
                      <template v-for="subItem in purchaseUnit">
                        <el-option :label="subItem.code" :value="subItem.code"></el-option>
                      </template>
                    </el-select>
                    <span v-else>{{scope.row[item.key]}}</span>
                  </template>
                </el-table-column>
                <el-table-column v-else-if="item.type == 'countPrice'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                  <template slot-scope="scope">
                    <span>{{accMul(Number(scope.row[item.keys[0]]),Number(scope.row[item.keys[1]]))}}</span>
                  </template>
                </el-table-column>
                <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>
              </template>
              <el-table-column v-if="editProduct"  label="操作" width="80" align="center">
                <template slot-scope="scope">
                  <el-button size="small" @click="delProduct(scope.$index)">删除</el-button>
                </template>
              </el-table-column>

          </el-table>

        </div>
        <div class="section-item" v-if="editProduct">
          <div class="block-item">
            <span>入仓单备注:</span>
            <el-input   style="width: 500px" v-model="wareStoreDetail.note" size="small" placeholder="请输入备注"></el-input>

          </div>
        </div>
        <div class="section-item msg-wrap" v-if="!editProduct">
          <div class="msg-item">
            <div class="inline-item msg-inline-item" >
              <p class="large">
                <span>申请入仓总数:</span>
                <span>{{wareStoreDetail.totalCount}}</span>
              </p>
              <p class="large">
                <span >入仓备注:</span>
                <span>{{wareStoreDetail.note}}</span>
              </p>
            </div>
            <div class="inline-item msg-inline-item" >
              <p class="large">
                <span>入仓总价值:</span>
                <span>{{wareStoreDetail.totalMoney}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <!--发货批次-->
      <div class="section" v-if="editDeliver">
        <div class="title">
          <span>发货批次</span>
        </div>
        <div class="section-item" >
          <!--根据入仓状态 判断-->
          <div class="block-item" v-if="inStorageOrderStatus != 6">
            <el-button  @click="chooseDeliver" size="small" type="primary">发 货</el-button>
          </div>
          <el-table v-if="deliverList.length" :data="deliverList" style="width: 100%;" >
            <template v-for="(item,index) in deliverConfig">
              <el-table-column v-if="item.key == 'pushTimes'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                <template slot-scope="scope">
                  {{code+'P'+scope.row[item.key]}}
                </template>

              </el-table-column>
              <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>
            </template>
            <el-table-column   label="操作" width="" align="center">
              <template slot-scope="scope">
                <el-button size="small" @click="deliverDetail(scope.row.purchaseCode,scope.row.pushTimes)" type="primary">查看</el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>
      </div>
      <!--实际入库明细-->
      <div class="section" v-if="this.editStorage">
        <div class="title">
          <span>实际入库明细</span>
        </div>
        <div class="section-item">
          <el-table  :data="storageList" style="width: 100%;" >
            <template v-for="(item,index) in storageConfig">
              <el-table-column :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>
            </template>
          </el-table>
        </div>
        <div class="section-item msg-wrap">
          <div class="msg-item">
            <div class="inline-item msg-inline-item" >
              <p class="large">
                <span>实际入库总数:</span>
                <span>{{wareStoreDetail.actualInTotalCount}}</span>
              </p>
            </div>
            <div class="inline-item msg-inline-item" >
              <p class="large">
                <span>实际入库总价值:</span>
                <span>{{wareStoreDetail.actualInTotalMoney}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="section" v-if="inStorageOrderStatus == 6">
        <span style="margin-left: 20px">入仓单已于{{wareStoreDetail.updateTime}}确认入仓</span>
      </div>
      <!--菜单-->
      <div class="section"  style="text-align: center">
        <el-button type="primary" @click="commitStorage" v-if="inStorageOrderStatus == 5">确认入仓</el-button>
        <template v-if="editProduct">
          <el-button @click="submitProduct(0)">保存</el-button>
          <el-button @click="submitProduct(1)" type="primary">保存并提交审核</el-button>
        </template>

      </div>
      <!--新增商品弹窗-->
      <el-dialog title="新增商品" size="largeMore" :visible.sync="wareProductModel.isShow">
        <div class="section ware-model">
          <div class="section-item">
            <div v-for="item in wareProductModel.selectConfig" class="inline-item">
              <span class="sign-name-item">{{item.label}}：</span>
              <el-select v-if="item.type == 'select'" filterable v-model="wareProductModel.opts[item.key]" class="input-item-middle" size="small"  :placeholder="'请选择'+item.label">
                <template v-for="subItem in item.options">
                  <el-option :label="subItem.label" :value="subItem.value"></el-option>
                </template>
              </el-select>
              <el-input v-else v-model="wareProductModel.opts[item.key]" class="input-item-middle" size="small"  :placeholder="'请输入'+item.label"></el-input>
            </div>
          </div>
          <div class="section-item" style="text-align: right">
            <el-button @click="queryProduct" size="small" type="primary">查询</el-button>
            <el-button @click="resetQuery" size="small" >重置</el-button>
          </div>
          <div class="section-item">
            <div class="block-item">
              <el-button size="small" @click="addProductView">增加选中商品</el-button>
            </div>
            <el-table v-loading="loading" ref="multipleTable" element-loading-text="拼命加载中" :data="wareProductModel.productList" height="300" style="width: 100%;" @selection-change="handleSelectionChange">
              <el-table-column type="selection" align="center" width="55" :selectable="selectable">

              </el-table-column>
              <template v-for="(item,index) in wareProductModel.resultConfig">
                <el-table-column v-if="item.type == 'operate'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                  <template slot-scope="scope">

                    <span class="c-dis" v-if="scope.row.inStorageStatus == 1">与仓内商品重复，不可入仓</span>
                    <span class="c-dis" v-else-if="scope.row.inStorageStatus == 2">商品条码为空，不可入仓</span>
                    <span class="c-dis" v-else-if="scope.row.inStorageStatus == 3">海外商品，不可入仓</span>

                    <span v-else>{{storageListMap[storageId]}}</span>

                  </template>
                </el-table-column>
                <el-table-column v-else-if="item.type == 'price'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                  <template slot-scope="scope">
                    <span :class="scope.row.inStorageStatus == 0 ? '' : 'c-dis'">{{scope.row[item.key] / 100}}</span>

                  </template>
                </el-table-column>
                <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center">
                  <template slot-scope="scope">
                    <span :class="scope.row.inStorageStatus == 0 ? '' : 'c-dis'">{{scope.row[item.key]}}</span>

                  </template>
                </el-table-column>
              </template>
            </el-table>
            <div class="pagination-item">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="wareProductModel.paging.currentPage"
                :page-sizes="wareProductModel.paging.pageSizes"
                :page-size="wareProductModel.paging.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="wareProductModel.paging.total">
              </el-pagination>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelModal()">取 消</el-button>
        </div>
      </el-dialog>
      <!--发货选择弹窗-->
      <el-dialog :visible.sync="deliverWayModel.isShow">
        <div class="section-item">
          <div class="block-item">
            <span>请选择发货方式</span>
          </div>
          <div class="block-item">
            <el-radio class="radio" :disabled="deliverWayModel.disabledType == 1" v-model="deliverWayModel.way" :label="1">整批发货，仓库可一次性收货入库</el-radio>
          </div>
          <div class="block-item">
            <el-radio class="radio" :disabled="deliverWayModel.disabledType == 2" v-model="deliverWayModel.way" :label="2">分批发货，仓库分多批次收货入库</el-radio>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="submitChooseDeliver()" type="primary">确 定</el-button>
          <el-button @click="cancelChooseDeliver()">取 消</el-button>
        </div>
      </el-dialog>
      <!--发货填写弹框-->
      <el-dialog title="发货" size="largeMore" :visible.sync="deliverModel.isShow">
        <div class="section-item">
          <div v-if="deliverModel.type == 1" class="block-item">
            <span class="c-red">温馨提示：请您在实际发货出库后再确认发货，并确认发货数真实无误</span>
          </div>
          <div class="block-item">
            <span>发货批次号：{{deliverModel.deliverCode}}</span>
            <span>入库单号：{{deliverModel.code}}</span>
          </div>
          <el-table  :data="deliverModel.productList" style="width: 100%;" >
            <el-table-column v-if="deliverModel.type == 2" prop="inStorageTime" label="入库时间"  align="center">

            </el-table-column>
            <template v-for="(item,index) in deliverModel.productConfig">
              <el-table-column v-if="item.type == 'choose'"  :label="item.label[deliverModel.type]" :width="item.width" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row[item.key[deliverModel.type]]}}</span>
                </template>
              </el-table-column>
              <el-table-column v-else-if="item.type == 'choose-type'"  :label="item.label[deliverModel.type]" :width="item.width" align="center">
                <template slot-scope="scope">
                  <el-input v-if="deliverModel.type == 1" :disabled="!scope.row[item.key[deliverModel.type]]" class="input-item-middle" v-model="scope.row[item.key[deliverModel.type]]" size="small"></el-input>

                  <span v-else>{{scope.row[item.key[deliverModel.type]]}}</span>
                </template>
              </el-table-column>
              <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>
            </template>
          </el-table>
          <div v-if="deliverModel.type == 1" class="block-item deliver-input-box">
            <div class="block-item">
              <span class="sign">预计到货时间：</span>
              <el-date-picker v-model="deliverModel.opts.productDeliveryTime" type="date"
                              placeholder="预计到货时间"
                              :picker-options="pickerOptions"
                              class="input-item-middle" size="small">
              </el-date-picker>
            </div>
            <div class="block-item">
              <span class="sign">物流商：</span>
              <el-select filterable clearable class="input-item-middle" size="small" v-model="deliverModel.opts.logisticsChannel" placeholder="请输入物流商">
                <template v-for="subItem in deliverModel.logisticsChannelList">
                  <el-option  :label="subItem.desc" :value="subItem.desc"></el-option>
                </template>
              </el-select>
            </div>
            <div class="block-item">
              <span class="sign">运单号：</span>
              <el-input  class="input-item-middle" v-model.trim="deliverModel.opts.logisticsNumber" size="small" placeholder="请输入运单号"></el-input>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button v-if="deliverModel.type == 1" @click="submitDeliver()"  type="primary">确认发货</el-button>
          <el-button @click="cancelDeliver()">取消</el-button>
        </div>
      </el-dialog>
      <!--确认入仓弹框-->
      <el-dialog title="确认入仓" :visible.sync="commitStorageModel.isShow">
        <div class="section-item">
          <div class="block-item">
            <span v-if="commitStorageModel.type == 1">本次入仓仍在进行中，暂无需确认。请等待仓库反馈实际入库数量后，确认无异议，再操作确认入仓。</span>
            <span v-else-if="commitStorageModel.type == 2">点击【确认入仓】，即代表您已认可本次入仓行为，对仓库反馈的商品实际入库数量无异议。在您【确认入仓】后，我们会自动将您的入仓商品切换至格格家仓库发货。请您知悉。</span>
          </div>

        </div>
        <div slot="footer" class="dialog-footer">
          <el-button :disabled="commitStorageModel.type == 1" @click="submitCommitStorage()" type="primary">确认入仓</el-button>
          <el-button @click="cancelCommitStorage()">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <v-load />
      <v-notice />
      <v-toast />
      <v-alert-msg v-if="!editBussWithMsg"/>
      <v-edit-info v-if="editBussWithMsg"/>
      <v-view-image />
    </div>
  </div>
</template>
<script>
  import vLeftNav from '@/components/common/LeftNav'
  import vHead from '@/components/common/Header'
  import vLoad from '@/components/tools/Loading'
  import vNotice from '@/components/tools/Notice'
  import vToast from '@/components/tools/Toast'
  import vAlertMsg from '@/components/messageCenter/alertMsg'
  import vEditInfo from '@/components/accountManage/editBusinessInfo'
  import vViewImage from '@/components/tools/ViewImage'
  import {mapState,mapGetters,mapActions} from 'vuex'
  export default {
    name: 'manageWarehouseDetail',
    components: {
      vHead,
      vLoad,
      vNotice,
      vToast,
      vAlertMsg,
      vEditInfo,
      vViewImage
    },
    data:()=>({
      sellerInStorageOrderId:'',  //入仓Id
      inStorageOrderStatus:'',    //入仓状态
      code:'',                    //入仓单编号
      isEdit:false,               //是否编辑
      editProduct:true,          //编辑商品 新建 审核不通过
      editDeliver:false,         //编辑物流
      editStorage:false,         //显示入仓
      isReady:false,              //页面展示
      config:{
        type:'Ware',
        menu:true
      }, //头部配置
      wareStoreDetail:{
          note:''
      },         //入仓明细
      detailMsgArr:[
        {
          title:'采购方信息',
          size:2,
          detail:[
            {
              label:'收货仓库',
              key:'purchaseStorage'
            },
            {
              label:'交货联系人',
              key:'purchaseContact'
            },
            {
              label:'详细地址',
              key:'purchaseAddress'
            },
            {
              label:'联系方式',
              key:'purchaseContactPhone'
            }
          ]
        },
        {
          title:'供应方信息',
          size:4,
          detail:[
            {
              label:'供应商名称',
              key:'sellerName'
            },
            {
              label:'联系人',
              key:'sellerContact'
            },
            {
              label:'收款账号',
              key:'collectionAccount'
            },
            {
              label:'SwiftCode',
              key:'swiftCode'
            },
            {
              label:'公司名称',
              key:'sellerCompanyName'
            },
            {
              label:'联系电话',
              key:'sellerContactPhone'
            },
            {
              label:'开户行',
              key:'bank'
            },
            {
              label:'银行地址',
              key:'bankAddress'
            },
            {
              label:'报价币种',
              key:'sellerCurrencyDesc'
            },
            {
              label:'采购款结算',
              key:'purchaseSettlement'
            },
            {
              label:'收款人',
              key:'payee'
            }
          ]
        }
      ],         //入仓明细配置
      wareProductConfig:[
        {
          label:'基础商品码',
          key:'baseGoodsCode',
          type:'',
          width:'100'
        },
        {
          label:'SKU码',
          key:'skuCode',
          type:'',
          width:'100'
        },
        {
          label:'商品名称-销售属性',
          key:'skuName',
          type:''
        },
        {
          label:'发货地',
          key:'deliveryArea',
          type:'',
          width:'140'
        },
        {
          label:'发货编码',
          key:'deliveryCode',
          type:'',
          width:'120'
        },
        {
          label:'毛重(克)',
          key:'grossWeight',
          type:'input',
          disabled:true,
          width:'80'
        },
        {
          label:'净重(克)',
          key:'netWeight',
          type:'input',
          width:'80'
        },
        {
          label:'生产日期',
          key:'manufacturerDate',
          type:'date',
          width:'130'
        },
        {
          label:'保质期（月）',
          key:'durabilityPeriod',
          type:'input',
          width:'100'
        },
        {
          label:'规格',
          key:'specification',
          type:'input',
          width:'100'
        },
        {
          label:'采购单位',
          key:'purchaseUnit',
          type:'purchaseUnit',
          width:'120'
        },
        {
          label:'申请入仓数',
          key:'applyCount',
          type:'input',
          width:'100'
        },
        {
          label:'供货单价',
          key:'costPrice',
          width:'100'
        },
        {
          label:'合计价值',
          type:'countPrice',
          keys:['applyCount','costPrice'],
          width:'120'
        }
      ],    //已选商品列表配置
      wareProductList:[],         //已选商品列表
      loading:true,               //商品选择列表加载
      wareProductModel:{
        isShow:false,
        selectConfig:[
          {
            type:'select',
            filterable:true,
            label:'发货地',
            placeholder:'发货地',
            key:'deliverAreaId',
            intKey:'',
            options:[]
          },
          {
            type:'input',
            label:'基础商品码',
            placeholder:'基础商品码',
            key:'baseGoodsCode',
            intKey:'',
          },
          {
            type:'input',
            label:'SKU码',
            placeholder:'SKU码',
            key:'skuCode',
            intKey:''
          },
          {
            type:'input',
            label:'发货编码',
            placeholder:'发货编码',
            key:'deliveryCode',
            intKey:''
          },
          {
            type:'input',
            label:'商品名称',
            placeholder:'商品名称',
            key:'skuName',
            intKey:''
          },
        ],       //搜索配置
        resultConfig:[
          {
            label:'基础商品码',
            key:'baseGoodsCode',
          },
          {
            label:'SKU码',
            key:'skuCode',
          },
          {
            label:'商品名称-销售属性值',
            key:'skuName',
          },
          {
            label:'发货地',
            key:'deliverArea',
          },
          {
            label:'发货编码',
            key:'deliverCode',
          },
          {
            label:'供货单价',
            key:'costPrice',
            type:'price'
          },
          {
            label:'可入仓库',
            key:'operate',
            type:'operate'
          }
        ],       //结果配置
        opts:{
          page:1,
          rows:10,
          deliverAreaId:'',
          baseGoodsCode:'',
          skuCode:'',
          deliveryCode:'',
          skuName:'',
        },     //搜索值
        productList:[],           //搜索结果
        paging:{
          currentPage:1,
          pageSizes:[10],
          pageSize:0,
          total:0,
        },             //分页
        batchList:[],              //批量选择
        batchListLog:{},
        batchListLogRow:{},
        storageId:''
      },     //商品选择弹框
      sellerDeliverList:[],       //发货地列表数据
      deliverModel:{
        isShow:false,
        type:1,                   // 1 编辑  2 查看
        code:'',
        deliverCode:'',
        deliverType:'',
        number:'',
        productList:[],           // 商品数据
        productConfig:[
          {
            label:'基础商品码',
            key:'baseGoodsCode'
          },
          {
            label:'SKU码',
            key:'skuCode'
          },
          {
            label:'商品名称-销售属性',
            key:'skuName'
          },
          {
            label:{
              1:'申请入仓数',
              2:'申请入仓数'
            },
            key:{
              1:'applyCount',
              2:'applyCount'
            },
            type:'choose'

          },
          {
            label:{
              1:'已发货数',
              2:'发货数'
            },
            key:{
              1:'alreadyDeliverCount',
              2:'sendCount'
            },
            type:'choose'
          },
          {
            label:{
              1:'本次发货数',
              2:'实际入仓数'
            },
            key:{
              1:'quantity',
              2:'actualInCount'
            },
            type:'choose-type'
          }
        ],      // 商品数据配置
        opts:{                    // 物流
          productDeliveryTime:'',
          logisticsChannel:'',
          logisticsNumber:''
        },
        logisticsChannelList:[]   //物流列表


      },         //发货弹框
      deliverList:[],             //发货列表
      deliverConfig:[
        {
          label:'发货批次',
          key:'pushTimes'
        },
        {
          label:'入库单号',
          key:'purchaseCode'
        },
        {
          label:'入库状态',
          key:'pushStatusDesc'
        },
        {
          label:'发货时间',
          key:'pushTime'
        },
        {
          label:'预计到货时间',
          key:'estimatedDeliveryTime'
        },
        {
          label:'发货SKU',
          key:'sendSkuCount'
        },
        {
          label:'发货总数',
          key:'sendTotalCount'
        },
        {
          label:'实际入库数',
          key:'actualInTotalCount'
        }
      ],        //发货列表配置
      deliverWayModel:{
        isShow:false,
        way:1,
        disabledType:''
      },      //发货方式弹框
      storageConfig:[
        {
          label:'基础商品码',
          key:'baseGoodsCode',
          type:''
        },
        {
          label:'SKU码',
          key:'skuCode',
          type:''
        },
        {
          label:'商品名称-销售属性',
          key:'skuName',
          type:''
        },
        {
          label:'发货地',
          key:'deliveryArea',
          type:''
        },
        {
          label:'发货编码',
          key:'deliveryCode',
          type:''
        },
        {
          label:'申请入仓数',
          key:'applyCount',
          type:''
        },
        {
          label:'发货数',
          key:'sendCount',
          type:''
        },
        {
          label:'实际入库数',
          key:'actualInCount',
          type:''
        },
        {
          label:'供货单价',
          key:'wholesalePrice',
          type:''
        },
        {
          label:'实际入库价值',
          key:'actualInMoney',
        }
      ],        //入仓列表配置
      storageList:[],             //入仓列表数据
      purchaseUnit:[
        {
          code:'个',
          value:'个'
        }
      ],         //采购单位
      storageListMap:{},          //入仓仓库MAP
      storageId:'',               //入仓仓库Id
      commitStorageModel:{
        isShow:false,
        type:'',
      },      //确认入仓
      hasGetStorageList:false,
      hasGetAllSkuUnit:false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      isDetailReady:false
    }),
    created (){
      this.initHome()
      this.initView()
    },
    computed: {
      detailMsg(){
        let detailMsgArr = Util.deepCopy(this.detailMsgArr)
        const chunk = (arr, size) =>
          Array.apply(null, {length: Math.ceil(arr.length / size)}).map((v, i) => arr.slice(i * size, i * size + size));

        detailMsgArr.map((item)=>{
          const size = item.size
          item.detail = Array.apply(null, {
              length:Math.ceil(item.detail.length / size)
            }).map((v,i) =>
              item.detail.slice(i * size,i * size + size)
            )
        })
        return detailMsgArr
      },
      ...mapState(['loginCheck','editBussWithMsg']),
      ...mapGetters({
        demoWareStore:'getDemoWareStore'
      }),
    },
    methods: {
      ...mapActions(['getLoginCheck','setEditWithMsg','getGoodsDeliver','callSetNotice',
      'getWareStoreDetail','getWarePreStoreDetail','getWareStoreProduct','getCommitStorage','sendStorageDelivery',
        'getWareDeliverDetail','getLogisticsChannel', 'getStorageList','getSendStorageDeliverDetail','addWareStorage','addWarePreStorage',
        'getAllSkuUnit']),
      initHome() {
        this.getLoginCheck()
          .then(() =>{
            this.isReady = true
          })

      },
      initView() {
        //check type
        this.code = this.$route.query.code
        this.isEdit = this.code ? true : false
        if(this.isEdit){
          this.getWareStoreDetail({code:this.code})
            .then((rs)=>{
              this.isDetailReady = true
              this.inStorageOrderStatus = rs.status
              this.wareStoreDetail = rs
              this.storageId = rs.purchaseStorageId

//            0 新建状态
//            1 待审核
//            2 待发货
//            3 不通过
//            4 待入库
//            5 已入库
//            6 完结
//                this.inStorageOrderStatus = 5
//              console.log(this.inStorageOrderStatus)
              if(this.inStorageOrderStatus == 0 || this.inStorageOrderStatus == 3){
                this.editProduct = true
                this.getWarePreStoreDetail({code:this.code})
                  .then((rs)=>{
                    this.wareStoreDetail = rs
                    this.storageId = rs.storageId
                    rs.skuList.map((item)=>{
                      item.costPrice = item.wholesalePrice
                    })

                    this.wareProductList = rs.skuList || []
                    this.wareProductList.map((item)=>{
                      item.edit = true
                    })
                  })
                return false
              } else {
                this.editProduct = false
              }
              //获取 商品列表
              this.wareProductList = rs.skuList || []
              rs.skuList.map((item)=>{
                item.costPrice = item.wholesalePrice
              })
              if(this.editProduct){
                this.wareProductList.map((item)=>{
                  item.edit = true
                })
              }
              if(this.inStorageOrderStatus == 2 || this.inStorageOrderStatus >=4){
                this.editDeliver = true
                //获取 发货列表
                this.deliverList = rs.pushList || []

              }
              if((this.inStorageOrderStatus == 2 || this.inStorageOrderStatus >=4) && (rs.actualSkuList && rs.actualSkuList.length)){
                this.editStorage = true
                //获取 入仓列表
                this.storageList = rs.actualSkuList || []

              }

            })
        }
        else {
          this.isDetailReady = true
          this.storageId = this.$route.query.storageId
        }
        if(!this.hasGetAllSkuUnit){
          this.getAllSkuUnit()
            .then((rs)=>{
              this.purchaseUnit = []
              rs.map((item)=>{
                  let _opts = {
                    code:item.value,
                    value:item.value
                  }
                  this.purchaseUnit.push(_opts)
              })
              this.hasGetAllSkuUnit = true
            })
        }
        if(!this.hasGetStorageList){
          this.getStorageList()
            .then((rs)=>{
              rs.map((item)=>{
                this.storageListMap[item.code] = item.name
              })
              this.hasGetStorageList = true
            })
        }


      },
      accMul(arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try { m += s1.split(".")[1].length } catch (e) { }
        try { m += s2.split(".")[1].length } catch (e) { }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
      },
      //调用新增商品
      addWareProduct() {
        if(!this.wareProductModel.selectConfig[0].options.length){
          this.getGoodsDeliver()
            .then((rs)=>{
              let list = []
              rs.map((item)=>{
                let _opt = {
                  label:item.name,
                  value:item.code+''
                }
                list.push(_opt)
              })
              this.wareProductModel.selectConfig[0].options = list
              this.queryProduct()
              this.wareProductModel.isShow = true
            })
        } else {
          this.queryProduct()
          this.wareProductModel.isShow = true
        }

      },
      //删除商品
      delProduct(idx) {
        this.wareProductList.splice(idx,1)
//        console.log(rs)
      },
      //取消新增商品
      cancelModal() {
        this.wareProductModel.isShow = false
        this.resetQuery()
        this.wareProductModel.batchList = []
        this.wareProductModel.productList = []
        this.wareProductModel.batchListLog = {}
      },
      queryProduct() {
        this.loading = true
        this.wareProductModel.opts.deliverAreaId = this.wareProductModel.opts.deliverAreaId ? this.wareProductModel.opts.deliverAreaId : this.wareProductModel.selectConfig[0].options[0].value
        let _opts = {
          opts: this.wareProductModel.opts,
          storageId:this.storageId
        }
        this.getWareStoreProduct(_opts)
          .then((rs)=>{
            this.loading = false
            this.wareProductModel.productList = rs.rows
            this.wareProductModel.paging.pageSize = Number(this.wareProductModel.opts.rows);
            this.wareProductModel.paging.currentPage = Number(this.wareProductModel.opts.page);
            this.wareProductModel.paging.total = rs.total
            let _logIndex = this.wareProductModel.batchListLog[this.wareProductModel.opts.page] || [],
                _self = this
            setTimeout(function(){
              if(_logIndex.length){
                _logIndex.map((item)=>{
                  _self.$refs.multipleTable.toggleRowSelection(_self.wareProductModel.productList[item]);
                })
              }
            },1000)

          })
      },
      resetQuery() {
        this.wareProductModel.opts = {
            page:1,
            rows:10,
            deliverAreaId:this.wareProductModel.selectConfig[0].options[0].value,
            baseGoodsCode:'',
            skuCode:'',
            deliveryCode:'',
            name:''
        }
      },
      handleSizeChange(val) {
        this.nextPage({rows:val})
      },
      handleCurrentChange(val) {
        this.nextPage({page:val})
      },
      nextPage(opts){
        let _idList = {}
        this.wareProductModel.productList.map((item,index)=>{
          _idList[item.baseGoodsCode] = index
        })
        let _logIndex = []
        this.wareProductModel.batchList.map((item)=>{
          _logIndex.push(_idList[item.baseGoodsCode])
        })
        this.wareProductModel.batchListLog[this.wareProductModel.opts.page] = _logIndex
        this.wareProductModel.batchListLogRow[this.wareProductModel.opts.page] = Util.deepCopy(this.wareProductModel.batchList)
        this.wareProductModel.opts = Object.assign({},this.wareProductModel.opts,opts)
        this.queryProduct()
      },
      handleSelectionChange(list){
        this.wareProductModel.batchList = list;
      },
      //能否选中新增商品
      selectable(row,id){
        let able = true
        this.wareProductList.map((item)=>{
          if(item.skuId == row.skuId && item.deliveryAreaId == row.deliverAreaId) {
            row.inStorageStatus = 1
            able = false
          }
        })
        able = row.inStorageStatus == 0 ? true : false
        return able
      },
      //选中新增商品
      addProductView(){
        let _batchList = Util.deepCopy(this.wareProductModel.batchList)
        for(let i in this.wareProductModel.batchListLogRow){
          if(this.wareProductModel.opts.page != i){
            _batchList = _batchList.concat(this.wareProductModel.batchListLogRow[i]);
          }
        }
        if(!_batchList.length){
            this.getToast('请选择要添加的商品')
            return false
        }
        _batchList.map((item)=>{
          let _opts = {
            baseGoodsCode:item.baseGoodsCode,
            skuName:item.skuName,
            skuCode:item.skuCode,
            deliveryAreaId:item.deliverAreaId,
            applyCount:'',
            costPrice:item.costPrice / 100,
            grossWeight: item.grossWeight,
            netWeight: '',
            durabilityPeriod:'',
            manufacturerDate:'',
            deliveryArea:item.deliverArea,
            deliveryCode:item.deliverCode,
            purchaseUnit:'',
            specification:'',
            skuId:item.skuId,
            edit:true
          }
          this.wareProductList.push(_opts)
        })
//        console.log(this.wareProductList)
        this.cancelModal()
      },

      //提交保存 保存并且审核
      submitProduct(type){
        if(!this.wareProductList.length){
          this.getToast(`请选择商品`)
          return false
        }
        let _applyKeys = ['skuCode','deliveryAreaId','applyCount','grossWeight',
        'netWeight','durabilityPeriod','manufacturerDate','deliveryArea','deliveryCode',
          'purchaseUnit','specification','skuId']
        let _list = Util.deepCopy(this.wareProductList)
        for(let i = 0;i<_list.length;i++){
          let _item = _list[i],
              name = _item.skuName
          if(!(_item.grossWeight+'')){
              this.getToast(`请填写${name}毛重`)
              return false
          } else if(!(_item.grossWeight+'').match(RegExpType.Num)){
            this.getToast(`${name}毛重格式不正确`)
            return false
          } else if(_item.grossWeight == 0){
            this.getToast(`${name}毛重不能为0`)
            return false
          } else if(!(_item.netWeight+'')){
            this.getToast(`请填写${name}净重`)
            return false
          } else if(!(_item.netWeight+'').match(RegExpType.Num)){
            this.getToast(`${name}净重格式不正确`)
            return false
          }else if(_item.netWeight == 0){
            this.getToast(`${name}净重不能为0`)
            return false
          } else if(Number(_item.grossWeight) < Number(_item.netWeight)){
            this.getToast(`${name}毛重应大于净重`)
            return false
          } else if(!_item.manufacturerDate){
            this.getToast(`请填写${name}生产日期`)
            return false
          } else if(!_item.durabilityPeriod){
            this.getToast(`请填写${name}保质期`)
            return false
          } else if(!(_item.durabilityPeriod+'').match(RegExpType.Num)){
            this.getToast(`${name}保质期不正确`)
            return false
          } else if(!_item.specification){
            this.getToast(`请填写${name}规格`)
            return false
          } else if(!_item.purchaseUnit){
            this.getToast(`请选择${name}采购单位`)
            return false
          } else if(!_item.applyCount){
            this.getToast(`请填写${name}申请入仓数`)
            return false
          } else if(!(_item.applyCount+'').match(RegExpType.Num)){
            this.getToast(`${name}申请入仓数不正确`)
            return false
          } else if(this.wareStoreDetail.note && this.wareStoreDetail.note.length > 50){
            this.getToast(`入仓单备注小于50字`)
            return false
          }
          _item.manufacturerDate = Util.formatDate('yyyy-mm-dd',new Date(_item.manufacturerDate))
          let _applyItem = {}
          _applyKeys.map((key)=>{
              _applyItem[key] = _item[key]
          })
          _item = _applyItem
//          console.log(_item.manufacturerDate)
//          delete _item.baseGoodsCode
//          delete _item.costPrice
//          delete _item.deliverArea
//          delete _item.deliverCode
//          delete _item.edit
//          delete _item.skuName

        }
        let _opts = {
          storageId:this.storageId,
          note:this.wareStoreDetail.note,
          skuList:_list,
          submitType:type
        }
        if(this.isEdit && (this.inStorageOrderStatus == 0 || this.inStorageOrderStatus == 3)){
          let _params = {
            opts:_opts,
            code:this.code
          }
          this.addWarePreStorage(_params)
            .then((rs)=>{
              this.getToast(`保存成功`)
              this.$router.push({
                path:'/manage/warehouse',
              })
            })
        }
        else {
          this.addWareStorage(_opts)
            .then((rs)=>{
              this.getToast(`保存成功`)
              this.$router.push({
                path:'/manage/warehouse',
              })
            })
        }

      },
      //选择发货方式
      chooseDeliver(){
        //判断 能否发货 和 默认发货方式
        if(this.deliverList.length){
          let _sendTotalCount = 0,
            _applyCount = 0
          this.deliverList.map((item)=>{
            _sendTotalCount += Number(item.sendTotalCount)
          })
          this.wareProductList.map((item)=>{
            _applyCount += Number(item.applyCount)
          })
          if(_sendTotalCount >= _applyCount){
            this.getToast('当前入仓单已全部发货')
            return false
          }
          this.deliverWayModel.way = 2
          this.deliverWayModel.disabledType = 1
        }
        this.deliverWayModel.isShow = true
      },
      submitChooseDeliver(){
        this.deliverModel.deliverType = this.deliverWayModel.way
        this.cancelChooseDeliver()
        this.getWareDeliverDetail({code:this.code})
          .then((rs)=>{
            this.callDeliverModel(1,rs)
          })
      },
      cancelChooseDeliver(){
        this.deliverWayModel.isShow = false
      },
      deliverDetail(code,index){
        this.getSendStorageDeliverDetail({code:code,number:index})
          .then((rs)=>{
            this.callDeliverModel(2,rs.skuList,index)
          })
      },
      callDeliverModel(type,rs,index){
        this.deliverModel.type = type
        this.deliverModel.code = this.code
        let _num = 0
        this.deliverModel.productList = Util.deepCopy(rs)
        if(type == 1){
          this.deliverModel.productList.map((item)=>{
            item.quantity = item.applyCount - item.alreadyDeliverCount
            if(item.quantity == 0){
              item.quantity = ''
            }
          })
          if(!this.deliverModel.logisticsChannelList.length){
            this.getLogisticsChannel()
              .then((rs)=>{
                this.deliverModel.logisticsChannelList = rs
              })
          }
          _num = this.wareStoreDetail.sendNumber
        }
        else {
          _num = index
        }
        this.deliverModel.number = _num
        this.deliverModel.deliverCode = this.code+'P'+(_num || '')
        this.deliverModel.isShow = true
      },
      submitDeliver(){
        //校验通过
        let _deliverList = []
        for(let i = 0;i< this.deliverModel.productList.length;i++){
            let _item = this.deliverModel.productList[i],
                _name = _item.skuName
            if(_item.quantity){
              if(_item.quantity == 0){
                this.getToast(`${_name}发货件数不能为0`)
                return false
              }
              else if(!(_item.quantity+'').match(RegExpType.Num)){
                this.getToast(`${_name}发货件数格式不正确`)
                return false
              }
              else if(Number(_item.quantity) + Number(_item.alreadyDeliverCount) > _item.applyCount){
                this.getToast(`${_name}发货件数大于当前可发货数`)
                return false
              }
              _deliverList.push(_item)
            }

        }
        if(!_deliverList.length){
          this.getToast(`至少选择一个商品发货`)
          return false
        }

        if(!this.deliverModel.opts.productDeliveryTime){
          this.getToast(`预计到货时间不能为空`)
          return false
        }
//        else if (!this.deliverModel.opts.logisticsChannel){
//          this.getToast(`物流商不能为空`)
//          return false
//        } else if (!this.deliverModel.opts.logisticsNumber){
//          this.getToast(`运单号不能为空`)
//          return false
//        } else if (!(this.deliverModel.opts.logisticsNumber+'').match(RegExpType.NumA)){
//          this.getToast(`运单号只能包含数字和字母`)
//          return false
//        }
        let _list = []
        _deliverList.map((item)=>{
            let _opts = {
              deliverCode:item.deliveryCode,
              quantity:item.quantity
            }
          _list.push(_opts)
        })
        let _opts = {
          deliverType:this.deliverModel.deliverType,
          number:this.deliverModel.number,
          expectArrivalTime:Util.formatDate('yyyy-mm-dd',new Date(this.deliverModel.opts.productDeliveryTime)),
          logisticsType:'1',
          logisticsNumber:this.deliverModel.opts.logisticsChannel,
          logisticsCode:this.deliverModel.opts.logisticsNumber,
          product:_list
        }
        this.$confirm('发货数量确认后不可修改，请确认无误后操作发货。', '提示', {
          confirmButtonText: '确认发货',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.sendStorageDelivery({opts:_opts,code:this.code})
              .then(()=>{
                this.cancelDeliver()
                this.getToast(`发货成功`)
                this.initView()
              })
          //提交
        }).catch(() => {

        });
      },
      cancelDeliver(){
        this.deliverModel.isShow = false
        this.deliverModel.opts = {
          productDeliveryTime:'',
          logisticsChannel:'',
          logisticsNumber:''
        }
        this.deliverModel.productList = []

      },

      //确认入仓
      commitStorage(){
        //判断显示
//        if(!this.deliverList.length){
//          this.commitStorageModel.type = 1
//        } else {
//          let _deliver = true
//          this.deliverList.map((item)=>{
//            if(item.actualInTotalCount == 0){
//              _deliver = false
//            }
//          })
//          this.commitStorageModel.type = _deliver ? 2 : 1
//        }
        this.commitStorageModel.type = 2
        this.commitStorageModel.isShow = true
      },
      submitCommitStorage(){
        this.getCommitStorage({code:this.code})
          .then((rs)=>{
            this.cancelCommitStorage()
            this.getToast('确认入仓成功')
            this.initView()
          })
      },
      cancelCommitStorage(){
          this.commitStorageModel.isShow = false
      },
      getToast(msg){
        const notice = {
          isShow:true,
          msg:msg,
        }
        this.callSetNotice(notice)
      },
      clickDemo(){
        this.$store.commit('DEMO_WARE_MUT',{a:1})
        this.$store.dispatch('demoWareAction',{a:1})
      }
    }
  }
</script>
<style lang='less' rel="stylesheet/less" scoped>
  .main-container{
    padding-top: 120px;
    min-height: 880px;
    margin: 0 20px;
    background-color: rgb(255,255,255);
    .title{
      margin: 0 20px;
      padding: 0;
      font-size: 20px;
      /*width: 50%;*/
    }
    .section{
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
    .section-item{
      padding:0 20px;
    }
  }
  .msg-wrap{
    .msg-title{
      font-size: 16px;
      font-weight: bold;
    }
    .msg-item{
      overflow: hidden;
      .msg-inline-item{
        width: 400px;
        float: left;
        >p{
          overflow: hidden;
          margin-bottom: 10px;
          >span{
            &:nth-child(1){
              float: left;
              display: inline-block;
              width: 80px;
            }
            &:nth-child(2){
              float: left;
              width: 320px;
            }
          }
          &.large{
            >span{
              &:nth-child(1){
                width: 110px;
              }
              &:nth-child(2){
                float: left;
                width: 290px;
              }
            }
          }
        }
      }
    }
  }
  .ware-store-list{
    .input-item-middle{
      /*width: 120px;*/
      /*padding: 0 5px;*/
      width: 90%;
    }
  }
  .ware-model{
    .sign-name-item{
      width: 90px;
    }
  }
  .deliver-input-box{
    .sign{
      display: inline-block;
      width: 100px;
      text-align: right;
    }
    .input-item-middle{
      width: 250px;
    }
  }
</style>
