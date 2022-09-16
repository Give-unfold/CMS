import axios from 'axios'
import { RES_URL } from './Url'

let elmsg = null
export const requst = (options) => {
  return new Promise(reslove => {
    const insta = axios.create({
      baseURL: RES_URL
    })
    // 请求拦截
    insta.interceptors.request.use(config => {
      config.headers.Authorization = sessionStorage.getItem('token')
      return config
    })

    // 响应拦截
    insta.interceptors.response.use(res => {
      if (elmsg) elmsg.close()
      if (res.status != 200) return elmsg = ElMessage.error(res.data.meta.msg);
      elmsg = ElMessage({
        message: res.data.meta.msg,
        type: "success",
      });
      return res.data
    })

    insta(options).then(res => {
      reslove(res)
    })
  })
}