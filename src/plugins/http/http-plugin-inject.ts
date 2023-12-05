import type { TDefinePlugin } from '@/utils/http';

export default {
    event: 'before-request',
    apply: async (config, options: UniApp.RequestOptions) => {
        const INJECT_DATA: any = {
            header: {},
            data: {},
        };
        Object.keys(INJECT_DATA).forEach((key) => {
            Object.keys(INJECT_DATA[key]).forEach((k) => {
                // @ts-ignore
                options[key][k] = INJECT_DATA[key][k];
            });
        });
    },
} as TDefinePlugin;
