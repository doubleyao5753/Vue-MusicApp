import jsonp from 'common/js/jsonp'
import {
  recUrlParams,
  recJsonpCallback
} from './config'

export function getRankList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const params = Object.assign({}, recUrlParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, params, recJsonpCallback)
}
