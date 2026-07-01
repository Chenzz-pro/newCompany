<template>
	<view class="multi-line-text">
		<!-- 纯文本模式 -->
		<view v-if="!isHtml && textLines.length > 0">
			<view 
				v-for="(line, index) in textLines" 
				:key="index" 
				class="text-line"
				:class="{ 'first-line': index === 0 }"
			>
				<text>{{ line }}</text>
			</view>
		</view>
		
		<!-- HTML富文本模式 -->
		<view v-else-if="isHtml" class="html-content">
			<rich-text :nodes="content"></rich-text>
		</view>
		
		<!-- 默认显示原始内容 -->
		<view v-else class="plain-content">
			<text>{{ content }}</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'MultiLineText',
	props: {
		// 文本内容
		content: {
			type: [String, Array],
			default: ''
		},
		// 是否为HTML格式
		isHtml: {
			type: Boolean,
			default: false
		},
		// 是否自动按换行符分割
		autoSplit: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		textLines() {
			if (!this.content || typeof this.content !== 'string') {
				return []
			}
			
			if (this.autoSplit) {
				// 按换行符分割，过滤空行
				return this.content
					.split('\n')
					.map(line => line.trim())
					.filter(line => line.length > 0)
			}
			
			return [this.content]
		}
	}
}
</script>

<style scoped>
.multi-line-text {
	width: 100%;
}

.text-line {
	font-size: 28rpx;
	color: #C6D8FF;
	line-height: 2;
	margin-bottom: 12rpx;
}

.text-line:last-child {
	margin-bottom: 0;
}

.html-content {
	font-size: 28rpx;
	color: #C6D8FF;
	line-height: 2;
}

.plain-content {
	font-size: 28rpx;
	color: #C6D8FF;
	line-height: 1.8;
	word-wrap: break-word;
	word-break: break-all;
}
</style>
