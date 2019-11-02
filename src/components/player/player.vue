<template>
    <div class="player"
         v-show="playList.length>0">
        <transition name="normal"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterLeave">
            <div class="normal-player"
                 v-show="fullScreen">
                <div class="background">
                    <img width="100%"
                         height="100%"
                         :src="currentSong.image">
                </div>
                <div class="top">
                    <div class="back"
                         @click="toggleFullScreen"><i class="icon-back"></i></div>
                    <div class="title"
                         v-html="currentSong.name"></div>
                    <div class="subtitle"
                         v-html="currentSong.singer"></div>
                </div>
                <div class="middle">
                    <div class="middle-l">
                        <div class="cd-wrapper"
                             ref="cdWrapper">
                            <div class="cd"
                                 :class="cdRotate">
                                <img class="image"
                                     :src="currentSong.image">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="progress-wrapper">
                        <span class="time time-l">{{formatTime(currentPlayTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="progressPercent"
                                          @triggerProgress="changeSongTime"></progress-bar>
                        </div>
                        <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left"
                             @click="changeMode">
                            <i :class="modeStyle"></i>
                        </div>
                        <div class="icon i-left"
                             :class="isDisable">
                            <i class="icon-prev"
                               @click="prev"></i>
                        </div>
                        <div class="icon i-center"
                             :class="isDisable">
                            <i :class="playIcon"
                               @click="togglePlaying"></i>
                        </div>
                        <div class="icon i-right"
                             :class="isDisable">
                            <i class="icon-next"
                               @click="next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon-not-favorite"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player"
                 v-show="!fullScreen"
                 @click="toggleFullScreen">
                <div class="icon">
                    <img width="40"
                         height="40"
                         :class="cdRotate"
                         :src="currentSong.image">
                </div>
                <div class="text">
                    <h2 class="name"
                        v-html="currentSong.name"></h2>
                    <p class="desc"
                       v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <progress-circle :radius="32"
                                     :percent="progressPercent">
                        <i :class="playIconMini"
                           class="icon-mini"
                           @click.stop="togglePlaying"></i>
                    </progress-circle>
                </div>
                <div class="control">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <audio ref="audio"
               :src="currentSong.url"
               @play="ready"
               @error='error'
               @timeupdate="timeUpdate"
               @ended="end"></audio>
    </div>
</template>

<script>
import progressBar from 'base/progress-bar/progress-bar'
import progressCircle from 'base/progress-circle/progress-circle'
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import { mode } from 'common/js/config'
import { shuffle } from 'common/js/util'

const transform = prefixStyle('transform')

export default {
    name: 'Player',
    components: {
        progressBar,
        progressCircle
    },
    data () {
        return {
            songReady: false,
            currentPlayTime: 0
        }
    },
    mounted () {
        document.addEventListener('keyup', (e) => {
            // space's keycode is 32
            if (e.keyCode === 32) this.togglePlaying()
        })
    },
    computed: {
        ...mapGetters([
            'fullScreen',
            'playList',
            'sequenceList',
            'playing',
            'currentIndex',
            'currentSong',
            'playMode',
            'stableSong'
        ]),
        progressPercent () {
            return this.currentPlayTime / this.currentSong.duration
        },
        // 播放器样式切换
        playIcon () {
            return this.playing ? 'icon-pause' : 'icon-play'
        },
        playIconMini () {
            return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
        },
        cdRotate () {
            return this.playing ? 'play' : 'play pause'
        },
        isDisable () {
            return this.songReady ? '' : 'disable'
        },
        modeStyle () {
            return this.playMode === mode.sequence ? 'icon-sequence' : this.playMode === mode.loop ? 'icon-loop' : 'icon-random'
        }
    },
    methods: {
        ...mapMutations({
            setFullScreen: 'SET_FULL_SCREEN',
            setPlaying: 'SET_PLAYING_STATE',
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayList: 'SET_PLAY_LIST',
            setPlayMode: 'SET_PLAY_MODE'
        }),
        toggleFullScreen () {
            this.fullScreen ? this.setFullScreen(false) : this.setFullScreen(true)
        },
        togglePlaying () {
            if (!this.songReady) return
            this.setPlaying(!this.playing)
        },
        ready () {
            this.songReady = true
        },
        error (e) {
            this.songReady = true
            this.$refs.audio.src = this.stableSong
        },
        prev () {
            if (!this.songReady) return
            let index = this.currentIndex - 1
            // 到第一首歌时上一曲
            if (index === -1) {
                index = this.playList.length - 1
            }
            this.setCurrentIndex(index)
            if (!this.playing) this.togglePlaying()
            this.songReady = false
        },
        next () {
            if (!this.songReady) return
            let index = this.currentIndex + 1
            // 到最后一首歌时下一曲
            if (index === this.playList.length) {
                index = 0
            }
            this.setCurrentIndex(index)
            if (!this.playing) this.togglePlaying()
            this.songReady = false
        },
        timeUpdate (audio) {
            this.currentPlayTime = audio.target.currentTime
        },
        formatTime (interval) {
            interval = Math.floor(interval)
            let min = Math.floor(interval / 60)
            let sec = interval % 60
            sec = sec < 10 ? sec.toString().padStart(2, '0') : sec
            return min + ':' + sec
        },
        changeSongTime (newPercent) {
            this.$refs.audio.currentTime = this.currentSong.duration * newPercent
            if (!this.playing) this.togglePlaying()
        },
        changeMode () {
            let varyMode = (this.playMode + 1) % 3  // Tips: 取余确保在012之间
            this.setPlayMode(varyMode)
            let list = []
            // 如果是随机模式，对播放列表执行洗牌算法
            if (varyMode === mode.random) {
                list = shuffle(this.sequenceList)
            } else {
                list = this.sequenceList
            }
            // 一旦playList被改变，那么由索引决定的当前歌曲一定会变，所以应该在之前重新设置索引
            this._resetCurrentSong(list)
            this.setPlayList(list)
        },
        _resetCurrentSong (list) {
            let curIndex = list.findIndex((e) => {
                return e.id === this.currentSong.id
            })
            this.setCurrentIndex(curIndex)
        },
        end () {
            if (this.playMode === mode.loop) {
                this.loop()
            } else {
                this.next()
            }
        },
        loop () {
            this.$refs.audio.currentTime = 0
            this.$refs.audio.play()
        },
        // 播放CD切换动画
        _getPosAndScale () {
            // SMALL CD
            const targetWidth = 40
            const paddingLeft = 40
            const paddingBottom = 30
            // BIG CD
            const paddingTop = 80
            const width = window.innerWidth * 0.8
            // CHANGE VALUE
            const scale = targetWidth / width
            const x = -(window.innerWidth / 2 - paddingLeft)
            const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
            return {
                x,
                y,
                scale
            }
        },
        enter (el, done) {
            const { x, y, scale } = this._getPosAndScale()
            let animation = {
                0: {
                    transform: `transform3d(${x}px,${y}px,0) scale(${scale})`
                },
                60: {
                    transform: `transform3d(0,0,0) scale(1.1)`
                },
                100: {
                    transform: `transform3d(0,0,0) scale(1)`
                }
            }
            animations.registerAnimation({
                name: 'move',
                animation,
                presets: {
                    duration: 400,
                    easing: 'linear'
                }
            })
            animations.runAnimation(this.$refs.cdWrapper, 'move', done)
        },
        afterEnter () {
            animations.unregisterAnimation('move')
            this.$refs.cdWrapper.style.animation = ''
        },
        leave (el, done) {
            this.$refs.cdWrapper.style.transition = 'all 0.4s'
            const { x, y, scale } = this._getPosAndScale()
            this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
            this.$refs.cdWrapper.addEventListener('transitionend', done)
        },
        afterLeave () {
            this.$refs.cdWrapper.style.transition = ''
            this.$refs.cdWrapper.style[transform] = ''
        }
    },
    watch: {
        currentSong (newSong, oldSong) {
            if (newSong.id === oldSong.id) return
            this.$nextTick(() => {
                this.$refs.audio.play()
            })
        },
        playing (newval) {
            const audio = this.$refs.audio
            this.$nextTick(() => {
                newval ? audio.play() : audio.pause()
            })
        }
    }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.player {
    .normal-player {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 150;
        background: $color-background;

        .background {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.6;
            filter: blur(20px);
        }

        .top {
            position: relative;
            margin-bottom: 25px;

            .back {
                position: absolute;
                top: 0;
                left: 6px;
                z-index: 50;

                .icon-back {
                    display: block;
                    padding: 9px;
                    font-size: $font-size-large-x;
                    color: $color-theme;
                    transform: rotate(-90deg);
                }
            }

            .title {
                width: 70%;
                margin: 0 auto;
                line-height: 40px;
                text-align: center;
                no-wrap();
                font-size: $font-size-large;
                color: $color-text;
            }

            .subtitle {
                line-height: 20px;
                text-align: center;
                font-size: $font-size-medium;
                color: $color-text;
            }
        }

        .middle {
            position: fixed;
            width: 100%;
            top: 80px;
            bottom: 170px;
            white-space: nowrap;
            font-size: 0;

            .middle-l {
                display: inline-block;
                vertical-align: top;
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 80%;

                .cd-wrapper {
                    position: absolute;
                    left: 10%;
                    top: 0;
                    width: 80%;
                    height: 100%;

                    .cd {
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                        border: 10px solid rgba(255, 255, 255, 0.1);
                        border-radius: 50%;

                        &.play {
                            animation: rotate 20s linear infinite;
                        }

                        &.pause {
                            animation-play-state: paused;
                        }

                        .image {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                }

                .playing-lyric-wrapper {
                    width: 80%;
                    margin: 30px auto 0 auto;
                    overflow: hidden;
                    text-align: center;

                    .playing-lyric {
                        height: 20px;
                        line-height: 20px;
                        font-size: $font-size-medium;
                        color: $color-text-l;
                    }
                }
            }

            .middle-r {
                display: inline-block;
                vertical-align: top;
                width: 100%;
                height: 100%;
                overflow: hidden;

                .lyric-wrapper {
                    width: 80%;
                    margin: 0 auto;
                    overflow: hidden;
                    text-align: center;

                    .text {
                        line-height: 32px;
                        color: $color-text-l;
                        font-size: $font-size-medium;

                        &.current {
                            color: $color-text;
                        }
                    }
                }
            }
        }

        .bottom {
            position: absolute;
            bottom: 50px;
            width: 100%;

            .dot-wrapper {
                text-align: center;
                font-size: 0;

                .dot {
                    display: inline-block;
                    vertical-align: middle;
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

            .progress-wrapper {
                display: flex;
                align-items: center;
                width: 80%;
                margin: 0px auto;
                padding: 10px 0;

                .time {
                    color: $color-text;
                    font-size: $font-size-small;
                    flex: 0 0 30px;
                    line-height: 30px;
                    width: 30px;

                    &.time-l {
                        text-align: left;
                    }

                    &.time-r {
                        text-align: right;
                    }
                }

                .progress-bar-wrapper {
                    flex: 1;
                }
            }

            .operators {
                display: flex;
                align-items: center;

                .icon {
                    flex: 1;
                    color: $color-theme;

                    &.disable {
                        color: $color-theme-d;
                    }

                    i {
                        font-size: 30px;
                    }
                }

                .i-left {
                    text-align: right;
                }

                .i-center {
                    padding: 0 20px;
                    text-align: center;

                    i {
                        font-size: 40px;
                    }
                }

                .i-right {
                    text-align: left;
                }

                .icon-favorite {
                    color: $color-sub-theme;
                }
            }
        }

        &.normal-enter-avtive, &.normal-leave-active {
            transition: all 0.5s;

            .top, .bottom {
                transition: all 0.5s cubic-bezier(0.86, 0.18, 0.82, 1.32);
            }
        }

        &.normal-enter, &.normal-leave-to {
            opacity: 0;

            .top {
                transform: translate3d(0, -100px, 0);
            }

            .bottom {
                transform: translate3d(0, 100px, 0);
            }
        }
    }

    .mini-player {
        display: flex;
        align-items: center;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 180;
        width: 100%;
        height: 60px;
        background: $color-highlight-background;

        &.mini-enter-active, &.mini-leave-active {
            transition: all 0.4s;
        }

        &.mini-enter, &.mini-leave-to {
            opacity: 0;
        }

        .icon {
            flex: 0 0 40px;
            width: 40px;
            padding: 0 10px 0 20px;

            img {
                border-radius: 50%;

                &.play {
                    animation: rotate 10s linear infinite;
                }

                &.pause {
                    animation-play-state: paused;
                }
            }
        }

        .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;

            .name {
                margin-bottom: 2px;
                no-wrap();
                font-size: $font-size-medium;
                color: $color-text;
            }

            .desc {
                no-wrap();
                font-size: $font-size-small;
                color: $color-text-d;
            }
        }

        .control {
            flex: 0 0 30px;
            width: 30px;
            padding: 0 10px;

            .icon-play-mini, .icon-pause-mini, .icon-playlist {
                font-size: 30px;
                color: $color-theme-d;
            }

            .icon-mini {
                font-size: 32px;
                position: absolute;
                left: 0;
                top: 0;
            }
        }
    }
}

@keyframes rotate {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>