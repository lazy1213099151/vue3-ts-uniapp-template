import type { TDefinePlugin, IHttpConfig } from '@/utils/http';

const RoleKey = '__role_vals__';

const matchRoles = (needRoles: string[], haveRoles: string[]) => {
    return haveRoles.some((role) => needRoles.includes(role));
};

export default {
    event: 'before-request',
    apply: async (config: IHttpConfig, opts: UniApp.RequestOptions) => {
        if (Array.isArray(config.idents)) {
            let roles = uni.getStorageSync(RoleKey);
            if (!Array.isArray(roles)) return;
            let state = matchRoles(config.idents, roles);
            if (!state) {
                // 权限不足
                opts?.fail?.({ message: `权限不足` } as any);
                return 'abort';
            }
        }
    },
} as TDefinePlugin;
