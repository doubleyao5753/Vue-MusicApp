<template>
    <div class="suggest">
        <div class="suggest-list">
            <div class="suggest-item"
                 v-for="item in result"
                 :key="item.id">
                <div class="icon">
                    <i :class="singerOrSong(item)"></i>
                </div>
                <div class="name">
                    <p class="text"
                       v-html="getDifferentName(item)"></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getInputSearch } from 'api/search'
import { ERR_OK } from 'api/config'
import { newSong, formatSinger } from 'common/js/song'

const TYPE_SINGER = 'singer'
export default {
    name: 'Suggest',
    props: {
        query: {
            type: String,
            default: ''
        },
        hasSinger: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            result: [],
            page: 1
        }
    },
    methods: {
        _getInputSearch () {
            getInputSearch(this.query, this.page, this.hasSinger).then(res => {
                if (res.code === ERR_OK) {
                    // console.log(res.data)
                    this.result = this._formatRes(res.data)
                    console.log(this.result)
                }
            })
        },
        _formatRes (data) {
            let format = []
            if (data.zhida && data.zhida.singerid) {
                format.push({ ...data.zhida, ...{ type: TYPE_SINGER, id: 0 } })
            }
            if (data.song) {
                format = format.concat(this._normalizeSong(data.song.list))
            }
            return format
        },
        // 格式化歌曲数据结构，处处都在用的方法
        _normalizeSong (list) {
            let form = []
            list.forEach((e) => {
                if (e.songid && e.albummid) {
                    form.push(newSong(e))
                }
            })
            return form
        },
        singerOrSong (item) {
            if (item.type && item.type === TYPE_SINGER) {
                return 'icon-mine'
            } else {
                return 'icon-music'
            }
        },
        getDifferentName (item) {
            if (item.type && item.type === TYPE_SINGER) {
                return item.singername
            } else {
                return `${item.name} - ${Array.isArray(item.singer) ? formatSinger(item.singer) : item.singer}`
            }
        }
    },
    watch: {
        query () {
            this._getInputSearch()
        }
    }
}
</script>

<style lang="stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
    height: 100%;
    overflow: hidden;

    .suggest-list {
        padding: 0 30px;

        .suggest-item {
            display: flex;
            align-items: center;
            padding-bottom: 20px;
        }

        .icon {
            flex: 0 0 30px;
            width: 30px;

            [class^='icon-'] {
                font-size: 14px;
                color: $color-text-d;
            }
        }

        .name {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-d;
            overflow: hidden;

            .text {
                no-wrap();
            }
        }
    }

    .no-result-wrapper {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>