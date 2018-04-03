<template>
  <div>
    <div class="title">
      <span>账户与权限</span>
    </div>
    <div class="section">
      <div class="section-item padding">
        <div class="section-title">
          <span>当前账号设置</span>
        </div>
        <div class="block-item">
          账号:{{loginCheck.username}}
        </div>
        <div class="block-item">
          密码:
          <el-button size="small" type="primary" @click="changePwd(loginCheck.id,'')">修改密码</el-button>
        </div>
      </div>
      <div class="section-item">
        <div class="section-title">
          <span>角色设置</span>
          <div class="block-item">
            <el-button size="small" type="primary" @click="callEditRole()">新增角色</el-button>
          </div>
        </div>
        <div class="modal">
          <el-dialog size="tiny" @close="cancelRole()" title="角色编辑" :visible.sync="roleEditConfig.isModal">
            <el-form :model="roleEditConfig.opts" :rules="roleEditConfigRules" ref="roleEditConfig.opts">
              <el-form-item  label="角色" prop="roleName" label-width="80px">
                <el-input   v-model="roleEditConfig.opts.roleName" placeholder="角色名称" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item  label="描述" prop="roleDesc" label-width="80px">
                <el-input  v-model="roleEditConfig.opts.roleDesc" placeholder="角色描述" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item  label="权限" prop="roleFunctionRelations" label-width="80px">
                <!--:default-checked-keys="roleEditConfig.defaultChecked"-->
                <el-tree @check-change="checkedTree" ref="tree"  :data="treeList" show-checkbox node-key="id"  :props="defaultProps" auto-complete="off"></el-tree>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelRole()">取 消</el-button>
              <el-button type="primary" @click="submitRole('roleEditConfig.opts')">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
      <div class="result-view">
        <el-table :data="accountRoleList" style="width: 100%;">
          <el-table-column prop="roleName"  label="角色" width="340" align="center"></el-table-column>
          <el-table-column prop="roleDesc"  label="描述" width="340" align="center"></el-table-column>
          <el-table-column  label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="primary"  @click="callEditRole(scope.row)">编辑</el-button>
              <el-button size="small" @click="callDelRole(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="section-item">
        <div class="section-title">
          <span>其他账号设置</span>
          <div class="block-item">
            <el-button size="small" type="primary" @click="callEditAccount()">新增账号</el-button>
          </div>
        </div>
      </div>
      <div class="result-view">
        <el-table :data="accountListFilter" style="width: 100%;">
          <el-table-column prop="username"  label="账号" width="340" align="center"></el-table-column>
          <el-table-column prop="accountRoleRelations"  label="角色" width="340" align="center">
            <template slot-scope="scope">
              <span v-for="item in scope.row.accountRoleRelations">{{mapRoleID[item.sellerRoleId+'']}}&nbsp;&nbsp;</span>
            </template>
          </el-table-column>
          <el-table-column  label="操作"  align="center">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="callEditAccount(scope.row)">配置角色</el-button>
              <el-button size="small" type="primary" @click="changePwd(scope.row.id,scope.row.password)">修改密码</el-button>
              <el-button size="small" @click="callDelAccount(scope.row.id,scope.row.username)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!--账户编辑弹窗-->
      <div class="modal">
        <el-dialog size="tiny" title="账户编辑" :visible.sync="accountRoleConfig.isModal" @close="cancelEditAccount()">
          <el-form v-if="accountRoleConfig.type == 'add'" :model="accountRoleConfig.opts.add" :rules="accountRoleConfigRules" ref="accountRoleConfig.opts.add">
            <el-form-item  label="账户" prop="username" label-width="100px">
              <el-input  v-model="accountRoleConfig.opts.add.username" placeholder="请填写" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item  label="密码" prop="password" label-width="100px">
              <el-input type="password" v-model="accountRoleConfig.opts.add.password" placeholder="请填写" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item  label="确认密码" prop="remark" label-width="100px">
              <el-input type="password"  v-model="accountRoleConfig.opts.add.remark" placeholder="请填写" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item  label="角色" prop="accountRoleRelations" label-width="100px">
              <el-checkbox-group v-model="accountRoleConfig.checkList">
                <template v-for="(item,key) in roleCheckOptions">
                  <el-checkbox :label="item.roleName"></el-checkbox>
                </template>

              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <el-form v-else :model="accountRoleConfig.opts.edit" :rules="accountRoleConfigRules" ref="accountRoleConfig.opts.edit">
            <el-form-item  prop="accountRoleRelations" label="角色" label-width="100px">
              <el-checkbox-group v-model="accountRoleConfig.checkList">
                <template v-for="(item,key) in roleCheckOptions">
                  <el-checkbox :label="item.roleName"></el-checkbox>
                </template>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelEditAccount()">取 消</el-button>
            <el-button v-if="accountRoleConfig.type == 'add'" type="primary" @click="submitEditAccount('accountRoleConfig.opts.add')">确 定</el-button>
            <el-button v-else type="primary" @click="submitEditAccount('accountRoleConfig.opts.edit')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="modal">
        <el-dialog size="tiny" title="修改密码" :visible.sync="changePwdConfig.isModal"  @close="cancelChangePwd()">
          <el-form :model="changePwdConfig.opts" :rules="changePwdConfigRules" ref="changePwdConfig.opts">
            <el-form-item v-if="changePwdConfig.type == 'Main'"  prop="oldPassword" label="原密码" label-width="100px">
              <el-input  type="password" v-model="changePwdConfig.opts.oldPassword" placeholder="请填写" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item  label="新密码" label-width="100px" prop="newPassword">
              <el-input  type="password" v-model="changePwdConfig.opts.newPassword" placeholder="请填写" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item  label="确认密码" label-width="100px" prop="confirmPassword">
              <el-input  type="password" v-model="changePwdConfig.opts.confirmPassword" placeholder="请填写" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelChangePwd()">取 消</el-button>
            <el-button type="primary" @click="submitChangePwd('changePwdConfig.opts')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'authority',
    created (){
      this.initView()
    },
    data() {
      const validateArray = (rule, value, callback) => {
        if(value.length < 1){
          callback(new Error('请选择'));
        }   else {
          callback();
        }
      }
      const validateTreeList = (rule, value, callback) => {
//        console.log('======')
        if(this.roleEditConfig.opts.roleFunctionRelations.length < 1){
          callback(new Error('请选择权限'));
        }   else {
          callback();
        }
      }
      const validatePass = (rule, value, callback) => {
        const reg = /^[a-zA-Z0-9]{6,12}$/g;
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if(!value.match(reg)){
            callback(new Error('密码6-12位字母或数字组成'));
          }  else {
            callback();
//            this.$refs[this.changePwdConfig.opts].validateField('confirmPassword');
          }
        }
      }
      const validateConfPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        }
        else if (value !== this.changePwdConfig.opts.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        }
        else {
          callback();
        }
      }
      const validateRoleConfPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        }
        else if (value !== this.accountRoleConfig.opts.add.password) {
          callback(new Error('两次输入密码不一致!'));
        }
        else {
          callback();
        }
      }
      const validateCheckList = (rule, value, callback) => {
        if(this.accountRoleConfig.checkList.length < 1){
          callback(new Error('请选择角色'));
        }   else {
          callback();
        }
      }
      return {
        dialogClose:false,  //角色编辑
        changePwdConfig:{
          isModal:false,
          type:'',
          opts:{
            accountId:'',
            oldPassword:'',
            newPassword:'',
            confirmPassword:'',
          },
        }, //密码修改数据
        changePwdConfigRules:{
          oldPassword:[
            { required: true,message: '请输入密码', trigger: 'blur' }
          ],
          newPassword:[
            { required: true, validator: validatePass, trigger: 'blur' },
          ],
          confirmPassword:[
            { required: true, validator: validateConfPass, trigger: 'blur' },
          ],
        }, //密码修改规则
        mapTree:{},
        treeList:[],
        defaultProps: {
          children: 'children',
          label: 'label'
        }, //默认选中树状图
        roleEditConfig:{
          isModal:false,
          opts:{
            id:'',
            roleName:'',
            roleDesc:'',
            roleFunctionRelations:[]
          },
          sellerRoleId:'',
          defaultChecked:[]
        }, //角色修改数据配置
        roleEditConfigRules:{
          roleName:[
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          roleDesc:[
            { required: true, message: '请输入角色描述', trigger: 'blur' }
          ],
          roleFunctionRelations:[
            { required: true, validator: validateTreeList, trigger: 'change' }
          ]
        },  //角色修改规则
        accountRoleConfig:{
          isModal:false,
          id:'',
          type:'',
          opts:{
            edit:{
              id:'',
              accountRoleRelations:[],
            },
            add:{
              username:'',
              password:'',
              remark:'',
              accountRoleRelations:[],
            }
          },
          checkList: []
        }, //账户修改数据配置
        accountRoleConfigRules:{
          username:[
            { required: true, message: '请输入账户名', trigger: 'blur' }
          ],
          password:[
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          remark:[
            { required: true, validator:validateRoleConfPass, trigger: 'blur' }
          ],
          accountRoleRelations:[
//            { required: true, type: 'array', message: '请选择角色', trigger: 'change' }
            { required: true, validator: validateCheckList, trigger: 'change' }
          ],
        }, //账户修改规则
        roleCheckOptions:[],
        mapRoleID:{},
        accountListFilter:[],
        roleClick:false,
        accountRoleList:[],
        accountFunList:[]
      }
    },
    computed: {
      ...mapState(['loginCheck','sellerInfo'])
    },
    methods: {
      ...mapActions(['getAccountList','changeAccountPwd','getAccountRoleList','getAccountFunctionList',
        'saveAccountRole','delAccountRole','addAccount','changeAccountRole','delAccount',
        'callSetNotice']),
//      页面初始化
      initView(){
        this.getAccountFunctionList()
          .then((rs)=>{
//            权限列表
            this.accountFunList = rs
            this.setFunList()
          })
        this.callGetAccountRoleList()
        this.callGetAccountList()
      },
//      账户列表
      callGetAccountList(){
        this.getAccountList()
          .then((rs)=>{
            let arr = JSON.parse(JSON.stringify(rs))
            this.accountListFilter = arr.filter((item)=>this.loginCheck.id != item.id)
          })
      },
//      角色列表
      callGetAccountRoleList(){
        this.getAccountRoleList()
          .then((rs)=>{
            this.accountRoleList = rs
            this.roleCheckOptions = []
            for(let i in this.accountRoleList){
                let opt = {
                  id:this.accountRoleList[i].id,
                  roleName:this.accountRoleList[i].roleName,
                }
              this.mapRoleID[this.accountRoleList[i].id+''] = this.accountRoleList[i].roleName
              this.roleCheckOptions.push(opt)
            }
//            console.log(this.mapRoleID)
          })
      },
//      设置权限本地
      setFunList(){
        let childrenList = [];
        for(let i in this.accountFunList){
          this.mapTree[this.accountFunList[i].id] = this.accountFunList[i].functionName
            if(this.accountFunList[i].parentId == 0){
              let opts = {
                id:this.accountFunList[i].id,
                label:this.accountFunList[i].functionName,
                children:[]
              }
              this.treeList.push(opts);
            } else{
              childrenList.push(this.accountFunList[i])
            }
        }
        for(let i in childrenList){
            for(let j in this.treeList){
                if(childrenList[i].parentId == this.treeList[j].id){
                  let opts = {
                    id:childrenList[i].id,
                    label:childrenList[i].functionName,
                  }
                  this.treeList[j].children.push(opts)
                }
            }
        }
//        console.log(this.treeList)
      },
//      取消修改密码
      cancelChangePwd(){
        this.changePwdConfig.isModal = false;
        this.changePwdConfig.opts = {
          accountId:'',
          oldPassword:'',
          newPassword:'',
          confirmPassword:'',
        }
      },
//      提交密码修改
      submitChangePwd(formName){
        let isCheck = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            isCheck = true
          } else {
            isCheck = false
            return false;
          }
        })
        if(!isCheck){
            return false
        }
