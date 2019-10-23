// !重点：格式化获取到的歌手数据，转换成合适的数据结构

// 定义类
export default class Song {
    constructor ({
        id,
        mid,
        name,
        singer,
        album,
        duration,
        image,
        url
    }) {
        this.id = id
        this.mid = mid
        this.name = name
        this.singer = singer
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }
}

// 实例化歌曲这个类
export function newSong (musicData) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        name: musicData.songname,
        singer: formatSinger(musicData.singer),
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    })
}

function formatSinger (singer) {
    let res = []
    if (!singer) return ''
    singer.forEach((e) => {
        res.push(e.name)
    })
    return res.join('/')
}
