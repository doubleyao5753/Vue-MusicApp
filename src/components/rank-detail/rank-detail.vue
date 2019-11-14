<template>
    <transition name="slide">
        <music-list :songs="songs"
                    :title="title"
                    :bg-image="bgImage"
                    :rank="true"></music-list>
    </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { newSong } from 'common/js/song'
import { getTopList } from 'api/rank'
import { ERR_OK } from 'api/config'

export default {
    name: 'GedanDetail',
    components: {
        MusicList
    },
    created () {
        this._getTopList()
    },
    data () {
        return {
            songs: []
        }
    },
    computed: {
        title () {
            return this.topList.topTitle
        },
        bgImage () {
            if (this.songs.length) {
                return this.songs[0].image
            }
            return this.topList.picUrl
        },
        ...mapGetters([
            'topList'
        ])
    },
    methods: {
        _getTopList () {
            // console.log(this.topList)
            if (!this.topList.id) {
                this.$router.push({
                    path: '/rank'
                })
            }
            getTopList(this.topList.id).then((res) => {
                if (res.code === ERR_OK) {
                    this.songs = this._normalizeSong(res.songlist)
                }
            })
        },
        _normalizeSong (list) {
            let res = []
            list.forEach((e) => {
                let temp = e.data
                if (temp.songid && temp.albummid) {
                    res.push(newSong(temp))
                }
            })
            return res
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
