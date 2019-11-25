<template>
    <div class='wrapper'
         ref="wrapper">
        <slot></slot>
    </div>
</template>

<script>
// ? better-scroll文档：https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/
import BScroll from 'better-scroll'
export default {
    name: 'Scroll',
    props: {
        probeType: {
            type: Number,
            default: 1
        },
        click: {
            type: Boolean,
            default: true
        },
        data: {
            type: Array,
            default: () => []
        },
        // 扩展
        listenScroll: {
            type: Boolean,
            default: false
        },
        bottomRefresh: {
            type: Boolean,
            default: false
        }
    },
    mounted () {
        // 延迟初始化BScroll是要确保在此之前DOM已经渲染
        setTimeout(() => {
            this._initScroll()
        }, 20)
    },
    methods: {
        // 初始化scroll
        _initScroll () {
            if (!this.$refs.wrapper) return // if there is no content in slot, end this
            this.scroll = new BScroll(this.$refs.wrapper, {
                probeType: this.probeType,
                click: this.click
            })

            // 如果配置监听滚动，则监听滚动事件，并将当前滚动位置暴露出去
            if (this.listenScroll) {
                let self = this // 事件函数里面的this指向触发对象
                this.scroll.on('scroll', (e) => {
                    // 将scroll的滚动坐标暴露出去,对象e有两个属性：x 和 y
                    self.$emit('scroll', e)
                })
            }

            // 如果配置底部刷新，则监听滚动结束事件，
            // 当 当前滚动位置  距离  最大滚动值 50像素时 暴露事件出去
            if (this.bottomRefresh) {
                this.scroll.on('scrollEnd', () => {
                    if (this.scroll.y < (this.scroll.maxScrollY + 50)) {
                        this.$emit('closeToEnd')
                    }
                })
            }
        },
        enable () {
            this.scroll && this.scroll.enable()
        },
        disable () {
            this.scroll && this.scroll.disable()
        },
        refresh () {
            this.scroll && this.scroll.refresh()
        },
        // 扩展：滚动到目标坐标
        scrollTo () {
            // 因为插件的scrollTo方法必须要传入参数，使用apply和arguments来实现参数的转移
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        // 扩展：滚动到目标元素
        scrollToElement () {
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        }
    },
    // ! 重点！！！ 当数据发生变化的时候必须要重新计算高度重新加载BScroll
    watch: {
        data () {
            setTimeout(() => {
                this.refresh()
            }, 20)
        }
    }
}
</script>