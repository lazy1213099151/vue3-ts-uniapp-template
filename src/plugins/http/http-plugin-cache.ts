import type { IHttpConfig, IBaseResponse, TDefinePlugin } from '@/utils/http';

const CACHE_STORE: {
    [p: string]: {
        data: any;
        params: any;
        expire: number;
    };
} = {};

export const getHttpCache: TDefinePlugin = {
    event: 'before-request',
    apply: async (config: IHttpConfig, options: UniApp.RequestOptions) => {
        if (!config.cache || config.cache <= 0) return;

        let cache = CACHE_STORE[config.url];

        if (!cache) return;

        // 判断请求参数是否一致
        // 判断是否已过期
        if (JSON.stringify(config.data || {}) === JSON.stringify(cache.params || {}) && cache.expire > Date.now()) {
            options?.success?.({
                statusCode: 200,
                data: cache.data,
                header: options.header,
                cookies: [],
            });
            return 'abort';
        } else {
            delete CACHE_STORE[config.url];
        }
    },
};

export const setHttpCache: TDefinePlugin = {
    event: 'response',
    apply: async (res: IBaseResponse, config: IHttpConfig) => {
        if (!config.cache || config.cache <= 0) return;
        CACHE_STORE[config.url] = {
            data: res,
            params: config.data,
            expire: Date.now() + config.cache,
        };
    },
};