//         if(!this.changePwdConfig.opts.oldPassword || !this.changePwdConfig.opts.newPassword || !this.changePwdConfig.opts.confirmPassword ) {
//           this.getNotice('密码输入不能为空');
//             return false
//         }
//         const reg = /^[a-zA-Z0-9]{6,12}$/g;
//          if(!this.changePwdConfig.opts.newPassword.match(reg) || !this.changePwdConfig.opts.confirmPassword.match(reg)){
//           this.getNotice('密码格式错误6到12位字母或数字');
//           return false
//         }
//         if(this.changePwdConfig.opts.newPassword != this.changePwdConfig.opts.confirmPassword){
//           this.getNotice('确认密码输入不一致');
//           return false
//         }
         const opts = {
           accountId:this.changePwdConfig.opts.accountId,
           oldPassword:this.changePwdConfig.opts.oldPassword,
           newPassword:this.changePwdConfig.opts.newPassword,
         }
//         console.log(opts)
        this.changeAccountPwd(opts)
          .then(()=>{
             this.cancelChangePwd()
          })
      },
//      调用修改密码
      changePwd(id,pwd){
        this.changePwdConfig.isModal = true;
        this.changePwdConfig.opts = {
          accountId:id,
          oldPassword:pwd,
          newPassword:'',
          confirmPassword:'',
        }
        if(!pwd){
          this.changePwdConfig.type = 'Main'
        }else{
          this.changePwdConfig.type = ''
        }
      },
