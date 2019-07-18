<template>
  <div id="plug-doc">
     <el-table
      :data="plugDoc"
      style="width: 100%;">
            <el-table-column
              prop="name"
              label="文档名"
              width="200">
            </el-table-column>
            <el-table-column
              prop="description"
              label="文档描述"
              width="240">
            </el-table-column>
            <el-table-column
              prop="author"
              label="文档作者"
              width="180">
            </el-table-column>
            <el-table-column
              prop="date"
              label="上传日期"
              width="200">
            </el-table-column>
            <el-table-column
              prop="downloads"
              label="下载次数"
              width="80"
              align="center">
            </el-table-column>
          <el-table-column label="操作" align="center"  width="280">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="info"
                @click="download(scope.row.id)">下载</el-button>
             </template>
          </el-table-column>
    </el-table>   
  </div>
</template>

<script>
import { getDocList } from '../../http/api';// 导入我们的api接口
import { downloadDoc } from '../../http/api';
export default {
  name: 'PlugDoc',
  created(){
      this.onLoad();
  },
  data() {
      return {
        plugDoc: []
      }
    },
  methods: {
      onLoad() {
           getDocList({tag:"interface"}).then(res =>{
              this.plugDoc = res.data;
           })
      },
      download(id){
          var params = new URLSearchParams();
          params.append('id', id);
          downloadDoc(params).then(res =>{
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

<style>

</style>