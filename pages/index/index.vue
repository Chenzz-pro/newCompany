<template>
	<view class="home-page" @touchstart="onPullStart" @touchmove="onPullMove" @touchend="onPullEnd">
		<!-- 自定义顶部导航栏 -->
		<view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="nav-content">
				<text class="nav-title">凯风云燊传媒</text>
				<view class="nav-subtitle">KAI FENG YUN SHEN MEDIA</view>
			</view>
		</view>

		<!-- 占位 -->
		<view :style="{ height: (statusBarHeight + 44) + 'px' }"></view>

		<!-- 全屏图片轮播 -->
		<view class="swiper-section">
			<swiper class="banner-swiper" :indicator-dots="true" indicator-color="rgba(255,255,255,0.5)"
				indicator-active-color="#ffffff" :autoplay="true" :interval="3000" :duration="500"
				:circular="true" @change="onSwiperChange">
				<swiper-item v-for="(item, index) in swipers" :key="index" @tap="onSwiperTap(item)">
					<image class="swiper-img" :src="item.imageUrl" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
			<!-- 兜底：无数据时显示默认图 -->
			<view v-if="!swipers.length" class="swiper-default">
				<image class="swiper-img" src="/static/images/default-banner.png" mode="aspectFill"></image>
			</view>
		</view>

		<!-- 企业宣传视频 -->
		<view class="video-section card" v-if="videoUrl">
			<view class="section-title">企业宣传</view>
			<view class="video-wrapper">
				<video :src="videoUrl" :poster="videoPoster" :autoplay="false" :muted="isMuted"
					:controls="true" :show-fullscreen-btn="true" :enable-progress-gesture="true"
					object-fit="cover" class="video-player" @play="onVideoPlay"
					@ended="onVideoEnded">
				</video>
				<!-- 静音切换按钮 -->
				<view class="mute-btn" @tap="toggleMute" v-if="isPlaying">
					<text>{{ isMuted ? '🔇' : '🔊' }}</text>
				</view>
			</view>
		</view>

		<!-- 公司简介 -->
		<view class="intro-section card">
			<view class="intro-header">
				<view class="intro-header-left">
					<text class="section-title" style="padding:0">关于我们</text>
					<text class="intro-subtitle">ABOUT US</text>
				</view>
			</view>

			<!-- 核心数据 -->
			<view class="stats-row">
				<view class="stat-item">
					<text class="stat-num">1500<text class="stat-unit">+</text></text>
					<text class="stat-label">签约主播艺人</text>
				</view>
				<view class="stat-divider"></view>
				<view class="stat-item">
					<text class="stat-num">2<text class="stat-unit">家</text></text>
					<text class="stat-label">旗下公司</text>
				</view>
				<view class="stat-divider"></view>
				<view class="stat-item">
					<text class="stat-num">6<text class="stat-unit">大</text></text>
					<text class="stat-label">核心业务</text>
				</view>
			</view>

			<!-- 凯风云燊传媒 -->
			<view class="company-card">
				<view class="company-card-header">
					<view class="company-badge">母公司</view>
					<text class="company-date">2023年创立</text>
				</view>
				<text class="company-name">厦门市凯风云燊传媒有限公司</text>
				<text class="company-desc">新媒体运营服务商，提供网络直播、电商、活动策划、艺人包装、个人IP孵化、新媒体推广，旗下主播艺人共1500余位。</text>
				<view class="company-tags">
					<text class="ctag">网络直播</text>
					<text class="ctag">电商运营</text>
					<text class="ctag">活动策划</text>
					<text class="ctag">艺人包装</text>
					<text class="ctag">IP孵化</text>
					<text class="ctag">新媒体推广</text>
				</view>
			</view>

			<!-- 连接线 -->
			<view class="timeline-connector">
				<view class="connector-line"></view>
				<view class="connector-dot"></view>
				<view class="connector-line"></view>
			</view>

			<!-- 琅图文化传媒 -->
			<view class="company-card company-card-sub">
				<view class="company-card-header">
					<view class="company-badge badge-sub">子公司</view>
					<text class="company-date">2025年成立</text>
				</view>
				<text class="company-name">厦门市琅图文化传媒有限公司</text>
				<text class="company-desc">以凯风云燊传媒为背景，重构运营模式管理体系，为来访公司交流学习的样板模范，主营新媒体推广、艺人包装、学习培训。</text>
				<view class="company-tags">
					<text class="ctag ctag-sub">新媒体推广</text>
					<text class="ctag ctag-sub">艺人包装</text>
					<text class="ctag ctag-sub">交流学习</text>
				</view>
			</view>
		</view>

		<!-- 发展历程 -->
		<view class="timeline-section card">
			<view class="timeline-header">
				<text class="section-title" style="padding:0">发展历程</text>
				<text class="timeline-subtitle">MILESTONES</text>
			</view>

			<view class="tl-wrapper">
				<!-- 2023年2月 -->
				<view class="tl-item">
					<view class="tl-left">
						<text class="tl-year">2023</text>
						<text class="tl-month">2月</text>
					</view>
					<view class="tl-line">
						<view class="tl-dot dot-start"></view>
						<view class="tl-connector"></view>
					</view>
					<view class="tl-content">
						<view class="tl-card">
							<view class="tl-card-tag tag-start">创业起步</view>
							<text class="tl-card-title">公司正式成立</text>
							<text class="tl-card-desc">以电商带货、短视频切片、抖音直播为主要业务方向，开启新媒体征程。</text>
						</view>
					</view>
				</view>

				<!-- 2023年8月 -->
				<view class="tl-item">
					<view class="tl-left">
						<text class="tl-year">2023</text>
						<text class="tl-month">8月</text>
					</view>
					<view class="tl-line">
						<view class="tl-dot dot-milestone"></view>
						<view class="tl-connector"></view>
					</view>
					<view class="tl-content">
						<view class="tl-card tl-card-highlight">
							<view class="tl-card-tag tag-milestone">里程碑</view>
							<text class="tl-card-title">月流水突破600万+</text>
							<view class="tl-highlight-num">
								<text class="hl-num">600</text>
								<text class="hl-unit">万元/月</text>
							</view>
							<text class="tl-card-desc">成立仅6个月，公司总体月流水突破600万元人民币，实现快速增长。</text>
						</view>
					</view>
				</view>

				<!-- 2024年8月 -->
				<view class="tl-item">
					<view class="tl-left">
						<text class="tl-year">2024</text>
						<text class="tl-month">8月</text>
					</view>
					<view class="tl-line">
						<view class="tl-dot dot-award"></view>
						<view class="tl-connector"></view>
					</view>
					<view class="tl-content">
						<view class="tl-card">
							<view class="tl-card-tag tag-expand">业务拓展</view>
							<text class="tl-card-title">业务升级 · 平台认证</text>
							<text class="tl-card-desc">嫁接商务推广、短视频达人及个人账号孵化、本地生活服务等新业务板块。</text>
							<view class="tl-award">
								<text class="award-icon">🏆</text>
								<text class="award-text">抖音平台认证「福深第一拉新公司」</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 2025年9月 -->
				<view class="tl-item tl-item-last">
					<view class="tl-left">
						<text class="tl-year">2025</text>
						<text class="tl-month">9月</text>
					</view>
					<view class="tl-line">
						<view class="tl-dot dot-now"></view>
					</view>
					<view class="tl-content">
						<view class="tl-card tl-card-new">
							<view class="tl-card-tag tag-new">最新</view>
							<text class="tl-card-title">创办琅图文化 · 集团化发展</text>
							<text class="tl-card-desc">随着业务体系完善，创办琅图文化传媒有限公司，以直播带货、娱乐主播、抖音切片、小红书/抖音/快手培训等多元化发展。</text>
							<view class="tl-new-badges">
								<text class="nb">直播带货</text>
								<text class="nb">娱乐主播</text>
								<text class="nb">多平台培训</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 核心业务 -->
		<view class="business-section card" v-if="businessList.length">
			<view class="section-title">核心业务</view>
			<view class="business-grid">
				<view class="business-item" v-for="(item, idx) in businessList" :key="idx">
					<image :src="item.icon" class="business-icon" mode="aspectFit"></image>
					<text class="business-name">{{ item.name }}</text>
				</view>
			</view>
		</view>

		<!-- 招聘入口 -->
		<view class="recruit-entry card" @tap="goRecruit">
			<view class="recruit-entry-left">
				<text class="recruit-entry-title">人才招聘</text>
				<text class="recruit-entry-desc">加入我们，共创未来</text>
			</view>
			<view class="recruit-entry-btn">
				<view class="recruit-arrows">
					<text class="recruit-arrow-item">▶</text>
					<text class="recruit-arrow-item">▶</text>
					<text class="recruit-arrow-item">▶</text>
				</view>
				<text>立即查看</text>
			</view>
		</view>

		<!-- 底部联系我们 -->
		<view class="contact-section card">
			<view class="section-title">联系我们</view>
			<view class="contact-list">
				<view class="contact-item" @tap="callPhone">
					<text class="contact-icon">📞</text>
					<view class="contact-info">
						<text class="contact-label">客服电话</text>
						<text class="contact-value">{{ companyPhone }}</text>
					</view>
				</view>
				<view class="contact-item" @tap="openMap">
					<text class="contact-icon">📍</text>
					<view class="contact-info">
						<text class="contact-label">公司地址</text>
						<text class="contact-value">{{ companyAddress }}</text>
					</view>
				</view>
				<view class="contact-item" @tap="copyWechat">
					<text class="contact-icon">💬</text>
					<view class="contact-info">
						<text class="contact-label">客服微信</text>
						<text class="contact-value">{{ companyWechat }}</text>
					</view>
				</view>
			</view>
			<!-- 地图 -->
			<map class="contact-map" :latitude="companyLat" :longitude="companyLng" :markers="markers"
				:scale="16" show-location @tap="openMap"></map>
		</view>

		<!-- 底部版权 -->
		<view class="footer">
			<text class="footer-text">© 2026 厦门市凯风云燊传媒有限公司 版权所有</text>
		</view>

		<!-- 上滑跳转招聘提示 -->
		<view class="pull-recruit-hint" :class="{ 'pull-active': pullHintVisible, 'pull-ready': pullReady }">
			<view class="pull-recruit-line"></view>
			<text class="pull-recruit-text">{{ pullHintText }}</text>
			<view class="pull-recruit-arrow">
				<text class="pull-arrow-item">↑</text>
				<text class="pull-arrow-item">↑</text>
			</view>
		</view>
	</view>
