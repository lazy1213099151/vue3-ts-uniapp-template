import { wxlogin_service } from '@/services/base'

/**
 * 复制内容至剪切板
 * @param content 要复制的内容
 */
export const copy = (content: string, msg?: string) => {
    uni.setClipboardData({
        data: content,
        success: () => {
            uni.getClipboardData({
                success: () => {
                    uni.showToast({
                        title: msg || '复制成功',
                        icon: 'none',
                    });
                },
                fail: (err) => {
                    console.log(err);
                },
            });
        },
        fail: (err) => {
            console.log(err);
        },
    });
};

/**
 * 获取微信登录code
 */
export const get_wxlogin_code = async () => {
    // @ts-ignore
    const { code } = await wx.login()
    if (!code) return
    let { source, error } = await wxlogin_service<any>(code)
    if(error) return
    call_user.set_token(source.token)
}

/**
 * 操作用户信息
 */
export const call_user = {
    token_key: '__token__',
    set_token(token: string) {
        uni.setStorageSync(call_user.token_key, token)
    },
    get_token(): string {
        return uni.getStorageSync(call_user.token_key) || ''
    }
}