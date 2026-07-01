<template>
  <view class="tech-card">
    <!-- 左上角分类角标 -->
    <view v-if="badge" class="tech-badge" :class="badgeColor">
      <text>{{ badge }}</text>
    </view>
    <!-- 右上角年份 -->
    <text v-if="year" class="tech-year">{{ year }}</text>
    <!-- 主内容插槽 -->
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'tech-card',
  props: {
    badge: { type: String, default: '' },
    badgeColor: { type: String, default: 'blue' },
    year: { type: String, default: '' }
  }
}
</script>

<style scoped>
.tech-card {
  position: relative;
  background: rgba(10, 40, 140, 0.75);
  border-radius: 16rpx;
  border: 2rpx solid rgba(46, 199, 255, 0.3);
  box-shadow: 0 0 16rpx rgba(138, 79, 255, 0.25), 0 0 24rpx rgba(46, 199, 255, 0.2);
  padding: 24rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
}

.tech-badge {
  display: inline-block;
  padding: 4rpx 16rpx;
  border-radius: 6rpx;
  font-size: 20rpx;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 12rpx;
}

.tech-badge.blue {
  background: linear-gradient(135deg, #2EC7FF, #73C0FF);
  box-shadow: 0 0 10rpx rgba(46, 199, 255, 0.3);
}

.tech-badge.purple {
  background: linear-gradient(135deg, #8A4FFF, #D168E8);
  box-shadow: 0 0 10rpx rgba(138, 79, 255, 0.3);
}

.tech-year {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  font-size: 22rpx;
  color: #96B8F0;
}
</style>
