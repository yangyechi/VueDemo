<template>
  <div id="app">
    <!--顶部导航栏-->
    <TopBar></TopBar>
    
     <!--操作区域-->
    <div id = "main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/public/TopBar'
export default {
  name: 'App',
  components:{
    TopBar
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow:hidden;
  overflow-y:auto;
}
</style>
