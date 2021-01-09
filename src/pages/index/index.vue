<template>
  <div class="index">
    <div class="img-container">
      <img src="/static/images/user.png" alt="" />
    </div>
    <div class="btn-container">
      <button @click="bindViewTap">开始查询</button>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },

  components: {
  },

  methods: {
    bindViewTap (e) {
      wx.navigateTo({
        url: '/pages/list/main'
      })
    }
  },

  created () {
    wx.hideTabBar()
  }
}
</script>

<style scoped>
.index {
  width: 100%;
}
</style>
