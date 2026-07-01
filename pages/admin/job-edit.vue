<template>
		<view class="admin-page">
			<!-- 顶部导航 -->
			<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
				<view class="nav-content">
					<view class="nav-back" @tap="goBack">
						<text>←</text>
					</view>
					<text class="nav-title">{{ isEdit ? '编辑岗位' : '发布岗位' }}</text>
					<view class="nav-placeholder"></view>
				</view>
			</view>
			<view :style="{ height: (statusBarHeight + 44) + 'px' }"></view>

			<!-- 表单内容 -->
			<view class="form-container">
				<view class="form-section card">
					<view class="section-title">基本信息</view>

					<!-- 岗位名称 -->
					<view class="form-item">
						<view class="form-label">
							<text class="required">*</text>
							<text>岗位名称</text>
						</view>
						<input
							class="form-input"
							v-model="formData.title"
							placeholder="请输入岗位名称，如：新媒体运营"
							maxlength="50"
						/>
					</view>

					<!-- 岗位分类 -->
					<view class="form-item">
						<view class="form-label">
							<text class="required">*</text>
							<text>岗位分类</text>
						</view>
						<picker mode="selector" :range="categories" @change="onCategoryChange">
							<view class="form-picker">
								<text>{{ formData.category || '请选择分类' }}</text>
								<text class="arrow">›</text>
							</view>
						</picker>
					</view>

					<!-- 工作地点 -->
					<view class="form-item">
						<view class="form-label">
							<text class="required">*</text>
							<text>工作地点</text>
						</view>
						<picker mode="selector" :range="locations" @change="onLocationChange">
							<view class="form-picker">
								<text>{{ formData.location || '请选择地点' }}</text>
								<text class="arrow">›</text>
							</view>
						</picker>
					</view>

					<!-- 薪资范围 -->
					<view class="form-item">
						<view class="form-label">
							<text class="required">*</text>
							<text>薪资范围</text>
						</view>
						<input
							class="form-input"
							v-model="formData.salary"
							placeholder="如：5000-8000元/月"
						/>
					</view>

					<!-- 招聘人数 -->
					<view class="form-item">
						<view class="form-label">招聘人数</view>
						<input
							class="form-input"
							type="number"
							v-model="formData.count"
							placeholder="1"
						/>
					</view>

					<!-- 是否急招 -->
					<view class="form-item switch-item">
						<view class="form-label">是否急招</view>
						<switch
							:checked="formData.isUrgent"
							@change="onUrgentChange"
							color="#00E5FF"
						/>
					</view>
				</view>

				<!-- 任职要求 -->
				<view class="form-section card">
					<view class="section-title">任职要求</view>

					<view class="form-item">
						<view class="form-label">工作经验</view>
						<picker mode="selector" :range="experiences" @change="onExperienceChange">
							<view class="form-picker">
								<text>{{ formData.experience || '不限' }}</text>
								<text class="arrow">›</text>
							</view>
						</picker>
					</view>

					<view class="form-item">
						<view class="form-label">学历要求</view>
						<picker mode="selector" :range="educations" @change="onEducationChange">
							<view class="form-picker">
								<text>{{ formData.education || '不限' }}</text>
								<text class="arrow">›</text>
							</view>
						</picker>
					</view>

					<view class="form-item">
						<view class="form-label">岗位要求</view>
						<textarea
							class="form-textarea"
							v-model="formData.description"
							placeholder="请输入岗位职责和要求..."
							maxlength="500"
						/>
					</view>
				</view>

				<!-- 福利待遇 -->
				<view class="form-section card">
					<view class="section-title">福利待遇</view>
					<view class="form-item">
						<textarea
							class="form-textarea"
							v-model="formData.benefitsText"
							placeholder="请输入福利待遇，每行一项..."
							maxlength="300"
						/>
						<view class="form-hint">提示：每行输入一项福利，如：五险一金、带薪年假等</view>
					</view>
				</view>

				<!-- 底部间距 -->
				<view style="height: 180rpx;"></view>
			</view>

			<!-- 底部操作栏 -->
			<view class="bottom-bar">
				<button class="btn-cancel" @tap="goBack">取消</button>
				<button class="btn-submit" @tap="submitJob">{{ isEdit ? '保存' : '发布' }}</button>
			</view>
		</view>
	</template>

	<script>
	import { callCloud, showToast, showLoading, hideLoading } from '@/common/util.js'
	import config from '@/common/config.js'

	export default {
		data() {
			return {
				statusBarHeight: 20,
				isEdit: false,
				jobId: '',
				formData: {
					title: '',
					category: '',
					location: '',
					salary: '',
					count: 1,
					isUrgent: false,
					experience: '不限',
					education: '不限',
					description: '',
					benefitsText: ''
				},
				categories: config.jobCategories.filter(c => c !== '全部'),
				locations: config.workLocations.filter(l => l !== '全部'),
				experiences: ['不限', '应届生', '1-3年', '3-5年', '5年以上'],
				educations: ['不限', '高中', '大专', '本科', '硕士', '博士']
			}
		},
		onLoad(options) {
			const sysInfo = uni.getSystemInfoSync()
			this.statusBarHeight = sysInfo.statusBarHeight || 20

			if (options.id) {
				// 编辑模式
				this.isEdit = true
				this.jobId = options.id
				this.loadJobDetail(options.id)
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},

			async loadJobDetail(id) {
				showLoading('加载中...')
				try {
					const res = await callCloud('getJobDetail', { id })
					if (res && res.data) {
						const job = res.data
						this.formData = {
							title: job.title || '',
							category: job.category || '',
							location: job.location || '',
							salary: job.salary || '',
							count: job.count || 1,
							isUrgent: job.isUrgent || false,
							experience: job.experience || '不限',
							education: job.education || '不限',
							description: job.description || '',
							benefitsText: job.benefits ? job.benefits.join('\n') : ''
						}
					}
				} catch (e) {
					console.error('加载岗位详情失败:', e)
					showToast('加载失败')
				} finally {
					hideLoading()
				}
			},

			onCategoryChange(e) {
				this.formData.category = this.categories[e.detail.value]
			},

			onLocationChange(e) {
				this.formData.location = this.locations[e.detail.value]
			},

			onExperienceChange(e) {
				this.formData.experience = this.experiences[e.detail.value]
			},

			onEducationChange(e) {
				this.formData.education = this.educations[e.detail.value]
			},

			onUrgentChange(e) {
				this.formData.isUrgent = e.detail.value
			},

			async submitJob() {
				console.log('点击发布按钮')
				console.log('formData:', JSON.stringify(this.formData))
				// 验证必填项
				if (!this.formData.title) {
					showToast('请输入岗位名称')
					return
				}
				if (!this.formData.category) {
					showToast('请选择岗位分类')
					return
				}
				if (!this.formData.location) {
					showToast('请选择工作地点')
					return
				}
				if (!this.formData.salary) {
					showToast('请输入薪资范围')
					return
				}

				// 处理福利待遇
				const benefits = this.formData.benefitsText
					.split('\n')
					.map(item => item.trim())
					.filter(item => item.length > 0)

				// 构建提交数据
				const jobData = {
					...this.formData,
					benefits
				}

				console.log('提交数据:', JSON.stringify(jobData))
				showLoading(this.isEdit ? '保存中...' : '发布中...')
				try {
					const res = await callCloud('addJob', {
						jobData,
						jobId: this.isEdit ? this.jobId : null
					})

					console.log('addJob 返回:', JSON.stringify(res))

					if (res && res.success) {
						showToast(this.isEdit ? '保存成功' : '发布成功')
						setTimeout(() => {
							uni.navigateBack()
						}, 1500)
					} else {
						showToast(res.message || '操作失败')
					}
				} catch (e) {
					console.error('提交失败:', e)
					showToast('提交失败')
				} finally {
					hideLoading()
				}
			}
		}
	}
	</script>

	<style lang="scss" scoped>
	.admin-page {
		min-height: 100vh;
		background: linear-gradient(180deg, #0A0E27 0%, #121838 100%);
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
		box-shadow: 0 2rpx 24rpx rgba(0,0,0,0.4);
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

	.nav-placeholder { width: 60rpx; }

	.form-container { padding: 24rpx; }

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

	.form-section { margin-bottom: 24rpx; }

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #00E5FF;
		padding: 24rpx;
		border-bottom: 1rpx solid rgba(123,47,253,0.2);
		position: relative;
		z-index: 1;
		text-shadow: 0 0 8rpx rgba(0,229,255,0.2);
	}

	.form-item {
		padding: 24rpx;
		border-bottom: 1rpx solid rgba(123,47,253,0.12);
		position: relative;
		z-index: 1;
	}
	.form-item:last-child { border-bottom: none; }

	.form-label { font-size: 28rpx; color: #E2E8F0; margin-bottom: 16rpx; }
	.required { color: #FF2EC4; margin-right: 4rpx; }

	.form-input {
		width: 100%;
		height: 72rpx;
		background: rgba(10,14,39,0.6);
		border-radius: 8rpx;
		padding: 0 24rpx;
		font-size: 28rpx;
		color: #E2E8F0;
		border: 1rpx solid rgba(123,47,253,0.15);
	}

	.form-picker {
		width: 100%;
		height: 72rpx;
		background: rgba(10,14,39,0.6);
		border-radius: 8rpx;
		padding: 0 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #E2E8F0;
		border: 1rpx solid rgba(123,47,253,0.15);
	}

	.arrow { font-size: 36rpx; color: #00E5FF; }

	.switch-item { display: flex; align-items: center; justify-content: space-between; }

	.form-textarea {
		width: 100%;
		min-height: 200rpx;
		background: rgba(10,14,39,0.6);
		border-radius: 8rpx;
		padding: 24rpx;
		font-size: 28rpx;
		color: #E2E8F0;
		line-height: 1.6;
		border: 1rpx solid rgba(123,47,253,0.15);
	}

	.form-hint { font-size: 24rpx; color: #94A3B8; margin-top: 12rpx; }

	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(10,14,39,0.95);
		backdrop-filter: blur(20rpx);
		-webkit-backdrop-filter: blur(20rpx);
		border-top: 1rpx solid rgba(123,47,253,0.3);
		box-shadow: 0 -2rpx 24rpx rgba(0,0,0,0.4);
		padding: 24rpx;
		padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
		display: flex;
		gap: 24rpx;
		z-index: 100;
	}

	.btn-cancel, .btn-submit {
		flex: 1;
		height: 88rpx;
		border-radius: 8rpx;
		font-size: 32rpx;
		font-weight: bold;
		border: none;
	}
	.btn-cancel { background: rgba(18,24,56,0.8); color: #94A3B8; border: 1rpx solid rgba(123,47,253,0.2); }
	.btn-submit { background: linear-gradient(135deg, #FF2EC4, #7B2FFD); color: #FFFFFF; box-shadow: 0 0 24rpx rgba(123,47,253,0.3); }
	</style>
