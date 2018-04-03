<template>
  <div>
    <div class="title">
      日常活动提报
    </div>
    <div class="section">
      <v-search-item />
      <v-search-menu />
      <v-search-result />

    </div>
  </div>
</template>
<script>
  import vSearchItem from '@/components/activityManage/searchItem'
  import vSearchMenu from '@/components/activityManage/searchMenu'
  import vSearchResult from '@/components/activityManage/searchResult'
  import {mapState, mapActions} from 'vuex'
  export default{
    name:'dailyReport',
    created (){
      this.initSearch()
    },
    computed: {
      ...mapState(['currentSearch'])
    },
    data: () => ({
      reportSearch:{
        searchList: {
          public:[
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
              type:'input',
              label:'主题ID',
              placeholder:'请输入',
              key:'activityId'
            },
            {
              type:'input',
              label:'活动主题',
              placeholder:'请输入',
              key:'activityName',
              width:'365'
            },
            {
              type: 'select',
              label: '活动渠道',
              placeholder:'请选择',
              key: 'activityType',
              selectType:'selectAll',
              options:[
                {
                  value: 'all',
                  label: '全部'
                },
                {
                  value: '1',
                  label: '格格家'
                },
                {
                  value: '2',
                  label: '环球捕手'
                },
                {
                  value: '5',
                  label: '格格家供应链'
                },
                {
                  value: '6',
                  label: '脉宝云店'
                },
                {
                  value: '8',
                  label: '美食买手'
                }
              ]
            },
            {
              type: 'select',
              label: '活动状态',
              placeholder:'请选择',
              key: 'activityState',
              selectType:'selectAll',
              options:[
                {
                  value: 'all',
                  label: '全部'
                },
//                {
//                  value: '0',
//                  label: '未开始'
//                },
                {
                  value: '1',
                  label: '活动进行中'
                },
                {
                  value: '2',
                  label: '已停用'
                },
              ]
            },
            {
              type: 'select',
              label: '提报状态',
              placeholder:'请选择',
              key: 'activityApplyState',
              selectType:'selectAll',
              options:[
                {
                  value: 'all',
                  label: '全部'
                },
                {
                  value: '0',
                  label: '未提报'
                },
                {
                  value: '1',
                  label: '已提报'
                },
              ]
            },
          ],
          private:[]
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
        },
        resultItem: {
          option: [
            {
              fixed:'left',
              label: '活动ID',
              key: 'id',
              width:'80'
            },
            {
              label: '活动主题',
              key: 'name',
              width:''
            },
            {
              label: '活动渠道',
              key: 'type',
              width:'100',
              type: 'type'
            },
            {
              label: '活动状态',
              key: 'isAvailable',
              width:'80',
              type:'dailyAvailable'
            },
            {
              label: '活动频率',
              key: 'frequency',
              width:'80',
              type:'frequency'
            },
            {
              label: '日常活动时间',
              key: 'timeDesc',
              width:'120'
            },
            {
              label: '提报状态',
              key: 'joinCount',
              width:'80',
              type:'joinCount',
            },
            {
              label: '提报合计',
              key: 'joinCount',
              width:'80'
            },
            {
              label: '审核通过',
              key: 'passCount',
              width:'80'
            },
            {
              label: '审核不通过',
              key: 'denyCount',
              width:'80'
            },
            {
              fixed:'right',
              label: '操作',
              type: 'opera',
              key: '',
              width:'80'
            }
          ],
          type:'daily',
          opera: {
            items: [
              {
                type: 'toDetail',
                label: '申报',
                key: '',
                val: '',
                source: 'search'
              },
            ]
          }
        },
      },
    }),
    methods: {
      ...mapActions(['setSearch']),
      initSearch() {
        this.setSearch(this.reportSearch)
      }
    },
    components: {
      vSearchItem,
      vSearchMenu,
      vSearchResult
    }
  }
</script>
