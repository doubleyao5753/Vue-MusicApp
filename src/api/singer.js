// 歌手组件  模块下的获取数据方法

import jsonp from 'common/js/jsonp'
import {
    recommendUrlParams,
    recommendJsonpCallback
} from './config'

// 歌手数据的获取
export function getSinger () {
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

    const params = Object.assign({}, recommendUrlParams, {
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: 1,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq'
    })

    return jsonp(url, params, recommendJsonpCallback)
}
