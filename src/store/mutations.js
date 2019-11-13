import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER] (state, payload) {
    state.singer = payload
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAY_LIST] (state, list) {
    state.playList = list
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE] (state, num) {
    state.playMode = num
  },
  [types.SET_CURRENT_INDEX] (state, num) {
    state.currentIndex = num
  },
  [types.SET_GEDAN] (state, payload) {
    state.gedan = payload
  },
  [types.SET_TOP_LIST] (state, payload) {
    state.gedan = payload
  }
}

export default mutations
