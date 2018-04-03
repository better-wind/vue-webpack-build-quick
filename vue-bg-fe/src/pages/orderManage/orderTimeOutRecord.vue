<template>
  <div>
    <div class="title">
      <span>超时订单报备记录</span>
    </div>
    <div class="section">
      <v-search-item />
      <v-search-menu />
      <v-search-result />
    </div>
  </div>
</template>
<script>
  import vSearchItem from '@/components/orderManage/searchItem'
  import vSearchMenu from '@/components/orderManage/searchMenu'
  import vSearchResult from '@/components/orderManage/recordResult'
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'orderTimeOutRecord',
    created (){
      this.initSearch()
    },
    data: () => ({
      orderSearch: {
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
              type: 'select',
              label: '报备类型',
              placeholder:'请选择',
              key: 'applyType',
              selectType:'selectAll',
              options:[
                {
                  value: 'all',
                  label: '全部'
                },
                {
                  value: '0',
                  label: '订单异常'
                },
                {
                  value: '1',
                  label: '超时发货'
                },
              ]
            },
            {
              type: 'select',
              label: '审核结果',
              placeholder:'请选择',
              key: 'status',
              selectType:'selectAll',
              options:[
                {
                  value: 'all',
                  label: '全部'
                },
                {
                  value: '0',
                  label: '审核中'
                },
                {
                  value: '1',
                  label: '不计赔偿通过'
                },
                {
                  value: '2',
                  label: '不通过'
                },
                {
                  value: '3',
                  label: '计赔偿通过'
                }
              ]
            },
          ],
          private: [
            {
              type: 'date-picker',
              label: '提交时间',
              placeholder:'请选择',
              key: 'createTimeStart',
              checkNextDate:'createTimeEnd',
              split:true
            },
            {
              type: 'date-picker',
              label: '',
              placeholder:'请选择',
              key: 'createTimeEnd',
              checkPreDate:'createTimeStart'
            },
            {
              type: 'select',
              label: '发货地',
              placeholder:'请选择',
              key: 'sellerId',
              options:[]
            },
          ]
        },
        searchMenu: {
          public: [
            {
              label: '查询',
              style: 'primary',
              type: 'submit'
            },
            {
              label: '重置',
              type: 'reset',
            }
          ],
          private:[
            {
              label:'提交超时发货报备',
              style: 'primary',
              type:'editTimeOutRecord'
            },
            {
              label:'异常订单报备记录',
              style: 'primary',
              type:'AbnormalRecord'
            }
          ],
        },
        resultItem: {
          type: 'timeout',
          option: [
            {
              fixed: 'left',
              label: '审核结果',
              key: 'statusStr',
              width:'80'
            },
            {
              label: '报备类型',
              key: 'applyTypeStr',
              width:'100'
            },
            {
              label: '发货地',
              key: 'sendAddress',
              width:'100',
              type:'sendAddress'
            },
            {
              label: '订单产生时间',
              key: 'startTime',
              width:'200',
              type:'InterValTime'
            },
            {
              label: '时长',
              key: 'diffTime',
              width:'140',
              type: 'diffTime'
            },
            {
              label: '预计发货时间',
              key: 'extendValue',
              width:'180',
              type:'extendTypeTime'
            },
            {
              label: '申报理由',
              key: 'reason',
              width:'180',
              type: 'reason'
            },
            {
              label: '提交时间',
              key: 'createTime',
              width:'180',
              type:'time'
            },
            {
              fixed:'right',
              type: 'opera',
              label: '附件',
              width:'80'
            }
          ],
          opera: {
            items: [
              {
                type: 'download',
                label: '下载',

              },
            ]
          }
        }
      },
    }),
    methods: {
      ...mapActions(['setSearch','getDeliveryArea']),
      initSearch() {
        this.getDeliveryArea()
          .then((rs)=>{
            this.setDeliveryListOpt(rs)
        })
        this.setSearch(this.orderSearch)
      },
      setDeliveryListOpt(rs){
        let opts = [];
        rs.forEach((item,idx)=>{
          const opt = {
            label:item.sendAddress,
            value:item.id + ''
          }
          opts.push(opt)
        })
        this.orderSearch.searchList.private[2].options = opts
      },
    },
    components: {
      vSearchItem,
      vSearchMenu,
      vSearchResult
    }
  }
</script>
