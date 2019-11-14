<template>
    <div class="song-list">
        <ul>
            <li class="item"
                v-for="(song,index) in songs"
                @click="emitSong(song,index)"
                :key="song.id">
                <div class="rank"
                     v-show="rank">
                    <span :class="getRankCls(index)"
                          v-text="getRankNum(index)"></span>
                </div>
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
            type: Array,
            default: () => []
        },
        rank: {
            type: Boolean,
            default: false
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
        },
        getRankCls (index) {
            if (index < 3) {
                return `icon icon${index}`
            } else {
                return 'text'
            }
        },
        getRankNum (index) {
            if (index >= 3) {
                return index + 1
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.song-list {
    .item {
        display: flex;
        align-items: center;
        box-sizing: border-box;
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

        .rank {
            flex: 0 0 25px;
            width: 25px;
            margin-right: 30px;
            text-align: center;
            position: static;

            .icon {
                display: inline-block;
                width: 25px;
                height: 24px;
                background-size: 25px 24px;

                &.icon0 {
                    bg-image('first');
                }

                &.icon1 {
                    bg-image('second');
                }

                &.icon2 {
                    bg-image('third');
                }
            }

            .text {
                color: $color-theme;
                font-size: $font-size-large;
            }
        }
    }
}
</style>