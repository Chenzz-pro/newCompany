<template>
	<view class="manage-page">
		<!-- 顶部导航 -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="nav-content">
				<view class="nav-back" @tap="goBack"><text>←</text></view>
				<text class="nav-title">我的岗位</text>
				<view class="nav-placeholder"></view>
			</view>
		</view>
		<view :style="{ height: (statusBarHeight + 44) + 'px' }"></view>

		<!-- 岗位列表 -->
		<view class="job-list">
			<view v-for="job in jobList" :key="job._id" class="job-card card">
				<view class="job-header">
					<text class="job-name">{{ job.title }}</text>
					<text class="job-status" :class="'status-' + job.status">
						{{ statusText(job.status) }}
					</text>
				</view>
				<view class="job-info">
					<text class="info-item">{{ job.salary }}</text>
					<text class="info-item">📍 {{ job.location }}</text>
					<text class="info-item">🕐 {{ relativeTime(job.publishTime) }}</text>
				</view>
				<view class="job-actions">
					<view class="action-btn btn-edit" @tap="editJob(job._id)">编辑</view>
					<view class="action-btn btn-resume" @tap="viewResumes(job._id)">
						查看简历
					</view>
					<view class="action-btn" :class="job.status === 'published' ? 'btn-offline' : 'btn-online'"
						@tap="toggleStatus(job)">
						{{ job.status === 'published' ? '下架' : '上架' }}
					</view>
					<view class="action-btn btn-delete" @tap="deleteJob(job)">删除</view>
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
				<text class="empty-text">暂无发布的岗位</text>
				<view class="empty-btn" @tap="goAddJob">去发布岗位</view>
			</view>
		</view>
	</view>
</template>

<script>
import { callCloud, showToast, showLoading, hideLoading, relativeTime } from '@/common/util.js'

export default {
	data() {
		return {
			statusBarHeight: 20,
			jobList: [],
			page: 1,
			loading: false,
			hasMore: true
		}
	},
	onLoad() {
		const sysInfo = uni.getSystemInfoSync()
		this.statusBarHeight = sysInfo.statusBarHeight || 20
		this.checkAuth()
	},
	onShow() {
		this.page = 1
		this.hasMore = true
		this.jobList = []
		this.loadJobs()
	},
	methods: {
		relativeTime,

		async checkAuth() {
			try {
				const res = await callCloud('getUserInfo')
				if (res && res.data) {
					if (res.data.role !== 'admin') {
						showToast('无权限访问')
						setTimeout(() => uni.navigateBack(), 1500)
					}
				}
			} catch (e) {
				console.error(e)
			}
		},

		async loadJobs() {
			if (this.loading) return
			this.loading = true
			console.log('开始加载岗位列表, page:', this.page)
			try {
				const res = await callCloud('getMyJobs', { page: this.page })
				console.log('getMyJobs 返回:', JSON.stringify(res))
				if (res && res.success && res.data) {
					if (this.page === 1) {
						this.jobList = res.data.list
					} else {
						this.jobList = [...this.jobList, ...res.data.list]
					}
					this.hasMore = res.data.hasMore
					console.log('岗位数量:', res.data.list.length, 'total:', res.data.total)
				} else {
					console.error('加载失败:', res)
				}
			} catch (e) {
				console.error('加载岗位失败:', e)
			} finally {
				this.loading = false
			}
		},

		statusText(status) {
			const map = { published: '招聘中', offline: '已下架', pending: '待审核' }
			return map[status] || status
		},

		editJob(id) {
			uni.navigateTo({ url: `/pages/admin/job-edit?id=${id}` })
		},

		viewResumes(jobId) {
			uni.navigateTo({ url: `/pages/admin/resume-list?jobId=${jobId}` })
		},

		async toggleStatus(job) {
			const action = job.status === 'published' ? 'offline' : 'online'
			const tip = action === 'offline' ? '确定下架该岗位？' : '确定上架该岗位？'

			uni.showModal({
				title: '提示',
				content: tip,
				success: async (modalRes) => {
					if (!modalRes.confirm) return
					showLoading('操作中...')
					try {
						const res = await callCloud('deleteJob', { jobId: job._id, action })
						if (res && res.success) {
							showToast(res.message)
							this.page = 1
							this.jobList = []
							this.loadJobs()
						} else {
							showToast(res.message || '操作失败')
						}
					} catch (e) {
						showToast('网络异常')
					} finally {
						hideLoading()
					}
				}
			})
		},

		deleteJob(job) {
			uni.showModal({
				title: '确认删除',
				content: `确定删除「${job.title}」？删除后不可恢复`,
				success: async (res) => {
					if (!res.confirm) return
					showLoading('删除中...')
					try {
						const result = await callCloud('deleteJob', { jobId: job._id })
						if (result && result.success) {
							showToast('删除成功')
							this.page = 1
							this.jobList = []
							this.loadJobs()
						} else {
							showToast(result.message || '删除失败')
						}
					} catch (e) {
						showToast('网络异常')
					} finally {
						hideLoading()
					}
				}
			})
		},

		goAddJob() {
			uni.navigateTo({ url: '/pages/admin/job-edit' })
		},

		goBack() {
			uni.navigateBack()
		}
	}
}
</script>

<style lang="scss" scoped>
.manage-page {
	min-height: 100vh;
	background: #1256D8;
}

.nav-bar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 999;
	background: rgba(10, 40, 140, 0.75);
	box-shadow: 0 2rpx 8rpx rgba(46, 199, 255, 0.15);
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
	color: #FFFFFF;
}

.nav-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #FFFFFF;
}

.nav-placeholder {
	width: 60rpx;
}

.job-list {
	padding: 24rpx;
}

.job-card {
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.job-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.job-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #FFFFFF;
	flex: 1;
}

.job-status {
	font-size: 24rpx;
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
}

.status-published {
	background: rgba(46, 199, 255, 0.2);
	color: #73C0FF;
}

.status-offline {
	background: #1256D8;
	color: #96B8F0;
}

.status-pending {
	background: #FFF7E6;
	color: #D168E8;
}

.job-info {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid rgba(46, 199, 255, 0.15);
}

.info-item {
	font-size: 24rpx;
	color: #C6D8FF;
}

.job-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.action-btn {
	padding: 12rpx 24rpx;
	border-radius: 8rpx;
	font-size: 24rpx;
}

.btn-edit {
	background: rgba(46, 199, 255, 0.15);
	color: #73C0FF;
}

.btn-resume {
	background: rgba(46, 199, 255, 0.2);
	color: #73C0FF;
}

.btn-offline {
	background: #FFF7E6;
	color: #D168E8;
}

.btn-online {
	background: rgba(46, 199, 255, 0.2);
	color: #73C0FF;
}

.btn-delete {
	background: #FFECE8;
	color: #FF4D4F;
}

.load-status {
	text-align: center;
	padding: 30rpx 0;
	font-size: 24rpx;
	color: #96B8F0;
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
	color: #96B8F0;
	margin-bottom: 30rpx;
}

.empty-btn {
	background: linear-gradient(135deg, #73C0FF, #2EC7FF);
	color: rgba(10, 40, 140, 0.75);
	padding: 20rpx 48rpx;
	border-radius: 8rpx;
	font-size: 28rpx;
}
</style>
