<template>
	<view class="profile-page">
		<!-- 顶部用户信息区 -->
		<view class="user-header">
			<view class="avatar-area">
				<image v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" class="avatar-large" />
				<view v-else class="avatar-placeholder-large">
					<text class="avatar-emoji">👤</text>
				</view>
			</view>
			<text class="user-name">{{ userInfo.nickName || '未设置昵称' }}</text>
			<text class="user-phone" v-if="userInfo.phone">{{ userInfo.phone }}</text>
		</view>

		<!-- 设置列表 -->
		<view class="settings-card">
			<!-- 头像 -->
			<view class="settings-item" @tap="changeAvatar">
				<text class="settings-label">头像</text>
				<view class="settings-right">
					<image v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" class="avatar-small" />
					<view v-else class="avatar-small-placeholder">
						<text>👤</text>
					</view>
					<text class="settings-arrow">›</text>
				</view>
			</view>

			<!-- 昵称 -->
			<view class="settings-item" @tap="editNickName">
				<text class="settings-label">昵称</text>
				<view class="settings-right">
					<text class="settings-value">{{ userInfo.nickName || '未设置' }}</text>
					<text class="settings-arrow">›</text>
				</view>
			</view>

			<!-- 手机号 -->
			<view class="settings-item last" @tap="bindPhone">
				<text class="settings-label">绑定手机</text>
				<view class="settings-right">
					<text class="settings-value">{{ userInfo.phone || '未绑定' }}</text>
					<text class="settings-arrow">›</text>
				</view>
			</view>
		</view>

		<!-- 修改昵称弹窗 -->
		<view class="modal-mask" v-if="showNickModal" @tap="showNickModal = false">
			<view class="modal-content" @tap.stop>
				<view class="modal-title">修改昵称</view>
				<input class="modal-input" v-model="newNickName" placeholder="请输入昵称" maxlength="20" />
				<view class="modal-btns">
					<button class="modal-btn-cancel" @tap="showNickModal = false">取消</button>
					<button class="modal-btn-confirm" @tap="saveNickName">保存</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { callCloud, showToast, showLoading, hideLoading } from '@/common/util.js'

