/**
用法示例：
import {http, get, post, del, put} from '@/utils/http'

let {data, error} = await http({method: 'GET', data: {}})

let {data, error} = await get('/xxx', toast: '获取xxx失败')

let {data, error} = await post('/xxx', toast: {
    403: '权限出错',
    500: '服务器错误',
    400: '妈的错了'
})

.....

返回参数只有2个，一个data，一个error
只要error存在，那么一定是错了！
所以只需要判断error是否存在，如果存在则不再往后执行

*/

import plugins from '@/plugins/http/http-plugin';

export type THandleToast = (result: IBaseResponse) => string;

export interface IHttpConfig {
    // 请求地址
    url: string;
    // 请求方法
    method: 'GET' | 'POST' | 'DELETE' | 'PUT';
    // 发送的数据
    data?: Record<any, any>;
    // 超时时间，毫秒
    timeout?: number;
    // 请求头
    headers?: Record<any, any>;
    // 请求体类型
    requestType?: string;
    // 响应体类型
    responseType?: string;
    // 错误提示
    toast?: string | THandleToast | Record<number, string>;
    // 配置缓存，毫秒
    cache?: number;
    // 重连次数
    reconnent?: number;
    // 权限列表
    idents?: string[];
}

export interface IBaseResponse<T = any> {
    code: number;
    status: boolean;
    msg: string;
    data: T;
}

export type TPluginEventKey = 'before-request' | 'after-request' | 'response' | 'error';

export type TPluginHandle = (...args: any) => Promise<any>;

export type TDefinePlugin = {
    event: TPluginEventKey;
    apply: TPluginHandle;
};

export const httpPlugins = {
    plugins: {
        'before-request': [],
        'after-request': [],
        response: [],
        error: [],
    } as Record<TPluginEventKey, TPluginHandle[]>,
    /** 查询插件 */
    find: (event: TPluginEventKey, cb: TPluginHandle) => {
        let idx = httpPlugins.plugins[event].findIndex((item) => item === cb);
        return idx;
    },
    /** 注册插件 */
    use: (event: TPluginEventKey, cb: TPluginHandle) => {
        let idx = httpPlugins.find(event, cb);
        if (idx === -1) httpPlugins.plugins[event].push(cb);
    },
    /** 删除插件 */
    del: (event: TPluginEventKey, cb: TPluginHandle) => {
        let idx = httpPlugins.find(event, cb);
        if (idx > -1) httpPlugins.plugins[event].splice(idx, 1);
    },
    /** 执行插件 */
    apply: async (event: TPluginEventKey, ...args: any): Promise<any> => {
        for await (let plugin of httpPlugins.plugins[event]) {
            let next = await plugin.apply(plugin, args);
            if (next === false) break;
            if (next === 'abort') return 'abort';
        }
    },
};

export const http = async <T = any>(config: IHttpConfig) => {
    // 请求配置
    const baseConfig = {
        url: config.url,
        method: config.method,
        data: config.data || {},
        timeout: config.timeout || 5000,
        header: {
            'content-Type': config.responseType || 'application/json',
            ...config.headers,
        },
    };

    try {
        let { data, error, source } = await new Promise<{ data: T; error?: any, source?: any }>((resolve) => {
            const options: UniApp.RequestOptions = {
                ...baseConfig,
                success: success(resolve),
                fail: fail(resolve),
            };

            // 成功处理函数
            function success(resolve: any): UniNamespace.RequestOptions['success'] {
                return async (result) => {
                    await httpPlugins.apply('response', result.data, config, baseConfig);
                    // 执行插件
                    let { data, code } = result.data as IBaseResponse<T>;
                    
                    if (code == 200) {
                        // 返回数据
                        return resolve({ data, source: result.data  });
                    }
                    if (typeof config.toast === 'string') uni.showToast({ icon: 'none', title: config.toast });
                    resolve({ error: result.data, data: null });
                };
            }

            // 失败处理函数
            function fail(resolve: any): UniNamespace.RequestOptions['fail'] {
                return async (error) => {
                    await httpPlugins.apply('error', error, config, options);
                    resolve({ error, data: null });
                };
            }

            httpPlugins.apply('before-request', config, options).then((sign: string) => {
                sign !== 'abort' && uni.request(options)
            });
        });

        if (error) {
            if (typeof config?.toast === 'function') {
                uni.showToast({ icon: 'none', title: config.toast(error) });
            } else if (typeof config?.toast === 'object' && config.toast !== null && config.toast[error.code]) {
                uni.showToast({ icon: 'none', title: config.toast[error.code] });
            } else if (typeof config.toast === 'string') {
                uni.showToast({ icon: 'none', title: config.toast });
            }
        }
        return { data, error, source };
    } catch (error) {
        await httpPlugins.apply('error', error, config);
        if (typeof config.toast === 'string') {
            uni.showToast({ icon: 'none', title: config.toast });
        }
        return { error };
    }
};

/** get请求 */
export const get = <T>(config: Omit<IHttpConfig, 'method'>) => {
    return http<T>({ ...config, method: 'GET' });
};

/** post请求 */
export const post = <T>(config: Omit<IHttpConfig, 'method'>) => {
    return http<T>({ ...config, method: 'POST' });
};

/** put请求 */
export const put = <T>(config: Omit<IHttpConfig, 'method'>) => {
    return http<T>({ ...config, method: 'PUT' });
};

/** del请求 */
export const del = <T>(config: Omit<IHttpConfig, 'method'>) => {
    let str = [] as any[];
    for (const key in config.data) {
        if (Object.prototype.hasOwnProperty.call(config.data, key)) {
            str.push(`${key}=${config.data[key]}`);
        }
    }
    config.url = `${config.url}?${str.join('&')}`;
    return http<T>({ ...config, method: 'DELETE' });
};

/** 串行请求 */
export const serial = async (arr: Function[]) => {
    let result = [];
    for (let fn of arr) {
        let res = await fn();
        result.push(res);
    }
    return result;
};

/** 并行请求 */
export const parallelism = async (arr: Function[], max = 6) => {
    let result = [];
    while (arr.length) {
        let list = arr.splice(0, max);
        let temps: any[] = [];
        list.forEach((cb) => temps.push(cb()));
        let res = await Promise.all(temps);
        result.push(...res);
    }
    return result;
};

(() => {
    for (const plugin of plugins) {
        httpPlugins.use(plugin.event, plugin.apply);
    }
})();
