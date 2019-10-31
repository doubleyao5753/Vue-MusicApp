<template>
    <div class="song-list">
        <ul>
            <li class="item"
                v-for="(song,index) in songs"
                @click="emitSong(song,index)"
                :key="song.id">
                <div class="content">
                    <h1 class="name">{{song.name}}</h1>
                    <p class="detail">{{formatDetail(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'SongList',
    props: {
        songs: {
            types: Array,
            default: () => []
        }
    },
    computed: {

    },

    methods: {
        formatDetail (song) {
            return `${song.singer} · ${song.album}`
        },
        emitSong (song, index) {
            this.$emit('select', song, index)
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.song-list {
    .item {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        height: 64px;
        font-size: $font-size-medium;

        .content {
            flex: 1;
            line-height: 20px;
            overflow: hidden;

            .name {
                no-wrap();
                color: $color-text;
            }

            .detail {
                no-wrap();
                margin-top: 4px;
                color: $color-text-d;
            }
        }
    }
}
</style>