<template>
		<view class="resume-page">
			<!-- 顶部导航 -->
			<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
				<view class="nav-content">
					<view class="nav-back" @tap="goBack"><text>←</text></view>
					<text class="nav-title">{{ jobTitle ? '岗位简历' : '收到的简历' }}</text>
					<view class="nav-placeholder"></view>
				</view>
			</view>
			<view :style="{ height: (statusBarHeight + 44) + 'px' }"></view>

			<!-- 筛选标签 -->
			<view class="filter-tabs">
				<view v-for="(tab, idx) in tabs" :key="idx"
					:class="['tab-item', currentTab === idx ? 'active' : '']"
					@tap="switchTab(idx)">
					<text>{{ tab.label }}</text>
					<text v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</text>
				</view>
			</view>

			<!-- 简历列表 -->
			<view class="resume-list">
				<view v-for="item in resumeList" :key="item._id" class="resume-card card"
					:class="{ unread: item.readStatus === 0 }">
					<view class="resume-header" @tap="viewDetail(item)">
						<view class="resume-left">
							<view class="resume-name-row">
								<text class="resume-name">{{ item.resumeInfo.realName }}</text>
								<text v-if="item.readStatus === 0" class="unread-dot"></text>
							</view>
							<text class="resume-phone">{{ item.resumeInfo.phone }}</text>
							<text class="resume-job">{{ item.jobTitle }}</text>
						</view>
						<view class="resume-right">
							<text class="resume-time">{{ formatTime(item.deliverTime) }}</text>
							<text class="resume-status" :class="'interview-' + item.interviewStatus">
								{{ interviewStatusText(item.interviewStatus) }}
							</text>
						</view>
					</view>
					<view class="resume-actions">
						<view class="action-btn btn-detail" @tap="viewDetail(item)">查看详情</view>
						<view class="action-btn btn-read" v-if="item.readStatus === 0" @tap="markRead(item)">标记已读</view>
						<view class="action-btn btn-call" @tap="callCandidate(item.resumeInfo.phone)">联系</view>
						<picker :range="statusOptions" @change="onStatusChange($event, item)">
							<view class="action-btn btn-status">处理</view>
						</picker>
					</view>
				</view>

				<!-- 加载状态 -->
				<view class="load-status" v-if="resumeList.length">
					<text v-if="loading">加载中...</text>
					<text v-else-if="!hasMore">— 没有更多了 —</text>
				</view>

				<!-- 空状态 -->
				<view class="empty-state" v-if="!loading && !resumeList.length">
					<text class="empty-icon">📭</text>
					<text class="empty-text">暂无简历</text>
				</view>
			</view>
		</view>
	</template>

	<script>
	import { callCloud, showToast, formatTime, makePhoneCall } from '@/common/util.js'

	export default {
		data() {
			return {
				statusBarHeight: 20,
				jobId: '',
				jobTitle: '',
				currentTab: 0,
				tabs: [
					{ label: '全部', status: -1, count: 0 },
					{ label: '待处理', status: 0, count: 0 },
					{ label: '邀约面试', status: 1, count: 0 },
					{ label: '已录用', status: 3, count: 0 },
					{ label: '不合适', status: 2, count: 0 }
				],
				statusOptions: ['待处理', '邀约面试', '不合适', '已录用'],
				resumeList: [],
				page: 1,
				loading: false,
				hasMore: true
			}
		},
		onLoad(options) {
			const sysInfo = uni.getSystemInfoSync()
			this.statusBarHeight = sysInfo.statusBarHeight || 20
			if (options.jobId) {
				this.jobId = options.jobId
				this.jobTitle = options.jobTitle || '岗位简历'
			}
			this.loadResumes()
		},
		onPullDownRefresh() {
			this.page = 1
			this.hasMore = true
			this.resumeList = []
			this.loadResumes().then(() => uni.stopPullDownRefresh())
		},
		methods: {
			formatTime,

			interviewStatusText(status) {
				const map = { 0: '待处理', 1: '邀约面试', 2: '不合适', 3: '已录用' }
				return map[status] || '待处理'
			},

			switchTab(idx) {
				if (this.currentTab === idx) return
				this.currentTab = idx
				this.page = 1
				this.hasMore = true
				this.resumeList = []
				this.loadResumes()
			},

			async loadResumes() {
				if (this.loading) return
				this.loading = true
				try {
					const params = { page: this.page }
					if (this.jobId) params.jobId = this.jobId
					const tab = this.tabs[this.currentTab]
					if (tab.status !== -1) params.interviewStatus = tab.status
					const res = await callCloud('getCompanyResume', params)
					if (res && res.success && res.data) {
						if (this.page === 1) {
							this.resumeList = res.data.list
						} else {
							this.resumeList = [...this.resumeList, ...res.data.list]
						}
						this.hasMore = res.data.hasMore
					}
				} catch (e) { console.error('加载简历失败:', e) } finally { this.loading = false }
			},

			viewDetail(item) { uni.navigateTo({ url: `/pages/admin/resume-detail?id=${item._id}` }) },
			async markRead(item) {
				try {
					const res = await callCloud('updateResumeStatus', { deliverId: item._id, readStatus: 1 })
					if (res && res.success) { item.readStatus = 1 }
				} catch (e) { showToast('操作失败') }
			},

			onStatusChange(e, item) {
				const newStatus = parseInt(e.detail.value)
				uni.showModal({
					title: '确认操作',
					content: `确定将「${item.resumeInfo.realName}」标记为「${this.statusOptions[newStatus]}」？`,
					success: async (modalRes) => {
						if (!modalRes.confirm) return
						try {
							const res = await callCloud('updateResumeStatus', { deliverId: item._id, readStatus: 1, interviewStatus: newStatus })
							if (res && res.success) { item.interviewStatus = newStatus; item.readStatus = 1; showToast('更新成功') }
							else { showToast(res.message || '更新失败') }
						} catch (e) { showToast('网络异常') }
					}
				})
			},

			callCandidate(phone) { makePhoneCall(phone) },
			goBack() { uni.navigateBack() }
		}
	}
	</script>

	<style lang="scss" scoped>
	.resume-page { min-height: 100vh; background: linear-gradient(180deg, #0A0E27 0%, #121838 100%); }

	.nav-bar {
		position: fixed; top: 0; left: 0; right: 0; z-index: 999;
		background: rgba(10,14,39,0.92); backdrop-filter: blur(20rpx); -webkit-backdrop-filter: blur(20rpx);
		border-bottom: 1rpx solid rgba(123,47,253,0.25); box-shadow: 0 2rpx 24rpx rgba(0,0,0,0.4);
	}
	.nav-content { display: flex; align-items: center; justify-content: space-between; padding: 0 24rpx; height: 88rpx; }
	.nav-back { width: 60rpx; height: 60rpx; display: flex; align-items: center; justify-content: center; font-size: 40rpx; color: #00E5FF; }
	.nav-title { font-size: 32rpx; font-weight: bold; color: #FFFFFF; text-shadow: 0 0 12rpx rgba(0,229,255,0.3); }
	.nav-placeholder { width: 60rpx; }

	.filter-tabs { display: flex; background: rgba(10,14,39,0.92); padding: 16rpx 24rpx; gap: 16rpx; border-bottom: 1rpx solid rgba(123,47,253,0.2); }
	.tab-item { display: flex; align-items: center; padding: 10rpx 24rpx; border-radius: 30rpx; font-size: 24rpx; color: #94A3B8; background: rgba(18,24,56,0.6); border: 1rpx solid rgba(123,47,253,0.15); }
	.tab-item.active { background: linear-gradient(135deg, #7B2FFD, #00E5FF); color: #FFFFFF; box-shadow: 0 0 16rpx rgba(0,229,255,0.25); }
	.tab-badge { background: #FF2EC4; color: #FFFFFF; font-size: 18rpx; padding: 2rpx 8rpx; border-radius: 10rpx; margin-left: 8rpx; }

	.resume-list { padding: 24rpx; }

	.card {
		position: relative; background: rgba(18,24,56,0.85); backdrop-filter: blur(10rpx); -webkit-backdrop-filter: blur(10rpx);
		border-radius: 16rpx; border: 1rpx solid rgba(123,47,253,0.2);
		box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.3), 0 0 16rpx rgba(123,47,253,0.08); overflow: hidden;
	}
	.card::before {
		content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 0; opacity: 0.02;
		background: repeating-linear-gradient(0deg, transparent, transparent 39rpx, rgba(123,47,253,0.3) 39rpx, rgba(123,47,253,0.3) 40rpx);
	}

	.resume-card { padding: 24rpx; margin-bottom: 16rpx; }
	.resume-card.unread { border-left: 4rpx solid #00E5FF; box-shadow: 0 0 16rpx rgba(0,229,255,0.12); }

	.resume-header { display: flex; justify-content: space-between; margin-bottom: 16rpx; position: relative; z-index: 1; }
	.resume-left { flex: 1; }
	.resume-name-row { display: flex; align-items: center; margin-bottom: 8rpx; }
	.resume-name { font-size: 30rpx; font-weight: bold; color: #FFFFFF; }
	.unread-dot { width: 16rpx; height: 16rpx; border-radius: 50%; background: #00E5FF; margin-left: 12rpx; box-shadow: 0 0 8rpx rgba(0,229,255,0.6); animation: glowPulse 1.5s infinite; }
	@keyframes glowPulse { 0%,100% { box-shadow: 0 0 8rpx rgba(0,229,255,0.5); } 50% { box-shadow: 0 0 20rpx rgba(0,229,255,0.8); } }

	.resume-phone { font-size: 24rpx; color: #E2E8F0; display: block; margin-bottom: 4rpx; }
	.resume-job { font-size: 24rpx; color: #00E5FF; }
	.resume-right { text-align: right; }
	.resume-time { font-size: 22rpx; color: #94A3B8; display: block; margin-bottom: 8rpx; }
	.resume-status { font-size: 22rpx; padding: 4rpx 12rpx; border-radius: 4rpx; }
	.interview-0 { background: rgba(255,46,196,0.15); color: #FF2EC4; border: 1rpx solid rgba(255,46,196,0.2); }
	.interview-1 { background: rgba(0,229,255,0.15); color: #00E5FF; border: 1rpx solid rgba(0,229,255,0.2); }
	.interview-2 { background: rgba(148,163,184,0.12); color: #94A3B8; border: 1rpx solid rgba(148,163,184,0.15); }
	.interview-3 { background: rgba(123,47,253,0.15); color: #9B6DFF; border: 1rpx solid rgba(123,47,253,0.2); }

	.resume-actions { display: flex; gap: 12rpx; padding-top: 16rpx; border-top: 1rpx solid rgba(123,47,253,0.15); position: relative; z-index: 1; }
	.action-btn { padding: 10rpx 20rpx; border-radius: 8rpx; font-size: 24rpx; }
	.btn-detail { background: rgba(0,229,255,0.1); color: #00E5FF; border: 1rpx solid rgba(0,229,255,0.2); }
	.btn-read { background: rgba(255,46,196,0.1); color: #FF2EC4; border: 1rpx solid rgba(255,46,196,0.15); }
	.btn-call { background: rgba(123,47,253,0.1); color: #9B6DFF; border: 1rpx solid rgba(123,47,253,0.2); }
	.btn-status { background: rgba(148,163,184,0.08); color: #94A3B8; border: 1rpx solid rgba(148,163,184,0.12); }

	.load-status { text-align: center; padding: 30rpx 0; font-size: 24rpx; color: #94A3B8; }
	.empty-state { display: flex; flex-direction: column; align-items: center; padding: 120rpx 0; }
	.empty-icon { font-size: 80rpx; margin-bottom: 20rpx; }
	.empty-text { font-size: 28rpx; color: #94A3B8; }
	</style>
