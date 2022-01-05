import { request } from "../fetch";
export  function  sendLogin(username, password) {
   return request({
        url: 'log',
        method: 'post',
        data: {
            username, 
            password
        }
    })
}