import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        // 默认重定向到推荐路由组件
        redirect: '/recommend'
    },
    {
        path: '/recommend',
        name: 'Recommend',
        component: Recommend
    },
    {
        path: '/singer',
        name: 'Singer',
        component: Singer
    },
    {
        path: '/rank',
        name: 'Rank',
        component: Rank
    },
    {
        path: '/search',
        name: 'Search',
        component: Search
    },
    ]
})
