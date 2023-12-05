import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface IUserinfo {
    /** 账号 */
    account: string
    /** 头像 */
    avatar: string
    /** 注册时间 */
    create_time: string
    /** 邮箱 */
    email: string
    /** 身份 */
    ident: number
    /** 简介 */
    intro: string
    /** 用户id */
    user_id: string
    /** 昵称 */
    username: string
}

const init_userinfo: IUserinfo = {
    account: '',
    avatar: '',
    create_time: '',
    email: '',
    ident: 0,
    intro: '',
    user_id: '',
    username: ''
}

export const use_user_store = defineStore('user_store', () => {
    const user = ref<IUserinfo>(init_userinfo)

    /** 设置用户信息 */
    function set_userinfo(userinfo: IUserinfo) {
        user.value = userinfo
    }

    /** 重置用户信息 */
    function reset() {
        user.value = init_userinfo
    }

    return {
        user,
        set_userinfo,
        reset
    }
})