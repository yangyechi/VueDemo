<template>
  <div id = "download">
    <el-table
      :data="plugInfo"
      style="width: 100%;">
            <el-table-column
              prop="name"
              label="插件名"
              width="200">
            </el-table-column>
            <el-table-column
              prop="description"
              label="插件描述"
              width="260">
            </el-table-column>
            <el-table-column
              prop="developers"
              label="开发者"
              width="150">
            </el-table-column>
            <el-table-column
              prop="maintainers"
              label="维护者"
              width="150">
            </el-table-column>
             <el-table-column
              prop="date"
              label="上传日期"
              width="140"
              align="left">
            </el-table-column>
             <el-table-column
              prop="version"
              label="插件版本"
              width="130"
              align="center">
            </el-table-column>
            <el-table-column
              prop="downloads"
              label="下载次数"
              width="140"
              align="center">
            </el-table-column>
          <el-table-column label="操作" align="center" width="110">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="info"
                @click="handleDownload(scope.row.id)">下载</el-button>
            </template>
          </el-table-column>
    </el-table>   
  </div>
</template>
 
<script>
import { getPlugList } from '../../http/api';// 导入我们的api接口
import { downloadPlug } from '../../http/api';
export default {
  name: 'Download',
  created(){
     this.onLoad();
  },
  data() {
      return {
        plugInfo: []
      }
    },
    methods: {
       onLoad() {
           getPlugList().then(res =>{
            this.plugInfo = res.data;
        })
      },
      handleDownload(id){
          var params = new URLSearchParams();
          params.append('id', id);
          downloadPlug(params).then(res =>{
              if(res.code == 1){
                  this.$message({
                        message: res.msg,
                        type:'error',
                        showClose:true,
                        duration:1500
                  })
              } else {
                        var blob = new Blob([res]);//{type:'application/octet-stream'}
                        var fileName = this.$store.getters.getFileName;
                        if ("download" in document.createElement("a")) {
                            // 非IE下载
                            var link = document.createElement("a");
                            link.download = fileName;
                            link.style.display = "none";
                            link.href = window.URL.createObjectURL(blob);
                            document.body.appendChild(link);
                            link.click();
                            window.URL.revokeObjectURL(link.href); // 释放URL 对象
                            document.body.removeChild(link);
                        } else {
                            // IE10+下载
                            navigator.msSaveBlob(blob, fileName);
                        }
              }
          })
      }
    }
}
</script>
<style scoped>
 
</style>