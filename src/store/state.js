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
    currentIndex: -1,
    // 临时固定写死歌曲url
    stableSong: 'http://58.49.111.15/amobile.music.tc.qq.com/C400001DI2Jj3Jqve9.m4a?guid=1853571640&vkey=7423668BB38E21D35D154C01881B112B61C152AF9CB6FA2E12D25059987D2A099B1A9B2074F8DEFA589C6649A18995CCA6AC7F917CFD257B&uin=3578&fromtag=66'
}

export default state
