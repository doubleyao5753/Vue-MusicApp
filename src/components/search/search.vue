<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox"
                        @queryChange="onQueryChange"></search-box>
        </div>
        <div class="shortcut-wrapper"
             v-show="!query">
            <div class="shortcut">
                <div class="hot-key">
                    <h1 class="title">热门搜索</h1>
                    <ul>
                        <li class="item"
                            v-for="item in hotWords"
                            :key="item.n"
                            @click="addToQuery(item.k)">
                            <span>{{item.k}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="search-result"
             v-show="query">
            <suggest :query="query"></suggest>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import { getHotWords } from 'api/search'
import { ERR_OK } from 'api/config'

export default {
    name: 'Search',
    components: {
        SearchBox,
        Suggest
    },
    data () {
        return {
            hotWords: [],
            query: ''
        }
    },
    created () {
        this._getHotWords()
    },
    methods: {
        _getHotWords () {
            getHotWords().then((res) => {
                if (res.code === ERR_OK) {
                    this.hotWords = res.data.hotkey.slice(0, 10)
                }
            })
        },
        addToQuery (words) {
            this.$refs.searchBox.addQuery(words)
        },
        onQueryChange (q) {
            this.query = q
        }
    }
}
</script>

<style lang="stylus">
@import '~common/stylus/variable.styl';
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search {
    .search-box-wrapper {
        margin: 20px;
    }

    .shortcut-wrapper {
        position: fixed;
        top: 178px;
        bottom: 0;
        width: 100%;

        .shortcut {
            height: 100%;
            overflow: hidden;

            .hot-key {
                margin: 0 20px 20px 20px;

                .title {
                    margin-bottom: 20px;
                    font-size: $font-size-medium;
                    color: $color-text-l;
                }

                .item {
                    display: inline-block;
                    padding: 5px 10px;
                    margin: 0 20px 10px 0;
                    border-radius: 6px;
                    background: $color-highlight-background;
                    font-size: $font-size-medium;
                    color: $color-text-d;
                }
            }

            .search-history {
                position: relative;
                margin: 0 20px;

                .title {
                    display: flex;
                    align-items: center;
                    height: 40px;
                    font-size: $font-size-medium;
                    color: $color-text-l;

                    .text {
                        flex: 1;
                    }

                    .clear {
                        extend-click();

                        .icon-clear {
                            font-size: $font-size-medium;
                            color: $color-text-d;
                        }
                    }
                }
            }
        }
    }

    .search-result {
        position: fixed;
        width: 100%;
        top: 178px;
        bottom: 0;
    }
}
</style>