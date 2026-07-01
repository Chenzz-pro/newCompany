<template>
	<view class="mine-page">
		<!-- 顶部蓝色背景区域 -->
		<view class="header-bg" :style="{ paddingTop: (statusBarHeight + 10) + 'px' }">
			<!-- 标题栏 -->
			<view class="header-title">
				<text class="title-text">个人中心</text>
			</view>
			
			<!-- 未登录状态 - 使用 button 组件获取手机号 -->
			<button v-if="!userInfo.phone" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber" class="user-section-btn">
				<view class="user-section">
					<view class="mascot-box">
						<text class="mascot">🤖</text>
					</view>
					<view class="user-info">
						<text class="user-name">点击授权手机号登录</text>
						<text class="user-desc">登录查看投递、完善资料</text>
					</view>
					<view class="admin-badge" v-if="userInfo.role === 'admin'">管理员</view>
				</view>
			</button>
			
			<!-- 已登录状态 -->
			<view v-else class="user-section" @tap="goProfile">
				<view class="mascot-box">
					<image v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" class="avatar-img-circle" />
					<text v-else class="mascot">👤</text>
				</view>
				<view class="user-info">
					<text class="user-name">{{ userInfo.nickName || '用户' }}</text>
					<text class="user-desc">{{ userInfo.phone }}</text>
				</view>
				<view class="admin-badge" v-if="userInfo.role === 'admin'">管理员</view>
			</view>
		</view>
		
		<!-- 内容区域 -->
		<view class="content-area">
			<!-- 求职服务 -->
			<view class="section-card">
				<view class="card-header">
					<text class="card-title">求职服务</text>
				</view>
				<view class="card-body">
					<view class="list-item" @tap="goPage('/pages/user/my-deliver')">
						<text class="item-icon"></text>
						<text class="item-text">我的投递记录</text>
						<view class="item-right">
							<text v-if="deliverCount > 0" class="badge">{{ deliverCount }}</text>
							<text class="item-arrow">›</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 设置 -->
			<view class="section-card">
				<view class="card-body">
					<view class="list-item" @tap="goProfile">
						<text class="item-text">设置</text>
						<text class="item-arrow">›</text>
					</view>
				</view>
			</view>
			
			<!-- 管理后台（仅 admin） -->
			<view class="section-card" v-if="userInfo.role === 'admin'">
				<view class="card-header">
					<text class="card-title">管理后台</text>
				</view>
				<view class="card-body">
					<view class="list-item" @tap="goPage('/pages/admin/job-edit')">
						<text class="item-icon"></text>
						<text class="item-text">发布新岗位</text>
						<text class="item-arrow">›</text>
					</view>
					<view class="list-item" @tap="goPage('/pages/admin/job-manage')">
						<text class="item-icon"></text>
						<text class="item-text">岗位管理</text>
						<text class="item-arrow">›</text>
					</view>
					<view class="list-item" @tap="goPage('/pages/admin/resume-list')">
						<text class="item-icon"></text>
						<text class="item-text">全部简历</text>
						<text class="item-arrow">›</text>
					</view>
				</view>
			</view>
			
			<!-- 联系我们 -->
			<view class="section-card">
				<view class="card-body">
					<view class="list-item" @tap="callService">
						<text class="item-text">联系我们</text>
						<text class="item-arrow">›</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { callCloud, showToast, showLoading, hideLoading, makePhoneCall } from '@/common/util.js'
import config from '@/common/config.js'

export default {
	data() {
		return {
			statusBarHeight: 20,
			userInfo: {
				role: 'user',
				nickName: '',
				avatarUrl: '',
				phone: ''
			},
			deliverCount: 0
		}
	},
	onShow() {
		this.loadUserInfo()
		this.loadDeliverCount()
	},
	methods: {
		async loadUserInfo() {
			console.log('开始加载用户信息')
			try {
				const res = await callCloud('getUserInfo')
				console.log('getUserInfo 返回:', res)
				if (res && res.success && res.data) {
					this.userInfo = {
						role: res.data.role || 'user',
						nickName: res.data.nickName || '',
						avatarUrl: res.data.avatarUrl || '',
						phone: res.data.phone || ''
					}
					console.log('更新后的 userInfo:', this.userInfo)
				} else {
					console.error('获取用户信息失败:', res)
				}
			} catch (e) {
				console.error('获取用户信息异常:', e)
			}
		},

		async loadDeliverCount() {
			try {
				const res = await callCloud('getMyDeliver', { page: 1, pageSize: 1 })
				if (res && res.success && res.data) {
					this.deliverCount = res.data.total || 0
				}
			} catch (e) {
				// ignore
			}
		},

		// 获取手机号授权回调
		async onGetPhoneNumber(e) {
			console.log('========== 获取手机号事件 ==========')
			console.log('e.detail:', JSON.stringify(e.detail))
			
			// 用户拒绝授权
			if (!e.detail || !e.detail.code) {
				console.log('用户拒绝授权或未获取到code')
				showToast('需要授权手机号才能登录')
				return
			}
			
			const code = e.detail.code
			const cloudID = e.detail.cloudID || ''
			console.log('获取到的 code:', code, 'cloudID:', cloudID)
			
			showLoading('登录中...')
			
			try {
				const callData = {
					updateData: { phoneCode: code, cloudID: cloudID },
					getPhone: true
				}
				console.log('调用云函数参数:', JSON.stringify(callData))
				const phoneRes = await callCloud('updateUserInfo', callData)
				
				console.log('updateUserInfo 返回:', JSON.stringify(phoneRes))
				
				if (phoneRes && phoneRes.success) {
					showToast('登录成功')
					// 刷新用户信息
					await this.loadUserInfo()
					console.log('刷新后 userInfo:', JSON.stringify(this.userInfo))
				} else {
					console.error('登录失败:', phoneRes)
					showToast(phoneRes.message || '登录失败')
				}
			} catch (err) {
				console.error('登录错误:', err)
				showToast('登录失败，请重试')
			} finally {
				hideLoading()
			}
		},

		goProfile() {
			console.log('跳转到个人资料页')
			uni.navigateTo({ url: '/pages/mine/profile' })
		},

		callService() {
			console.log('点击联系客服')
			const phone = config.company.phone
			console.log('客服电话:', phone)
			if (!phone) {
				showToast('客服电话未配置')
				return
			}
			makePhoneCall(phone)
		},

		goPage(url) {
			uni.navigateTo({ url })
		}
	}
}
</script>

