<template>
  <div id="upload-doc" >
    <el-form :model="document" :rules="rules" ref="document" label-width="100px" style="padding-top:30px;padding-left:22%">
      <el-form-item label="文档名称" prop="name" class="text-normal">
        <el-input v-model="document.name" class="input-normal"></el-input>
      </el-form-item>
      <el-form-item label="文档描述" prop="description" class="text-normal">
        <el-input type="textarea" v-model="document.description" class="input-normal" rows="3"></el-input>
      </el-form-item>
      <el-form-item label="文档作者" prop="author" class="text-normal">
        <el-input v-model="document.author" class="input-normal"></el-input>
      </el-form-item>
       <el-form-item label="相关插件" prop="plug_id" class="select-normal">
         <el-select v-model="document.plug_id" filterable placeholder="请选择"  >
           <el-option
            size="10"
            v-for="item in plugList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文档类型" prop="tag" class="select-normal">
         <el-select v-model="document.tag" filterable placeholder="请选择"  >
           <el-option
            size="10"
            v-for="item in tags"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传文档" prop="fileList" class="text-normal" >
        <el-checkbox-group  v-model="document.fileList"> 
            <el-upload     
            style="padding-right:90%"
            ref="upload"
            :auto-upload="false"
            action="/api/PlugInfo/add"
            :on-change="handleChange"
            :on-remove="onRemove"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="document.fileList"
            >
              <el-button slot="trigger" size="small" type="primary" :disabled="!enabledUploadBtn">点击上传</el-button>
            </el-upload>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item style="padding-right:30%;padding-top:10px;">
        <el-button type="primary" @click="submitForm('document')" :disabled="!enabledUploadBtn">立即上传</el-button>
        <el-button @click="resetForm('document')" :disabled="!enabledUploadBtn">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
import { uploadDoc } from '../../http/api';// 导入我们的api接口
import { getPlugIdAndName } from '../../http/api';// 导入我们的api接口
export default {
  name: "UploadDoc",
  created(){
     this.onLoad();
  },
  data() {
    return {
      fileError: false,
      enabledUploadBtn :true,
      plugList: [],
      tags:[{value:'config',label:'配置文档'},{value:'interface',label:'接口文档'}],
      document: {
        plug_id:'',
        name: '',
        description: '',
        author: '',
        tag: '',
        fileList: [],
      },
      rules: {
        fileList:[
            {type:'array',required: true,message: '请上传插件',trigger: 'change'}
        ],
        name: [
          { required: true, message: "请输入文档名称", trigger: "blur" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入文档描述", trigger: "blur" },
          {
            min: 10,
            max: 200,
            message: "长度在 10 到 200 个字符",
            trigger: "blur"
          }
        ],
        author: [
          { required: true, message: "请输入文档作者", trigger: "blur" },
          { min: 2, max: 50, message: "长度在 2 到 50个字符", trigger: "blur" }
        ],
        plug_id: [
          { required: true, message: "请选择该文档对应的插件", trigger: "change" },
        ],
        tag: [
          { required: true, message: "请选择该文档所属类型", trigger: "change" },
        ],
      }
    };
  },
  methods: {
    onLoad() {
           getPlugIdAndName().then(res =>{
            this.plugList = res.data;
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
            if (valid) {
              this.enabledUploadBtn = false;
              var params = new FormData();
              params.append("file",this.document.fileList[0].raw);
              params.append("name",this.document.name);
              params.append("plugId",this.document.plug_id);
              params.append("description",this.document.description);
              params.append("author",this.document.author);
              params.append("tag",this.document.tag);
              //基于action上传文件
              //this.$refs.upload.submit();
              uploadDoc(params).then(res =>{
                  if(res.code === 0){
                       this.$message({
                        message:'上传成功！',
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
                  this.resetForm('document');
              })
            } else {
                console.log('error submit!!');
                return false;
            }         
      });
      this.enabledUploadBtn = true;
    },
    resetForm(formName) {
       this.$refs[formName].resetFields();
       this.$refs.upload.clearFiles();
    },
    handleExceed(files, fileList) {
      this.$message({
          message: `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 
          ${files.length + fileList.length} 个文件`,
          type:'warning',
          showClose:true,
          duration:1500
      })
    },
    handleChange(file, fileList) {
      var flag = 0;
      this.fileError = false;
      var fileName = file.name;
      var suffixName = fileName.substring(fileName.indexOf(".") + 1);
      const isZIP = suffixName === "zip";
      const isRAR = suffixName === "rar";
      const isDOC = suffixName === "doc";
      const isDOCX = suffixName === "docx";
      const isPDF = suffixName === "pdf";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isZIP && !isRAR && !isDOC && !isDOCX && !isPDF) {
        this.fileError = true;
        this.$message({
            message: "上传文件必须是zip/rar/doc/docx/pdf 格式!",
            type:'error',
            showClose:true,
            duration:1500
        })
        this.$refs.upload.clearFiles();
        flag = 1;
      }
      if (!isLt2M) {
        this.fileError = true;
        this.$message({
            message: "上传文件大小不能超过 2MB!",
            type:'error',
            showClose:true,
            duration:1500
        })
        this.$refs.upload.clearFiles();
        flag = 1;
      }
      if(flag == 0){
        this.document.fileList = fileList;
      }
    },
    beforeRemove(file, fileList) {
      if (!this.fileError){
            return this.$confirm(`确定移除 ${file.name}？`);
      } 
      else{
            return true;
      }
    },
    onRemove(file, fileList){
        this.document.fileList = fileList;
    }
  }
};
</script>

<style>
.text-normal {
  padding-top: 1px;
}
.input-normal {
  width: 70%;
  align-content: center;
  padding-right: 50%;
}
.select-normal{
  width: 30%;
  align-content: center;
  padding-right: 80%;
}
</style>