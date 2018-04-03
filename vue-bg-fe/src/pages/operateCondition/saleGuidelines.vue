<template>
  <div>
    <div class="title">
      <span>联系我们</span>
    </div>
    <div class="section">
      <div class="section-item">
        <template v-for="tItem in tableGuide">
          <div class="section-title mg-t mg-b">
            <span>{{tItem.title}}</span>
          </div>
          <div class="result-view">
            <el-table :data="tItem.guidelinesTable"  style="width: 100%">
              <el-table-column align="center" prop="dockingDepartment" label="对接部门" width="180"></el-table-column>
              <el-table-column align="center" prop="handlingMatters" label="处理事项" width="280">
                <template slot-scope="scope">
                  <div v-for="(item,idx) in scope.row.handlingMatters" style="padding: 0 10px;text-align: left">
                    {{idx + 1}}、{{item}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="contact" label="联系方式" >
                <template slot-scope="scope">
                  <div v-for="item in scope.row.contact">
                    <div v-if="item.split('/').length == 1">
                      {{item}}
                    </div>
                    <div v-else style="text-align: center">
                      <div style="display: inline-block;width: 80px;text-align: left">{{item.split('/')[0]}}</div>
                      <div style="display: inline-block;width: 50px;text-align: left">{{item.split('/')[1]}}</div>
                      <div style="display: inline-block;width: 120px;text-align: left">{{item.split('/')[2]}}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="enclosure" label="附件" width="180">
                <template slot-scope="scope">
                  <div v-for="item in scope.row.enclosure">
                    <a :href="item.url">{{item.name}}</a>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="time" label="处理时效" width="100">
              </el-table-column>

            </el-table>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    data:()=>({
      tableGuide:[
        {
          title:'超时报备与申诉',
          guidelinesTable:[
            {
              dockingDepartment:'QC部',
              handlingMatters:[
                '报备超时发货',
              ],
              contact:[
                '系统超时发货报备模块完成'
              ],
              enclosure:[],
              time:'2个工作日'
            },
            {
              dockingDepartment:'平台运营管理部',
              handlingMatters:[
                '系统物流超时申诉处理'
              ],
              contact:[
                '系统超时订单列表申诉完成'
              ],
              enclosure:[],
              time:'3个工作日'
            },
            {
              dockingDepartment:'QC部',
              handlingMatters:[
                '商家系统报备未发货异常订单咨询',
                '系统无法报备的未发货异常情况（只针对于系统不支持的异常报备情况提交表格）'
              ],
              contact:[
                'yichangdingdan@gegejia.com'
              ],
              enclosure:[
                {
                  name:'《未发货异常报备》',
                  url:'/static/file/未发货异常报备.xlsx'
                }
              ],
              time:'2个工作日'
            },
          ]
        },
        {
          title:'售后服务',
          guidelinesTable:[
            {
              dockingDepartment:'客服部',
              handlingMatters:[
                '商家所有已发货异常订单的对接',
                '已发货异常原因包含：发货后无物流、途中快递异常等一切需与客服沟通事宜'
              ],
              contact:[
                'kefuduijie@gegejia.com'
              ],
              enclosure:[
                {
                  name:'《已发货异常报备》',
                  url:'/static/file/已发货异常报备.xlsx',
                }
              ],
              time:'2个工作日'
            },
            {
              dockingDepartment:'客服部',
              handlingMatters:[
                '消费者开票信息异常反馈',
              ],
              contact:[
                'huangqq@gegejia.com',
              ],
              enclosure:[
              ],
              time:'2个工作日'
            },
          ]
        },
        {
          title:'财务结算',
          guidelinesTable:[
            {
              dockingDepartment:'运营管理部',
              handlingMatters:[
                '合作协议&商家规则的咨询',
                '对平台客服处理的售后及结算赔偿款有质疑发起的申诉'
              ],
              contact:[
                'seller@gegejia.com'
              ],
              enclosure:[
                {
                  name:'《商家售后申诉规范表》',
                  url:'/static/file/商家售后申诉规范表.xlsx',
                }
              ],
              time:'3个工作日'
            },
            {
              dockingDepartment:'财务部',
              handlingMatters:[
                '货款结算咨询',
                '结款差异调整'
              ],
              contact:[
                'finance@gegejia.com'
              ],
              enclosure:[],
              time:'3个工作日'
            },
          ]
        },
        {
          title:'业务对接',
          guidelinesTable:[
            {
              dockingDepartment:'产品部',
              handlingMatters:[
                  '商家系统问题'
              ],
              contact:[
                  'QQ：644506774'
              ]
            },
            {
              dockingDepartment:'运营管理部',
              handlingMatters:[
                '合同对接',
                '开户行修改',
                'ERP对接'
              ],
              contact:[
                'zhangss@gegejia.com'
              ],
              enclosure:[
                {
                  name:'《账户变更函模板》',
                  url:'/static/file/账户变更函模板.docx'
                },
                {
                  name:'《格家网络ERP对接申请函》',
                  url:'/static/file/格家网络ERP对接申请函.docx'
                }
              ],
              time:'2个工作日'
            },
            {
              dockingDepartment:'商品部',
              handlingMatters:[
                '招商咨询',
                '活动选品',
                '商品审核',
                '商品定价',
                '商品上、下架'
              ],
              contact:[
                '母婴：/东玲/QQ:1285574909',
                '保健：/蔡晓敏/QQ:545479689',
                '休闲零食：/肖德仁/QQ:3259004990',
                '美妆个护：/缪心成/QQ:398885828',
                '水果：/肖琼道/QQ:2885014391',
                '生鲜：/田黎/QQ:649639326',
                '百货：/柳俊杰/QQ:424232661',
                '乳制品：/谷定/QQ:2885014541',
                '茶饮酒水：/谷定/QQ:2885014541',
                '格格厨房：/谷定/QQ:2885014541'
              ],
              enclosure:[],
              time:''
            }
          ]
        }
      ]
    })
  }
</script>
