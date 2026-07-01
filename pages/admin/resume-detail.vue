<template>
		<view class="detail-page">
			<!-- 顶部导航 -->
			<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
				<view class="nav-content">
					<view class="nav-back" @tap="goBack"><text>←</text></view>
					<text class="nav-title">简历详情</text>
					<view class="nav-placeholder"></view>
				</view>
			</view>
			<view :style="{ height: (statusBarHeight + 44) + 'px' }"></view>

			<!-- 简历内容 -->
			<view class="content" v-if="resume">
				<!-- 基本信息 -->
				<view class="section card">
					<view class="section-title">基本信息</view>
					<view class="info-row">
						<text class="info-label">姓名</text>
						<text class="info-value">{{ resume.resumeInfo.realName }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">电话</text>
						<view class="info-value phone-link" @tap="callPhone">
							{{ resume.resumeInfo.phone }}
							<text class="call-icon">📞</text>
						</view>
					</view>
					<view class="info-row" v-if="resume.resumeInfo.education">
						<text class="info-label">学历</text>
						<text class="info-value">{{ resume.resumeInfo.education }}</text>
					</view>
					<view class="info-row" v-if="resume.resumeInfo.workExp">
						<text class="info-label">经验</text>
						<text class="info-value">{{ resume.resumeInfo.workExp }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">投递岗位</text>
						<text class="info-value text-primary">{{ resume.jobTitle }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">投递时间</text>
						<text class="info-value">{{ formatTime(resume.deliverTime) }}</text>
					</view>
				</view>

				<!-- 自我介绍 -->
				<view class="section card" v-if="resume.resumeInfo.selfIntro">
					<view class="section-title">自我介绍</view>
					<text class="intro-text">{{ resume.resumeInfo.selfIntro }}</text>
				</view>

				<!-- 附件简历 -->
				<view class="section card" v-if="resume.resumeInfo.resumeFile && resume.resumeInfo.resumeFile.length">
					<view class="section-title">附件简历</view>
					<view class="image-grid">
						<image v-for="(img, idx) in resume.resumeInfo.resumeFile" :key="idx"
							:src="img" class="resume-image" mode="aspectFill" @tap="previewImage(idx)"></image>
					</view>
				</view>

				<!-- 处理状态 -->
				<view class="section card">
					<view class="section-title">处理状态</view>
					<view class="status-row">
						<text class="status-label">当前状态</text>
						<text class="status-value" :class="'interview-' + resume.interviewStatus">
							{{ interviewStatusText(resume.interviewStatus) }}
						</text>
					</view>
					<view class="status-row">
						<text class="status-label">阅读状态</text>
						<text class="status-value">{{ resume.readStatus === 0 ? '未读' : '已读' }}</text>
					</view>
					<view class="remark-area" v-if="resume.remark">
						<text class="remark-label">备注：</text>
						<text class="remark-text">{{ resume.remark }}</text>
					</view>
				</view>

				<!-- 操作区 -->
				<view class="action-section card">
					<view class="action-title">更新处理状态</view>
					<view class="status-btns">
						<view v-for="(s, idx) in statusOptions" :key="idx"
							:class="['status-btn', resume.interviewStatus === idx ? 'active' : '']"
							@tap="updateStatus(idx)">
							{{ s }}
						</view>
					</view>
					<!-- 备注输入 -->
					<view class="remark-input-area">
						<textarea class="remark-input" v-model="remark" placeholder="添加备注..." maxlength="200" />
						<view class="remark-save" @tap="saveRemark">保存备注</view>
					</view>
				</view>
			</view>

			<!-- 底部占位 -->
			<view style="height: 120rpx;"></view>

			<!-- 底部操作栏 -->
			<view class="bottom-bar" v-if="resume">
				<view class="bottom-btn btn-call" @tap="callPhone">📞 联系求职者</view>
				<view class="bottom-btn btn-read" v-if="resume.readStatus === 0" @tap="markRead">标记已读</view>
			</view>
		</view>
	</template>

	<script>
	import { callCloud, showToast, formatTime, makePhoneCall, showLoading, hideLoading, previewImage as previewImg } from '@/common/util.js'

	export default {
		data() {
			return {
				statusBarHeight: 20,
				deliverId: '',
				resume: null,
				remark: '',
				statusOptions: ['待处理', '邀约面试', '不合适', '已录用']
			}
		},
		onLoad(options) {
			const sysInfo = uni.getSystemInfoSync()
			this.statusBarHeight = sysInfo.statusBarHeight || 20
			if (options.id) {
				this.deliverId = options.id
				this.loadDetail()
			}
		},
		methods: {
			formatTime,

			interviewStatusText(status) {
				const map = { 0: '待处理', 1: '邀约面试', 2: '不合适', 3: '已录用' }
				return map[status] || '待处理'
			},

			async loadDetail() {
				showLoading('加载中...')
				try {
					const res = await callCloud('getCompanyResume', { page: 1, pageSize: 100 })
					if (res && res.success && res.data && res.data.list) {
						const found = res.data.list.find(item => item._id === this.deliverId)
						if (found) {
							this.resume = found
							this.remark = found.remark || ''
							if (found.readStatus === 0) { this.markRead() }
						}
					}
				} catch (e) { showToast('加载失败') } finally { hideLoading() }
			},

			async updateStatus(status) {
				showLoading('更新中...')
				try {
					const res = await callCloud('updateResumeStatus', { deliverId: this.deliverId, readStatus: 1, interviewStatus: status })
					if (res && res.success) { this.resume.interviewStatus = status; this.resume.readStatus = 1; showToast('更新成功') }
					else { showToast(res.message || '更新失败') }
				} catch (e) { showToast('网络异常') } finally { hideLoading() }
			},

			async markRead() {
				try { await callCloud('updateResumeStatus', { deliverId: this.deliverId, readStatus: 1 }); if (this.resume) this.resume.readStatus = 1 } catch (e) {}
			},

			async saveRemark() {
				showLoading('保存中...')
				try {
					const res = await callCloud('updateResumeStatus', { deliverId: this.deliverId, remark: this.remark })
					if (res && res.success) { showToast('保存成功') }
				} catch (e) { showToast('网络异常') } finally { hideLoading() }
			},

			callPhone() { if (this.resume && this.resume.resumeInfo.phone) { makePhoneCall(this.resume.resumeInfo.phone) } },
			previewImage(idx) { if (this.resume && this.resume.resumeInfo.resumeFile) { previewImg(this.resume.resumeInfo.resumeFile, idx) } },
			goBack() { uni.navigateBack() }
		}
	}
	</script>

	<style lang="scss" scoped>
	.detail-page { min-height: 100vh; background: linear-gradient(180deg, #0A0E27 0%, #121838 100%); }

	.nav-bar {
		position: fixed; top: 0; left: 0; right: 0; z-index: 999;
		background: rgba(10,14,39,0.92); backdrop-filter: blur(20rpx); -webkit-backdrop-filter: blur(20rpx);
		border-bottom: 1rpx solid rgba(123,47,253,0.25); box-shadow: 0 2rpx 24rpx rgba(0,0,0,0.4);
	}
	.nav-content { display: flex; align-items: center; justify-content: space-between; padding: 0 24rpx; height: 88rpx; }
	.nav-back { width: 60rpx; height: 60rpx; display: flex; align-items: center; justify-content: center; font-size: 40rpx; color: #00E5FF; }
	.nav-title { font-size: 32rpx; font-weight: bold; color: #FFFFFF; text-shadow: 0 0 12rpx rgba(0,229,255,0.3); }
	.nav-placeholder { width: 60rpx; }

	.content { padding: 24rpx; }

	.card {
		position: relative; background: rgba(18,24,56,0.85); backdrop-filter: blur(10rpx); -webkit-backdrop-filter: blur(10rpx);
		border-radius: 16rpx; border: 1rpx solid rgba(123,47,253,0.2);
		box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.3), 0 0 16rpx rgba(123,47,253,0.08); overflow: hidden;
	}
	.card::before {
		content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 0; opacity: 0.02;
		background: repeating-linear-gradient(0deg, transparent, transparent 39rpx, rgba(123,47,253,0.3) 39rpx, rgba(123,47,253,0.3) 40rpx);
	}

	.section { padding: 24rpx; margin-bottom: 20rpx; }
	.section-title { font-size: 30rpx; font-weight: bold; color: #00E5FF; margin-bottom: 20rpx; padding-bottom: 16rpx; border-bottom: 1rpx solid rgba(123,47,253,0.2); position: relative; z-index: 1; text-shadow: 0 0 8rpx rgba(0,229,255,0.2); }

	.info-row { display: flex; justify-content: space-between; align-items: center; padding: 16rpx 0; position: relative; z-index: 1; }
	.info-label { font-size: 26rpx; color: #94A3B8; }
	.info-value { font-size: 26rpx; color: #E2E8F0; }
	.text-primary { color: #00E5FF; font-weight: bold; }
	.phone-link { display: flex; align-items: center; color: #00E5FF; }
	.call-icon { margin-left: 8rpx; font-size: 28rpx; }

	.intro-text { font-size: 28rpx; color: #E2E8F0; line-height: 1.8; position: relative; z-index: 1; }

	.image-grid { display: flex; flex-wrap: wrap; gap: 16rpx; position: relative; z-index: 1; }
	.resume-image { width: 200rpx; height: 200rpx; border-radius: 8rpx; border: 1rpx solid rgba(123,47,253,0.2); }

	.status-row { display: flex; justify-content: space-between; align-items: center; padding: 12rpx 0; position: relative; z-index: 1; }
	.status-label { font-size: 26rpx; color: #94A3B8; }
	.status-value { font-size: 26rpx; padding: 4rpx 16rpx; border-radius: 4rpx; }

	.interview-0 { background: rgba(255,46,196,0.15); color: #FF2EC4; }
	.interview-1 { background: rgba(0,229,255,0.15); color: #00E5FF; }
	.interview-2 { background: rgba(148,163,184,0.12); color: #94A3B8; }
	.interview-3 { background: rgba(123,47,253,0.15); color: #9B6DFF; }

	.remark-area { margin-top: 16rpx; padding: 16rpx; background: rgba(10,14,39,0.6); border-radius: 8rpx; position: relative; z-index: 1; }
	.remark-label { font-size: 24rpx; color: #94A3B8; }
	.remark-text { font-size: 26rpx; color: #E2E8F0; }

	.action-section { padding: 24rpx; margin-bottom: 20rpx; }
	.action-title { font-size: 30rpx; font-weight: bold; color: #FFFFFF; margin-bottom: 20rpx; position: relative; z-index: 1; }
	.status-btns { display: flex; flex-wrap: wrap; gap: 16rpx; margin-bottom: 24rpx; position: relative; z-index: 1; }
	.status-btn { padding: 16rpx 28rpx; border-radius: 8rpx; font-size: 26rpx; background: rgba(10,14,39,0.6); color: #94A3B8; border: 1rpx solid rgba(123,47,253,0.15); }
	.status-btn.active { background: linear-gradient(135deg, #7B2FFD, #00E5FF); color: #FFFFFF; box-shadow: 0 0 20rpx rgba(0,229,255,0.25); }
	.remark-input-area { margin-top: 16rpx; position: relative; z-index: 1; }
	.remark-input { width: 100%; min-height: 120rpx; background: rgba(10,14,39,0.6); border-radius: 8rpx; padding: 16rpx; font-size: 26rpx; box-sizing: border-box; color: #E2E8F0; border: 1rpx solid rgba(123,47,253,0.15); }
	.remark-save { margin-top: 12rpx; text-align: right; color: #00E5FF; font-size: 26rpx; }

	.bottom-bar {
		position: fixed; bottom: 0; left: 0; right: 0;
		background: rgba(10,14,39,0.95); backdrop-filter: blur(20rpx); -webkit-backdrop-filter: blur(20rpx);
		display: flex; gap: 20rpx; padding: 20rpx 24rpx; padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		border-top: 1rpx solid rgba(123,47,253,0.3); box-shadow: 0 -2rpx 24rpx rgba(0,0,0,0.4);
	}
	.bottom-btn { flex: 1; text-align: center; padding: 20rpx 0; border-radius: 8rpx; font-size: 28rpx; font-weight: bold; }
	.btn-call { background: linear-gradient(135deg, #7B2FFD, #FF2EC4); color: #FFFFFF; box-shadow: 0 0 20rpx rgba(123,47,253,0.3); }
	.btn-read { background: linear-gradient(135deg, #00E5FF, #7B2FFD); color: #FFFFFF; box-shadow: 0 0 20rpx rgba(0,229,255,0.3); }
	</style>
