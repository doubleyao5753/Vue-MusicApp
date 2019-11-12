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
  // 原始顺顺顺序播放列表
  sequenceList: [],
  // 播放模式
  playMode: mode.loop,
  // 当前歌曲索引
  currentIndex: -1,
  // 临时固定写死歌曲url
  stableSong: 'https://www.joy127.com/url/1769.mp3',
  // 歌单详情
  gedan: {}
}

export default state
