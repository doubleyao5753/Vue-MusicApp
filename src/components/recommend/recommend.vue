<template>
    <div class="recommend"
         ref="recommend">
        <scroll class="recommend-cotent"
                ref="scroll"
                :data="songList">
            <div class="scroll-valid">
                <!-- 确保在获取到图片数据之后再渲染slider组件 -->
                <div v-if="sliderData.length"
                     class="slider-wrapper">
                    <slider>
                        <div v-for="item in sliderData"
                             :key="item.id">
                            <a :href="item.linkUrl">
                                <img :src="item.picUrl"
                                     class="needsclick"
                                     @load="sliderRendered">
                            </a>
                        </div>
                    </slider>
                </div>
                <div class="recommend-list"
                     v-if="songList.length">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul>
                        <li class="item"
                            v-for="item in songList"
                            :key="item.dissid"
                            @click="jumpToDetail(item)">
                            <div class="icon">
                                <img v-lazy="item.imgurl"
                                     width="60"
                                     height="60">
                            </div>
                            <div class="text">
                                <h2 class="name">{{item.creator.name}}</h2>
                                <p class="desc">{{item.dissname}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-container"
                 v-show="!songList.length">
                <loading :text="'不要着急，老子还在飞机上...'"></loading>
            </div>
        </scroll>
        <!-- 子路由歌单详情组件渲染出口 -->
        <router-view></router-view>
    </div>
</template>

<script>
import { getSlider, getSongList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { playListMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
    name: 'Recommend',
    components: { Slider, Scroll, Loading },
    mixins: [playListMixin],
    data () {
        return {
            sliderData: [],
            songList: []
        }
    },
    created () {
        this._getRecData()
        setTimeout(() => {
            this._getSongList()
        }, 20)
    },
    methods: {
        _getRecData () {
            getSlider().then((res) => {
                if (res.code === ERR_OK) {
                    this.sliderData = res.data.slider
                }
            })
        },
        _getSongList () {
            getSongList().then((res) => {
                if (res.code === ERR_OK) {
                    this.songList = res.data.list
                    console.log(res.data)
                }
            })
        },
        sliderRendered () {
            if (!this.flag) {
                // 一旦轮播图高度被撑开，就刷新scroll
                this.$refs.scroll.refresh()
                // 确保只执行一次
                this.flag = true
            }
        },
        handlePlayList (playList) {
            const bottomDis = playList.length > 0 ? '60px' : ''
            this.$refs.recommend.style.bottom = bottomDis
            this.$refs.scroll.refresh()
        },
        jumpToDetail (item) {
            this.setGedan(item)
            this.$router.push({
                path: `/recommend/${item.dissid}`
            })
        },
        ...mapMutations({
            setGedan: 'SET_GEDAN'
        })
    }
}
</script>

<style lang="stylus">
@import '~common/stylus/variable.styl';

.recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;

    .recommend-cotent {
        height: 100%;
        overflow: hidden;

        .slider-wrapper {
            position: relative;
            width: 100%;
            overflow: hidden;
        }

        .recommend-list {
            .list-title {
                height: 65px;
                line-height: 65px;
                text-align: center;
                font-size: $font-size-medium;
                color: $color-theme;
            }

            .item {
                display: flex;
                box-sizing: border-box;
                align-items: center;
                padding: 0 20px 20px 20px;

                .icon {
                    flex: 0 0 60px;
                    width: 60px;
                    padding-right: 20px;
                }

                .text {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    flex: 1;
                    line-height: 20px;
                    overflow: hidden;
                    font-size: $font-size-medium;

                    .name {
                        margin-bottom: 10px;
                        color: $color-text;
                    }

                    .desc {
                        color: $color-text-d;
                    }
                }
            }
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
