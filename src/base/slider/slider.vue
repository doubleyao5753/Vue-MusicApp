<template>
    <div class="slider"
         ref="slider">
        <div class="slider-group"
             ref="sliderGroup">

            <slot></slot>

        </div>
        <div class="dots">
            <span class="dot"
                  v-for="(item,index) in pages"
                  :class="{active: current === index}"
                  :key="index"></span>
        </div>
    </div>
</template>

<script>
// 插件better-scroll：https://github.com/ustbhuangyi/better-scroll/blob/master/README_zh-CN.md
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'
export default {
    name: 'Slider',
    data () {
        return {
            pages: [],
            current: 0
        }
    },
    // 使用props，将轮播图重要的配置留给父组件自定义
    props: {
        loop: {
            type: Boolean,
            default: true
        },
        autoplay: {
            type: Boolean,
            default: true
        },
        autoInterval: {
            type: Number,
            default: 3000
        }
    },
    mounted () {
        // 延迟初始化BScroll是要确保在此之前DOM已经渲染
        setTimeout(() => {
            this._setSliderWidth()
            this._initSlider()
            this._initDots()
            if (this.autoplay) this._play()
        }, 20)
        // 解决屏幕视口改变无法自适应轮播图宽度的问题
        window.addEventListener('resize', () => {
            if (!this.slider) return
            this._setSliderWidth(true) // 设置resize参数很关键
            this.slider.refresh()
        })
    },
    methods: {
        // 设置轮播图的宽度和轮播图容器的宽度(若干图片宽度之和)
        _setSliderWidth (isResize = false) {
            let widthSum = 0
            let sliderItems = this.$refs.sliderGroup.children
            let sliderWidth = this.$refs.slider.clientWidth
            for (let i = 0; i < sliderItems.length; i++) {
                const items = sliderItems[i]
                addClass(items, 'slider-item')
                // 每一个子图的宽度与视口同步
                items.style.width = sliderWidth + 'px'
                widthSum += sliderWidth
            }
            // 如果需要循环，容器宽度应该再加两个图片的宽
            if (this.loop && !isResize) { widthSum += 2 * sliderWidth }
            // 所有轮播图的总宽度
            this.$refs.sliderGroup.style.width = widthSum + 'px'
        },
        // 初始化插件better-scroll
        _initSlider () {
            // 将BScroll对象放到公共属性中公用
            this.slider = new BScroll(this.$refs.slider, {
                scrollX: true,
                scrollY: false,
                momentum: false,
                snap: {
                    loop: this.loop,
                    threshold: 0.3
                },
                click: true
            })
            // 监听滚动结束事件，此时计算当前页码，并与dot匹配
            this.slider.on('scrollEnd', () => {
                this.current = this.slider.getCurrentPage().pageX
                if (this.autoplay) {
                    clearTimeout(this.timer) // 先清除再执行，以防混乱
                    this._play()
                }
            })
        },
        _initDots () {
            this.num = this.$refs.sliderGroup.children.length
            if (this.loop) this.num -= 2
            this.pages = new Array(this.num)
        },
        _play () {
            this.timer = setTimeout(() => {
                this.slider.next(500)
            }, this.autoInterval)
        }
    },
    destroyed () {
        // 凡是有定时器的，必须要记得清掉
        clearTimeout(this.timer)
    }
}
</script>

<style lang="stylus">
@import '~common/stylus/variable';

.slider {
    min-height: 1px;
    position: relative;

    .slider-group {
        position: relative;
        overflow: hidden;
        white-space: nowrap;

        .slider-item {
            float: left;
            box-sizing: border-box;
            overflow: hidden;
            text-align: center;

            a {
                display: block;
                width: 100%;
                overflow: hidden;
                text-decoration: none;
            }

            img {
                display: block;
                width: 100%;
            }
        }
    }

    .dots {
        position: absolute;
        right: 0;
        left: 0;
        bottom: 12px;
        text-align: center;
        font-size: 0;

        .dot {
            display: inline-block;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;

            &.active {
                width: 20px;
                border-radius: 5px;
                background: $color-text-ll;
            }
        }
    }
}
</style>