</template>

<script>
import config from '@/common/config.js'
import { callCloud, makePhoneCall, copyToClipboard, previewImage, showToast, showLoading, hideLoading } from '@/common/util.js'

export default {
	data() {
		return {
			statusBarHeight: 20,
			swipers: [],
			videoUrl: '',
			videoPoster: '',
			isMuted: true,
			isPlaying: false,
			companyInfo: {},
			businessList: [],
			companyPhone: config.company.phone,
			companyAddress: config.company.address,
			companyWechat: config.company.wechat,
			companyLat: config.company.latitude,
			companyLng: config.company.longitude,
			markers: [{
				id: 1,
				latitude: config.company.latitude,
				longitude: config.company.longitude,
				title: config.company.name,
				width: 30,
				height: 30
			}],
			// 上滑跳转招聘
			pullHintVisible: false,
			pullReady: false,
			pullHintText: '继续上滑 查看岗位',
			_maxScrollY: 0,
			_overScrollThreshold: 80,
			_switchLocked: false,
			_atBottom: false,
			_touchStartY: 0,
			_touchPullDistance: 0
		}
	},
	onLoad() {
		const sysInfo = uni.getSystemInfoSync()
		this.statusBarHeight = sysInfo.statusBarHeight || 20
		this.loadData()
	},
	onShareAppMessage() {
		return {
			title: config.company.name + ' - 诚聘英才',
			path: '/pages/index/index'
		}
	},
	onUnload() {
		if (this._bottomClearTimer) clearTimeout(this._bottomClearTimer)
	},
	onReady() {
		this.$nextTick(() => {
			this._calcMaxScroll()
		})
	},
	onReachBottom() {
		this._atBottom = true
		this.pullHintVisible = true
		if (this._bottomClearTimer) clearTimeout(this._bottomClearTimer)
		this._bottomClearTimer = setTimeout(() => {
			this._atBottom = false
			this.pullHintVisible = false
			this.pullReady = false
			this.pullHintText = '继续上滑 查看岗位'
			this._touchPullDistance = 0
		}, 2000)
	},
	onPageScroll(e) {
		// 更新当前滚动位置，用于判断是否在底部
		if (this._maxScrollY > 0 && e.scrollTop >= this._maxScrollY - 5) {
			if (!this._atBottom) {
				this._atBottom = true
				this.pullHintVisible = true
			}
		} else {
			if (this._atBottom && e.scrollTop < this._maxScrollY - 20) {
				this._atBottom = false
				this.pullHintVisible = false
				this.pullReady = false
				this.pullHintText = '继续上滑 查看岗位'
				this._touchPullDistance = 0
			}
		}
	},
	methods: {
		async loadData() {
			showLoading('加载中...')
			try {
				// 并行加载数据
				const [swiperRes, videoRes, companyRes] = await Promise.all([
					this.loadSwipers(),
					this.loadVideo(),
					this.loadCompanyInfo()
				])
			} catch (e) {
				console.error('首页数据加载失败:', e)
			} finally {
				hideLoading()
				this.$nextTick(() => {
					this._calcMaxScroll()
				})
			}
		},

		async loadSwipers() {
			try {
				const res = await callCloud('getSwipers')
				if (res && res.data && res.data.length) {
					// 提取所有 cloud:// 格式的 fileID，转换为临时 HTTPS URL
					const cloudFileIDs = res.data
						.map(item => item.imageUrl)
						.filter(url => url && url.startsWith('cloud://'))

					if (cloudFileIDs.length) {
						const tempRes = await new Promise((resolve, reject) => {
							wx.cloud.getTempFileURL({
								fileList: cloudFileIDs,
								success: resolve,
								fail: reject
							})
						})
						// 建立 fileID -> tempFileURL 的映射
						const fileMap = {}
						tempRes.fileList.forEach(f => {
							if (f.tempFileURL) {
								fileMap[f.fileID] = f.tempFileURL
							}
						})
						// 替换 imageUrl
						this.swipers = res.data.map(item => ({
							...item,
							imageUrl: fileMap[item.imageUrl] || item.imageUrl
						}))
					} else {
						this.swipers = res.data
					}
				}
			} catch (e) {
				console.error('加载轮播图失败:', e)
				this.swipers = []
			}
		},

		async loadVideo() {
			try {
				const res = await callCloud('getVideo')
				if (res && res.data) {
					this.videoUrl = res.data.videoUrl || ''
					this.videoPoster = res.data.posterUrl || ''
				}
			} catch (e) {
				this.videoUrl = ''
			}
		},

		async loadCompanyInfo() {
			try {
				const res = await callCloud('getCompanyInfo')
				if (res && res.data) {
					this.companyInfo = res.data
					if (res.data.phone) this.companyPhone = res.data.phone
					if (res.data.address) this.companyAddress = res.data.address
					if (res.data.wechat) this.companyWechat = res.data.wechat
					if (res.data.latitude) this.companyLat = res.data.latitude
					if (res.data.longitude) this.companyLng = res.data.longitude
					if (res.data.business) this.businessList = res.data.business
					// 更新地图标记点
					this.markers = [{
						id: 1,
						latitude: this.companyLat,
						longitude: this.companyLng,
						title: config.company.name,
						width: 30,
						height: 30
					}]
				}
			} catch (e) {
				// 使用config中的默认数据
			}
		},

		onSwiperTap(item) {
			if (item.link) {
				if (item.link.startsWith('http')) {
					// 外链暂不处理
				} else {
					uni.navigateTo({ url: item.link })
				}
			}
		},

		onSwiperChange(e) {
			// 轮播切换回调
		},

		onVideoPlay() {
			this.isPlaying = true
		},

		onVideoEnded() {
			this.isPlaying = false
		},

		toggleMute() {
			this.isMuted = !this.isMuted
		},

		callPhone() {
			makePhoneCall(this.companyPhone)
		},

		copyWechat() {
			copyToClipboard(this.companyWechat)
		},

		openMap() {
			uni.openLocation({
				latitude: this.companyLat,
				longitude: this.companyLng,
				name: config.company.name,
				address: this.companyAddress
			})
		},

		previewImg(url, urls) {
			previewImage(urls, urls.indexOf(url))
		},

		goRecruit() {
			uni.switchTab({ url: '/pages/recruit/list' })
		},

		goAbout() {
			uni.switchTab({ url: '/pages/about/index' })
		},

		onPullStart(e) {
			if (!this._atBottom || this._switchLocked) return
			this._touchStartY = e.touches[0].clientY
			this._touchPullDistance = 0
		},

		onPullMove(e) {
			if (!this._atBottom || this._switchLocked) return
			const deltaY = this._touchStartY - e.touches[0].clientY
			this._touchPullDistance = deltaY
			if (deltaY > 50) {
				this.pullReady = true
				this.pullHintText = '释放查看招聘岗位'
			} else if (deltaY > 10) {
				this.pullReady = false
				this.pullHintText = '继续上滑 查看岗位'
			}
		},

		onPullEnd(e) {
			if (this.pullReady && this._atBottom && !this._switchLocked) {
				this._switchToRecruit()
			}
			this._touchPullDistance = 0
			this.pullReady = false
			this.pullHintText = '继续上滑 查看岗位'
		},

		_calcMaxScroll() {
			const query = uni.createSelectorQuery().in(this)
			query.select('.home-page').boundingClientRect()
			query.exec(res => {
				if (res[0]) {
					const pageH = res[0].height
					const winH = uni.getSystemInfoSync().windowHeight
					this._maxScrollY = Math.max(0, pageH - winH)
				}
			})
		},

		_switchToRecruit() {
			if (this._switchLocked) return
			this._switchLocked = true
			this.pullHintText = '正在跳转...'
			uni.switchTab({
				url: '/pages/recruit/list'
			})
			setTimeout(() => { this._switchLocked = false }, 1500)
		}
	}
}
</script>