export default {
	data() {
		return {
			userInfo: {
				nickName: '',
				avatarUrl: '',
				phone: ''
			},
			showNickModal: false,
			newNickName: ''
		}
	},
	onShow() {
		this.loadUserInfo()
	},
	methods: {
		async loadUserInfo() {
			try {
				const res = await callCloud('getUserInfo')
				if (res && res.success && res.data) {
					this.userInfo = {
						nickName: res.data.nickName || '',
						avatarUrl: res.data.avatarUrl || '',
						phone: res.data.phone || ''
					}
				}
			} catch (e) {
				console.error('获取用户信息失败:', e)
			}
		},

		changeAvatar() {
			wx.chooseMedia({
				count: 1,
				mediaType: ['image'],
				sizeType: ['compressed'],
				success: async (res) => {
					const tempPath = res.tempFiles[0].tempFilePath
					showLoading('上传中...')
					try {
						const ext = tempPath.split('.').pop()
						const cloudPath = `avatar/${Date.now()}.${ext}`
						const uploadRes = await wx.cloud.uploadFile({ cloudPath, filePath: tempPath })
						const fileID = uploadRes.fileID
						await callCloud('updateUserInfo', { updateData: { avatarUrl: fileID } })
						this.userInfo.avatarUrl = fileID
						showToast('头像更新成功')
					} catch (e) {
						showToast('上传失败')
					} finally {
						hideLoading()
					}
				}
			})
		},

		editNickName() {
			this.newNickName = this.userInfo.nickName || ''
			this.showNickModal = true
		},

		async saveNickName() {
			if (!this.newNickName.trim()) {
				showToast('请输入昵称')
				return
			}
			showLoading('保存中...')
			try {
				const res = await callCloud('updateUserInfo', {
					updateData: { nickName: this.newNickName.trim() }
				})
				if (res && res.success) {
					this.userInfo.nickName = this.newNickName.trim()
					this.showNickModal = false
					showToast('保存成功')
				}
			} catch (e) {
				showToast('保存失败')
			} finally {
				hideLoading()
			}
		},

		bindPhone() {
			if (this.userInfo.phone) {
				showToast('已绑定手机号')
				return
			}
			wx.getPhoneNumber({
				success: async (res) => {
					if (res.cloudID) {
						showLoading('绑定中...')
						try {
							const phoneRes = await callCloud('updateUserInfo', {
								updateData: { phone: res.cloudID },
								getPhone: true
							})
							if (phoneRes && phoneRes.success) {
								showToast('绑定成功')
								this.loadUserInfo()
							}
						} catch (e) {
							showToast('绑定失败')
						} finally {
							hideLoading()
						}
					}
				},
				fail: () => {
					showToast('取消授权')
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.profile-page {
	min-height: 100vh;
	background: #1256D8;
}

/* 顶部用户信息区 */
.user-header {
	background: linear-gradient(180deg, #73C0FF 0%, #2EC7FF 100%);
	padding: 80rpx 0 100rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.avatar-area {
	margin-bottom: 24rpx;
}

.avatar-large {
	width: 160rpx;
	height: 160rpx;
	border-radius: 50%;
	border: 6rpx solid rgba(255, 255, 255, 0.5);
}

.avatar-placeholder-large {
	width: 160rpx;
	height: 160rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.2);
	display: flex;
	align-items: center;
	justify-content: center;
	border: 6rpx solid rgba(255, 255, 255, 0.5);
}

.avatar-emoji {
	font-size: 80rpx;
}

.user-name {
	font-size: 36rpx;
	font-weight: 600;
	color: rgba(10, 40, 140, 0.75);
	margin-bottom: 12rpx;
}

.user-phone {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.8);
}

/* 设置卡片 */
.settings-card {
	background: rgba(10, 40, 140, 0.75);
	margin: -50rpx 24rpx 0;
	border-radius: 16rpx;
	position: relative;
	z-index: 1;
	box-shadow: 0 4rpx 16rpx rgba(46, 199, 255, 0.15);
	overflow: hidden;
}

.settings-item {
	display: flex;
	align-items: center;
	padding: 32rpx 28rpx;
	border-bottom: 1rpx solid #F2F3F5;
}

.settings-item.last {
	border-bottom: none;
}

.settings-label {
	font-size: 28rpx;
	color: #FFFFFF;
	width: 160rpx;
	flex-shrink: 0;
}

.settings-right {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.settings-value {
	font-size: 26rpx;
	color: #96B8F0;
	max-width: 300rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	margin-right: 8rpx;
}

.settings-arrow {
	font-size: 32rpx;
	color: #C9CDD4;
}

.avatar-small {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	margin-right: 8rpx;
}

.avatar-small-placeholder {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background: rgba(46, 199, 255, 0.15);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 8rpx;
	font-size: 32rpx;
}

/* 弹窗 */
.modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.modal-content {
	width: 80%;
	background: rgba(10, 40, 140, 0.75);
	border-radius: 16rpx;
	padding: 40rpx 30rpx;
}

.modal-title {
	font-size: 34rpx;
	font-weight: bold;
	color: #FFFFFF;
	text-align: center;
	margin-bottom: 30rpx;
}

.modal-input {
	width: 100%;
	height: 80rpx;
	background: #1256D8;
	border-radius: 8rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
	box-sizing: border-box;
}

.modal-btns {
	display: flex;
	gap: 20rpx;
	margin-top: 30rpx;
}

.modal-btn-cancel,
.modal-btn-confirm {
	flex: 1;
	height: 80rpx;
	border-radius: 8rpx;
	font-size: 28rpx;
	border: none;
}

.modal-btn-cancel {
	background: #1256D8;
	color: #C6D8FF;
}

.modal-btn-confirm {
	background: linear-gradient(135deg, #73C0FF, #2EC7FF);
	color: rgba(10, 40, 140, 0.75);
}
</style>
