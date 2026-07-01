<template>
		<view class="recruit-list-page">
			<!-- 顶部筛选栏 -->
			<view class="filter-bar">
				<view class="filter-list">
					<view v-for="(cat, idx) in categories" :key="idx"
						:class="['filter-item', currentCategory === cat ? 'active' : '']"
						@tap="onCategoryTap(cat)">
						<text>{{ cat }}</text>
					</view>
				</view>
			</view>

			<!-- 招聘列表 -->
			<view class="job-list">
				<view v-for="(job, idx) in jobList" :key="job._id" class="job-card card fade-in"
					:style="{ animationDelay: (idx % 10) * 0.05 + 's' }" @tap="goDetail(job._id)">
					<view class="job-header">
						<text class="job-name">{{ job.title }}</text>
						<text class="job-salary">{{ job.salary }}</text>
					</view>
					<view class="job-tags">
						<text v-if="job.isUrgent" class="tag tag-urgent">急招</text>
						<text v-if="job.freshGrad" class="tag tag-normal">应届生</text>
						<text v-if="job.workType" class="tag tag-normal">{{ job.workType }}</text>
					</view>
					<view class="job-info">
						<text class="job-info-item">📍 {{ job.location }}</text>
						<text class="job-info-item">💼 {{ job.experience }}</text>
						<text class="job-info-item">👥 {{ job.headcount || '若干' }}人</text>
					</view>
					<view class="job-footer">
						<text class="job-time">{{ relativeTime(job.publishTime) }}</text>
						<text class="job-apply-btn" @tap.stop="goApply(job._id)">投递简历</text>
					</view>
				</view>

				<!-- 加载状态 -->
				<view class="load-status" v-if="jobList.length">
					<text v-if="loading">加载中...</text>
					<text v-else-if="!hasMore">— 没有更多了 —</text>
				</view>

				<!-- 空状态 -->
				<view class="empty-state" v-if="!loading && !jobList.length">
					<text class="empty-icon">📋</text>
					<text class="empty-text">暂无招聘岗位</text>
				</view>
			</view>
		</view>
	</template>

	<script>
	import config from '@/common/config.js'
	import { callCloud, showToast, relativeTime } from '@/common/util.js'

	export default {
		data() {
			return {
				categories: config.jobCategories,
				currentCategory: '全部',
				jobList: [],
				page: 1,
				pageSize: config.pageSize,
				loading: false,
				hasMore: true
			}
		},
		onLoad() {
			this.loadJobs()
		},
		onPullDownRefresh() {
			this.page = 1
			this.hasMore = true
			this.jobList = []
			this.loadJobs().then(() => {
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			if (this.hasMore && !this.loading) {
				this.page++
				this.loadJobs()
			}
		},
		methods: {
			relativeTime,

			async loadJobs() {
				if (this.loading) return
				this.loading = true

				try {
					const where = {}
					if (this.currentCategory !== '全部') {
						where.category = this.currentCategory
					}
					where.status = 'published'

					const res = await callCloud('getJobs', {
						page: this.page,
						pageSize: this.pageSize,
						where
					})

					if (res && res.data) {
						if (this.page === 1) {
							this.jobList = res.data.list
						} else {
							this.jobList = [...this.jobList, ...res.data.list]
						}
						this.hasMore = res.data.hasMore
					}
				} catch (e) {
					console.error('加载招聘列表失败:', e)
					showToast('加载失败，请重试')
				} finally {
					this.loading = false
				}
			},

			onCategoryTap(cat) {
				if (this.currentCategory === cat) return
				this.currentCategory = cat
				this.page = 1
				this.hasMore = true
				this.jobList = []
				this.loadJobs()
			},

			goDetail(id) {
				uni.navigateTo({ url: `/pages/recruit/detail?id=${id}` })
			},

			goApply(id) {
				uni.navigateTo({ url: `/pages/recruit/apply?id=${id}` })
			},


		}
	}
	</script>

	<style scoped>
	/* ============================================
	   招聘列表 — 轻赛博霓虹科技风
	   ============================================ */
	.recruit-list-page {
		min-height: 100vh;
		background: linear-gradient(180deg, #0A0E27 0%, #0F1535 50%, #121838 100%);
	}

	/* 筛选栏 — 玻璃态 */
	.filter-bar {
		display: flex;
		align-items: center;
		background: rgba(10,14,39,0.92);
		backdrop-filter: blur(20rpx);
		-webkit-backdrop-filter: blur(20rpx);
		padding: 20rpx 24rpx;
		position: sticky;
		top: 0;
		z-index: 100;
		border-bottom: 1rpx solid rgba(123,47,253,0.25);
		box-shadow: 0 4rpx 24rpx rgba(0,0,0,0.4), 0 0 16rpx rgba(123,47,253,0.1);
		overflow-x: auto;
		white-space: nowrap;
	}

	.filter-list {
		display: inline-flex;
		gap: 16rpx;
	}

	.filter-item {
		display: inline-block;
		padding: 12rpx 28rpx;
		border-radius: 30rpx;
		font-size: 26rpx;
		color: #94A3B8;
		background: rgba(18,24,56,0.6);
		border: 1rpx solid rgba(123,47,253,0.2);
		flex-shrink: 0;
		transition: all 0.3s ease;
	}

	.filter-item.active {
		background: linear-gradient(135deg, #7B2FFD, #00E5FF);
		color: #FFFFFF;
		font-weight: 600;
		border-color: transparent;
		box-shadow: 0 0 20rpx rgba(0,229,255,0.3), 0 0 32rpx rgba(123,47,253,0.2);
	}

	/* 招聘列表 */
	.job-list {
		padding: 24rpx;
	}

	/* 岗位卡片 */
	.job-card {
		padding: 30rpx;
		margin-bottom: 20rpx;
		position: relative;
		overflow: hidden;
		background: rgba(18,24,56,0.85);
		backdrop-filter: blur(10rpx);
		-webkit-backdrop-filter: blur(10rpx);
		border-radius: 16rpx;
		border: 1rpx solid rgba(123,47,253,0.2);
		box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.3), 0 0 16rpx rgba(123,47,253,0.08);
		animation: cardFadeIn 0.5s ease forwards;
		opacity: 0;
	}

	.fade-in {
		animation: cardFadeIn 0.5s ease forwards;
	}

	@keyframes cardFadeIn {
		from { opacity: 0; transform: translateY(20rpx); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* 卡片电路纹理 */
	.job-card::before {
		content: '';
		position: absolute;
		top: 0; left: 0; right: 0; bottom: 0;
		pointer-events: none;
		z-index: 0;
		opacity: 0.03;
		background:
			repeating-linear-gradient(0deg, transparent, transparent 39rpx, rgba(123,47,253,0.3) 39rpx, rgba(123,47,253,0.3) 40rpx),
			repeating-linear-gradient(90deg, transparent, transparent 39rpx, rgba(0,229,255,0.2) 39rpx, rgba(0,229,255,0.2) 40rpx);
	}

	/* 卡片左侧渐变光条 */
	.job-card::after {
		content: '';
		position: absolute;
		left: 0;
		top: 20rpx;
		bottom: 20rpx;
		width: 4rpx;
		background: linear-gradient(180deg, #00E5FF, #7B2FFD, #FF2EC4);
		border-radius: 0 2rpx 2rpx 0;
		opacity: 0.8;
		z-index: 1;
		animation: sideGlow 3s ease-in-out infinite;
	}

	@keyframes sideGlow {
		0%,100% { opacity: 0.6; box-shadow: 0 0 8rpx rgba(0,229,255,0.3); }
		50% { opacity: 1; box-shadow: 0 0 16rpx rgba(0,229,255,0.6); }
	}

	.job-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx;
		position: relative;
		z-index: 1;
	}

	.job-name {
		font-size: 32rpx;
		font-weight: 700;
		color: #FFFFFF;
		flex: 1;
		text-shadow: 0 0 8rpx rgba(255,255,255,0.15);
	}

	.job-salary {
		font-size: 32rpx;
		font-weight: 700;
		color: #FF2EC4;
		text-shadow: 0 0 12rpx rgba(255,46,196,0.4);
		margin-left: 20rpx;
		flex-shrink: 0;
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
		background: rgba(0,229,255,0.1);
		color: #00E5FF;
		border: 1rpx solid rgba(0,229,255,0.2);
	}

	.job-info {
		display: flex;
		flex-wrap: wrap;
		gap: 24rpx;
		margin-bottom: 20rpx;
		position: relative;
		z-index: 1;
	}

	.job-info-item {
		font-size: 24rpx;
		color: #E2E8F0;
		background: rgba(123,47,253,0.08);
		padding: 6rpx 16rpx;
		border-radius: 6rpx;
		border: 1rpx solid rgba(123,47,253,0.15);
	}

	.job-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 20rpx;
		border-top: 1rpx solid rgba(123,47,253,0.15);
		position: relative;
		z-index: 1;
	}

	.job-time {
		font-size: 22rpx;
		color: #94A3B8;
	}

	.job-apply-btn {
		background: linear-gradient(135deg, #FF2EC4, #7B2FFD);
		color: #FFFFFF;
		font-weight: 600;
		padding: 12rpx 32rpx;
		border-radius: 30rpx;
		font-size: 26rpx;
		box-shadow: 0 0 20rpx rgba(123,47,253,0.3);
		position: relative;
		overflow: hidden;
	}

	.job-apply-btn:active {
		transform: scale(0.95);
		opacity: 0.85;
	}

	/* 加载状态 */
	.load-status {
		text-align: center;
		padding: 30rpx 0;
		font-size: 24rpx;
		color: #94A3B8;
	}

	/* 空状态 */
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
	}
	</style>
