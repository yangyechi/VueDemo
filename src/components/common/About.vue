<template>
  <div id="about">
       <div id = "team-img">
          <el-carousel :interval="4000" type="card" :height="imgHeight" style="padding-top:30px">
            <el-carousel-item v-for="img in imgs" :key="img.id">
              <el-row>
                <el-col :span="24"><img style="margin:auto" ref="imgHeight" :src="img.idView" class="banner_img"/></el-col>
              </el-row>
            </el-carousel-item>
          </el-carousel>
       </div>
      <div id = "text-des">
          <p>所属团队：西南科技大学软件测试实验室</p>
          <p>指导教师：李绘卓</p>
          <p>开发者：杨野驰</p>
      </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data(){
    return{
      imgHeight:'400px',
      imgs:[
       {id: 0, idView: require('../../assets/1.jpg')},
       {id: 1, idView: require('../../assets/2.jpg')},
       {id: 2, idView: require('../../assets/3.jpg')},
       {id: 3, idView: require('../../assets/4.jpg')}
      ]
    }
  }
}
</script>

<style>
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  #text-des{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB",
               "Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  .banner_img{
    width:100%;
    height: 100%;
  }
</style>