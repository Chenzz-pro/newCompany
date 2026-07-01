<template>
  <view class="data-stat">
    <view class="stat-item" v-for="(item, idx) in items" :key="idx">
      <text class="stat-num">{{ item.num }}</text>
      <text class="stat-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'data-stat',
  props: {
    items: { type: Array, default: () => [] }
  }
}
</script>

<style scoped>
.data-stat {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(10, 40, 140, 0.5);
  border-radius: 14rpx;
  padding: 32rpx 24rpx;
  margin-bottom: 32rpx;
  border: 1rpx solid rgba(46, 199, 255, 0.2);
  box-shadow: 0 0 12rpx rgba(46, 199, 255, 0.15);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

.stat-item + .stat-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10%;
  height: 80%;
  width: 1rpx;
  background: linear-gradient(180deg, transparent, rgba(46, 199, 255, 0.3), transparent);
}

.stat-num {
  font-size: 48rpx;
  font-weight: 800;
  color: #FFFFFF;
  text-shadow: 0 0 14rpx rgba(46, 199, 255, 0.4);
  line-height: 1.2;
}

.stat-text {
  font-size: 22rpx;
  color: #96B8F0;
  margin-top: 8rpx;
}
</style>
