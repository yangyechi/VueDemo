<template>
<div id = "top-bar">
  <el-container style="height:60px">
    <el-header>     
      <div id = "title">
        <p>C/C++语言代码评阅插件系统</p>
      </div>
      <div id = "search-input">
        <el-input
            placeholder="搜索插件"
            prefix-icon="el-icon-search"
            v-model="search"
           @keyup.enter.native="searchFile">
        </el-input>`
      </div>
      <div id = "navigation-bar">
          <el-menu 
          router :default-active="$route.path"
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">         
            <el-menu-item index="/download">插件下载</el-menu-item>         
            <el-menu-item index="/plugDoc">接口文档</el-menu-item>
            <el-menu-item index="/configDoc">配置文档</el-menu-item> 
            <el-menu-item index="/uploadPlug" v-if="isShow" >插件上传</el-menu-item>
            <el-menu-item index="/uploadDoc" v-if="isShow" >文档上传</el-menu-item>     
            <el-menu-item index="/about">关于</el-menu-item>       
          </el-menu>
      </div>
      <div id = "login">
         <el-button type="text" @click="clickLoginBtn()" class="font">{{isLogin}}</el-button>
          <el-dialog title="登录" :visible.sync="dialogFormVisible">
            <el-form :model="user" :rules="rules" ref="user">
                <el-form-item label="账号" prop = "username" :label-width="formLabelWidth" >
                  <el-input v-model="user.username" autocomplete="off" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop = "password" :label-width="formLabelWidth">
                   <el-input v-model="user.password" autocomplete="off" placeholder="密码" show-password></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary"  @click="submitForm('user')">确 定</el-button>
            </div>
          </el-dialog>
      </div>
    </el-header>
  </el-container>
  </div>
</template>
 
<script>
import { postLoginInfo } from '../../http/api';// 导入我们的api接口
export default {
  name: "TopBar",
  created(){
    /*
        var that=this;
        document.onkeydown=function(e){
            var key=window.event.keyCode;
            if(key==13){
                that.submitForm('user');
            }
        }*/
  },
  data() {
      return {
        loginStatus:'登录',
        search: '',
        dialogFormVisible: false,
        user: {
           username:'',
           password:'',
        },
        formLabelWidth: '120px',
        rules: {
            username:[
                {required: true,message: '请输入账号',trigger: 'blur'},
                { min: 5, max: 18, message: "长度在 6 到 30 个字符", trigger: "blur" }
            ],
            password: [
                  { required: true, message: "请输入密码", trigger: "blur" },
                  { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" }
            ]
        }
      };
  },
  computed:{
      isShow(){
            if(sessionStorage.getItem('token') && sessionStorage.getItem('isAdmin')){
                //this.$store.commit("setAdminStatus",true);
                this.$store.dispatch("changeAdminStatus",true);
            }          
           return this.$store.getters.getAdminStatus;
      },
      isLogin(){
          if(sessionStorage.getItem('token')){
                //this.$store.commit("login",sessionStorage.getItem('token'));
                this.$store.dispatch("login",sessionStorage.getItem('token'));                
          }
          return this.$store.getters.getLoginStatus?'退出登录':'登录'
      }
  },
  methods:{
     submitForm(user){
        this.$refs[user].validate((valid) => {
          if (valid) {
             postLoginInfo(this.user).then(res =>{
                  //console.log("错误码（成功：0 错误： 1）：" + res.code);
                  //console.log("描述：" + res.msg);
                  if(res.code === 0){
                       this.loginStatus = '退出登录'
                       this.$message({
                            message: "登录成功",
                            type:'success',
                            showClose:true,
                            duration:1000
                       })
                       this.dialogFormVisible = false;
                       this.$router.push({path: '/'});
                       this.$store.dispatch("login",res.data.token);
                       if(res.data.role === 'admin'){
                          this.$store.dispatch("changeAdminStatus",true);
                       }
                  } else {
                       this.$message({
                            message: "账号或密码错误",
                            type:'error',
                            showClose:true,
                            duration:1000
                       })
                       this.user.username = '';
                       this.user.password = '';
                  }
             })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
     },
     clickLoginBtn(){
          if(this.$store.getters.getLoginStatus){
                  this.dialogFormVisible = false;
                  this.loginStatus = '登录';
                  this.$message({
                      message: "已退出登录",
                      type:'success',
                      showClose:true,
                      duration:1000
                  })
                  this.$store.dispatch("logOut");
                  this.$router.push({path: '/'});
                  this.user.username = '';
                  this.user.password = '';
          } else{
                this.dialogFormVisible = true
          }
     },
     searchFile(){
       this.$store.dispatch("changeSearchContent",this.search);
       this.$router.push({path: '/empty'});
     }
  }
};
</script>
<style scoped>
#top-bar{
  height: 60px;
  background-color:#545c64;
}
#title{
  font-size: 22px;
  color: aliceblue;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB",
               "Microsoft YaHei","微软雅黑",Arial,sans-serif;
  text-align: left;
  width: 25%;
  height: 0px;
  position:absolute;
  top: 1px;
}
#search-input{
  width: 15%;
  height: 0px;
  left: 28%;
  top: 18px;
  position: absolute;
}
#navigation-bar{
   height: 0px;
   width: 50%;
   padding-left: 45%;
}
#login{
  height: 0px;
  position: absolute;
  left:93%;
  top:18px;
}
.font{
  font-size: 18px;
  color: aliceblue;
  
}
</style>