<style lang="scss" scoped>
.home-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #0A3490 0%, #1256D8 100%);
	position: relative;
	z-index: 1;
}

/* 导航栏 - 极简风格 */
.nav-bar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 999;
	background: rgba(10, 40, 140, 0.85);
	box-shadow: 0 2rpx 24rpx rgba(0, 0, 0, 0.4), 0 0 20rpx rgba(40, 120, 255, 0.3);
	border-bottom: 1rpx solid rgba(46, 199, 255, 0.15);
}

.nav-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 16rpx 30rpx 12rpx;
	height: 88rpx;
}

.nav-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #73C0FF;
	letter-spacing: 4rpx;
	margin-bottom: 4rpx;
	text-shadow: 0 0 16rpx rgba(106, 173, 255, 0.5);
}

.nav-subtitle {
	font-size: 18rpx;
	font-weight: 400;
	color: #96B8F0;
	letter-spacing: 2rpx;
	text-transform: uppercase;
}

/* 轮播 */
.swiper-section {
	position: relative;
	width: 100%;
}

.banner-swiper {
	width: 100%;
	height: 400rpx;
}

.swiper-img {
	width: 100%;
	height: 400rpx;
}

.swiper-default {
	width: 100%;
	height: 400rpx;
	background: rgba(10, 40, 140, 0.6);
}

