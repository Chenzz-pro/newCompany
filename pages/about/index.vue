<template>
	<view class="about-page">
		<!-- 企业介绍头部 -->
		<view class="about-header card">
			<image class="about-logo" src="/static/images/logo.png" mode="aspectFit"></image>
			<text class="about-name">{{ companyInfo.name || '企业名称' }}</text>
			<text class="about-slogan">{{ companyInfo.slogan || '企业标语' }}</text>
		</view>

		<!-- 企业完整介绍 -->
		<view class="about-intro card">
			<view class="section-title">企业简介</view>
			<view class="intro-content">
				<rich-text :nodes="companyInfo.fullIntro || '企业详细介绍加载中...'"></rich-text>
			</view>
		</view>

		<!-- 发展历程 -->
		<view class="timeline-section card" v-if="timeline.length">
			<view class="section-title">发展历程</view>
			<view class="timeline">
				<view class="timeline-item" v-for="(item, idx) in timeline" :key="idx">
					<view class="timeline-dot"></view>
					<view class="timeline-line" v-if="idx < timeline.length - 1"></view>
					<view class="timeline-content">
						<text class="timeline-year">{{ item.year }}</text>
						<text class="timeline-desc">{{ item.event }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 厂房/环境图集 -->
		<view class="gallery-section card" v-if="gallery.length">
			<view class="section-title">企业环境</view>
			<view class="gallery-grid">
				<image v-for="(img, idx) in gallery" :key="idx" :src="img" class="gallery-img"
					mode="aspectFill" @tap="previewGallery(idx)"></image>
			</view>
		</view>

		<!-- 联系我们 -->
		<view class="contact-section card">
			<view class="section-title">联系我们</view>
			<view class="contact-list">
				<view class="contact-item" @tap="callPhone">
					<view class="contact-left">
						<text class="contact-icon">📞</text>
						<view>
							<text class="contact-label">客服电话</text>
							<text class="contact-value">{{ companyPhone }}</text>
						</view>
					</view>
					<text class="contact-action">拨打</text>
				</view>
				<view class="contact-item" @tap="copyWechat">
					<view class="contact-left">
						<text class="contact-icon">💬</text>
						<view>
							<text class="contact-label">客服微信</text>
							<text class="contact-value">{{ companyWechat }}</text>
						</view>
					</view>
					<text class="contact-action">复制</text>
				</view>
				<view class="contact-item" @tap="sendEmail">
					<view class="contact-left">
						<text class="contact-icon">📧</text>
						<view>
							<text class="contact-label">电子邮箱</text>
							<text class="contact-value">{{ companyEmail }}</text>
						</view>
					</view>
					<text class="contact-action">发送</text>
				</view>
				<view class="contact-item" @tap="openMap">
					<view class="contact-left">
						<text class="contact-icon">📍</text>
						<view>
							<text class="contact-label">公司地址</text>
							<text class="contact-value">{{ companyAddress }}</text>
						</view>
					</view>
					<text class="contact-action">导航</text>
				</view>
			</view>
		</view>

		<!-- 地图 -->
		<view class="map-section card">
			<map class="company-map" :latitude="companyLat" :longitude="companyLng"
				:markers="markers" :scale="16" show-location @tap="openMap"></map>
		</view>

		<!-- 公众号二维码 -->
		<view class="qrcode-section card" v-if="companyInfo.qrcode">
			<view class="section-title">关注公众号</view>
			<image :src="companyInfo.qrcode" class="qrcode-img" mode="aspectFit"></image>
			<text class="qrcode-tip">长按扫码关注企业公众号</text>
		</view>

		<!-- 留言反馈 -->
		<view class="feedback-section card">
			<view class="section-title">留言反馈</view>
			<view class="feedback-form">
				<input class="feedback-input" v-model="feedback.name" placeholder="您的姓名" maxlength="20" />
				<input class="feedback-input" v-model="feedback.phone" placeholder="联系电话" type="number" maxlength="11" />
				<textarea class="feedback-textarea" v-model="feedback.content" placeholder="请输入您的留言..."
					maxlength="300"></textarea>
				<button class="btn-primary" @tap="submitFeedback" :disabled="feedbackSubmitting">
					{{ feedbackSubmitting ? '提交中...' : '提交留言' }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
import config from '@/common/config.js'
import { callCloud, makePhoneCall, copyToClipboard, showToast, showLoading, hideLoading, isValidPhone, previewImage } from '@/common/util.js'

export default {
	data() {
		return {
			companyInfo: {},
			timeline: [],
			gallery: [],
			companyPhone: config.company.phone,
			companyAddress: config.company.address,
			companyWechat: config.company.wechat,
			companyEmail: config.company.email,
			companyLat: config.company.latitude,
			companyLng: config.company.longitude,
			markers: [],
			feedback: { name: '', phone: '', content: '' },
			feedbackSubmitting: false
		}
	},
	onLoad() {
		this.loadCompanyInfo()
	},
	methods: {
		async loadCompanyInfo() {
			showLoading('加载中...')
			try {
				const res = await callCloud('getCompanyInfo')
				if (res && res.data) {
					const d = res.data
					this.companyInfo = d
					if (d.phone) this.companyPhone = d.phone
					if (d.address) this.companyAddress = d.address
					if (d.wechat) this.companyWechat = d.wechat
					if (d.email) this.companyEmail = d.email
					if (d.latitude) this.companyLat = d.latitude
					if (d.longitude) this.companyLng = d.longitude
					if (d.timeline) this.timeline = d.timeline
					if (d.gallery) this.gallery = d.gallery
					this.markers = [{
						id: 1,
						latitude: this.companyLat,
						longitude: this.companyLng,
						title: this.companyInfo.name || config.company.name,
						width: 30,
						height: 30
					}]
				}
			} catch (e) {
				console.error('加载企业信息失败:', e)
			} finally {
				hideLoading()
			}
		},

		callPhone() {
			makePhoneCall(this.companyPhone)
		},

		copyWechat() {
			copyToClipboard(this.companyWechat)
		},

		sendEmail() {
			// #ifdef MP-WEIXIN
			showToast('请发送邮件至: ' + this.companyEmail)
			copyToClipboard(this.companyEmail)
			// #endif
		},

		openMap() {
			uni.openLocation({
				latitude: this.companyLat,
				longitude: this.companyLng,
				name: this.companyInfo.name || config.company.name,
				address: this.companyAddress
			})
		},

		previewGallery(idx) {
			previewImage(this.gallery, idx)
		},

		async submitFeedback() {
			if (!this.feedback.name.trim()) {
				showToast('请输入姓名')
				return
			}
			if (!this.feedback.phone.trim() || !isValidPhone(this.feedback.phone)) {
				showToast('请输入正确的手机号')
				return
			}
			if (!this.feedback.content.trim()) {
				showToast('请输入留言内容')
				return
			}

			this.feedbackSubmitting = true
			try {
				await callCloud('submitResume', {
					type: 'feedback',
					data: {
						name: this.feedback.name.trim(),
						phone: this.feedback.phone.trim(),
						content: this.feedback.content.trim(),
						createTime: new Date()
					}
				})
				showToast('留言成功')
				this.feedback = { name: '', phone: '', content: '' }
			} catch (e) {
				showToast('提交失败')
			} finally {
				this.feedbackSubmitting = false
			}
		}
	}
}
</script>

<style scoped>
/* ============================================
   关于我们 — 深色赛博科技风（参照首页发展历程）
   ============================================ */

/* 页面基底 */
.about-page {
  min-height: 100vh;
  background: #0A3490;
  background: linear-gradient(180deg, #0A3490 0%, #1256D8 100%);
  padding: 24rpx;
  padding-bottom: 60rpx;
}

/* ===== 企业头部 ===== */
.about-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 30rpx;
  background: rgba(10, 40, 140, 0.75);
  border-radius: 14rpx;
  border: 1rpx solid rgba(46, 199, 255, 0.3);
  box-shadow: 0 0 12rpx rgba(46, 199, 255, 0.25), 0 0 16rpx rgba(138, 79, 255, 0.2);
  margin-bottom: 24rpx;
}

.about-logo {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 24rpx;
}

.about-name {
  font-size: 40rpx;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 12rpx;
}

.about-slogan {
  font-size: 26rpx;
  color: #96B8F0;
}

/* ===== 企业简介 ===== */
.about-intro {
  padding: 30rpx;
  background: rgba(10, 40, 140, 0.75);
  border-radius: 14rpx;
  border: 1rpx solid rgba(46, 199, 255, 0.3);
  box-shadow: 0 0 12rpx rgba(46, 199, 255, 0.25), 0 0 16rpx rgba(138, 79, 255, 0.2);
  margin-bottom: 24rpx;
}

.intro-content {
  font-size: 28rpx;
  color: #C6D8FF;
  line-height: 2;
}

/* ===== 发展历程 ===== */
.timeline-section {
  padding: 30rpx;
  background: rgba(10, 40, 140, 0.75);
  border-radius: 14rpx;
  border: 1rpx solid rgba(46, 199, 255, 0.3);
  box-shadow: 0 0 12rpx rgba(46, 199, 255, 0.25), 0 0 16rpx rgba(138, 79, 255, 0.2);
  margin-bottom: 24rpx;
}

.timeline {
  padding-left: 20rpx;
}

.timeline-item {
  position: relative;
  padding-left: 40rpx;
  padding-bottom: 40rpx;
}

.timeline-dot {
  position: absolute;
  left: 0;
  top: 8rpx;
  width: 16rpx;
  height: 16rpx;
  background: #73C0FF;
  border-radius: 50%;
  box-shadow: 0 0 10rpx rgba(106, 173, 255, 0.5);
  animation: glowPulse 2s infinite;
}

.timeline-line {
  position: absolute;
  left: 7rpx;
  top: 28rpx;
  width: 2rpx;
  height: calc(100% - 28rpx);
  background: rgba(46, 199, 255, 0.25);
}

.timeline-content {
  padding-left: 12rpx;
}

.timeline-year {
  font-size: 30rpx;
  font-weight: 700;
  color: #73C0FF;
  display: block;
  margin-bottom: 8rpx;
}

.timeline-desc {
  font-size: 26rpx;
  color: #C6D8FF;
  line-height: 1.6;
}

/* ===== 企业环境 ===== */
.gallery-section {
  padding: 30rpx;
  background: rgba(10, 40, 140, 0.75);
  border-radius: 14rpx;
  border: 1rpx solid rgba(46, 199, 255, 0.3);
  box-shadow: 0 0 12rpx rgba(46, 199, 255, 0.25), 0 0 16rpx rgba(138, 79, 255, 0.2);
  margin-bottom: 24rpx;
}

.gallery-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.gallery-img {
  width: calc(33.33% - 8rpx);
  height: 200rpx;
  border-radius: 8px;
}

/* ===== 联系我们 ===== */
.contact-section {
  padding: 30rpx;
  background: rgba(10, 40, 140, 0.75);
  border-radius: 14rpx;
  border: 1rpx solid rgba(46, 199, 255, 0.3);
  box-shadow: 0 0 12rpx rgba(46, 199, 255, 0.25), 0 0 16rpx rgba(138, 79, 255, 0.2);
  margin-bottom: 24rpx;
}

.contact-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid rgba(46, 199, 255, 0.12);
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.contact-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.contact-label {
  font-size: 24rpx;
  color: #96B8F0;
  display: block;
}

.contact-value {
  font-size: 28rpx;
  color: #FFFFFF;
  display: block;
  margin-top: 4rpx;
}

.contact-action {
  background: rgba(40, 120, 255, 0.3);
  color: #73C0FF;
  padding: 10rpx 24rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  border: 1rpx solid rgba(40, 120, 255, 0.35);
}

/* ===== 地图 ===== */
.map-section {
  padding: 0;
  overflow: hidden;
  background: rgba(10, 40, 140, 0.75);
  border-radius: 14rpx;
  border: 1rpx solid rgba(46, 199, 255, 0.3);
  box-shadow: 0 0 12rpx rgba(46, 199, 255, 0.25), 0 0 16rpx rgba(138, 79, 255, 0.2);
  margin-bottom: 24rpx;
}

.company-map {
  width: 100%;
  height: 350rpx;
}

/* ===== 公众号 ===== */
.qrcode-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx;
  background: rgba(10, 40, 140, 0.75);
  border-radius: 14rpx;
  border: 1rpx solid rgba(46, 199, 255, 0.3);
  box-shadow: 0 0 12rpx rgba(46, 199, 255, 0.25), 0 0 16rpx rgba(138, 79, 255, 0.2);
  margin-bottom: 24rpx;
}

.qrcode-img {
  width: 300rpx;
  height: 300rpx;
  margin: 20rpx 0;
}

.qrcode-tip {
  font-size: 24rpx;
  color: #96B8F0;
}

/* ===== 留言反馈 ===== */
.feedback-section {
  padding: 30rpx;
  background: rgba(10, 40, 140, 0.75);
  border-radius: 14rpx;
  border: 1rpx solid rgba(46, 199, 255, 0.3);
  box-shadow: 0 0 12rpx rgba(46, 199, 255, 0.25), 0 0 16rpx rgba(138, 79, 255, 0.2);
  margin-bottom: 24rpx;
}

.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.feedback-input {
  background: rgba(10, 40, 140, 0.6);
  border: 1rpx solid rgba(46, 199, 255, 0.2);
  padding: 24rpx;
  border-radius: 8px;
  font-size: 28rpx;
  color: #FFFFFF;
}

.feedback-textarea {
  background: rgba(10, 40, 140, 0.6);
  border: 1rpx solid rgba(46, 199, 255, 0.2);
  padding: 24rpx;
  border-radius: 8px;
  font-size: 28rpx;
  height: 200rpx;
  width: 100%;
  box-sizing: border-box;
  color: #FFFFFF;
}

.feedback-input::placeholder,
.feedback-textarea::placeholder {
  color: rgba(180, 200, 240, 0.5);
}
</style>
