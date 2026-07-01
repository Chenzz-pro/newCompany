<template>
		<view class="apply-page">
			<!-- 意向岗位 -->
			<view class="form-section card">
				<view class="form-title">投递简历</view>
				<view class="intent-job" v-if="jobTitle">
					<text class="intent-label">意向岗位：</text>
					<text class="intent-value">{{ jobTitle }}</text>
				</view>
			</view>

			<!-- 基本信息表单 -->
			<view class="form-section card">
				<view class="form-item">
					<text class="form-label"><text class="required">*</text> 姓名</text>
					<input class="form-input" v-model="form.name" placeholder="请输入您的姓名" maxlength="20" />
				</view>
				<view class="form-item">
					<text class="form-label"><text class="required">*</text> 手机号</text>
					<input class="form-input" v-model="form.phone" placeholder="请输入手机号码" type="number" maxlength="11" />
				</view>
				<view class="form-item">
					<text class="form-label">微信号</text>
					<input class="form-input" v-model="form.wechat" placeholder="请输入微信号（选填）" maxlength="30" />
				</view>
				<view class="form-item">
					<text class="form-label"><text class="required">*</text> 意向岗位</text>
					<picker :range="jobCategories" @change="onJobPick" :value="jobIndex">
						<view class="form-picker">
							<text :class="form.position ? '' : 'placeholder'">{{ form.position || '请选择意向岗位' }}</text>
							<text class="picker-arrow">></text>
						</view>
					</picker>
				</view>
				<view class="form-item">
					<text class="form-label">工作经验</text>
					<picker :range="experienceOptions" @change="onExpPick" :value="expIndex">
						<view class="form-picker">
							<text :class="form.experience ? '' : 'placeholder'">{{ form.experience || '请选择工作经验' }}</text>
							<text class="picker-arrow">></text>
						</view>
					</picker>
				</view>
			</view>

			<!-- 上传生活照 -->
			<view class="form-section card">
				<view class="form-item">
					<text class="form-label"><text class="required">*</text> 上传生活照</text>
					<view class="upload-area">
						<view class="upload-list">
							<view class="upload-item" v-for="(img, idx) in form.images" :key="idx">
								<image :src="img" class="upload-img" mode="aspectFill" @tap="previewImage(idx)"></image>
								<view class="upload-del" @tap="delImage(idx)">×</view>
							</view>
						</view>
						<view class="upload-btn" @tap="chooseImage" v-if="form.images.length < 5">
							<text class="upload-icon">+</text>
							<text class="upload-text">上传</text>
						</view>
					</view>
					<text class="upload-tip">支持上传生活照等，最多5张</text>
				</view>
			</view>

			<!-- 自我介绍 -->
			<view class="form-section card">
				<view class="form-item">
					<text class="form-label">自我介绍</text>
					<textarea class="form-textarea" v-model="form.intro" placeholder="简单介绍一下自己，让HR更了解您..."
						maxlength="500" :auto-height="false"></textarea>
					<text class="textarea-count">{{ form.intro.length }}/500</text>
				</view>
			</view>

			<!-- 提交按钮 -->
			<view class="submit-area">
				<button class="btn-orange submit-btn" @tap="submitResume" :disabled="submitting">
					{{ submitting ? '提交中...' : '立即投递' }}
				</button>
				<text class="submit-tip">提交后，HR会在3个工作日内与您联系</text>
			</view>
		</view>
	</template>

	<script>
	import config from '@/common/config.js'
	import { callCloud, isValidPhone, showToast, showLoading, hideLoading, previewImage as previewImg } from '@/common/util.js'

	export default {
		data() {
			return {
				jobId: '',
				jobTitle: '',
				jobCategories: config.jobCategories.filter(c => c !== '全部'),
				experienceOptions: ['在校生', '应届生', '1-3年', '3-5年', '5-10年', '10年以上'],
				jobIndex: 0,
				expIndex: 0,
				submitting: false,
				form: {
					name: '',
					phone: '',
					wechat: '',
					position: '',
					experience: '',
					images: [],
					intro: ''
				}
			}
		},
		onLoad(options) {
			if (options.id) {
				this.jobId = options.id
				this.loadJobTitle()
			}
		},
		methods: {
			async loadJobTitle() {
				try {
					const res = await callCloud('getJobDetail', { id: this.jobId })
					if (res && res.data) {
						this.jobTitle = res.data.title
						this.form.position = res.data.title
					}
				} catch (e) {
					// ignore
				}
			},

			onJobPick(e) {
				this.jobIndex = e.detail.value
				this.form.position = this.jobCategories[this.jobIndex]
			},

			onExpPick(e) {
				this.expIndex = e.detail.value
				this.form.experience = this.experienceOptions[this.expIndex]
			},

			chooseImage() {
				uni.chooseImage({
					count: 5 - this.form.images.length,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: async (res) => {
						showLoading('上传中...')
						try {
							for (const path of res.tempFilePaths) {
								const url = await this.uploadToCloud(path)
								this.form.images.push(url)
							}
						} catch (e) {
							showToast('上传失败')
						} finally {
							hideLoading()
						}
					}
				})
			},

			async uploadToCloud(filePath) {
				const ext = filePath.split('.').pop()
				const cloudPath = `resume/${Date.now()}_${Math.random().toString(36).substr(2, 8)}.${ext}`
				const res = await wx.cloud.uploadFile({ cloudPath, filePath })
				return res.fileID
			},

			delImage(idx) {
				this.form.images.splice(idx, 1)
			},

			previewImage(idx) {
				previewImg(this.form.images, idx)
			},

			validateForm() {
				if (!this.form.name.trim()) {
					showToast('请输入姓名')
					return false
				}
				if (!this.form.phone.trim()) {
					showToast('请输入手机号')
					return false
				}
				if (!isValidPhone(this.form.phone)) {
					showToast('手机号格式不正确')
					return false
				}
				if (!this.form.position) {
					showToast('请选择意向岗位')
					return false
				}
				if (!this.form.images.length) {
					showToast('请上传生活照')
					return false
				}
				return true
			},

			async submitResume() {
				if (!this.validateForm()) return
				if (this.submitting) return

				this.submitting = true
				console.log('========== 开始投递简历 ==========')
				console.log('jobId:', this.jobId)
				console.log('form:', JSON.stringify(this.form))
				try {
					// 使用新的 addDeliver 云函数，写入 resume_deliver 集合
					const res = await callCloud('addDeliver', {
						jobId: this.jobId,
						resumeInfo: {
							realName: this.form.name.trim(),
							phone: this.form.phone.trim(),
							wechat: this.form.wechat.trim(),
							workExp: this.form.experience,
							selfIntro: this.form.intro.trim(),
							resumeFile: this.form.images
						}
					})

					console.log('addDeliver 返回:', JSON.stringify(res))

					if (res && res.success) {
						uni.showModal({
							title: '投递成功',
							content: '您的简历已成功提交，HR会在3个工作日内联系您！',
							showCancel: false,
							success: () => {
								uni.navigateBack()
							}
						})
					} else {
						showToast(res.message || '提交失败，请重试')
					}
				} catch (e) {
					console.error('投递简历失败:', e)
					showToast('网络异常，请重试')
				} finally {
					this.submitting = false
				}
			}
		}
	}
	</script>

	<style lang="scss" scoped>
	/* ============================================
	   投递简历 — 轻赛博霓虹科技风
	   ============================================ */
	.apply-page {
		min-height: 100vh;
		background: linear-gradient(180deg, #0A0E27 0%, #0F1535 50%, #121838 100%);
		padding: 24rpx;
		padding-bottom: 60rpx;
	}

	.card {
		position: relative;
		background: rgba(18,24,56,0.85);
		backdrop-filter: blur(10rpx);
		-webkit-backdrop-filter: blur(10rpx);
		border-radius: 16rpx;
		border: 1rpx solid rgba(123,47,253,0.2);
		box-shadow: 0 8rpx 32rpx rgba(0,0,0,0.3), 0 0 20rpx rgba(123,47,253,0.08);
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

	.form-section {
		padding: 30rpx;
		margin-bottom: 24rpx;
	}

	.form-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #FFFFFF;
		margin-bottom: 24rpx;
		position: relative;
		z-index: 1;
		text-shadow: 0 0 12rpx rgba(0,229,255,0.3);
	}

	.intent-job {
		display: flex;
		align-items: center;
		background: rgba(0,229,255,0.08);
		border: 1rpx solid rgba(0,229,255,0.2);
		padding: 20rpx 24rpx;
		border-radius: 8rpx;
		position: relative;
		z-index: 1;
	}

	.intent-label {
		font-size: 28rpx;
		color: #94A3B8;
	}

	.intent-value {
		font-size: 28rpx;
		color: #00E5FF;
		font-weight: bold;
		text-shadow: 0 0 8rpx rgba(0,229,255,0.3);
	}

	/* 表单 */
	.form-item {
		padding: 24rpx 0;
		border-bottom: 1rpx solid rgba(123,47,253,0.12);
		position: relative;
		z-index: 1;
	}

	.form-item:last-child {
		border-bottom: none;
	}

	.form-label {
		font-size: 28rpx;
		color: #FFFFFF;
		margin-bottom: 16rpx;
		display: block;
	}

	.required {
		color: #FF2EC4;
		margin-right: 4rpx;
		text-shadow: 0 0 6rpx rgba(255,46,196,0.3);
	}

	.form-input {
		font-size: 28rpx;
		color: #E2E8F0;
		padding: 16rpx 0;
	}

	.form-picker {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16rpx 0;
		font-size: 28rpx;
		color: #E2E8F0;
	}

	.placeholder {
		color: #94A3B8;
	}

	.picker-arrow {
		color: #00E5FF;
	}

	/* 上传 */
	.upload-area {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
		margin-top: 16rpx;
	}

	.upload-list {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
	}

	.upload-item {
		position: relative;
		width: 160rpx;
		height: 160rpx;
	}

	.upload-img {
		width: 160rpx;
		height: 160rpx;
		border-radius: 8rpx;
		border: 1rpx solid rgba(123,47,253,0.2);
	}

	.upload-del {
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		width: 40rpx;
		height: 40rpx;
		background: rgba(0,0,0,0.7);
		color: #FF2EC4;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		border: 1rpx solid rgba(255,46,196,0.3);
	}

	.upload-btn {
		width: 160rpx;
		height: 160rpx;
		border: 2rpx dashed rgba(123,47,253,0.25);
		border-radius: 8rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(123,47,253,0.05);
	}

	.upload-icon {
		font-size: 48rpx;
		color: #7B2FFD;
	}

	.upload-text {
		font-size: 22rpx;
		color: #94A3B8;
		margin-top: 8rpx;
	}

	.upload-tip {
		font-size: 22rpx;
		color: #94A3B8;
		margin-top: 12rpx;
		display: block;
	}

	/* 自我介绍 */
	.form-textarea {
		width: 100%;
		height: 200rpx;
		font-size: 28rpx;
		padding: 16rpx;
		background: rgba(10,14,39,0.6);
		border-radius: 8rpx;
		margin-top: 12rpx;
		box-sizing: border-box;
		color: #E2E8F0;
		border: 1rpx solid rgba(123,47,253,0.15);
	}

	.textarea-count {
		font-size: 22rpx;
		color: #94A3B8;
		text-align: right;
		display: block;
		margin-top: 8rpx;
	}

	/* 提交 */
	.submit-area {
		margin-top: 48rpx;
		padding: 0 24rpx;
	}

	.submit-btn {
		width: 100%;
		background: linear-gradient(135deg, #FF2EC4, #7B2FFD) !important;
		color: #FFFFFF !important;
		border: none !important;
		border-radius: 10rpx !important;
		padding: 28rpx 0 !important;
		font-size: 34rpx !important;
		font-weight: bold !important;
		box-shadow: 0 0 32rpx rgba(123,47,253,0.3) !important;
	}

	.submit-btn[disabled] {
		opacity: 0.6;
	}

	.submit-btn:active {
		transform: scale(0.97);
	}

	.submit-tip {
		font-size: 24rpx;
		color: #94A3B8;
		text-align: center;
		display: block;
		margin-top: 20rpx;
	}
	</style>