/* 视频 */
.video-section {
	margin: 24rpx;
	background: rgba(10, 40, 140, 0.75);
	border: 1rpx solid rgba(46, 199, 255, 0.3);
	box-shadow: 0 0 12rpx rgba(46, 199, 255, 0.25), 0 0 16rpx rgba(138, 79, 255, 0.2);
	border-radius: 14rpx;
}

.video-wrapper {
	position: relative;
	border-radius: 8px;
	overflow: hidden;
}

.video-player {
	width: 100%;
	height: 420rpx;
}

.mute-btn {
	position: absolute;
	right: 20rpx;
	bottom: 20rpx;
	width: 60rpx;
	height: 60rpx;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
}

/* 企业简介 */
.intro-section {
	margin: 0 24rpx 24rpx;
	padding: 30rpx;
	background: rgba(10, 40, 140, 0.75);
	box-shadow: 0 8rpx 24rpx rgba(40, 120, 255, 0.2);
	border: 1rpx solid rgba(46, 199, 255, 0.2);
}

.intro-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 30rpx;
}

.intro-header-left {
	display: flex;
	flex-direction: column;
}

.intro-subtitle {
	font-size: 20rpx;
	color: rgba(180, 200, 240, 0.7);
	letter-spacing: 2rpx;
	margin-top: 4rpx;
}

