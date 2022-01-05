import { request } from "../fetch";
// 获取用户表单
export function getUserList() {
    return request({
        url: '/user'
    })
}
// 修改用户状态
export function updateUserState(id, state) {
    return request({
        url: '/userinfo',
        method:'put',
        data: {
            id: id, //可以直接 简写成 id
            state: state
        }
    })
}
// 新增用户
export function addUserInfo(username, email, mobile) {
    return request( {
        url: '/userinfo/add',
        method: 'post',
        data: {
          username,
          email,
          mobile
        }
    })

}