//      调用删除角色
      callDelRole(id){
//        delAccountRole
        const opts = {
          roleId:id
        }
        this.$confirm('是否删除角色', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.delAccountRole(opts)
            .then(()=>{
              this.callGetAccountRoleList()
            })
        }).catch(() => {
        });
      },
//      调用编辑角色
      callEditRole(item){
          let self = this;
          if(item){
            let updateList = [],
                defaultList =[],
                defaultCheck = [];
            let _mapTree = {}
            this.treeList.map((item)=>{
                if(item.children.length){
                  _mapTree[item.id] = item.children
                }
            })
            for(let i in item.roleFunctionRelations){
              if(!_mapTree[item.roleFunctionRelations[i].sellerFuncId]){
                let defOpt = {
                  id:item.roleFunctionRelations[i].sellerFuncId,
                  label:this.mapTree[item.roleFunctionRelations[i].sellerFuncId]
                }
                defaultCheck.push(defOpt)
              }

            }

            this.roleEditConfig.opts = {
              id:item.id,
              roleName:item.roleName,
              roleDesc:item.roleDesc,
//              roleFunctionRelations:updateList
              roleFunctionRelations:[]
            }
//            this.roleEditConfig.defaultChecked = defaultList
            this.roleEditConfig.sellerRoleId = item.id
            this.roleEditConfig.isModal = true
            let self = this;
            setTimeout(function(){
              self.$refs.tree.setCheckedNodes(defaultCheck);
            },100)
//            console.log(this.roleEditConfig.defaultChecked)
          }
          else{
            this.roleEditConfig.opts = {
              id:'',
              roleName:'',
              roleDesc:'',
              roleFunctionRelations:[]
            }
            this.roleEditConfig.sellerRoleId = ''
//            this.roleEditConfig.defaultChecked = []
            this.roleEditConfig.isModal = true
            let self = this;
            setTimeout(function(){
              self.$refs.tree.setCheckedNodes([]);
            },10)
          }

      },
