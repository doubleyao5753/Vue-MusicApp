<template>
    <scroll class="listview"
            ref="listView"
            :data="singerData"
            :listen-scroll="listenScroll"
            :probe-type="probeType"
            @scroll="scrolling">
        <!-- 歌手列表 -->
        <ul>
            <li v-for="item in singerData"
                class="list-group"
                :key="item.title"
                ref="listGroup">
                <h2 class="list-group-title">{{item.title}}</h2>
                <ul>
                    <li class="list-group-item"
                        v-for="list in item.items"
                        :key="list.id"
                        @click="pickedItem(list)">
                        <img v-lazy="list.avatar"
                             class="avatar">
                        <span class="name">{{list.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <!-- 快捷字母表 -->
        <div class="list-shortcut"
             @touchstart.stop.prevent='touchStart'
             @touchmove.stop.prevent='touchMove'>
            <ul>
                <li class="item"
                    v-for="(item,index) in shortcutList"
                    :key="index"
                    :class="{current: current === index}"
                    :data-index="index">{{item}}</li>
            </ul>
        </div>
        <!-- 固定字母头 -->
        <div class="list-fixed"
             v-show="fixedTitle"
             ref="fixed">
            <div class="fixed-title"> {{fixedTitle}}</div>
        </div>
        <!-- loading -->
        <div class="loading-container"
             v-show="!singerData.length">
            <loading :text="'不要着急，老子还在飞机上...'"></loading>
        </div>
    </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { customAttr } from 'common/js/dom'

const ITEM_HEIGHT = 18
const FIXED_TITLE_HEIGHT = 30

export default {
    name: 'ListView',
    components: {
        Scroll,
        Loading
    },
    created () {
        this.touch = {} // ! 重点：在实例对象中定义一个公共对象使得各方法可以共用
        this.listenScroll = true
        this.probeType = 3
        this.itemsHeight = []
    },
    props: {
        singerData: {
            type: Array,
            default: null
        }
    },
    data () {
        return {
            scrollY: -1,
            current: 0,
            approach: -1
        }
    },
    // 一般不会怎么改变的数据使用computed更好
    computed: {
        // 使用计算属性拿到字母表数组（首字母）
        shortcutList () {
            return this.singerData.map((e) => {
                return e.title.substring(0, 1)
            })
        },
        // 使用计算属性拿到固定首字母
        fixedTitle () {
            if (this.scrollY > 0) {
                return ''
            }
            return this.singerData[this.current] ? this.singerData[this.current].title : ''
        }
    },
    methods: {
        // 点击快捷字母栏，跳转到指定字母界面
        touchStart (e) {
            // event.target 属性可以用来实现事件委托
            let anchorIndex = customAttr(e.target, 'index')
            this.touch.y1 = e.touches[0].pageY
            this.touch.currentIndex = anchorIndex
            this._scrollTo(anchorIndex)
        },
        // 滑动快捷字母栏，跳转到指定字母界面
        touchMove (e) {
            this.touch.y2 = e.touches[0].pageY  // 注意y2可能为负值
            let distance = (this.touch.y2 - this.touch.y1) / ITEM_HEIGHT || 0
            let gapIndex = parseInt(this.touch.currentIndex) + Math.floor(distance)
            this._scrollTo(gapIndex)
        },
        _scrollTo (index) {
            let list = this.$refs.listGroup
            // 马后炮：边界处理，修整边幅小细节非常重要
            if (index === null || index < 0 || index > list.length - 1) return
            // 使点击的字母index与歌手列表的index保持一致即可实现跳转
            this.$refs.listView.scrollToElement(list[index], 0)
        },
        _computeHeight () {
            // ! 计算ul下每个字母块li的坐标高度：记录每一次的累加高度
            this.itemsHeight = []
            const items = this.$refs.listGroup
            let height = 0
            this.itemsHeight.push(height) // 要保证第一个的高度为0
            for (let i = 0; i < items.length; i++) {
                height += items[i].clientHeight
                this.itemsHeight.push(height)
            }
            // console.log(this.itemsHeight)
        },
        scrolling (e) {
            this.scrollY = e.y
        },
        // 点击了谁，向外派发一个事件将其传出
        pickedItem (i) {
            this.$emit('picked', i)
        }
    },
    watch: {
        // 每次请求的数据发生变化时(当然包括第一次)，重新计算每个字母块的高度
        singerData () {
            setTimeout(() => {
                this._computeHeight()
            }, 20)
        },
        // ! 滑动时，判断当前字母块所在的区间在第几个索引 --> 实时联动字母栏
        scrollY (newVal) {
            // 滚动到顶部的顶部时，初始索引位置为0
            if (newVal > 0) {
                this.current = 0
                return
            }
            // 主区间：中间滚动时
            newVal = Math.abs(newVal)
            const itemsHeight = this.itemsHeight
            for (let i = 0; i < itemsHeight.length - 1; i++) {
                let pre = itemsHeight[i]
                let next = itemsHeight[i + 1]
                if (newVal >= pre && newVal < next) {
                    this.current = i
                    this.approach = next - newVal  // 计算到上限的距离（不断递减）
                } else if (newVal > next) {
                    // 滚动到底部的底部时：newVal大于next上限
                    this.current = itemsHeight.length - 2
                }
            }
        },
        // 如果超出的部分在title的高度之内,那就应该将其顶上去
        approach (newVal) {
            let fixedTop = (newVal > 0 && newVal <= FIXED_TITLE_HEIGHT) ? newVal - FIXED_TITLE_HEIGHT : 0  // 减去高度，使其递增
            this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
            // 传说webkit内核下 translate3d 比 translate2d效率要高
        }
    }
}
</script>

<style lang="stylus">
@import '~common/stylus/variable';

.listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background;

    .list-group {
        padding-bottom: 30px;

        .list-group-title {
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            font-size: $font-size-small;
            color: $color-text-l;
            background: $color-highlight-background;
        }

        .list-group-item {
            display: flex;
            align-items: center;
            padding: 20px 0 0 30px;

            .avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }

            .name {
                margin-left: 20px;
                color: $color-text-l;
                font-size: $font-size-medium;
            }
        }
    }

    .list-shortcut {
        position: absolute;
        z-index: 30;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        padding: 20px 0;
        border-radius: 10px;
        text-align: center;
        background: $color-background-d;
        font-family: Helvetica;

        .item {
            padding: 3px;
            line-height: 1;
            color: $color-text-l;
            font-size: $font-size-small;

            &.current {
                color: $color-theme;
            }
        }
    }

    .list-fixed {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;

        .fixed-title {
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            font-size: $font-size-small;
            color: $color-text-l;
            background: $color-highlight-background;
        }
    }

    .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>