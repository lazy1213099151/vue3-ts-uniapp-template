<template>
	<div
		class="base-navigation-bar"
		:style="{ height: nav_config.nav_height, backgroundColor: bgc }"
	>
		<div
			class="navigation-area"
			:style="{ height: nav_config.area_height, top: nav_config.area_top }"
		>
			<div class="content left">
				<div class="action-router" v-if="back">
					<span class="back-prev" @click="handle_back('prev')" />
					<span class="back-home" @click="handle_back('home')" />
				</div>
				<template>
					<slot name="left"></slot>
				</template>
			</div>
			<div class="content middle">
				<div class="title" v-if="title">{{ title }}</div>
			</div>
			<div class="content right"></div>
		</div>
	</div>
	<div class="empty-area" :style="{ height: nav_config.nav_height }"></div>
</template>

<script lang="ts" setup>
import { app_config } from '@/config/base'
import use_calc from '@/utils/navbar_calc'
const { nav_config } = use_calc()

const props = withDefaults(
	defineProps<{
		title?: string
		back?: boolean
		bgc?: string
	}>(),
	{
		title: app_config.title,
		bgc: app_config.custom_navbar_bgc,
	},
)

function handle_back(type: 'prev' | 'home') {
	if (type === 'home') {
		uni.reLaunch({
			url: '/pages/AudioTab/AudioTab',
		})
	} else {
		if (getCurrentPages().length > 1) {
			uni.navigateBack()
		} else {
			uni.reLaunch({
				url: '/pages/AudioTab/AudioTab',
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.base-navigation-bar {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1;
	width: 100%;
	box-sizing: border-box;
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

	.navigation-area {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 32rpx;
		box-sizing: border-box;

		.back {
			width: 9px;
			height: 17px;
			padding: 10px 30px 10px 0;
		}

		.title {
			text-align: center;
			font-size: 34rpx;
		}

		.content {
			display: flex;
			align-items: center;
			flex: 1;
			height: 100%;
		}

		.left {
			display: flex;
			align-items: center;
		}

		.middle {
			justify-content: center;
		}

		.right {
		}

		.action-router {
			display: flex;
			align-items: center;

			.back-prev {
				width: 60rpx;
				height: 60rpx;
				background: url('data:image/webp;base64,UklGRuQCAABXRUJQVlA4WAoAAAAwAAAADAAAFwAASUNDUBgCAAAAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANlZQOEylAAAALwzABRDHYJiNpJn3SZ0/ykHcaJhp2ya5R2r8oQzEYqZtm+QeqfGHMhCLgjaS1NgxPJOzDwB2V+4uZqb9/wKe+isEVuWqVKg60CpUGUDVK6lQdaABAgjwwDCSrTQPjXsCr/9OY2gDEf1X4LaNMuYd/AIAAABQ2x7ik3OQV5nN2nEIsyjKxrMV/0t6NvdLhMA+8Hccu8cJlfSV6OIow8+7FKQp/EUHAA==')
					no-repeat center / 20rpx 38rpx;
			}

			.back-home {
				margin-top: -6rpx;
				margin-left: 20rpx;
				width: 60rpx;
				height: 60rpx;
				background: url('data:image/webp;base64,UklGRqgDAABXRUJQVlA4WAoAAAAwAAAAGwAAGAAASUNDUBgCAAAAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANlZQOExpAQAALxsABhCfoaCNJGWeQdX7V/E+aGwoaCNJmWdQ9f5VvA8aBW0kKfMMqt6/ivdBw7BtJMWxBR88fwCx1rL3NudUa1VK2eecnVLaIQQhBP//+70n5xwhBO89McYb8P8XQmhgqHcIodUNDEAIYYUQqKkKIbSaIYQGAAlcaoYQNnCpGUJoIEMISwUAAD8AoAohBLABgCVJtmmrrm2bxz57/oO7W+fch/+I/jNw27aRutednfwCAACA4xEAAKiYNe5leWvUbK1nMZkWz+bWcRzHGVQ0Lx3CMPPmu93uKMbW1omSnvpBLwk60DXRpMRxR1fQjeNuBf3E71iUh0nPyjB3W1bHfjq6mhJn+asiZM1XPjUkLMpzozLCj3KmCViLfZ0gn8o1cBDrygwY73dcPs/rZm5VHl9TBlm7eqedDZi9gbHoVmHm4yfQAr9cLpfL5bAedyGEEOJeE0e9c/4/G/VXT8dTGjY29B/q6CIUAAA=')
					no-repeat center / 46rpx 40rpx;
			}
		}
	}
}
</style>
