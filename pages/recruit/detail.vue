<template>
		<view class="detail-page">
			<!-- 岗位基础信息卡 -->
			<view class="job-header-card card">
				<view class="job-title-row">
					<text class="job-title">{{ job.title }}</text>
					<text v-if="job.isUrgent" class="tag tag-urgent">急招</text>
				</view>
				<text class="job-salary">{{ job.salary || '面议' }}</text>
				<view class="job-meta">
					<text class="meta-item">📍 {{ job.location || '未设置' }}</text>
					<text class="meta-item">💼 {{ job.experience || '不限' }}</text>
					<text class="meta-item">👥 {{ job.headcount || '若干' }}人</text>
					<text class="meta-item">🕐 {{ job.workType || '全职' }}</text>
				</view>
				<view class="job-tags" v-if="job.tags && job.tags.length">
					<text v-for="(tag, idx) in job.tags" :key="idx" class="tag tag-normal">{{ tag }}</text>
				</view>
				<text class="publish-time">发布于 {{ formatTime(job.publishTime) }}</text>
			</view>

			<!-- 岗位要求 -->
			<view class="section-card card" v-if="job.description">
				<view class="section-title">岗位要求</view>
				<MultiLineText :content="job.description" />
			</view>

			<!-- 公司福利 -->
			<view class="section-card card" v-if="benefits.length">
				<view class="section-title">公司福利</view>
				<view class="benefit-list">
					<view class="benefit-item" v-for="(item, idx) in benefits" :key="idx">
						<text class="benefit-icon">✓</text>
						<text class="benefit-text">{{ item }}</text>
					</view>
				</view>
			</view>

			<!-- 工作地址 -->
			<view class="section-card card" v-if="job.address">
				<view class="section-title">工作地址</view>
				<view class="address-row" @tap="openMap">
					<text class="address-text">📍 {{ job.address }}</text>
					<text class="address-nav">导航 ></text>
				</view>
			</view>

			<!-- 底部占位 -->
			<view class="bottom-placeholder"></view>

			<!-- 底部操作栏 -->
			<view class="bottom-bar">
				<view class="bar-action" @tap="collectJob">
					<text class="action-icon">{{ isCollected ? '❤️' : '🤍' }}</text>
					<text class="action-text">收藏</text>
				</view>
				<view class="bar-action" @tap="callPhone">
					<text class="action-icon">📞</text>
					<text class="action-text">电话咨询</text>
				</view>
				<view class="bar-btn" @tap="goApply">
					<text>在线投递简历</text>
				</view>
			</view>
		</view>
	</template>

	<script>
	import config from '@/common/config.js'
	import { callCloud, formatTime, makePhoneCall, showToast, showLoading, hideLoading } from '@/common/util.js'
	import MultiLineText from '@/components/MultiLineText.vue'

	export default {
		components: {
			MultiLineText
		},
		data() {
			return {
				jobId: '',
				job: {},
				benefits: [],
				isCollected: false
			}
		},
		onLoad(options) {
			this.jobId = options.id
			if (this.jobId) {
				this.loadJobDetail()
			}
		},
		onShareAppMessage() {
			return {
				title: `${this.job.title || '招聘岗位'} - ${this.job.salary || '面议'}`,
				path: `/pages/recruit/detail?id=${this.jobId}`
			}
		},
		methods: {
			formatTime,

			async loadJobDetail() {
				showLoading('加载中...')
				console.log('开始加载岗位详情, jobId:', this.jobId)
				try {
					const res = await callCloud('getJobDetail', { id: this.jobId })
					console.log('getJobDetail 返回:', JSON.stringify(res))
					if (res && res.data) {
						this.job = res.data
						this.benefits = res.data.benefits || []
						console.log('job.description:', res.data.description)
						// 检查是否已收藏
						const collected = uni.getStorageSync('collected_jobs') || []
						this.isCollected = collected.includes(this.jobId)
					} else {
						console.error('未获取到岗位数据:', res)
					}
				} catch (e) {
					console.error('加载岗位详情失败:', e)
					showToast('加载失败')
				} finally {
					hideLoading()
				}
			},

			goApply() {
				uni.navigateTo({ url: `/pages/recruit/apply?id=${this.jobId}` })
			},

			callPhone() {
				makePhoneCall(config.company.phone)
			},

			collectJob() {
				let collected = uni.getStorageSync('collected_jobs') || []
				if (this.isCollected) {
					collected = collected.filter(id => id !== this.jobId)
					this.isCollected = false
					showToast('已取消收藏')
				} else {
					collected.push(this.jobId)
					this.isCollected = true
					showToast('已收藏')
				}
				uni.setStorageSync('collected_jobs', collected)
			},

			openMap() {
				if (this.job.latitude && this.job.longitude) {
					uni.openLocation({
						latitude: this.job.latitude,
						longitude: this.job.longitude,
						name: this.job.address,
						address: this.job.address
					})
				}
			}
		}
	}
	</script>

	<style scoped>
	/* ============================================
	   岗位详情 — 轻赛博霓虹科技风
	   ============================================ */
	.detail-page {
		min-height: 100vh;
		background: linear-gradient(180deg, #0A0E27 0%, #0F1535 50%, #121838 100%);
		padding-bottom: 120rpx;
	}

	/* 通用卡片 */
	.card {
		position: relative;
		background: rgba(18,24,56,0.85);
		backdrop-filter: blur(10rpx);
		-webkit-backdrop-filter: blur(10rpx);
		border-radius: 16rpx;
		border: 1rpx solid rgba(123,47,253,0.2);
		box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.3), 0 0 20rpx rgba(123,47,253,0.08), inset 0 1rpx 0 rgba(255,255,255,0.04);
		overflow: hidden;
	}

	.card::before {
		content: '';
		position: absolute;
		top: 0; left: 0; right: 0; bottom: 0;
		pointer-events: none;
		z-index: 0;
		opacity: 0.025;
		background:
			repeating-linear-gradient(0deg, transparent, transparent 39rpx, rgba(123,47,253,0.3) 39rpx, rgba(123,47,253,0.3) 40rpx),
			repeating-linear-gradient(90deg, transparent, transparent 39rpx, rgba(0,229,255,0.2) 39rpx, rgba(0,229,255,0.2) 40rpx);
	}

	/* 岗位头部 */
	.job-header-card {
		margin: 24rpx;
		padding: 30rpx;
		animation: cardBreath 3s ease-in-out infinite;
	}

	@keyframes cardBreath {
		0%,100% { box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.3), 0 0 20rpx rgba(123,47,253,0.08); }
		50% { box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.3), 0 0 32rpx rgba(123,47,253,0.15); }
	}

	.job-title-row {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
		position: relative;
		z-index: 1;
	}

	.job-title {
		font-size: 40rpx;
		font-weight: bold;
		color: #FFFFFF;
		flex: 1;
		text-shadow: 0 0 12rpx rgba(255,255,255,0.2);
	}

	.job-salary {
		font-size: 40rpx;
		font-weight: bold;
		color: #FF2EC4;
		text-shadow: 0 0 16rpx rgba(255,46,196,0.5);
		margin-bottom: 24rpx;
		display: block;
		position: relative;
		z-index: 1;
	}

	.job-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
		margin-bottom: 20rpx;
		position: relative;
		z-index: 1;
	}

	.meta-item {
		font-size: 26rpx;
		color: #E2E8F0;
		background: rgba(123,47,253,0.1);
		padding: 6rpx 16rpx;
		border-radius: 6rpx;
		border: 1rpx solid rgba(0,229,255,0.15);
	}

	.job-tags {
		display: flex;
		gap: 12rpx;
		margin-bottom: 16rpx;
		position: relative;
		z-index: 1;
	}

	.tag {
		font-size: 22rpx;
		padding: 4rpx 16rpx;
		border-radius: 4rpx;
	}

	.tag-urgent {
		background: rgba(255,46,196,0.15);
		color: #FF2EC4;
		border: 1rpx solid rgba(255,46,196,0.25);
		animation: urgentPulse 1.2s ease-in-out infinite;
	}

	@keyframes urgentPulse {
		0%,100% { opacity: 0.8; }
		50% { opacity: 1; text-shadow: 0 0 8rpx rgba(255,46,196,0.5); }
	}

	.tag-normal {
		background: rgba(0,229,255,0.15);
		color: #00E5FF;
		border: 1rpx solid rgba(0,229,255,0.2);
	}

	.publish-time {
		font-size: 22rpx;
		color: #94A3B8;
		position: relative;
		z-index: 1;
	}

	/* 内容区 */
	.section-card {
		margin: 0 24rpx 24rpx;
		padding: 30rpx;
	}

	.section-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #00E5FF;
		margin-bottom: 20rpx;
		padding-bottom: 16rpx;
		border-bottom: 1rpx solid rgba(123,47,253,0.2);
		position: relative;
		z-index: 1;
		text-shadow: 0 0 8rpx rgba(0,229,255,0.2);
	}

	/* 福利 */
	.benefit-list {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		position: relative;
		z-index: 1;
	}

	.benefit-item {
		display: flex;
		align-items: center;
		background: rgba(0,229,255,0.08);
		border: 1rpx solid rgba(0,229,255,0.2);
		padding: 12rpx 24rpx;
		border-radius: 30rpx;
	}

	.benefit-icon {
		color: #00E5FF;
		margin-right: 8rpx;
		font-size: 24rpx;
		text-shadow: 0 0 8rpx rgba(0,229,255,0.4);
	}

	.benefit-text {
		font-size: 26rpx;
		color: #E2E8F0;
	}

	/* 地址 */
	.address-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		z-index: 1;
	}

	.address-text {
		font-size: 28rpx;
		color: #E2E8F0;
		flex: 1;
	}

	.address-nav {
		font-size: 26rpx;
		color: #00E5FF;
		margin-left: 20rpx;
	}

	/* 底部占位 */
	.bottom-placeholder {
		height: 140rpx;
	}

	/* 底部操作栏 */
	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(10,14,39,0.95);
		backdrop-filter: blur(20rpx);
		-webkit-backdrop-filter: blur(20rpx);
		display: flex;
		align-items: center;
		padding: 20rpx 24rpx;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		border-top: 1rpx solid rgba(123,47,253,0.3);
		box-shadow: 0 -4rpx 24rpx rgba(0,0,0,0.4), 0 0 24rpx rgba(123,47,253,0.1);
		z-index: 999;
	}

	.bar-action {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-right: 40rpx;
	}

	.action-icon {
		font-size: 40rpx;
	}

	.action-text {
		font-size: 20rpx;
		color: #94A3B8;
		margin-top: 4rpx;
	}

	.bar-btn {
		flex: 1;
		background: linear-gradient(135deg, #FF2EC4, #7B2FFD);
		color: #FFFFFF;
		text-align: center;
		padding: 24rpx 0;
		border-radius: 10rpx;
		font-size: 32rpx;
		font-weight: bold;
		box-shadow: 0 0 24rpx rgba(123,47,253,0.35);
	}

	.bar-btn:active {
		transform: scale(0.97);
		opacity: 0.85;
	}
	</style>
