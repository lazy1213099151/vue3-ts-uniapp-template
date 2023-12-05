<template>
	<BasePage padding="0 32rpx">
		<div class="common-action">
			<span class="action-btn cancel" @click="on_cancel">取消</span>
			<span class="action-btn confirm" @click="on_confirm">确定</span>
		</div>
		<input
			class="text-input"
			type="text"
			v-if="input_type === 'text'"
			v-model="params.value"
			:placeholder="params.placeholder"
			:maxlength="params.max_words || -1"
			focus
		/>
		<textarea
			class="text-area"
			v-else-if="input_type === 'text-area'"
			v-model="params.value"
			:placeholder="params.placeholder"
			:show-confirm-bar="false"
			:maxlength="params.max_words || -1"
			auto-focus
		></textarea>
		<div class="word-count" v-if="params.show_words">
			{{ params.value.length }}
			<span v-if="params.max_words && params.max_words > 0"> / {{ params.max_words }} </span>
		</div>
		<div class="err-msg">{{ params.err_msg }}</div>
	</BasePage>
</template>

<script lang="ts" setup>
/**
 * 本页面是用来做为表单输入辅助页面的
 * 当用户要输入内容时，跳转到本页面进行填写，填写好后重新跳转回去
 * 用法示例：
 * 
import { to_write_form } from '@/utils/form_input'

async function to_form_page(key: keyof IUserinfo, type: TInputType) {
	let result = await to_write_form({
		key,
		type,
		value: user_store.user[key] || '',
	})
	console.log(result)
}
 */

import { onLoad, onUnload } from '@dcloudio/uni-app'
import use_form_input from '@/utils/form_input'
import type { TParamsType } from '@/utils/form_input'
const { params, input_type, on_cancel, on_confirm, reset } = use_form_input()

onLoad((e) => {
	e = e as TParamsType
	if (Object.keys(e).length > 0) {
		input_type.value = e.type
		delete e.type // 防止与元素的type属性冲突
		if(e.value) e.value = decodeURIComponent(e.value)
		Object.assign(params.value, e)
	}
})

onUnload(() => {
    reset()
})
</script>

<style lang="scss" scoped>
.common-action {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 0;
	font-size: 28rpx;

	.action-btn {
		padding: 8rpx 16rpx;
		border-radius: 4px;
	}

	.cancel {
		background-color: #f3f3f3;
		color: #737373;
	}

	.confirm {
		background-color: #6ca7ff;
		color: #fff;
	}
}

.text-area,
.text-input {
	width: 100%;
	border: 1px solid #fff;
	border-radius: 8px;
	padding-left: 15rpx;
	box-sizing: border-box;
	font-size: 28rpx;
	color: #444;
}

.text-input {
	height: 38px;
}

.text-area {
	padding: 15rpx;
}

.word-count {
	padding: 8rpx 0;
	text-align: right;
	font-size: 24rpx;
	color: #444444b7;
}

.err-msg {
	padding-top: 10rpx;
	text-align: center;
	font-size: 24rpx;
	color: red;
}
</style>
