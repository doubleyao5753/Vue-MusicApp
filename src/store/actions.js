// 要提交多个mutations或者要异步操作状态时，就要用Actions

import * as types from './mutation-types'

// !这个action太重要：点击歌单中的一首歌时，都要做这一堆事
export const selectPlay = function ({
    commit,
    state
}, {
    list,
    index
}) {
    commit(types.SET_PLAY_LIST, list)
    commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}
