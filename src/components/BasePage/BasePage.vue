<template>
	<div class="base-page">
		<BaseNavigationBar :="$attrs" />
		<div
			class="page-view"
			:style="{ height: `calc(100vh - ${nav_config.nav_height} - 32rpx)`, padding: props.padding || 0 }"
		>
			<slot />
		</div>
	</div>
</template>

<script lang="ts" setup>
import BaseNavigationBar from '../BaseNavigationBar/BaseNavigationBar.vue'
import use_navbar_calc from '@/utils/navbar_calc'
const { nav_config } = use_navbar_calc()
const props = defineProps<{
	padding?: string
}>()
</script>

<style lang="scss" scoped>
.base-page {
	width: 100vw;
	height: 100vh;
	box-sizing: border-box;

	.page-view {
		box-sizing: border-box;
	}
}
</style>

<style lang="scss">
page {
	background-image: linear-gradient(
		45deg,
		#ecf0fb,
		#f4fafc,
		#dce5fc,
		#f4ecfb,
		#ebe4fb,
		#e4ecfc,
		#d4e4fc,
		#fcfbfc,
		#ecfcfc
	);
	background-size: 440%;
	background-attachment: fixed;
}
</style>
