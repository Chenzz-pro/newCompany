<template>
  <text class="func-tag">{{ text }}</text>
</template>

<script>
export default {
  name: 'func-tag',
  props: {
    text: { type: String, default: '' }
  }
}
</script>

<style scoped>
.func-tag {
  display: inline-block;
  background: rgba(40, 120, 255, 0.3);
  color: #FFFFFF;
  font-size: 22rpx;
  padding: 6rpx 18rpx;
  border-radius: 6rpx;
  border: 1rpx solid rgba(115, 192, 255, 0.25);
  margin-right: 12rpx;
  margin-bottom: 10rpx;
}
</style>
