<template>
    <div class="music-list">
        <div class="back"
             @click="backPage">
            <i class="icon-back"></i>
        </div>
        <h1 class="title"
            v-html="title"></h1>
        <div class="bg-image"
             :style="bgStyle"
             ref="bgImage">
            <div class="play-wrapper"
                 v-show="songs.length>0"
                 ref="play">
                <div class="play">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="mask"></div>
        </div>

        <!-- 一层背景遮罩，在向上滚动时出现 -->
        <div class="bg-layer"
             ref="layer"></div>

        <scroll class="list"
                :data="songs"
                :probe-type='probeType'
                :listen-scroll="listenScroll"
                @scroll="getScrollY"
                ref="scroll">
            <div class="song-list-wrapper">
                <song-list :songs="songs"
                           @select="selectSong"></song-list>
            </div>
            <div class="loading-container"
                 v-show="!songs.length">
                <loading></loading>
            </div>
        </scroll>

    </div>
</template>

<script>
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import { prefixStyle } from 'common/js/dom'
import Loading from 'base/loading/loading'
import { mapActions } from 'vuex'

const TOPBAR_HEIGHT = 40
const transform = prefixStyle('transform')
export default {
    name: 'MusicList',
    props: {
        title: {
            type: String,
            default: ''
        },
        bgImage: {
            type: String,
            default: ''
        },
        songs: {
            type: Array,
            default: () => []
        }
    },
    components: {
        SongList,
        Scroll,
        Loading
    },
    data () {
        return {
            scrollY: 0
        }
    },
    created () {
        this.listenScroll = true
        this.probeType = 3
    },
    mounted () {
        // 使 scroll 组件的顶部top与背景图的高度相等 > 将背景图盒子露出来
        this.bgHeight = this.$refs.bgImage.clientHeight
        this.$refs.scroll.$el.style.top = this.bgHeight + 'px'
        // scroll 最小向上位移值
        this.minTranslateY = this.bgHeight - TOPBAR_HEIGHT
    },
    computed: {
        bgStyle () {
            return `background-image: url(${this.bgImage})`
        }
    },
    methods: {
        getScrollY (el) {
            this.scrollY = el.y
        },
        backPage () {
            this.$router.back()
        },
        selectSong (item, index) {
            this.selectPlay({
                list: this.songs,
                index
            })
        },
        ...mapActions([
            'selectPlay'
        ])
    },
    watch: {
        // 监听scroll坐标变化的同时处理相关dom 核心: layer层和image层zindex的变化
        scrollY (newval) {
            const layerDom = this.$refs.layer
            const bgImageDom = this.$refs.bgImage
            const play = this.$refs.play
            let abs = Math.abs(newval)
            let translateY = Math.min(this.minTranslateY, abs)
            if (newval < 0) {
                let bgZindex = 0
                layerDom.style[transform] = `translate3D(0,${-translateY}px,0)`
                if (abs > this.minTranslateY) {
                    // 当走出距离超过范围外
                    bgZindex = 10
                    bgImageDom.style.paddingTop = TOPBAR_HEIGHT + 'px'
                    play.style.visibility = 'hidden'
                } else {
                    // 当走出距离回归范围内，回归初始CSS
                    bgZindex = 0
                    bgImageDom.style.height = 0
                    bgImageDom.style.paddingTop = '70%'
                    play.style.visibility = 'visible'
                }
                bgImageDom.style.zIndex = bgZindex
            }
            // 向下滑动时，背景图缩放的比例等于下滑所占比
            if (newval > 0) {
                let scale = 1
                let percent = newval / this.bgHeight
                bgImageDom.style.zIndex = 10
                bgImageDom.style[transform] = `scale(${scale + percent})`
            }
        }
    }
}

</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.music-list {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;

    .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
            display: block;
            padding: 10px;
            font-size: $font-size-large-x;
            color: $color-theme;
        }
    }

    .title {
        position: absolute;
        top: 0;
        left: 10%;
        z-index: 40;
        width: 80%;
        no-wrap();
        text-align: center;
        line-height: 40px;
        font-size: $font-size-large;
        color: $color-text;
    }

    .bg-image {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 70%;
        transform-origin: top;
        background-size: cover;

        .play-wrapper {
            position: absolute;
            bottom: 20px;
            z-index: 50;
            width: 100%;

            .play {
                box-sizing: border-box;
                width: 135px;
                padding: 7px 0;
                margin: 0 auto;
                text-align: center;
                border: 1px solid $color-theme;
                color: $color-theme;
                border-radius: 100px;
                font-size: 0;

                .icon-play {
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 6px;
                    font-size: $font-size-medium-x;
                }

                .text {
                    display: inline-block;
                    vertical-align: middle;
                    font-size: $font-size-small;
                }
            }
        }

        .mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(7, 17, 27, 0.4);
        }
    }

    .bg-layer {
        position: relative;
        height: 100%;
        background: $color-background;
        // z-index: 20;
    }

    .list {
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        background: $color-background;

        // overflow: hidden;
        .song-list-wrapper {
            padding: 20px 30px;
        }

        .loading-container {
            position: absolute;
            width: 100%;
            top: 50%;
            transform: translateY(-50%);
        }
    }
}
</style>