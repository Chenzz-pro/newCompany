<script>
export default {
	onLaunch() {
		console.log('App Launch')
		// 初始化云开发环境
		if (wx.cloud) {
			wx.cloud.init({
				env: 'cloud1-d8gilol6sdb2084d3',
				traceUser: true
			})
		}
	},
	onShow() {
		console.log('App Show')
	},
	onHide() {
		console.log('App Hide')
	}
}
</script>

<style>
/* 凯风云燊传媒 — 全局样式 */
page {
  background: #0A3490;
  background: linear-gradient(180deg, #0A3490 0%, #1256D8 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 28rpx;
  color: #C6D8FF;
  line-height: 1.6;
}

.container { padding: 24rpx; }

/* 霓虹发光卡片 */
.card {
  background: rgba(10, 40, 140, 0.75);
  border-radius: 16rpx;
  border: 2rpx solid rgba(46, 199, 255, 0.3);
  box-shadow: 0 0 16rpx rgba(138, 79, 255, 0.25), 0 0 24rpx rgba(46, 199, 255, 0.2);
  margin-bottom: 24rpx;
  overflow: hidden;
}

.section-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #FFFFFF;
  padding: 32rpx 28rpx 24rpx;
}

.section-subtitle {
  font-size: 32rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.text-primary { color: #73C0FF; }
.text-orange { color: #D168E8; }
.text-gray  { color: #C6D8FF; }
.text-light { color: #96B8F0; }

/* 按钮 */
.btn-primary {
  background: linear-gradient(135deg, #2EC7FF, #73C0FF);
  color: #FFFFFF;
  border: none;
  border-radius: 10rpx;
  padding: 24rpx 0;
  font-size: 32rpx;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 0 20rpx rgba(46, 199, 255, 0.35);
}

.btn-orange {
  background: linear-gradient(135deg, #D168E8, #8A4FFF);
  color: #FFFFFF;
  border: none;
  border-radius: 10rpx;
  padding: 24rpx 0;
  font-size: 32rpx;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 0 20rpx rgba(138, 79, 255, 0.3);
}

/* 标签 */
.tag {
  display: inline-block;
  padding: 4rpx 16rpx;
  border-radius: 6rpx;
  font-size: 22rpx;
  margin-right: 12rpx;
}
.tag-urgent {
  background: rgba(209, 104, 232, 0.15);
  color: #D168E8;
  border: 1rpx solid rgba(209, 104, 232, 0.25);
}
.tag-normal {
  background: rgba(40, 120, 255, 0.3);
  color: #FFFFFF;
  border: 1rpx solid rgba(115, 192, 255, 0.2);
}

.divider {
  height: 1rpx;
  background: rgba(46, 199, 255, 0.15);
  margin: 24rpx 0;
}

.fade-in { animation: fadeIn 0.3s ease-in; }
@keyframes fadeIn {
  from { opacity: 0.6; }
  to { opacity: 1; }
}

@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 10rpx rgba(46, 199, 255, 0.3); }
  50% { box-shadow: 0 0 24rpx rgba(46, 199, 255, 0.55), 0 0 40rpx rgba(138, 79, 255, 0.3); }
}
</style>