<style scoped>
.mine-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #0A3490 0%, #1256D8 100%);
}

/* 顶部蓝色背景 */
.header-bg {
	background: linear-gradient(180deg, #0A2870 0%, #0A3490 50%, rgba(10, 40, 140, 0.4) 100%);
	padding-bottom: 120rpx;
	position: relative;
}

/* 标题栏 */
.header-title {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 32rpx 30rpx;
}

.title-text {
	font-size: 36rpx;
	font-weight: bold;
	color: #FFFFFF;
	text-shadow: 0 0 12rpx rgba(46, 199, 255, 0.3);
}

/* 用户信息按钮（未登录） */
.user-section-btn {
	width: 100%;
	padding: 0;
	margin: 0;
	border: none;
	background: transparent;
	text-align: left;
	line-height: normal;
}

.user-section-btn::after {
	border: none;
}

/* 用户信息区 */
.user-section {
	display: flex;
	align-items: center;
	padding: 0 32rpx 30rpx;
	cursor: pointer;
}

.mascot-box {
	width: 120rpx;
	height: 120rpx;
	background: rgba(255, 255, 255, 0.12);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 24rpx;
	flex-shrink: 0;
	border: 2rpx solid rgba(46, 199, 255, 0.2);
	box-shadow: 0 0 16rpx rgba(46, 199, 255, 0.1);
}

.avatar-img-circle {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
}

.mascot {
	font-size: 60rpx;
}

.user-info {
	flex: 1;
}

.user-name {
	font-size: 32rpx;
	font-weight: 600;
	color: #FFFFFF;
	display: block;
	margin-bottom: 8rpx;
}

.user-desc {
	font-size: 24rpx;
	color: #96B8F0;
}

.admin-badge {
	font-size: 22rpx;
	padding: 6rpx 18rpx;
	border-radius: 20rpx;
	background: rgba(209, 104, 232, 0.25);
	color: #FFFFFF;
	font-weight: 500;
	flex-shrink: 0;
}

/* 内容区域 */
.content-area {
	padding: 0 24rpx;
	margin-top: -80rpx;
	position: relative;
	z-index: 1;
}

/* 卡片 — 与招聘卡片同风格 */
.section-card {
	position: relative;
	background: rgba(10, 40, 140, 0.75);
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
	border: 1rpx solid rgba(46, 199, 255, 0.25);
	box-shadow: 0 0 18rpx rgba(138, 79, 255, 0.18), 0 0 28rpx rgba(46, 199, 255, 0.15);
}

/* 卡片左侧光条（与招聘卡片一致） */
.section-card::before {
	content: '';
	position: absolute;
	left: 0;
	top: 20rpx;
	bottom: 20rpx;
	width: 4rpx;
	background: linear-gradient(180deg, #2EC7FF, #8A4FFF, #2EC7FF);
	border-radius: 0 2rpx 2rpx 0;
	z-index: 1;
}

.card-header {
	padding: 24rpx 28rpx 16rpx;
	border-bottom: 1rpx solid rgba(46, 199, 255, 0.15);
}

.card-title {
	font-size: 28rpx;
	font-weight: 700;
	color: #FFFFFF;
	text-shadow: 0 0 8rpx rgba(255, 255, 255, 0.1);
}

.card-body {
	padding: 0 28rpx;
}

.list-item {
	display: flex;
	align-items: center;
	padding: 28rpx 0;
	border-bottom: 1rpx solid rgba(46, 199, 255, 0.08);
	position: relative;
}

.list-item:last-child {
	border-bottom: none;
}

.item-icon {
	width: 48rpx;
	height: 48rpx;
	background: rgba(46, 199, 255, 0.1);
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
	flex-shrink: 0;
	font-size: 28rpx;
}

.item-text {
	font-size: 28rpx;
	color: #FFFFFF;
	flex: 1;
	font-weight: 500;
}

.item-right {
	display: flex;
	align-items: center;
}

.item-arrow {
	font-size: 32rpx;
	color: #73C0FF;
	font-weight: 300;
}

.badge {
	background: #D168E8;
	color: #FFFFFF;
	font-size: 20rpx;
	min-width: 32rpx;
	height: 32rpx;
	line-height: 32rpx;
	text-align: center;
	border-radius: 16rpx;
	padding: 0 8rpx;
	margin-right: 12rpx;
	box-shadow: 0 0 8rpx rgba(209, 104, 232, 0.3);
}
</style>
