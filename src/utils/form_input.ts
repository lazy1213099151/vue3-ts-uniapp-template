import { watch } from 'vue'
import { ref } from 'vue'

export type TInputType = 'text' | 'text-area'

export type TParamsType = {
    /** 唯一ID */
    id: string
    /** 字段key*/
    key: string
    /** 输入的值 */
    value: any
    /** placeholder */
    placeholder: string
    /** 错误提示 */
    err_msg: string
    /** 最大字数 */
    max_words: number
    /** 是否显示字数 */
    show_words: boolean
    /** 匹配规则集, test=正则字符串，msg=匹配失败的提示文案 */
    regex: { test: string; msg: string }[]
}

const default_params: TParamsType = {
    id: '',
    key: '',
    value: '',
    placeholder: '',
    err_msg: '',
    max_words: -1,
    show_words: true,
    regex: [],
}

export default () => {
    const params = ref<TParamsType>({ ...default_params })

    const input_type = ref<TInputType>('text')

    /** 点击取消时 */
    function on_cancel() {
        uni.navigateBack()
    }

    /** 点击确定时 */
    function on_confirm() {
        // 防止用户进来啥都没动就点确定
        validate()
        if (params.value.err_msg) {
            return uni.showToast({ title: params.value.err_msg, icon: 'none' })
        }
        let { id, key, value } = params.value
        if (!id || !key || !value) {
            return uni.showToast({ title: '缺失关键字段', icon: 'none' })
        }
        uni.$emit(id, { key, value })
    }

    /** 校验方法 */
    const validate = () => {
        try {
            let regexs = params.value.regex
            if (!Array.isArray(regexs) || regexs.length === 0) return
            let val = params.value.value
            for (let i = 0; i < regexs.length; i++) {
                let { test, msg } = regexs[i]
                if (!test) continue
                let regex = new RegExp(test)
                if (!regex.test(val)) {
                    params.value.err_msg = msg || ''
                    return false
                }
            }
            params.value.err_msg = ''
            return true
        } catch (error: any) {
            params.value.err_msg = error.message || '未知错误'
            return false
        }
    }

    /** 重置数据 */
    function reset() {
        params.value = { ...default_params }
    }

    /** 边输入边校验 */
    watch(
        () => params.value.value,
        () => validate(),
    )

    return {
        params,
        input_type,
        on_confirm,
        on_cancel,
        reset
    }
}

/** 生成路径参数 */
function stringify(params: Record<any, any>) {
    let arr = [] as string[]
    for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            arr.push(`${key}=${encodeURIComponent(params[key])}`)
        }
    }
    return arr.join('&')
}

/** 去表单填写页面 */
export async function to_write_form(config: Partial<TParamsType & { type: string }>, callback?: (val: any) => void) {
    let { id, key, type, max_words } = config
    if (!key) return uni.showToast({ title: 'key 必须填写', icon: 'none' })
    if (!type) return uni.showToast({ title: 'type 必须填写', icon: 'none' })
    if (!id) config.id = `form_input_${Date.now()}`
    if (!max_words || max_words < 0) max_words = -1
    let query_str = stringify({
        ...default_params,
        ...config
    })

    /** 监听填写完成 */
    function watch_finish(resolve: (value: unknown) => void) {
        uni.$once(config.id as string, (result: any) => {
            resolve(result)
            callback && callback(result)
            uni.navigateBack()
        })
    }

    return new Promise((resolve, reject) => {
        uni.navigateTo({
            url: `/sub_packages/Commons/FormInput/FormInput?${query_str}`,
            success: () => {
                watch_finish(resolve)
            },
            fail(error) {
                reject(error)
            },
        })
    })
}