<template>
    <transition name="slide">
        <div class="singer-detail">
            我只是一个子组件，覆盖掉了原来的组件而已
        </div>
    </transition>
</template>

<script>
export default {
    name: 'SingerDetail',

}
</script>

<style lang="stylus">
@import '~common/stylus/variable';

.singer-detail {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $color-background;
}

.slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
}
</style>