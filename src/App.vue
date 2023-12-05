<script setup lang="ts">
import { onLaunch, onShow } from '@dcloudio/uni-app'
import { update } from './utils/update'
import { get_wxlogin_code } from './utils/base'
onLaunch(() => {
	get_wxlogin_code()
})
onShow(() => {
	update()
})
</script>
