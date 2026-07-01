<template>
  <view class="page-header">
    <view class="ph-bg"></view>
    <view class="ph-content">
      <text class="ph-title">{{ title }}</text>
      <text v-if="enTitle" class="ph-subtitle">{{ enTitle }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'page-header',
  props: {
    title: { type: String, default: '' },
    enTitle: { type: String, default: '' }
  }
}
</script>

<style scoped>
.page-header {
  position: relative;
  width: 100%;
  min-height: 160rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.ph-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(180deg, #0A3490 0%, #1256D8 100%);
  z-index: 0;
}

.ph-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 0;
}

.ph-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: 4rpx;
  text-shadow: 0 0 16rpx rgba(46, 199, 255, 0.3);
}

.ph-subtitle {
  font-size: 20rpx;
  color: #96B8F0;
  letter-spacing: 3rpx;
  margin-top: 6rpx;
  text-transform: uppercase;
}
</style>
