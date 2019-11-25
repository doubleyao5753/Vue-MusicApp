<template>
    <scroll class="suggest"
            :data="result"
            :bottomRefresh="bottomRefresh"
            @closeToEnd="searchMore"
            ref="suggest">
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
            <loading v-show="hasMore"></loading>
        </div>
    </scroll>
</template>

<script>
import { getInputSearch } from 'api/search'
import { ERR_OK } from 'api/config'
import { newSong } from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'

const TYPE_SINGER = 'singer'
const PER_PAGE = 20

export default {
    name: 'Suggest',
    components: {
        Scroll,
        Loading
    },
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
            page: 1,
            bottomRefresh: true,
            hasMore: true
        }
    },
    methods: {
        _getInputSearch () {
            // 每一次的第一次请求必须重置：默认有更多待加载，页码归零，scroll到回归顶部
            this.hasMore = true
            this.page = 1
            this.$refs.suggest.scrollTo(0, 0)
            getInputSearch(this.query, this.page, this.hasSinger, PER_PAGE).then(res => {
                if (res.code === ERR_OK) {
                    // console.log(res.data)
                    this.result = this._formatRes(res.data)
                    console.log(this.result)
                    // 检查是否还有更多数据没有被请求
                    this._checkMore(res.data)
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
        searchMore () {
            if (!this.hasMore) return
            this.page++
            getInputSearch(this.query, this.page, this.hasSinger, PER_PAGE).then(res => {
                if (res.code === ERR_OK) {
                    // 新的数据要  concat  拼接在后面
                    this.result = this.result.concat(this._formatRes(res.data))
                    this._checkMore(res.data)
                }
            })
        },
        _checkMore (data) {
            const song = data.song
            // data中的song对象含有：curnum curpage list totalnum 四个属性
            // 如果 list为空 或者 当前条数与当前页码与每页条数乘积之和大于总条数 时 不再hasMore
            if (!song.list.length || (song.curnum + song.curpage * PER_PAGE) > song.totalnum) {
                this.hasMore = false
            }
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
                return `${item.name} - ${item.singer}`
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