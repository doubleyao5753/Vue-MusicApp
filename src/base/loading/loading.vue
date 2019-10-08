<template>
    <div class='loading'>
        <img src="~common/image/noback-loading.gif"
             alt="loading">
        <span>{{text}}</span>
    </div>
</template>

<script>
export default {
    name: 'Loading',
    props: {
        text: {
            type: String,
            default: '正在加载中...'
        }
    }
}
</script>

<style lang="stylus">
@import '~common/stylus/variable.styl';

.loading {
    text-align: center;
    color: #fff;
    font-size: 14px;

    img {
        width: 20px;
        height: 20px;
        vertical-align: bottom;
    }
}
</style>