/**
 * 授权说明文案
 * @param {*} permission_name  微信小程序权限名称
 * @returns 
 */
function get_tips(permission_name: any) {
    if (permission_name == "scope.writePhotosAlbum" || permission_name == "uni.saveVideoToPhotosAlbum") {
        return "我们访问您的存储权限，为您提供使用与保存图片、视频、文件等服务。";
    }
    if (permission_name === 'subscription') {
        return '我们访问您的消息订阅权限，为您提供新头像边框上线提醒'
    }
    if (permission_name === 'scope.userLocation') {
        return '进入“设置”后，点击“位置信息”选择“使用小程序时允许”'
    }
}

/**
 * 授权说明文案
 * @param {*} permission_name  微信小程序权限名称
 * @returns 
 */
function get_permission_name(permission_name: any) {
    if (permission_name == "scope.writePhotosAlbum" || permission_name == "uni.saveVideoToPhotosAlbum") {
        return "存储权限";
    }
    if (permission_name === 'subscription') {
        return '消息订阅权限'
    }
    if (permission_name === 'scope.userLocation') {
        return '授权位置获取'
    }
}

//授权说明弹窗
function show_permission_tips(content: any, callback: any) {
    uni.showModal({
        title: "授权说明",
        content: content,
        confirmText: "确定",
        showCancel: false,
        success: function (res) {
            if (res.confirm) {
                callback && callback();
            }
        },
    });
}

//小程序判断授权
export function judge_permission(permission_name: any, agree_callback: any, refuse_callback: any) {
    uni.getSetting({
        success(res) {
            if (res.authSetting[permission_name] == undefined) {
                //1、首次授权
                let tips = get_tips(permission_name);
                show_permission_tips(tips,
                    () => {
                        agree_callback && agree_callback();
                    })
            } else if (res.authSetting[permission_name] == true) {
                //2、之前同意了授权
                agree_callback && agree_callback();
            } else if (res.authSetting[permission_name] != undefined &&
                res.authSetting[permission_name] != true) {
                //3、之前拒绝了权限
                uni.showModal({
                    title: '提示',
                    content: '您之前拒绝了' + get_permission_name(permission_name) + '，是否打开设置重新授权？',
                    success: function (res) {
                        if (res.confirm) {
                            //打开权限设置页
                            uni.openSetting({
                                success: function (res) {
                                    if (res.authSetting[permission_name] == true) {
                                        //用户在设置页打开了权限
                                        agree_callback && agree_callback();
                                    } else {
                                        //用户在设置页未打开权限
                                        uni.showToast({
                                            title: '授权失败',
                                            icon: 'none',
                                        })
                                        refuse_callback && refuse_callback();
                                    }
                                }
                            })
                        } else if (res.cancel) {
                            refuse_callback && refuse_callback();
                        }
                    }
                });
            }
        }
    })
}

export function is_have_permission(permissionName: any) {
    return new Promise<boolean>((resolve) => {
        uni.getSetting({
            success(res) {
                // @ts-ignore
                if (res.authSetting[permissionName] == true) {
                    //2、之前同意了授权
                    resolve(true)
                } else {
                    resolve(false)
                }
            }
        })
    })
}