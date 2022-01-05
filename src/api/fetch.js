import axios from "axios"
export function request(config) {
    // 创建axios实例  
    const instance = axios.create({
        baseURL: 'http://localhost:8848/',
        timeout: 5000
    })
    // 请求拦截器  成功/失败
    // 请求拦截request
    // 1.比如config中的一些信息需要处理后再发送请求
    // 2.比如每次发送网络请求的时候，有一下加载圈圈 一直转，然后成功了消失
    // 3.对某些网络请求(比如登录token)判断,如果没有就调转到登录界面
    instance.interceptors.request.use(suc => {
        // console.log(suc);
        // 请求成功后，必须把请求返回出去，后面才能继续发送请求，要不就拦截了
        //为请求头添加token  后端接口会做验证
        suc.headers.Authorization = window.sessionStorage.getItem('token')
        return suc
    }, fal => {
        //console.log(fal);
        return fal
    })
    // 响应拦截response
    instance.interceptors.response.use((res) => {
        return res
    }, (err) => {
        return err
    })
    // 发送网络请求  返回promise 调用then和catch
    return instance(config)
}
