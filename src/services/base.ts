import { get, post } from "@/utils/http";

/**
 * 微信登录
 */
export function wxlogin_service<T>(js_code: string) {
    return post<T>({
        url: '/funny/v1/public/login',
        data: {
            app_id: 'wx2038bc95bf001d3e',
            js_code
        }
    })
}