.intro-more-btn {
	display: flex;
	align-items: center;
	background: rgba(40, 120, 255, 0.3);
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
	color: #73C0FF;
	font-size: 24rpx;
}

.intro-more-btn .arrow {
	margin-left: 6rpx;
}

/* 核心数据 */
.stats-row {
	display: flex;
	align-items: center;
	justify-content: space-around;
	background: rgba(10, 40, 140, 0.5);
	border-radius: 12rpx;
	padding: 32rpx 24rpx;
	margin-bottom: 32rpx;
	border: 1rpx solid rgba(46, 199, 255, 0.2);
	box-shadow: 0 0 10rpx rgba(46, 199, 255, 0.15);
}

.stat-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
}

.stat-num {
	font-size: 48rpx;
	font-weight: 700;
	color: #73C0FF;
	text-shadow: 0 0 10rpx rgba(106, 173, 255, 0.4);
	line-height: 1.2;
}

.stat-unit {
	font-size: 24rpx;
	font-weight: 400;
	margin-left: 4rpx;
	color: #73C0FF;
}

.stat-label {
	font-size: 22rpx;
	color: #96B8F0;
	margin-top: 8rpx;
}

.stat-divider {
	width: 1rpx;
	height: 60rpx;
	background: rgba(46, 199, 255, 0.2);
}

/* 公司卡片 */
.company-card {
	background: rgba(10, 40, 140, 0.5);
	border-radius: 12rpx;
	padding: 24rpx;
	border-left: 4rpx solid #73C0FF;
	box-shadow: 0 0 12rpx rgba(46, 199, 255, 0.12);
}

.company-card-sub {
	border-left-color: #D168E8;
	box-shadow: 0 0 12rpx rgba(209, 104, 232, 0.12);
}

.company-card-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12rpx;
}

