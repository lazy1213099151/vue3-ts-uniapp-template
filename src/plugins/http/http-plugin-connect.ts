import type { TDefinePlugin, IHttpConfig } from '@/utils/http';

interface TOptions extends UniApp.RequestOptions {
    __reconnect_key__: symbol;
}

const HttpLogs = new Map<
    symbol,
    {
        failCount: number;
        successHandle: any;
        failHandle: any;
    }
>();

const httpReConnect: TDefinePlugin = {
    event: 'before-request',
    apply: async (config: IHttpConfig, options: TOptions) => {
        if (typeof config.reconnent !== 'number' || config.reconnent <= 0) return;

        let signKey = Symbol(options.url);

        HttpLogs.set(signKey, {
            failCount: 0,
            successHandle: options.success,
            failHandle: options.fail,
        });

        options.success = (result: any) => {
            let { data, statusCode } = result;
            if (statusCode !== 200 || data?.code !== 200) {
                options?.fail?.(data || '');
            } else {
                HttpLogs.get(signKey)?.successHandle(result);
                HttpLogs.delete(signKey);
            }
        };

        options.fail = (error: any) => {
            let source = HttpLogs.get(signKey);
            if (!source) return;
            source.failCount++;
            // @ts-ignore 傻逼提示
            if (source.failCount > config.reconnent) {
                source.failHandle(error);
                HttpLogs.delete(signKey);
            } else {
                // 在这里发起重连
                setTimeout(() => {
                    uni.request(options);
                }, 2000);
            }
        };
    },
};

export default httpReConnect;
