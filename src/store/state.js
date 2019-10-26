import {
    mode
} from 'common/js/config'

const state = {
    // 歌手相关数据:name id avatar ...
    singer: {},
    // 播放状态
    playing: false,
    // 是否全屏展开
    fullScreen: false,
    // 播放列表
    playList: [],
    // 排序播放列表
    sequenceList: [],
    // 播放模式
    playMode: mode.order,
    // 当前歌曲索引
    currentIndex: -1
}

export default state
