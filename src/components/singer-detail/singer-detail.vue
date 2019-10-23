<template>
    <transition name="slide">
        <div class="singer-detail">
            <!-- {{songs}} -->
        </div>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { newSong } from 'common/js/song'
export default {
    name: 'SingerDetail',
    created () {
        this._getSingerDetail()
    },
    data () {
        return {
            songs: ''
        }
    },
    computed: {
        ...mapGetters([
            'singer'
        ])
    },
    methods: {
        _getSingerDetail () {
            if (!this.singer.id) {
                // 处理边界情况
                this.$router.push('/singer')
                return
            }
            getSingerDetail(this.singer.id).then((res) => {
                if (res.code === ERR_OK) {
                    this.songs = this._formatSongs(res.data.list)
                }
            })
        },
        // ! 重点：格式化歌曲的数据结构
        _formatSongs (list) {
            let form = []
            list.forEach((e) => {
                // !解构赋值：拿出子对象
                let { musicData } = e
                if (musicData.songid && musicData.albummid) {
                    form.push(newSong(musicData))
                }
            })
            return form
        }
    }
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