import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'

// 子路由
import SingerDetail from 'components/singer-detail/singer-detail'
import GedanDetail from 'components/gedan-detail/gedan-detail'
import RankDetail from 'components/rank-detail/rank-detail'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend,
      children: [{
        path: ':id',
        component: GedanDetail
      }]
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children: [{
        path: ':id',
        component: SingerDetail
      }]
    },
    {
      path: '/rank',
      name: 'Rank',
      component: Rank,
      children: [{
        path: ':id',
        component: RankDetail
      }]
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    }
  ]
})
