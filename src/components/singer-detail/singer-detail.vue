<template>
    <transition name="slide">
        <music-list :title="title"
                    :bg-image="bgImage"
                    :songs="songs"></music-list>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { newSong } from 'common/js/song'
import MusicList from 'components/music-list/music-list'
export default {
    name: 'SingerDetail',
    components: {
        MusicList
    },
    created () {
        this._getSingerDetail()
    },
    data () {
        return {
            songs: []
        }
    },
    computed: {
        title () {
            return this.singer.name
        },
        bgImage () {
            return this.singer.avatar
        },
        ...mapGetters([
            'singer'
        ])
    },
    methods: {
        // 获取歌手详情页中歌曲的数据
        _getSingerDetail () {
            // 处理边界情况
            if (!this.singer.id) {
                this.$router.push('/singer')
                return
            }
            getSingerDetail(this.singer.id).then((res) => {
                if (res.code === ERR_OK) {
                    this.songs = this._formatSongs(res.data.list)
                    console.log(this.songs)
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