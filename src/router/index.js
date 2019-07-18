import Vue from 'vue'
import Router from 'vue-router'
import Download from '@/components/common/Download'
import PlugDoc from '@/components/common/PlugDoc'
import ConfigDoc from '@/components/common/ConfigDoc'
import About from '@/components/common/About'
import UploadPlug from '@/components/common/UploadPlug'
import UploadDoc from '@/components/common/UploadDoc'
import Search from '@/components/common/Search'
import Empty from '@/components/common/Empty'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Download
    },
    {
      path: '/empty',
      name: 'Empty',
      component: Empty
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/download',
      name: 'Download',
      component: Download
    },
    {
      path:'/plugDoc',
      name:'PlugDoc',
      component: PlugDoc
    },
    {
      path:'/configDoc',
      name:'ConfigDoc',
      component: ConfigDoc
    },
    {
      path:'/about',
      name:'About',
      component: About
    },
    {
      path:'/uploadPlug',
      name:'UploadPlug',
      component: UploadPlug
    },
    {
      path:'/uploadDoc',
      name:'UploadDoc',
      component: UploadDoc
    }
  ]
})
