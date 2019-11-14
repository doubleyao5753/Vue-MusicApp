import jsonp from 'common/js/jsonp'
import {
  recUrlParams,
  recJsonpCallback
} from './config'

export function getHotWords () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const params = Object.assign({}, recUrlParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, params, recJsonpCallback)
}
