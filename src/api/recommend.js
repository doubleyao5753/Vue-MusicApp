// 推荐组件  模块下的获取数据方法
import jsonp from 'common/js/jsonp.js'
import axios from 'axios'
import {
  recUrlParams,
  recJsonpCallback
} from './config'

// 轮播图数据的获取：通过jsonp访问的QQ音乐数据
export function getSlider () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const params = Object.assign({}, recUrlParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, params, recJsonpCallback)
}

// 歌单数据的获取：通过本地服务器设置代理欺骗浏览器设置Referer访问的QQ音乐数据
// build/webpack.dev.conf.js
export function getSongList () {
  const url = '/api/getSongList'

  return axios.get(url, {
    params: {
      picmid: 1,
      rnd: Math.random(),
      g_tk: 5381,
      loginUin: 0,
      hostUin: 0,
      format: 'json',
      inCharset: 'utf8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'yqq.json',
      needNewCode: 0,
      categoryId: 10000000,
      sortId: 5,
      sin: 0,
      ein: 19
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 歌单详情的数据抓取
export function getGedanDetail (disstid) {
  const url = '/api/getGedan'
  return axios.get(url, {
    params: {
      disstid,
      type: 1,
      json: 1,
      utf8: 1,
      onlysong: 0,
      new_format: 1,
      platform: 'yqq',
      loginUin: 0,
      hostUin: 0,
      needNewCode: 0,
      fotmat: 'json',
      g_tk: 5381,
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0
    }
  }).then((res) => {
    res = res.data.cdlist[0]
    return Promise.resolve(res)
  })
}
