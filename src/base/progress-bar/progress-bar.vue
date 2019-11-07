<template>
    <div class="progress-bar"
         ref="progressBar"
         @click="progressClick">
        <div class="bar-inner">
            <div class="progress"
                 ref="progress"></div>
            <div class="progress-btn-wrapper"
                 ref="progressBtn"
                 @touchstart.prevent="progressTouchStart"
                 @touchmove.prevent="progressTouchMove"
                 @touchend="progressTouchEnd">
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { prefixStyle } from 'common/js/dom'
const transform = prefixStyle('transform')
const PROGRESSBTN = 16
export default {
    name: 'ProgressBar',
    props: {
        percent: {
            type: Number,
            default: 0
        }
    },
    created () {
        // 创建一个公共对象以便各个方法都能访问
        this.touch = {}
    },
    methods: {
        progressTouchStart (e) {
            this.touch.initial = true
            this.touch.startX = e.touches[0].pageX
            this.touch.startWidth = this.$refs.progress.clientWidth
            this.touch.barWidth = this.$refs.progressBar.clientWidth - PROGRESSBTN
        },
        progressTouchMove (e) {
            // 确保在touchstart执行后才执行
            if (!this.touch.initial) return
            const deltaX = e.touches[0].pageX - this.touch.startX
            const offsetWidth = Math.min(this.touch.barWidth, Math.max(0, deltaX + this.touch.startWidth))
            this._offsetExecute(offsetWidth)
        },
        progressTouchEnd () {
            this.touch.initial = false
            this._triggerPercent()
        },
        progressClick (e) {
            const rect = this.$refs.progressBar.getBoundingClientRect()
            const offsetWidth = e.pageX - rect.left
            this._offsetExecute(offsetWidth)
            this._triggerPercent()
        },
        _triggerPercent () {
            // ! 这个函数在哪里被调用？这里面是拿不到this.touch的我日
            const barWidth = this.$refs.progressBar.clientWidth - PROGRESSBTN
            const touchPercent = this.$refs.progress.clientWidth / barWidth
            this.$emit('triggerProgress', touchPercent)
        },
        _offsetExecute (offset) {
            this.$refs.progress.style.width = offset + 'px'
            this.$refs.progressBtn.style[transform] = `translate3d(${offset}px,0,0)`
        }
    },
    watch: {
        percent (newPercent) {
            if (newPercent > 0) {
                let barWidth = this.$refs.progressBar.clientWidth - PROGRESSBTN
                let offsetWidth = barWidth * newPercent
                this._offsetExecute(offsetWidth)
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.progress-bar {
    height: 30px;

    .bar-inner {
        position: relative;
        top: 13px;
        height: 4px;
        background: rgba(0, 0, 0, 0.3);

        .progress {
            position: absolute;
            height: 100%;
            background: $color-theme;
        }

        .progress-btn-wrapper {
            position: absolute;
            left: -8px;
            top: -13px;
            width: 30px;
            height: 30px;

            .progress-btn {
                position: relative;
                top: 7px;
                left: 7px;
                box-sizing: border-box;
                width: 16px;
                height: 16px;
                border: 3px solid $color-text;
                border-radius: 50%;
                background: $color-theme;
            }
        }
    }
}
</style>