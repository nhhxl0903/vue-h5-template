// import qs from 'qs'
// axios
// import request from '@/utils/request'
// home api
import api from './index'
// axios
import request from '@/utils/request'

// 登录
export function LiffID(data) {
  return request({
    url: api.LiffID,
    method: 'get',
    data
  })
}