//      取消编辑角色
      cancelRole(){
        this.roleEditConfig.opts = {
          id:'',
          roleName:'',
          roleDesc:'',
          roleFunctionRelations:[]
        }
        this.roleEditConfig.sellerRoleId = ''
//        this.roleEditConfig.defaultChecked = []
        this.$refs.tree.setCheckedNodes([]);
        this.$refs['roleEditConfig.opts'].resetFields()
        this.roleEditConfig.isModal = false
      },
//      提交编辑角色
      submitRole(formName){
//        if(!this.roleEditConfig.opts.roleName){
//          this.getNotice('不能为空');
//          return false
//        }
//        if(!this.roleEditConfig.opts.roleDesc){
//          this.getNotice('描述不能为空');
//          return false
//        }
        let isCheck = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            isCheck = true
          } else {
            isCheck = false
            return false;
          }
        });
        if(!isCheck){
            return false
        }
//        if(this.roleEditConfig.opts.roleFunctionRelations.length<1){
//          this.getNotice('请选择权限');
//          return false
//        }
        let _optObj = {}
        this.roleEditConfig.opts.roleFunctionRelations.map((item)=>{
          _optObj[item.sellerFuncId] = item.sellerFuncId
        })
        let _other = {}
        this.treeList.map((item)=>{
          if(item.children.length){
            item.children.map((subItem)=>{
              if(_optObj[subItem.id] && !_optObj[item.id]){
                _other[item.id] = item.id
              }
            })
          }
        })
        for(let i in _other){
          let _opts = {
            sellerRoleId: this.roleEditConfig.opts.roleFunctionRelations[0].sellerRoleId,
            sellerFuncId: _other[i],
          }
          this.roleEditConfig.opts.roleFunctionRelations.push(_opts)
        }

