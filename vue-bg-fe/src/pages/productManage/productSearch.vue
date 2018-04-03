<template>
  <div>
    <div class="title">
      <span>商品管理</span>
      <div class="fl-r pd-r">
        <el-button v-if="!isFreeze"  @click="editProduct()" type="primary" size="small">新建商品</el-button>
      </div>
    </div>
    <div class="section">
      <v-search-item />
      <v-search-menu />
      <v-search-result />
    </div>
  </div>
</template>

<script>
  import vSearchItem from '@/components/productManageBack/searchItem'
  import vSearchMenu from '@/components/productManageBack/searchMenu'
  import vSearchResult from '@/components/productManageBack/searchResult'
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'productSearch',
    created (){
      this.initSearch()
    },
    computed: {
      ...mapState(['currentSearch','isFreeze'])
    },
    data: () => ({
      productSearch: {
        searchList: {
          public: [
            {
              type:'',
              key:'page',
              intKey:1
            },
            {
              type:'',
              key:'rows',
              intKey:20
            },
            {
              type:'',
              key:'levelOne',
            },
            {
              type:'',
              key:'levelTwo',
            },
            {
              type:'',
              key:'levelThree',
            },
            {
              type: 'select',
              label: '审核状态',
              placeholder:'请选择',
              key: 'status',
              selectType:'selectAll',
              options:[
                {
                value:'all',
                label: '全部'
                },
                {
                  value: '1',
                  label: '未审核'
                },
                {
                  value: '2',
                  label: '审核中'
                },
                {
                  value: '3',
                  label: '审核未通过'
                },
                {
                  value: '4',
                  label: '审核通过'
                },
              ]
            },
            {
              type: 'select',
              label: '出售状态',
              placeholder:'请选择',
              key: 'saleStatus',
              selectType:'selectAll',
              options:[
                {
                  value:'all',
                  label: '全部'
                },
                {
                  value: '0',
                  label: '未出售'
                },
                {
                  value: '1',
                  label: '出售中'
                }
              ]
            },
            {
              type: 'input',
              label: '商品ID',
              placeholder:'请输入商品ID',
              key: 'id'
            },
            {
              type: 'input',
              label: '商品条码',
              placeholder:'请输入商品条码',
              key: 'barcode'
            },
            {
              type: 'input',
              label: '商品名称',
              placeholder:'请输入商品名称',
              key: 'name',
              width:'323.5'
            },
          ],
          private: []
        },
        searchMenu: {
          public: [
            {
              label: '查询',
              style: 'primary',
              type: 'submit'
            },
          ],
          private:[
            {
              label: '导出',
              type: 'export',
            },
            {
              label: '重置',
              type: 'reset',
            }
          ]
        },
        resultItem: {
          option: [
            {
              fixed: 'left',
              label: '商品ID',
              key: 'id',
              width:'60'
            },
            {
              label: '商品主图',
              key: 'image1',
              type: 'image',
              width:'120'
            },
            {
              label: '商品名称',
              key: 'name',
              type: 'title',
              width:''
            },
            {
              label: '销售状态',
              key: 'saleStatus',
              type: 'saleStatus',
              width:'80'
            },
            {
              label: '审核状态',
              key: 'status',
              type: 'status',
              width:'80'
            },
            {
              label: '销量',
              key: 'salesCount',
              width:'80'
            },
            {
              label: '总库存',
              key: 'allStock',
              width:'80'
            },
            {
              label: '锁定库存',
              key: 'lockStock',
              width:'80'
            },
            {
              label: '剩余库存',
              key: 'surplusStock',
              width: '80'
            },
            {
              fixed: 'right',
              type: 'opera',
              label: '操作',
              width: '140'
            }
          ],
          opera: {
            items: [
              {
                type: 'toDetail',
                label: '编辑',
                key: 'id',
              },
              {
                type: 'status',
                key: 'status'
              }
            ]
          }
        },
      }
    }),
    methods: {
      ...mapActions(['setSearch']),
      initSearch() {
        this.setSearch(this.productSearch)
      },
      editProduct() {
        this.$router.push({
          path: '/product/edit',
        })
      }
    },
    components: {
      vSearchItem,
      vSearchMenu,
      vSearchResult
    }
  }
</script>
