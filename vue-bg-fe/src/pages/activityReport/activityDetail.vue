<template>
  <div>
    <div class="title">
      活动提报详情
    </div>
    <div class="section">
      <div class="section-item">
        <div class="block-item">
          <span>活动ID：{{activityDetailMsg.id}}</span>
          <span>活动主题：{{activityDetailMsg.name}}</span>
          <span v-if="activityDetailMsg.type">活动渠道：
            <span v-for="item in activityDetailMsg.type.split(',')">
                  {{mapType[item]}}
            </span>
          </span>
        </div>
        <div class="block-item" v-if="detailCon.source == 'daily'">
          <span>活动频率：{{mapFrequency[activityDetailMsg.frequency]}}</span>
          <span>日常活动时间：{{activityDetailMsg.timeDesc}}</span>
        </div>
        <template v-if="detailCon.source == 'large'">
          <div class="block-item" >
            <span>活动介绍：{{activityDetailMsg.desc}}</span>
          </div>
          <div class="block-item">
            <span>活动报名时间：{{activityDetailMsg.applyStartTime}} - {{activityDetailMsg.applyEndTime}}</span>
          </div>
          <div class="block-item">
            <span>活动时间：{{activityDetailMsg.activityStartTime}} - {{activityDetailMsg.activityEndTime}}</span>
          </div>
        </template>
        <div class="block-item">
          <template v-if="detailCon.source == 'large'">
            <span>活动状态：{{getLargeAvailable(activityDetailMsg.activityStartTime,activityDetailMsg.activityEndTime,'status')}}</span>

          </template>
          <span v-else-if="detailCon.source == 'daily'"> 活动介绍：{{activityDetailMsg.desc}}</span>

          <span v-if="activityDetailMsg.joinCount">提报状态：已提报</span>
          <span v-else >提报状态：未提报</span>
        </div>
      </div>
      <template v-if="detailCon.type == 'edit' && tableActivityJoinList.length">
        <div class="result-view">
          <el-table v-loading="loading" border element-loading-text="拼命加载中" :data="tableActivityJoinList"  style="width: 100%;" >
            <template v-for="(item,index) in JoinResultItem.option">
              <template v-if="item.fixed == 'left'" >
                <el-table-column fixed  :prop="item.key" :label="item.label" :width="item.width" align="center">
                  <template slot-scope="scope">
                    <div class="el-table-image">
                      <img :src="scope.row[item.key]" alt="">
                    </div>
                  </template>
                </el-table-column>
                <!--<el-table-column  fixed  v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center" ></el-table-column>-->
              </template>
              <template v-else-if="item.fixed == 'right' " fixed="right">
                <template v-if="detailCon.source == 'daily'">
                  <el-table-column  v-if="item.type == 'opera'" :width="item.width" :label="item.label"  align="center" >
                    <template slot-scope="scope">
                      <el-button v-if="scope.row.productStatus == 1" type="primary" @click="callCancelJoin(scope.row.id)" size="small">撤回</el-button>
                    </template>
                  </el-table-column>
                </template>
              </template>
              <template v-else >
                <el-table-column v-if="item.type == 'status'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                  <template slot-scope="scope">
                    <span>{{mapJoinStatus[scope.row.status]}}</span>
                  </template>
                </el-table-column>
                <el-table-column v-else-if="item.type == 'sendAddress'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                  <template slot-scope="scope">
                    <div class="deliver-item-wrap">
                      <div class="deliver-item" v-for="deliver in scope.row[item.key].split(',')">
                        {{deliver}}
                      </div>
                    </div>
                    <!--{{scope.row[item.key].split(',')}}-->
                  </template>
                </el-table-column>
                <el-table-column v-else-if="item.type == 'productStatus'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                  <template slot-scope="scope">
                    <template v-if="scope.row.status == 2">

                      <span v-if="detailCon.source == 'daily'">{{mapJoinProductStatus[scope.row.productStatus]}}</span>
                      <span v-else-if="detailCon.source == 'large'">{{mapJoinLargeProductStatus[scope.row.productStatus]}}</span>
                    </template>
                    <span v-else>未参与</span>
                  </template>
                </el-table-column>
                <el-table-column v-else-if="item.type == 'isLimitStock'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.isLimitStock == 1">{{scope.row.stock}}</span>
                    <span v-else>否</span>
                  </template>
                </el-table-column>
                <el-table-column v-else-if="item.type == 'isFreeFreight'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.isFreeFreight == 1">是</span>
                    <span v-else>否</span>
                  </template>
                </el-table-column>
                <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>
              </template>
            </template>
          </el-table>
        </div>
        <div class="pagination-item">
          <el-pagination
            @size-change="handleJoinSizeChange"
            @current-change="handleJoinCurrentChange"
            :current-page="pagingJoin.currentPage"
            :page-sizes="pagingJoin.pageSizes"
            :page-size="pagingJoin.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagingJoin.total">
          </el-pagination>
        </div>
      </template>
      <div class="section-item">
        <template v-if="detailCon.source == 'large'">
          <el-button v-if="activityDetailMsg.isAvailable == 1 && getLargeAvailable(activityDetailMsg.applyStartTime,activityDetailMsg.applyEndTime,'opera') == 1" type="primary" @click="callAddProduct()">新增商品</el-button>
        </template>
        <template v-else-if="detailCon.source == 'daily'">
          <el-button v-if="activityDetailMsg.isAvailable == 1" type="primary" @click="callAddProduct()">新增商品</el-button>
        </template>
        <!--<el-button  type="primary" @click="callAddProduct()">新增商品</el-button>-->
      </div>
      <div v-if="submitProductList.length" class="result-view">
        <el-table border :data="submitProductList"  style="width: 100%;" >
          <template v-for="(item,index) in submitResultItem.option">
            <template v-if="item.fixed == 'left'" >
              <el-table-column  fixed  v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center" >
                <template slot-scope="scope">
                  <div style="margin:10px auto;width: 80px;height: 80px;">
                    <img style="width: 100%" :src="scope.row[item.key]" alt="">
                  </div>
                </template>
              </el-table-column>
            </template>
            <template v-else-if="item.fixed == 'right'" >
              <el-table-column fixed="right"  v-if="item.type == 'opera'" :width="item.width" :label="item.label"  align="center" >
                <template slot-scope="scope">
                  <!--<template v-for="(operaItem,operaIndex) in resultItem.opera.selectItems">-->
                  <!--<el-button v-if="operaItem.type== 'select'" type="primary" @click="selectProduct(scope.row[operaItem.key])" size="small">{{operaItem.label}}</el-button>-->
                  <el-button  @click="delSubmitProduct(scope.row.skuId)" size="small">删除</el-button>
                  <!--</template>-->
                </template>
              </el-table-column>
            </template>
            <template v-else >
              <el-table-column v-if="item.key == 'activityWholesalePrice'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                <template slot-scope="scope">
                  <el-input size="small"  v-model="scope.row.activityWholesalePrice"></el-input>
                </template>
              </el-table-column>
              <el-table-column v-else-if="item.key == 'deliverAreaList'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                <template slot-scope="scope">
                  <div class="deliver-item-wrap">
                    <div class="deliver-item" v-for="deliver in scope.row.deliverAreaList">
                      {{deliver[item.itemKey]}}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-else-if="item.key == 'isLimitStock'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                  <template slot-scope="scope">
                    <el-radio class="radio" v-model="scope.row.isLimitStock" label="0">否</el-radio>
                    <el-radio class="radio" v-model="scope.row.isLimitStock" label="1">是</el-radio>
                    <el-input style="width: 50px" v-if="scope.row.isLimitStock == 1" size="small" v-model="scope.row.stock"></el-input>
                  </template>
                </el-table-column>
              <el-table-column v-else-if="item.key == 'isFreeFreight'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                <template slot-scope="scope">
                  <el-radio class="radio" v-model="scope.row.isFreeFreight" label="1">是</el-radio>
                  <el-radio class="radio" v-model="scope.row.isFreeFreight" label="0">否</el-radio>
                </template>
              </el-table-column>
              <el-table-column v-else-if="item.key == 'applyRemark'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.applyRemark"></el-input>
                </template>
              </el-table-column>
              <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>
            </template>
          </template>
        </el-table>
      </div>
      <div class="menu-center" v-if="submitProductList.length">
        <el-button  type="primary"  @click="submitProduct()" >提交</el-button>
      </div>
      <el-dialog class="product-panel" size="largeActivity" :visible.sync="productConfig.isShow" @close="cancelSelectProduct()">
        <div class="section">
          <div class="section-item">
            <div style="margin-bottom: 8px">
              <v-cate :categoryConfig="categoryConfig"/>
            </div>
            <div class="inline-item" v-for="(item,index) in searchItem">
              <span v-if="item.label" class="sign-name-item">{{item.label}}：</span>
              <template v-if="item.type=='input'">
                <el-input v-if="item.width" class="input-item-middle" :style="'width:'+item.width+'px'" size="small" v-model="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder"></el-input>
                <el-input v-else class="input-item-middle" size="small" v-model="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder"></el-input>
              </template>
              <el-select v-if="item.type=='select'" class="input-item-middle" size="small" v-model="currentSearchQuery[item.key]" v-bind:placeholder="item.placeholder">
                <template v-for="subItem in item.options">
                  <el-option  :label="subItem.label" :value="subItem.value"></el-option>
                </template>
              </el-select>
            </div>
            <div class="inline-item" style="width: 400px;text-align: right">
              <el-button type="primary" size="small" @click="searchProduct()">查询</el-button>
              <el-button size="small" @click="resetSearch()">重置</el-button>
            </div>
          </div>
          <div class="result-view" >
            <el-table border @scroll="onScroll($event)" :data="searchResult" height="240" style="width: 100%;" >
              <template v-for="(item,index) in resultItem.option">
                <template v-if="item.fixed == 'left'" >
                  <el-table-column  fixed  v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center" ></el-table-column>
                </template>
                <template v-else-if="item.fixed == 'right'" >
                  <el-table-column   v-if="item.type == 'opera'" :width="item.width" :label="item.label"  align="center" >
                    <template slot-scope="scope">
                       <el-button  type="primary" @click="selectProduct(scope.row.skuId)" size="small">选择</el-button>
                    </template>
                  </el-table-column>
                </template>
                <template v-else >

                  <el-table-column v-if="item.type == 'deliverAreaList'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                    <template  slot-scope="scope">
                      <div class="deliver-item-wrap">
                        <div class="deliver-item" v-for="deliver in scope.row.deliverAreaList">
                          {{deliver[item.key]}}
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>
                </template>
              </template>
            </el-table>
          </div>
          <div class="pagination-item">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="paging.currentPage"
              :page-sizes="paging.pageSizes"
              :page-size="paging.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="paging.total">
            </el-pagination>
          </div>
          <template v-if="selectProductList.length">
            <div class="section-item">
              <div class="inline-item">
                已选择商品：
              </div>
            </div>
            <div class="result-view ">
              <el-table border :data="selectProductList" height="240" style="width: 100%;" >
                <template v-for="(item,index) in resultItem.option">
                  <template v-if="item.fixed == 'left'" >
                    <el-table-column  fixed  v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center" ></el-table-column>
                  </template>
                  <template v-else-if="item.fixed == 'right'">
                    <el-table-column   v-if="item.type == 'opera'" :width="item.width" :label="item.label"  align="center" >
                      <template slot-scope="scope">
                        <el-button  @click="delSelectProduct(scope.row.skuId)" size="small">删除</el-button>
                      </template>
                    </el-table-column>
                  </template>
                  <template v-else >
                    <el-table-column v-if="item.type == 'deliverAreaList'" :prop="item.key" :label="item.label" :width="item.width" align="center">
                      <template  slot-scope="scope">
                        <div class="deliver-item-wrap">
                          <div class="deliver-item" v-for="deliver in scope.row.deliverAreaList">
                            {{deliver[item.key]}}
                          </div>
                        </div>

                      </template>
                    </el-table-column>
                    <el-table-column v-else :prop="item.key" :label="item.label" :width="item.width" align="center"></el-table-column>
                  </template>
                </template>
              </el-table>
            </div>
          </template>
          <div class="menu-center">
            <el-button v-if="selectProductList.length" type="primary" @click="saveSelectProduct()" size="small">保存</el-button>
            <el-button  size="small" @click="cancelSelectProduct()">取消</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import vCate from '@/components/productManage/category'
  import {mapState, mapActions} from 'vuex'
  export default {
    name:'activityDetail',
    created (){
        this.initView()
    },
    computed: {
      ...mapState(['currentSearchQuery']),
    },
    data: () => ({
      mapType:{
        1:'格格家',
        2:'环球捕手',
        5:'格格家供应链',
        6:'脉宝云店',
        8:'美食买手'
      },
      mapJoinStatus:{
        1:"审核中",
        2:"成功",
        3:"失败"
      },
      mapJoinProductStatus:{
        1:"等待排期",
        2:"取消",
        3:"提前结束",
        4:"已排期"
      },
      mapJoinLargeProductStatus:{
        1:"正常",
        2:"取消",
        3:"提前结束",
      },
      mapFrequency:{
        0:'一日一次',
        1:'一日两次',
        2:'一日三次',
        3:'一周一次',
        4:'一周两次',
        5:'一周三次',
        6:'一月一次',
        7:'一月两次',
        8:'一月三次'
      },
      productConfig:{
        isShow:false
      },
      categoryConfig:{
        type: 'search',
        label:'类目',
        items:[
          {
            type:'select',
            label:'',
            key:'firstCategoryId',
            intKey:'',
            placeholder:'一级分类',
            options:[]
          },
          {
            type:'select',
            label:'',
            key:'secondCategoryId',
            intKey:'',
            placeholder:'二级分类',
            options:[]
          },
          {
            type:'select',
            label:'',
            key:'thirdCategoryId',
            intKey:'',
            placeholder:'三级分类',
            options:[]
          },
          {
            type:'select',
            label:'',
            key:'fourthCategoryId',
            intKey:'',
            placeholder:'四级分类',
            options:[]
          }
        ],
      },
      searchItem:[
        {
          type: 'select',
          label: '发货地',
          placeholder:'请选择发货地',
          key: 'deliverAreaId',
          options:[]
        },
        {
          type: 'input',
          label: '发货编码',
          placeholder:'请输入发货编码',
          key: 'deliverCode'
        },
//        {
//          type: 'select',
//          label: '出售状态',
//          placeholder:'请选择',
//          key: 'statusCode',
//          options:[
//            {
//              value: '0',
//              label: '未出售'
//            },
//            {
//              value: '1',
//              label: '出售中'
//            }
//          ]
//        },
        {
          type: 'input',
          label: '商品名称',
          placeholder:'请输入商品名称',
          key: 'skuName',
          width:'323.5'
        },
      ],
      resultItem:{
        option:[
          {
            fixed: 'left',
            label: '商品名称',
            key: 'skuName',
            width:''
          },
          {
            label: '发货地',
            key: 'deliverAreaName',
            width:'150',
            type:'deliverAreaList'
          },
          {
            label: '发货编码',
            key: 'deliverCode',
            width:'150',
            type:'deliverAreaList'
          },
          {
            label: '剩余库存',
            key: 'availCount',
            width:'80',
            type:'deliverAreaList'
          },
          {
            label: '当前供货价',
            key: 'costPrice',
            width:'120'
          },
          {
            fixed:'right',
            type: 'opera',
            label: '操作',
            width:'80'
          }
        ],
        opera: {
          selectItems:[
            {
              type: 'select',
              label: '选择',
              key: 'id',
            },
          ],

        }
      },
      JoinResultItem:{
        option:[
          {
            label: '商品主图',
            fixed: 'left',
            key: 'skuImg',
            type: 'image',
            width:'120',
          },
          {
            label: '商品名称',
            key: 'skuName',
            type: 'title',
            width:'200'
          },
//          {
//            label: '发货地',
//            key: 'sendAddress',
//            width:'200',
//            type:'sendAddress'
//          },
          {
            label: '发货编码',
            key: 'deliverCode',
            type:'sendAddress',
            width:'200'
          },
          {
            label: '当前供货价',
            key: 'wholesalePrice',
            width:'80'
          },
          {
            label: '剩余库存',
            key: 'availCount',
            width:'80'
          },
          {
            label: '活动供货价',
            key: 'activityWholesalePrice',
            width:'80',
          },
          {
            label: '库存限制',
            key: 'isLimitStock',
            width:'80',
            type:'isLimitStock'
          },
          {
            label: '是否包邮',
            key: 'isFreeFreight',
            width:'80',
            type:'isFreeFreight'
          },
          {
            label: '备注',
            key: 'applyRemark',
            width:'80',
          },
          {
            label: '审核状态',
            key: 'status',
            width:'80',
            type:'status',
          },
          {
            label: '参与状态',
            key: 'productStatus',
            width:'80',
            type:'productStatus'
          },
          {
            fixed:'right',
            type: 'opera',
            label: '操作',
            width: '80'
          }
        ],
        opera: {
          selectItems:[
            {
              type: 'select',
              label: '选择',
              key: 'id',
            },
          ],

        }
      },
      submitResultItem:{
        option:[
          {
            fixed: 'left',
            label: '商品主图',
            key: 'imgUrl',
            width:'100'
          },
          {
            label: '商品名称',
            key: 'skuName',
            type: 'title',
            width:'200'
          },
          {
            label: '发货地',
            itemKey: 'deliverAreaName',
            width:'200',
            key:'deliverAreaList'
          },
          {
            label: '发货编码',
            itemKey: 'deliverCode',
            width:'150',
            key:'deliverAreaList'
          },
          {
            label: '当前供货价',
            key: 'costPrice',
            width:'100'
          },
          {
            label: '活动供货价',
            key: 'activityWholesalePrice',
            width:'140',
          },
          {
            label: '库存限制',
            key: 'isLimitStock',
            width:'180',
          },
          {
            label: '是否包邮',
            key: 'isFreeFreight',
            width:'150',
          },
          {
            label: '备注',
            key: 'applyRemark',
            width:'140',
          },
          {
            fixed:'right',
            type: 'opera',
            label: '操作',
            width: '80'
          }
        ],
        opera: {
          selectItems:[
            {
              type: 'select',
              label: '选择',
              key: 'id',
            },
          ],

        }
      },
      submitProductList:[], //提交商品列表
      submitProductIdList:[],
      mapSubmitProductId:{},//提交商品id 对应 idx
      searchResult:[], //弹窗 搜索结果
      mapProduct:{}, //弹窗 搜索商品id 对应 idx
      mapSelectProductId:{},//弹窗选择后商品id 对应 idx
      selectProductList:[], //弹窗选择商品列表
      selectProductIdList:[], //弹窗选择商品Id列表
      searchPage:1, //弹窗搜索页数 分页
      searchSize:5,//弹窗搜索大小 分页
      paging:{
        currentPage:1,
        pageSizes:[5],
        pageSize:0,
        total:0,
      },
      pagingJoin:{
        currentPage:1,
        pageSizes:[10],
        pageSize:0,
        total:0,
      },
      isLast:false, //弹窗是否最后一页
      mapListReady:false,
      detailCon:{
        id:'',
        type:'',
        source:''
      },
      isActivityJoinList:false,
      activityJoinOpts:{
        activityId:'',
        page:1,
        rows:10
      },
      loading:true,
      tableActivityJoinList:[],
      activityDetailMsg:{},
      activityJoinList:{}
    }),
    methods: {
      ...mapActions(['getActivitySkuList','setCurrentSearchQuery','setClearSelect','getActivityDetail',
        'getActivityJoinSkuList','activitySkuJoin','cancelSkuJoin','callSetNotice','getGoodsDeliver']),
      //页面初始
      getLargeAvailable(start,end,type){
        const tStart = new Date(start),
          tEnd = new Date(end),
          tNow = new Date();
        let status = '',
          opera = 0;
        if(tNow < tStart){
          status = '未开始'
//          opera = 1
        } else if(tNow >= tStart && tNow < tEnd) {
          status = '进行中'
          opera = 1
        } else if(tNow >= tEnd){
          status = '已结束'
        }
        return type == 'status' ? status : opera
      },
      initView(){
        this.detailCon = this.$route.query
        const opt = {
          activityId:this.detailCon.id
        }
        this.getActivityDetail(opt)
          .then((rs)=>{
            this.activityDetailMsg = rs
          })
        if(this.detailCon.type == 'edit'){
            this.activityJoinOpts.activityId = this.detailCon.id
            this.callPageJoinList()
        }
      },
      callPageJoinList(){
        this.loading = true
        this.getActivityJoinSkuList(this.activityJoinOpts)
          .then((rs)=>{
            this.activityJoinList = rs
            this.tableActivityJoinList = this.activityJoinList.rows || []
            this.pagingJoin.currentPage = Number(this.activityJoinOpts.page)
            this.pagingJoin.pageSize = Number(this.activityJoinOpts.rows)
            this.pagingJoin.total = Number(this.activityJoinList.total)
            this.loading = false
          })
      },
      handleJoinSizeChange(val) {
        this.activityJoinOpts.rows = val
        this.callPageJoinList()
      },
      handleJoinCurrentChange(val) {
        this.activityJoinOpts.page = val
        this.callPageJoinList()
      },
      //新增商品
      callAddProduct(){
        this.initSearch()
        this.pageSearch(this.searchPage,this.searchSize)
        if(this.searchItem[0].options.length) return false
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
            this.searchItem[0].options = list
          })
      },
      //设置搜索选项
      initSearch(){
        let query = {
          skuName: null,
          firstCategoryId: null,
          secondCategoryId: null,
          thirdCategoryId: null,
          page: 1,
          rows: 5,
//          statusCode: 1,
          deliverAreaId: null,
          deliverCode:null
        }
        this.searchPage = 1
        this.searchSize = 5
        this.setCurrentSearchQuery(query);
      },
      //搜索商品

      pageSearch(page,size){
        let query =  this.currentSearchQuery
        for(let i in query){
            query[i] = query[i] ? query[i] : null
        }
        query.page = page
        query.rows = size
        this.getActivitySkuList(query)
          .then((rs)=>{
            this.searchResult = rs.rows
            this.paging.currentPage = Number(query.page)
            this.paging.pageSize = Number(query.rows)
            this.paging.total = Number(rs.total)

            this.mapSelectProduct()
            this.productConfig.isShow = true
          })
      },

      handleSizeChange(val){

      },
      handleCurrentChange(val) {
        this.pageSearch(val,this.searchSize)
      },
      //商品id和商品信息对应
      mapSelectProduct() {
        for(let i in this.searchResult){
          this.mapProduct[this.searchResult[i].skuId] = this.searchResult[i]
        }
      },
      //查询商品
      searchProduct(){
        this.searchPage = 1
        this.searchSize = 5
        this.pageSearch(this.searchPage,this.searchSize)
      },
      //选择商品
      selectProduct(id){

        if(this.checkSelectId(id)){
          this.selectProductIdList.push(id)
          this.selectProductList.push(this.mapProduct[id])
          this.callMapSelectProductId()
        } else {
            this.getNotice('商品已经存在')
        }
      },
      //判断选择的商品是否已选
      checkSelectId(id){
        let isCheck = true
//        console.log(this.activityJoinList)
        if(this.detailCon.type == 'edit'){
          for(let i in this.activityJoinList.rows){
              if(this.detailCon.source == 'large'){
                if(id == this.activityJoinList.rows[i].skuId && (this.activityJoinList.rows[i].status == 1 || (this.activityJoinList.rows[i].status == 2 && this.activityJoinList.rows[i].productStatus == 1))){
                  isCheck = false
                }
              }
              else if (this.detailCon.source == 'daily'){
                if(id == this.activityJoinList.rows[i].skuId && (this.activityJoinList.rows[i].status == 1  || (this.activityJoinList.rows[i].status == 2 && this.activityJoinList.rows[i].productStatus == 1))){
                  isCheck = false
                }
              }
          }
        }
        if(this.selectProductIdList.includes(id)){
          isCheck = false
        }
        if(this.submitProductIdList.includes(id)){
          isCheck = false
        }

        return isCheck
      },
      //选择的商品 id 对应 idx
      callMapSelectProductId(){
        this.mapSelectProductId={}
        this.selectProductIdList.forEach((item,idx)=>{
          this.mapSelectProductId[item] = idx
        })
      },
      //提交的商品 ID 对应 idx
      callMapSubmitProduct(){
        this.mapSubmitProductId = {}
        this.submitProductIdList = []
        this.submitProductList.forEach((item,idx)=>{
          this.mapSubmitProductId[item.skuId] = idx
          this.submitProductIdList.push(item.skuId)
        })
        this.mapListReady = true
      },
      //删除选择的商品
      delSelectProduct(id){
        const idx = this.mapSelectProductId[id]
        this.selectProductIdList.splice(idx,1)
        this.selectProductList.splice(idx,1)
        this.callMapSelectProductId()
      },
      //删除要提交的商品
      delSubmitProduct(id){
        const idx = this.mapSubmitProductId[id]
        this.submitProductList.splice(idx,1)
        this.submitProductIdList.splice(idx,1)
        this.callMapSubmitProduct()
      },
      //保存选择商品
      saveSelectProduct(){
        for(let i in this.selectProductList){
            let obj = {}
            obj.imgUrl = this.selectProductList[i].imgUrl
            obj.skuId = this.selectProductList[i].skuId
            obj.activityWholesalePrice = ''
            obj.isFreeFreight = "1"
            obj.costPrice = this.selectProductList[i].costPrice
            obj.isLimitStock = "0"
            obj.applyRemark = ''
            obj.skuName = this.selectProductList[i].skuName
            obj.stock = ''
            obj.deliverAreaList = this.selectProductList[i].deliverAreaList
            this.submitProductList.push(obj)
        }
        this.callMapSubmitProduct()
        this.cancelSelectProduct()
      },
      resetSearch(){
        this.initSearch()
        this.setClearSelect({isClear:true})
      },
      cancelSelectProduct(){
        this.selectProductIdList = []
        this.selectProductList = []
        this.mapProduct = {}
        this.mapSelectProductId = {}
        this.searchResult = []
        this.setClearSelect({isClear:true})
        this.productConfig.isShow = false
      },
      submitProduct(){
        if(this.detailCon.source == 'large'){
            const status = this.getLargeAvailable(this.activityDetailMsg.applyStartTime,this.activityDetailMsg.applyEndTime,'opera')
            if(status != 1){
              this.getNotice('活动已停止提报')
              return false
            }
        }
        let subList = [];
        for(let i in this.submitProductList){
          if(!this.submitProductList[i].activityWholesalePrice){
              this.getNotice('请填写商品的活动供货价')
              return false
          }
          if(!(this.submitProductList[i].activityWholesalePrice+'').match(RegExpType.Price)){
            this.getNotice('活动供货价格式不正确')
            return false
          }
          if(this.submitProductList[i].activityWholesalePrice >= Number(this.submitProductList[i].costPrice)){
            this.getNotice('活动供货价须小于当前供货价')
            return false
          }
          if(this.submitProductList[i].isLimitStock == 1 && !this.submitProductList[i].stock){
            this.getNotice('请填写库存')
            return false
          }
          if(this.submitProductList[i].isLimitStock == 1 && !(this.submitProductList[i].stock+'').match(RegExpType.Num)){
            this.getNotice('库存格式不正确')
            return false
          }
          if(this.submitProductList[i].applyRemark.length > 30){
            this.getNotice('商品备注长度小于30字符')
            return false
          }
          let obj = {}
          obj.applyRemark = this.submitProductList[i].applyRemark
          obj.activityWholesalePrice = this.submitProductList[i].activityWholesalePrice
          obj.isFreeFreight = this.submitProductList[i].isFreeFreight
          obj.isLimitStock = this.submitProductList[i].isLimitStock
          obj.skuId = this.submitProductList[i].skuId
          if(obj.isLimitStock == 1){
            obj.stock= this.submitProductList[i].stock
          }
          subList.push(obj)
        }
        const opts = {
          activityId:this.detailCon.id,
          applyList:subList
        }
        console.log(opts)
        this.$confirm('是否确认提交', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
            this.callJoinActivity(opts)
        }).catch(() => {});
      },
      callJoinActivity(opts){
        this.activitySkuJoin(opts)
          .then(()=>{
          let sLink = ''
            this.submitProductList = []
              this.$router.replace({
              path: '/activity/detail/goods',
              query:{
                id: this.detailCon.id,
                type:'edit',
                source:this.detailCon.source,
              }
            })
            this.detailCon.type = 'edit'
//            this.activityJoinOpts.activityId = this.detailCon.id
//            this.callPageJoinList()
            this.initView()
        })
      },
      callCancelJoin(id){
        this.$confirm('是否确认撤销', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          const opt = {
            activityId:this.detailCon.id,
            applyId:id
          }
          this.cancelSkuJoin(opt)
            .then(()=>{
              this.activityJoinOpts.page = 1
              this.activityJoinOpts.rows = 10
              this.callPageJoinList()
            })
        }).catch(() => {});
      },
      getNotice(msg){
        const notice = {
          isShow:true,
          msg:msg,
        }
        this.callSetNotice(notice)
      },
    },
    components: {
      vCate
    },
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .block-item{
    span{
      display: inline-block;
      margin-right: 20px;
    }
  }
  .section-item{
    .el-dialog--large{
      top:5%!important;
    }
  }
  .product-panel{
    .section{
      padding-bottom: 0;
      .section-item{
        padding-top: 0;
        margin-bottom: 10px;
        .inline-item{
          padding: 5px 20px 5px 0;
        }
      }
      .pagination-item,.menu-center{
        padding: 10px 0;
      }
      .input-item-middle{
        width: 180px;
      }
    }
  }
  .deliver-item-wrap{
    .deliver-item{
      padding: 10px 2px;
      border-top: 1px solid rgb(236, 223, 223);
      &:nth-child(1){
        border-top: none;
      }
    }
  }

</style>
