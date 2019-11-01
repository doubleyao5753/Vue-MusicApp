<template>
    <div class="progress-circle">
        <svg version="1.1"
             xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 100 100"
             :width="radius"
             :height="radius">
            <circle class="progress-background"
                    r="50"
                    cx="50"
                    cy="50"
                    fill="transparent"></circle>
            <circle class="progress-bar"
                    r="50"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    :stroke-dasharray="dashArray"
                    :stroke-dashoffset="dashOffset"></circle>
            <!-- stroke就是svg中的画笔 -->
        </svg>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'ProgressCircle',
    props: {
        radius: {
            types: Number,
            default: 50
        },
        percent: {
            types: Number,
            default: 0
        }
    },
    data () {
        return {
            dashArray: Math.PI * 100
        }
    },
    computed: {
        dashOffset () {
            return (1 - this.percent) * this.dashArray
        }
    }
}
</script>

<style lang="stylus">
@import '~common/stylus/variable';

.progress-circle {
    position: relative;

    circle {
        stroke-width: 8px;
        transform-origin: center;

        &.progress-background {
            transform: scale(0.9);
            // stroke: $color-theme-d;
            stroke: #333333;
        }

        &.progress-bar {
            transform: scale(0.9) rotate(-90deg);
            // stroke: $color-theme;
            stroke: #FFFF00;
        }
    }
}
</style>