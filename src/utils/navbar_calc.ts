import { computed } from 'vue';

export default () => {
    // #ifdef MP
    let menu = uni.getMenuButtonBoundingClientRect()
    // #endif

    let nav_config = computed(() => {

        let nav_height = ''
        let area_height = ''
        let area_top = ''

        // #ifdef MP
        nav_height = `calc(${menu.height + menu.top}px + 10rpx)`
        area_height = `${menu.height}px`
        area_top = `${menu.top}px`
        // #endif

        // #ifdef H5
        area_height = nav_height = '44px'
        area_top = '0px'
        // #endif

        return {
            nav_height,
            area_height,
            area_top
        }
    })

    return {
        menu,
        nav_config
    }
}