//        return false
//        this.roleEditConfig.opts.roleFunctionRelations.push(_opts)
        this.saveAccountRole(this.roleEditConfig.opts)
          .then(()=>{
            this.callGetAccountRoleList()
            this.cancelRole()
          })
      },
//      角色树状图选择
      checkedTree(data, checked, indeterminate){
//          console.log(checked)
//          console.log(data)
//          console.log(data.id,data.label,checked)
          if(checked){
            let opt = {
//              id:'',
              sellerRoleId:this.roleEditConfig.sellerRoleId,
              sellerFuncId:data.id,
            }
            this.roleEditConfig.opts.roleFunctionRelations.push(opt)
          }
          if(!checked){
            let idx = this.roleEditConfig.opts.roleFunctionRelations.findIndex((element)=> element.sellerFuncId == data.id)
            if(idx > -1){
              this.roleEditConfig.opts.roleFunctionRelations.splice(idx,1)
            }
          }
//          let s = '---'
//          for(let i in this.roleEditConfig.opts.roleFunctionRelations){
//              s += this.roleEditConfig.opts.roleFunctionRelations[i].label+'---'
//          }
//          console.log(s)
//          console.log(this.roleEditConfig.opts.roleFunctionRelations)
      },
//      取消修改账户
      cancelEditAccount(){
        this.accountRoleConfig.type = ''
        this.accountRoleConfig.id = ''
        this.accountRoleConfig.opts.add.accountRoleRelations = []
        this.accountRoleConfig.opts.edit.accountRoleRelations = []
        this.accountRoleConfig.isModal = false
      },
