// 歌手组件 模块下部分功能的封装

// 对于重复的一些属性，封装一个类
export default class Singer {
    constructor ({
        id,
        name
    }) {
        this.id = id
        this.name = name
        this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
    }
}
