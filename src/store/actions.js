// 要提交多个mutations或者要异步操作状态时，就要用Actions

import * as types from './mutation-types'
import {
  mode
} from 'common/js/config'
import {
  shuffle
} from '../common/js/util'

// 从随机列表根据id找到当前播放歌曲的索引
function randomListIndex(randomList, currentSong) {
  return randomList.findIndex((e) => {
    return e.id === currentSong.id
  })
}

// !这个action太重要：点击歌单中的一首歌时，都要做这一堆事
export const selectPlay = function ({
  commit,
  state
}, {
  list,
  index
}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.playMode === mode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAY_LIST, randomList)
    // 拿到随机播放列表中当前播放歌曲的索引，再在背后通过随机列表和索引得到当前歌曲
    index = randomListIndex(randomList, list[index]) // !重点难点！！！
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 全部随机播放Action
export const randomPlay = function ({
  commit
}, {
  list
}) {
  commit(types.SET_PLAY_MODE, mode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