//      调用修改账户
      callEditAccount(item){
        this.accountRoleConfig.checkList = []
        if(item){
          this.accountRoleConfig.type = 'edit'
          this.accountRoleConfig.id = item.id
          for(let i in item.accountRoleRelations){
              for(let j in this.accountRoleList){
                  if(item.accountRoleRelations[i].sellerRoleId == this.accountRoleList[j].id){
                    this.accountRoleConfig.checkList.push(this.accountRoleList[j].roleName)
                  }
              }
          }
          this.accountRoleConfig.opts.add.accountRoleRelations = this.accountRoleConfig.checkList
          this.accountRoleConfig.opts.edit.accountRoleRelations = this.accountRoleConfig.checkList
        } else{
          this.accountRoleConfig.type = 'add'
        }
        this.accountRoleConfig.isModal = true
      },
//      提交修改账户
      submitEditAccount(formName){
        let isCheck = false
        let accountRoleList = []
        for(let i in this.accountRoleConfig.checkList){
          for(let j in this.accountRoleList){
            if(this.accountRoleConfig.checkList[i] == this.accountRoleList[j].roleName){
              let opts = {
                id:'',
                sellerAccountId:this.accountRoleConfig.id,
                sellerRoleId:this.accountRoleList[j].id
              }
              accountRoleList.push(opts)
            }
          }
        }
        this.accountRoleConfig.opts.add.accountRoleRelations = accountRoleList
        this.accountRoleConfig.opts.edit.accountRoleRelations = accountRoleList
        this.$refs[formName].validate((valid) => {
          if (valid) {
            isCheck = true
          } else {
            isCheck = false
            return false;
          }
        });
        if(!isCheck){
          return false
        }
        const type =  this.accountRoleConfig.type
//        console.log(type)
//        console.log(this.accountRoleConfig.checkList)
        if(type == 'add'){
//            if(!this.accountRoleConfig.opts.add.username || !this.accountRoleConfig.opts.add.password || !this.accountRoleConfig.opts.add.remark){
//              this.getNotice('不能为空');
//                return false;
//            }
//          const reg = /^[a-zA-Z0-9]{6,12}$/g;
//            if(!this.accountRoleConfig.opts.add.password.match(reg) || !this.accountRoleConfig.opts.add.remark.match(reg)){
//              this.getNotice('格式不正确6-12位字母或数字');
//              return false
//            }
//            if(this.accountRoleConfig.opts.add.password != this.accountRoleConfig.opts.add.remark){
//              this.getNotice('确认密码不相等');
//                return false
//            }
//            if(accountRoleList.length<1){
//              this.getNotice('请选择角色');
//              return false
//            }
            const opts = {
              username:this.accountRoleConfig.opts.add.username,
              password:this.accountRoleConfig.opts.add.password,
              remark:this.accountRoleConfig.opts.add.remark,
              accountRoleRelations:accountRoleList,
            }
          this.addAccount(opts)
            .then(()=>{
              this.callGetAccountList()
              this.cancelEditAccount()
            })
//            console.log(opts)
        }
        else if(type == 'edit'){
//          if(accountRoleList.length<1){
//            this.getNotice('请选择角色');
//            return false
//          }
          const opts = {
            id:this.accountRoleConfig.id,
            accountRoleRelations:accountRoleList,
          }
          this.changeAccountRole(opts)
            .then(()=>{
              this.callGetAccountList()
              this.cancelEditAccount()
            })
//          console.log(opts)
        }
      },
//      删除账户
      callDelAccount(id,name){
        const opts = {
          accountId:id
        }
        this.$confirm('是否删除账号 '+name, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.delAccount(opts)
            .then(()=>{
              this.callGetAccountList()
            })
        }).catch(() => {
        });
      },
//      错误提示
      getNotice(msg){
        const notice = {
          isShow:true,
          msg:msg,
        }
        this.callSetNotice(notice)
      },
    }
  }
</script>
<style scoped lang='less' rel="stylesheet/less">
  .section-item{
    padding: 0;
    .section-title{
      padding: 10px 20px;
      .block-item{
        float: right;
        padding: 0;
      }
    }
    &.padding{
      padding-left: 20px;
      .section-title{
        padding: 10px 0;
      }
    }
  }
  .result-view{
    margin-bottom: 20px;
  }
</style>
