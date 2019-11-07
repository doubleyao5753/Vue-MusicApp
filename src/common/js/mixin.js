import {
  mapGetters
} from 'vuex'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted () {
    this.handlePlayList(this.playList)
  },
  activated () {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList (newValue) {
      this.handlePlayList(newValue)
    }
  },
  methods: {
    // 混入对象与组件对象选项重名则只会调用组件对象,一旦用到了混入，就报错吧
    handlePlayList () {
      throw new Error('conponent has no handlePlayList')
    }
  }
}
