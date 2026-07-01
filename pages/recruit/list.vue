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
.recruit-list-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #0A3490 0%, #1256D8 100%);
}

/* 筛选栏 — 深色玻璃态 */
.filter-bar {
	display: flex;
	align-items: center;
	background: rgba(10, 40, 140, 0.85);
	padding: 20rpx 24rpx;
	position: sticky;
	top: 0;
	z-index: 100;
	border-bottom: 1rpx solid rgba(46, 199, 255, 0.2);
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.3);
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
	color: #96B8F0;
	background: rgba(10, 40, 140, 0.5);
	border: 1rpx solid rgba(46, 199, 255, 0.2);
	flex-shrink: 0;
}

.filter-item.active {
	background: linear-gradient(135deg, #2EC7FF, #73C0FF);
	color: #FFFFFF;
	font-weight: 600;
	border-color: transparent;
	box-shadow: 0 0 16rpx rgba(46, 199, 255, 0.35);
}

/* 招聘列表 */
.job-list {
	padding: 24rpx;
}

/* 岗位卡片 — 科技感增强 */
.job-card {
	padding: 30rpx;
	margin-bottom: 20rpx;
	position: relative;
	overflow: hidden;
}

/* 卡片左侧光条 */
.job-card::before {
	content: '';
	position: absolute;
	left: 0;
	top: 20rpx;
	bottom: 20rpx;
	width: 4rpx;
	background: linear-gradient(180deg, #2EC7FF, #8A4FFF, #2EC7FF);
	border-radius: 0 2rpx 2rpx 0;
	opacity: 0.8;
}

.job-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.job-name {
	font-size: 32rpx;
	font-weight: 700;
	color: #FFFFFF;
	flex: 1;
}

.job-salary {
	font-size: 32rpx;
	font-weight: 700;
	color: #D168E8;
	text-shadow: 0 0 10rpx rgba(209, 104, 232, 0.4);
	margin-left: 20rpx;
	flex-shrink: 0;
}

.job-tags {
	display: flex;
	gap: 12rpx;
	margin-bottom: 16rpx;
}

.job-info {
	display: flex;
	flex-wrap: wrap;
	gap: 24rpx;
	margin-bottom: 20rpx;
}

.job-info-item {
	font-size: 24rpx;
	color: #C6D8FF;
	background: rgba(46, 199, 255, 0.06);
	padding: 6rpx 16rpx;
	border-radius: 6rpx;
	border: 1rpx solid rgba(46, 199, 255, 0.1);
}

.job-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 20rpx;
	border-top: 1rpx solid rgba(46, 199, 255, 0.15);
}

.job-time {
	font-size: 22rpx;
	color: #96B8F0;
}

.job-apply-btn {
	background: linear-gradient(135deg, #D168E8, #8A4FFF);
	color: #FFFFFF;
	font-weight: 600;
	padding: 12rpx 32rpx;
	border-radius: 30rpx;
	font-size: 26rpx;
	box-shadow: 0 0 16rpx rgba(138, 79, 255, 0.35);
}

/* 加载状态 */
.load-status {
	text-align: center;
	padding: 30rpx 0;
	font-size: 24rpx;
	color: #96B8F0;
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
	color: #96B8F0;
}
</style>
