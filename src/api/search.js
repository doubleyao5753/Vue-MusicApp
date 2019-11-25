import jsonp from 'common/js/jsonp'
import {
  recUrlParams,
  recJsonpCallback
} from './config'
import axios from 'axios'

export function getHotWords () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const params = Object.assign({}, recUrlParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, params, recJsonpCallback)
}

export function getInputSearch (query, page, zhida, perpage) {
  //   const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  const url = '/api/getInputSearch'

  const params = Object.assign({}, recUrlParams, {
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    perpage,
    n: perpage,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  //   return jsonp(url, params, recJsonpCallback)
  return axios.get(url, {
    params: params
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
