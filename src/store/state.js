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
    playMode: mode.loop,
    // 当前歌曲索引
    currentIndex: -1,
    // 临时固定写死歌曲url
    stableSong: 'https://sharefs.yun.kugou.com/201911011250/318a4680738bc11ce924ee559828e6f8/G171/M03/0A/09/6w0DAF2fFH-AR-whADqcvOZ1-2o311.mp3'
}

export default state
