<template>
    <div class="singer">
        <list-view :singerData='singerList'
                   @picked="pickedSinger"></list-view>
        <router-view></router-view>
    </div>
</template>

<script>
import BScroll from 'base/scroll/scroll'
import ListView from 'base/listview/listview'
import { getSinger } from 'api/singer.js'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer.js'
import { mapMutations } from 'vuex'

const HOT_SINGER = '热门歌手'
const HOT_SINGER_LEN = 10
export default {
    name: 'Singer',
    components: {
        ListView,
        BScroll
    },
    data () {
        return {
            singerList: []
        }
    },
    created () {
        // setTimeout(() => {
        this._getSingerList()
        // }, 20)
    },
    methods: {
        pickedSinger (singer) {
            this.$router.push({
                path: `/singer/${singer.id}`
            })
            this.setSinger(singer)
        },
        _getSingerList () {
            getSinger().then((res) => {
                if (res.code === ERR_OK) {
                    this.singerList = this._formatSingerList(res.data.list)
                    // console.log(this.singerList)
                }
            })
        },
        // !重点：格式化获取到的歌手数据，转换成合适的数据结构
        _formatSingerList (raw) {
            // 定义全新数据格式
            let all = {
                hot: {
                    title: HOT_SINGER,
                    items: []
                }
            }
            raw.forEach((e, i) => {
                if (i < HOT_SINGER_LEN) {
                    all.hot.items.push(new Singer({
                        id: e.Fsinger_mid,
                        name: e.Fsinger_name
                    }))
                }
                let key = e.Findex
                if (!all[key]) {
                    all[key] = {
                        title: key,
                        items: []
                    }
                }
                all[key].items.push(new Singer({
                    id: e.Fsinger_mid,
                    name: e.Fsinger_name
                }))
            })
            // 对字母列表进行排序
            let letter = []
            let hot = []
            for (let k in all) {
                let v = all[k]
                if (v.title.match(/[a-zA-Z]/)) {
                    letter.push(v)
                } else if (v.title === HOT_SINGER) {
                    hot.push(v)
                }
            }
            letter.sort((a, b) => {
                // 对原数组进行字母升序排序
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return hot.concat(letter)
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        })
    }

}
</script>

<style lang="stylus">
@import '~common/stylus/variable.styl';

.singer {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
}
</style>