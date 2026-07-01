<template>
		<view class="deliver-page">
			<!-- 顶部导航 -->
			<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
				<view class="nav-content">
					<view class="nav-back" @tap="goBack"><text>←</text></view>
					<text class="nav-title">我的投递</text>
					<view class="nav-placeholder"></view>
				</view>
			</view>
			<view :style="{ height: (statusBarHeight + 44) + 'px' }"></view>

			<!-- 投递列表 -->
			<view class="deliver-list">
				<view v-for="item in deliverList" :key="item._id" class="deliver-card card">
					<view class="deliver-header">
						<text class="deliver-job">{{ item.jobTitle }}</text>
						<text class="deliver-status" :class="'interview-' + item.interviewStatus">
							{{ interviewStatusText(item.interviewStatus) }}
						</text>
					</view>
					<view class="deliver-info">
						<text class="info-item">投递时间：{{ formatTime(item.deliverTime) }}</text>
						<view class="info-row">
							<text class="info-item">阅读状态：
								<text :class="item.readStatus === 0 ? 'text-unread' : 'text-read'">
									{{ item.readStatus === 0 ? '未读' : '已读' }}
								</text>
							</text>
						</view>
					</view>
					<view class="deliver-actions">
						<view class="action-btn" @tap="viewJob(item.jobId)">查看岗位</view>
					</view>
				</view>

				<!-- 加载状态 -->
				<view class="load-status" v-if="deliverList.length">
					<text v-if="loading">加载中...</text>
					<text v-else-if="!hasMore">— 没有更多了 —</text>
				</view>

				<!-- 空状态 -->
				<view class="empty-state" v-if="!loading && !deliverList.length">
					<text class="empty-icon">📭</text>
					<text class="empty-text">暂无投递记录</text>
					<view class="empty-btn" @tap="goRecruit">去浏览岗位</view>
				</view>
			</view>
		</view>
	</template>

	<script>
	import { callCloud, formatTime } from '@/common/util.js'

	export default {
		data() {
			return {
				statusBarHeight: 20,
				deliverList: [],
				page: 1,
				loading: false,
				hasMore: true
			}
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync()
			this.statusBarHeight = sysInfo.statusBarHeight || 20
			this.loadDelivers()
		},
		onPullDownRefresh() {
			this.page = 1
			this.hasMore = true
			this.deliverList = []
			this.loadDelivers().then(() => uni.stopPullDownRefresh())
		},
		methods: {
			formatTime,

			interviewStatusText(status) {
				const map = { 0: '待处理', 1: '邀约面试', 2: '不合适', 3: '已录用' }
				return map[status] || '待处理'
			},

			async loadDelivers() {
				if (this.loading) return
				this.loading = true
				try {
					const res = await callCloud('getMyDeliver', { page: this.page })
					if (res && res.success && res.data) {
						if (this.page === 1) {
							this.deliverList = res.data.list
						} else {
							this.deliverList = [...this.deliverList, ...res.data.list]
						}
						this.hasMore = res.data.hasMore
					}
				} catch (e) {
					console.error('加载投递记录失败:', e)
				} finally {
					this.loading = false
				}
			},

			viewJob(jobId) {
				if (jobId) {
					uni.navigateTo({ url: `/pages/recruit/detail?id=${jobId}` })
				}
			},

			goRecruit() {
				uni.switchTab({ url: '/pages/recruit/list' })
			},

			goBack() {
				uni.navigateBack()
			}
		}
	}
	</script>

	<style lang="scss" scoped>
	/* ============================================
	   我的投递 — 轻赛博霓虹科技风
	   ============================================ */
	.deliver-page {
		min-height: 100vh;
		background: linear-gradient(180deg, #0A0E27 0%, #0F1535 50%, #121838 100%);
	}

	.nav-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 999;
		background: rgba(10,14,39,0.92);
		backdrop-filter: blur(20rpx);
		-webkit-backdrop-filter: blur(20rpx);
		border-bottom: 1rpx solid rgba(123,47,253,0.25);
		box-shadow: 0 2rpx 24rpx rgba(0,0,0,0.4), 0 0 16rpx rgba(123,47,253,0.1);
	}

	.nav-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 24rpx;
		height: 88rpx;
	}

	.nav-back {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 40rpx;
		color: #00E5FF;
	}

	.nav-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #FFFFFF;
		text-shadow: 0 0 12rpx rgba(0,229,255,0.3);
	}

	.nav-placeholder {
		width: 60rpx;
	}

	.deliver-list {
		padding: 24rpx;
	}

	/* 卡片 */
	.card {
		position: relative;
		background: rgba(18,24,56,0.85);
		backdrop-filter: blur(10rpx);
		-webkit-backdrop-filter: blur(10rpx);
		border-radius: 16rpx;
		border: 1rpx solid rgba(123,47,253,0.2);
		box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.3), 0 0 16rpx rgba(123,47,253,0.08);
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
			repeating-linear-gradient(0deg, transparent, transparent 39rpx, rgba(123,47,253,0.3) 39rpx, rgba(123,47,253,0.3) 40rpx);
	}

	.card::after {
		content: '';
		position: absolute;
		left: 0;
		top: 20rpx;
		bottom: 20rpx;
		width: 4rpx;
		background: linear-gradient(180deg, #00E5FF, #7B2FFD, #FF2EC4);
		border-radius: 0 2rpx 2rpx 0;
		z-index: 1;
		opacity: 0.7;
		animation: sideGlow 3s ease-in-out infinite;
	}

	@keyframes sideGlow {
		0%,100% { opacity: 0.5; }
		50% { opacity: 0.9; }
	}

	.deliver-card {
		padding: 24rpx;
		margin-bottom: 20rpx;
	}

	.deliver-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx;
		position: relative;
		z-index: 1;
	}

	.deliver-job {
		font-size: 30rpx;
		font-weight: bold;
		color: #FFFFFF;
		flex: 1;
		text-shadow: 0 0 8rpx rgba(255,255,255,0.1);
	}

	.deliver-status {
		font-size: 24rpx;
		padding: 4rpx 16rpx;
		border-radius: 4rpx;
		flex-shrink: 0;
	}

	.interview-0 { background: rgba(255,46,196,0.15); color: #FF2EC4; border: 1rpx solid rgba(255,46,196,0.2); }
	.interview-1 { background: rgba(0,229,255,0.15); color: #00E5FF; border: 1rpx solid rgba(0,229,255,0.2); }
	.interview-2 { background: rgba(148,163,184,0.15); color: #94A3B8; border: 1rpx solid rgba(148,163,184,0.2); }
	.interview-3 { background: rgba(123,47,253,0.15); color: #9B6DFF; border: 1rpx solid rgba(123,47,253,0.2); }

	.deliver-info {
		padding-bottom: 16rpx;
		border-bottom: 1rpx solid rgba(123,47,253,0.15);
		margin-bottom: 16rpx;
		position: relative;
		z-index: 1;
	}

	.info-item {
		font-size: 24rpx;
		color: #E2E8F0;
		display: block;
		margin-bottom: 8rpx;
	}

	.info-row {
		display: flex;
		align-items: center;
	}

	.text-unread {
		color: #FF2EC4;
		font-weight: bold;
		text-shadow: 0 0 6rpx rgba(255,46,196,0.3);
	}

	.text-read {
		color: #00E5FF;
	}

	.deliver-actions {
		display: flex;
		position: relative;
		z-index: 1;
	}

	.action-btn {
		padding: 10rpx 24rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
		background: rgba(0,229,255,0.1);
		color: #00E5FF;
		border: 1rpx solid rgba(0,229,255,0.2);
	}

	.load-status {
		text-align: center;
		padding: 30rpx 0;
		font-size: 24rpx;
		color: #94A3B8;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 120rpx 0;
	}

	.empty-icon {
		font-size: 80rpx;
		margin-bottom: 20rpx;
	}

	.empty-text {
		font-size: 28rpx;
		color: #94A3B8;
		margin-bottom: 30rpx;
	}

	.empty-btn {
		background: linear-gradient(135deg, #00E5FF, #7B2FFD);
		color: #FFFFFF;
		padding: 20rpx 48rpx;
		border-radius: 8rpx;
		font-size: 28rpx;
		box-shadow: 0 0 20rpx rgba(0,229,255,0.3);
	}
	</style>
