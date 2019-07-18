<template>
  <div id="upload-plug" style="padding-top:30px;padding-left:22%">
    <el-form :model="plugInfo" :rules="rules" ref="plugInfo" label-width="100px">
      <el-form-item label="插件名称" prop="name" class="text-normal">
        <el-input v-model="plugInfo.name" class="input-normal"></el-input>
      </el-form-item>
      <el-form-item label="插件描述" prop="description" class="text-normal">
        <el-input type="textarea" v-model="plugInfo.description" class="input-normal" rows="3"></el-input>
      </el-form-item>
      <el-form-item label="插件版本" prop="version" class="text-normal">
        <el-input v-model="plugInfo.version" class="input-normal"></el-input>
      </el-form-item>
      <el-form-item label="插件开发者" prop="developers" class="text-normal">
        <el-input v-model="plugInfo.developers" class="input-normal"></el-input>
      </el-form-item>
      <el-form-item label="插件维护者" prop="maintainers" class="text-normal">
        <el-input v-model="plugInfo.maintainers" class="input-normal"></el-input>
      </el-form-item>
      <el-form-item label="上传插件" prop="fileList" class="input-normal">
        <el-checkbox-group  v-model="plugInfo.fileList"> 
            <el-upload
              style="padding-right:90%"
              ref="upload"
              action="/api/PlugInfo/add"
              :show-file-list="true"
              :auto-upload="false"
              :on-change="handleChange"
              :on-remove="onRemove"
              :before-remove="beforeRemove"
              :before-upload="beforeAvatarUpload"
              :on-success="handlSuccess"
              :on-error="handlError"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="plugInfo.fileList"
            >
              <el-button slot="trigger" size="small" type="primary" :disabled="!enabledUploadBtn">点击上传</el-button>
            </el-upload>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item style="padding-right:30%;padding-top:10px;">
        <el-button type="primary" @click="submitForm('plugInfo')" :disabled="!enabledUploadBtn">立即上传</el-button>
        <el-button @click="resetForm('plugInfo')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import { uploadPlug } from '../../http/api';// 导入我们的api接口
export default {
  name: "UploadPlug",
  data() {
    return {
      fileError: false,
      enabledUploadBtn :true,
      plugInfo: {
        name: "",
        description: "",
        version: "",
        developers: "",
        maintainers: "",
        fileList: []
      },
      rules: {
         fileList: [
          {
            type: "array",
            required: true,
            message: "请上传插件",
            trigger: "change"
          }
        ],
        name: [
          { required: true, message: "请输入插件名称", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入插件描述", trigger: "blur" },
          {
            min: 10,
            max: 200,
            message: "长度在 10 到 200 个字符",
            trigger: "blur"
          }
        ],
        version: [
          { required: true, message: "请输入插件版本号", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        developers: [
          { required: true, message: "请输入插件开发者", trigger: "blur" },
          { min: 2, max: 80, message: "长度在 3 到 80个字符", trigger: "blur" }
        ],
        maintainers: [
          { required: true, message: "请输入插件维护人员", trigger: "blur" },
          { min: 2, max: 80, message: "长度在 3 到 80个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
              this.enabledUploadBtn = false;
              var params = new FormData();
              params.append("file",this.plugInfo.fileList[0].raw);
              params.append("name",this.plugInfo.name);
              params.append("description",this.plugInfo.description);
              params.append("version",this.plugInfo.version);
              params.append("developers",this.plugInfo.developers);
              params.append("maintainers",this.plugInfo.maintainers);
             
              //基于action上传文件
              //this.$refs.upload.submit();
              uploadPlug(params).then(res =>{
                  if(res.code === 0){
                      this.$message({
                          message: "上传成功！",
                          type:'success',
                          showClose:true,
                          duration:1000
                      })
                  } else {
                      this.$message({
                          message: res.msg,
                          type:'error',
                          showClose:true,
                          duration:1500
                      })
                  }
                  //清除表单信息
                  this.resetForm('plugInfo');
              })
              this.enabledUploadBtn = true;
          } else {
              console.log('error submit!!');
              return false;
          }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.upload.clearFiles();
    },
    handleExceed(files, fileList) {
      this.$message({
          message:  `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 
          ${files.length + fileList.length} 个文件`,
          type:'warning',
          showClose:true,
          duration:1200
      })
    },
    handleChange(file, fileList) {
      var flag = 0;
      this.fileError = false;
      var fileName = file.name;
      var suffixName = fileName.substring(fileName.indexOf(".") + 1);
      const isZIP = suffixName === "zip";
      const isRAR = suffixName === "rar";
      const isJAR = suffixName === "jar";
      const isLt20M = file.size / 1024 / 1024 < 20;

      if (!isZIP && !isRAR && !isJAR) {
        this.fileError = true;
        this.$message({
            message: "上传文件必须是zip/rar/jar 格式!",
            type:'error',
            showClose:true,
            duration:1500
        })
        this.$refs.upload.clearFiles();
        flag = 1;
      }
      if (!isLt20M) {
        this.fileError = true;
        this.$message({
            message: "上传文件大小不能超过 20MB!",
            type:'error',
            showClose:true,
            duration:1500
        })
        this.$refs.upload.clearFiles();
        flag = 1;
      }
      if(flag == 0){
          this.plugInfo.fileList = fileList;
      }
    },
    onRemove(file, fileList){
        this.plugInfo.fileList = fileList;
    },
    beforeRemove(file, fileList) {
      if (!this.fileError) {
          return this.$confirm(`确定移除 ${file.name}？`);
      }
      else{
          return true;
      } 
    },
    beforeAvatarUpload(file) {
        this.enabledUploadBtn = false;
    },
    handlSuccess(response, file, fileList){
        this.enabledUploadBtn = true;
    },
    handlError(err, file, fileList){
        this.enabledUploadBtn = true;
    }
  }
};
</script>

<style>
.text-normal {
  padding-top: 1px;
}
.input-normal {
  width: 60%;
  align-content: center;
  padding-right: 90%;
}
</style>