.company-badge {
	background: linear-gradient(135deg, #73C0FF, #2EC7FF);
	color: #FFFFFF;
	font-size: 20rpx;
	padding: 4rpx 16rpx;
	border-radius: 4rpx;
	font-weight: 600;
	box-shadow: 0 0 10rpx rgba(106, 173, 255, 0.3);
}

.badge-sub {
	background: linear-gradient(135deg, #D168E8, #8A4FFF);
	box-shadow: 0 0 10rpx rgba(209, 104, 232, 0.2);
}

.company-date {
	font-size: 22rpx;
	color: #96B8F0;
}

.company-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #FFFFFF;
	display: block;
	margin-bottom: 12rpx;
	line-height: 1.4;
}

.company-desc {
	font-size: 26rpx;
	color: #C6D8FF;
	line-height: 1.8;
	display: block;
	margin-bottom: 16rpx;
}

.company-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.ctag {
	background: rgba(40, 120, 255, 0.25);
	color: #73C0FF;
	font-size: 22rpx;
	padding: 6rpx 16rpx;
	border-radius: 4rpx;
	border: 1rpx solid rgba(40, 120, 255, 0.35);
}

.ctag-sub {
	background: rgba(209, 104, 232, 0.1);
	color: #D168E8;
	border: 1rpx solid rgba(209, 104, 232, 0.15);
}

/* 连接线 */
.timeline-connector {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 8rpx 0;
}

.connector-line {
	width: 2rpx;
	height: 24rpx;
	background: rgba(46, 199, 255, 0.2);
}

.connector-dot {
	width: 12rpx;
	height: 12rpx;
	background: #73C0FF;
	border-radius: 50%;
	margin: 4rpx 0;
	box-shadow: 0 0 12rpx rgba(106, 173, 255, 0.5);
	animation: glowPulse 2s infinite;
}

/* 发展历程 */
.timeline-section {
	margin: 0 24rpx 24rpx;
	padding: 30rpx;
	background: rgba(10, 40, 140, 0.75);
	border: 1rpx solid rgba(46, 199, 255, 0.3);
	box-shadow: 0 0 12rpx rgba(46, 199, 255, 0.25), 0 0 16rpx rgba(138, 79, 255, 0.2);
	border-radius: 14rpx;
}

.timeline-header {
	display: flex;
	align-items: baseline;
	gap: 12rpx;
	margin-bottom: 36rpx;
}

.timeline-subtitle {
	font-size: 20rpx;
	color: #96B8F0;
	letter-spacing: 2rpx;
}

/* 时间轴主体 */
.tl-wrapper {
	padding-left: 8rpx;
}

.tl-item {
	display: flex;
	position: relative;
	min-height: 180rpx;
}

/* 左侧年份 */
.tl-left {
	width: 100rpx;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	padding-top: 8rpx;
	padding-right: 20rpx;
}

.tl-year {
	font-size: 32rpx;
	font-weight: 700;
	color: #73C0FF;
}

.tl-month {
	font-size: 22rpx;
	color: #96B8F0;
}

/* 中间轴线 */
.tl-line {
	width: 40rpx;
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.tl-dot {
	width: 20rpx;
	height: 20rpx;
	border-radius: 50%;
	flex-shrink: 0;
	margin-top: 12rpx;
	z-index: 2;
}

.dot-start {
	background: #73C0FF;
	box-shadow: 0 0 0 6rpx rgba(40, 120, 255, 0.3), 0 0 16rpx rgba(106, 173, 255, 0.4);
}

.dot-milestone {
	background: #D168E8;
	box-shadow: 0 0 0 6rpx rgba(209, 104, 232, 0.12), 0 0 16rpx rgba(255, 176, 120, 0.4);
}

.dot-award {
	background: #73C0FF;
	box-shadow: 0 0 0 6rpx rgba(40, 120, 255, 0.3), 0 0 16rpx rgba(106, 173, 255, 0.4);
}

.dot-now {
	background: #73C0FF;
	box-shadow: 0 0 0 6rpx rgba(40, 120, 255, 0.3), 0 0 18rpx rgba(106, 173, 255, 0.55);
	animation: glowPulse 2s infinite;
}

@keyframes pulse {
	0%, 100% { box-shadow: 0 0 0 6rpx rgba(209, 104, 232, 0.15), 0 0 18rpx rgba(255, 45, 120, 0.5); }
	50% { box-shadow: 0 0 0 14rpx rgba(255, 176, 120, 0.06), 0 0 30rpx rgba(255, 45, 120, 0.3); }
}

.tl-connector {
	width: 3rpx;
	flex: 1;
	background: linear-gradient(to bottom, rgba(46, 199, 255, 0.3), rgba(138, 79, 255, 0.08));
	margin-top: 8rpx;
}

/* 右侧内容卡片 */
.tl-content {
	flex: 1;
	padding-bottom: 32rpx;
	padding-left: 8rpx;
}

.tl-card {
	background: rgba(10, 40, 140, 0.5);
	border-radius: 12rpx;
	padding: 24rpx;
	border: 1rpx solid rgba(46, 199, 255, 0.2);
	box-shadow: 0 0 10rpx rgba(46, 199, 255, 0.1);
}

.tl-card-highlight {
	background: linear-gradient(135deg, rgba(209, 104, 232, 0.06), rgba(209, 104, 232, 0.04));
	border: 1rpx solid rgba(209, 104, 232, 0.18);
	box-shadow: 0 0 16rpx rgba(209, 104, 232, 0.1);
}

.tl-card-new {
	background: linear-gradient(135deg, rgba(40, 120, 255, 0.15), rgba(59, 130, 246, 0.04));
	border: 1rpx solid rgba(106, 173, 255, 0.25);
	box-shadow: 0 0 16rpx rgba(40, 120, 255, 0.25);
}

.tl-card-tag {
	display: inline-block;
	font-size: 20rpx;
	padding: 4rpx 14rpx;
	border-radius: 4px;
	margin-bottom: 12rpx;
}

.tag-start {
	background: rgba(40, 120, 255, 0.3);
	color: #73C0FF;
	border: 1rpx solid rgba(40, 120, 255, 0.35);
}

.tag-milestone {
	background: rgba(209, 104, 232, 0.12);
	color: #D168E8;
	border: 1rpx solid rgba(209, 104, 232, 0.15);
}

.tag-expand {
	background: rgba(40, 120, 255, 0.25);
	color: #73C0FF;
	border: 1rpx solid rgba(106, 173, 255, 0.18);
}

.tag-new {
	background: linear-gradient(135deg, #73C0FF, #2EC7FF);
	color: #FFFFFF;
	font-weight: 600;
	box-shadow: 0 0 12rpx rgba(106, 173, 255, 0.3);
}

.tl-card-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #FFFFFF;
	display: block;
	margin-bottom: 10rpx;
	line-height: 1.4;
}

.tl-card-desc {
	font-size: 24rpx;
	color: #C6D8FF;
	line-height: 1.8;
	display: block;
}

/* 高亮数字 */
.tl-highlight-num {
	display: flex;
	align-items: baseline;
	margin: 16rpx 0;
}

.hl-num {
	font-size: 64rpx;
	font-weight: 700;
	color: #73C0FF;
	text-shadow: 0 0 20rpx rgba(106, 173, 255, 0.4);
	line-height: 1;
}

.hl-unit {
	font-size: 24rpx;
	color: #73C0FF;
	margin-left: 8rpx;
}

/* 荣誉标签 */
.tl-award {
	display: flex;
	align-items: center;
	background: linear-gradient(135deg, rgba(209, 104, 232, 0.05), rgba(209, 104, 232, 0.03));
	border-radius: 8px;
	padding: 16rpx 20rpx;
	margin-top: 16rpx;
	border: 1rpx solid rgba(209, 104, 232, 0.15);
}

.award-icon {
	font-size: 36rpx;
	margin-right: 12rpx;
}

.award-text {
	font-size: 24rpx;
	color: #D168E8;
	font-weight: 600;
	line-height: 1.4;
}

/* 新业务标签 */
.tl-new-badges {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
	margin-top: 16rpx;
}

.nb {
	background: rgba(40, 120, 255, 0.2);
	color: #73C0FF;
	font-size: 22rpx;
	padding: 6rpx 16rpx;
	border-radius: 20rpx;
	border: 1rpx solid rgba(106, 173, 255, 0.18);
}

/* 核心业务 */
.business-section {
	margin: 0 24rpx 24rpx;
	background: rgba(10, 40, 140, 0.75);
	border: 1rpx solid rgba(46, 199, 255, 0.3);
	box-shadow: 0 0 12rpx rgba(46, 199, 255, 0.25), 0 0 16rpx rgba(138, 79, 255, 0.2);
	border-radius: 14rpx;
}

.business-grid {
	display: flex;
	flex-wrap: wrap;
	padding: 0 12rpx 24rpx;
}

.business-item {
	width: 25%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx 0;
}

.business-icon {
	width: 80rpx;
	height: 80rpx;
	margin-bottom: 12rpx;
	background: rgba(40, 120, 255, 0.2);
	border-radius: 50%;
	padding: 16rpx;
	box-sizing: border-box;
}

.business-name {
	font-size: 24rpx;
	color: #C6D8FF;
}

/* 招聘入口 */
.recruit-entry {
	position: relative;
	margin: 32rpx 24rpx;
	padding: 32rpx 28rpx;
	border-radius: 14rpx;
	background: linear-gradient(135deg, #0A3490 0%, #1256D8 100%);
	border: 1rpx solid rgba(46, 199, 255, 0.3);
	box-shadow: 0 0 20rpx rgba(46, 199, 255, 0.28), 0 0 28rpx rgba(138, 79, 255, 0.18);
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.recruit-entry-left {
	flex: 1;
}

.recruit-entry-title {
	font-size: 36rpx;
	font-weight: 700;
	color: #FFFFFF;
	display: block;
}

.recruit-entry-desc {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.75);
	display: block;
	margin-top: 8rpx;
}

.recruit-entry-btn {
	background: rgba(255, 255, 255, 0.15);
	border-radius: 30rpx;
	padding: 16rpx 28rpx;
	color: #FFFFFF;
	font-size: 28rpx;
	font-weight: 600;
	display: flex;
	align-items: center;
	gap: 10rpx;
	border: 1rpx solid rgba(255, 255, 255, 0.25);
	flex-shrink: 0;
	white-space: nowrap;
}

/* 三箭头组 */
.recruit-arrows {
	display: flex;
	align-items: center;
	gap: 0;
}
.recruit-arrow-item {
	font-size: 26rpx;
	color: #D168E8;
	margin-left: -4rpx;
	animation: arrow-pulse 0.8s ease-in-out infinite;
}
.recruit-arrow-item:nth-child(1) {
	animation-delay: 0s;
}
.recruit-arrow-item:nth-child(2) {
	animation-delay: 0.15s;
}
.recruit-arrow-item:nth-child(3) {
	animation-delay: 0.3s;
}
@keyframes arrow-pulse {
	0%, 100% { transform: scale(1); opacity: 0.4; }
	50% { transform: scale(1.4); opacity: 1; }
}

/* 联系我们 */
.contact-section {
	margin: 0 24rpx 24rpx;
	background: rgba(10, 40, 140, 0.75);
	border: 1rpx solid rgba(46, 199, 255, 0.3);
	box-shadow: 0 0 12rpx rgba(46, 199, 255, 0.25), 0 0 16rpx rgba(138, 79, 255, 0.2);
	border-radius: 14rpx;
}

.contact-list {
	padding: 0 24rpx;
}

.contact-item {
	display: flex;
	align-items: center;
	padding: 24rpx 0;
	border-bottom: 1rpx solid rgba(46, 199, 255, 0.1);
}

.contact-item:last-child {
	border-bottom: none;
}

.contact-icon {
	font-size: 40rpx;
	margin-right: 20rpx;
}

.contact-info {
	flex: 1;
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
	font-weight: 600;
}

.contact-map {
	width: 100%;
	height: 300rpx;
	margin-top: 20rpx;
	border-radius: 8px;
}

/* 底部版权 */
.footer {
	text-align: center;
	padding: 40rpx 0 20rpx;
}

.footer-text {
	font-size: 22rpx;
	color: #96B8F0;
}

/* 上滑跳转招聘提示 */
.pull-recruit-hint {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10rpx 0 80rpx;
	opacity: 0;
	transform: translateY(20rpx);
	transition: all 0.3s ease;
}
.pull-recruit-hint.pull-active {
	opacity: 1;
	transform: translateY(0);
}
.pull-recruit-hint.pull-ready .pull-recruit-line {
	background: #73C0FF;
	width: 120rpx;
	box-shadow: 0 0 8rpx rgba(106, 173, 255, 0.4);
}
.pull-recruit-hint.pull-ready .pull-recruit-text {
	color: #73C0FF;
	font-weight: 600;
}
.pull-recruit-line {
	width: 80rpx;
	height: 4rpx;
	background: rgba(46, 199, 255, 0.3);
	border-radius: 2rpx;
	margin-bottom: 16rpx;
	transition: all 0.2s ease;
}
.pull-recruit-text {
	font-size: 24rpx;
	color: #96B8F0;
	margin-bottom: 8rpx;
	transition: color 0.2s ease;
}
.pull-recruit-arrow {
	display: flex;
	gap: 4rpx;
}
.pull-arrow-item {
	font-size: 24rpx;
	color: rgba(110, 175, 255, 0.4);
	animation: pull-bounce 0.8s ease-in-out infinite;
}
.pull-ready .pull-arrow-item {
	color: #73C0FF;
}
.pull-arrow-item:nth-child(1) {
	animation-delay: 0s;
}
.pull-arrow-item:nth-child(2) {
	animation-delay: 0.2s;
}
@keyframes pull-bounce {
	0%, 100% { transform: translateY(0); opacity: 0.4; }
	50% { transform: translateY(-6rpx); opacity: 1; }
}
</style>
