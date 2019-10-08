// 二次封装插件jsonp,以最方便的Promise的方式

import nativeJSONP from 'jsonp'

/**
 * 基于Promise的对二次封装jsonp
 * @param {String} url
 * @param {Object} params
 * @param {Object} option (callback function)
 */
export default function jsonp (url, params, option) {
    // 将原始url加上参数字符串
    url += (url.indexOf('?') < 0 ? '?' : '&') + concatParams(params)
    return new Promise((resolve, reject) => {
        nativeJSONP(url, option, (err, data) => {
            if (!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}

// 将各个参数拼接为url字符串
function concatParams (params) {
    let url = ''
    for (var p in params) {
        let value = params[p] === undefined ? '' : params[p]
        url += '&' + p + '=' + encodeURIComponent(value)
    }
    // 将首部的 & 去掉
    return url ? url.substring(1) : ''
}
