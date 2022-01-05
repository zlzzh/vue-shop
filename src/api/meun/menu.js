import { request } from "../fetch";
async function getMenuList() {
    let result = await request({
        url: '/menu'
    })
    return result
}
export { getMenuList }