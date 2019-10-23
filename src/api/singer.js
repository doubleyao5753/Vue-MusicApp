// 歌手组件  模块下的获取数据方法

import jsonp from 'common/js/jsonp'
import {
    recUrlParams,
    recJsonpCallback
} from './config'

// 歌手数据的获取
export function getSinger () {
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

    const params = Object.assign({}, recUrlParams, {
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: 1,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq'
    })

    return jsonp(url, params, recJsonpCallback)
}

// 歌手详情数据的获取(通过传入歌手的id)
export function getSingerDetail (singerId) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

    const params = Object.assign({}, recUrlParams, {
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        order: 'listen',
        begin: 0,
        num: 80,
        songstatus: 1,
        singermid: singerId
    })

    return jsonp(url, params, recJsonpCallback)
}
