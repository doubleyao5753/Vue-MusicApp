<template>
    <transition name="slide">
        <music-list></music-list>
    </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'

export default {
    name: 'GedanDetail',
    components: {
        MusicList
    },
    created () {
        // this._getTopList()
    },
    data () {
        return {
            songs: []
        }
    },
    computed: {
        title () {
            return this.gedan.dissname
        },
        bgImage () {
            return this.gedan.imgurl
        },
        ...mapGetters([
            'topList'
        ])
    },
    methods: {
        _getTopList () {
            console.log(this.topList)
            if (!this.topList.dissid) {
                this.$router.push({
                    path: '/recommend'
                })
            }
        },
        _normalizeSong (list) {
            let res = []
            list.forEach((e) => {
                if (e.id && e.album) {
                    res.push(newSong2(e))
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
