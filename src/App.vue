<template>
    <div id="app">
        <m-header></m-header>
        <tab></tab>
        <!-- 动态组件缓存下的路由出口 -->
        <keep-alive>
            <router-view />
        </keep-alive>
        <player></player>
    </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
// Player 播放器在整个全局都可使用，所以应该放在根组件下
import Player from 'components/player/player'
export default {
    name: 'App',
    components: {
        MHeader,
        Tab,
        Player
    }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/variable.styl';
</style>
