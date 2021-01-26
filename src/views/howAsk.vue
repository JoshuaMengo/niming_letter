<template>
  <div>
    <div class="header">
      <div class="goback" @click="$router.go(-1)"><img src="@/assets/wgoback.png" /></div>
      <div class="text">
        <img src="@/assets/v2_qkc12cl0.png" />
        <div>给好友写信</div>
      </div>
    </div>

    <div class="content">
      <div class="item">
        通过好友分享的专属海报，扫码进入Ta的信箱就可以给Ta留言啦~
      </div>
      <div class="line">or</div>
      <div class="bottom item">
        <div class="title">没有好友的海报/信箱链接</div>
        <div>填写对方的手机号码和您的留言内容，我们将通过短信通知Ta查收。</div>
        <div class="btn" @click="$router.push('/newAsk')">去写信</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="less">
.header {
  background: black;
  height: 95px;
  padding: 20px;
  .goback {
    width: 60px;
    margin-bottom: 25px;
    height: 24px;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .text {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 100);
    font-size: 20px;
    font-weight: bold;
    img {
      height: 20px;
      width: 20px;
      margin-right: 5px;
    }
  }
}
.content {
  color: rgba(61, 61, 61, 100);
  font-size: 14px;
  transform: translateY(-20px);
  .item {
    background: white;
    margin: 0 20px;
    padding: 20px;
    border-radius: 10px;
    line-height: 24px;
  }
  .line {
    text-align: center;
    margin: 10px 0;
  }

  .bottom {
    .title {
      color: rgba(16, 16, 16, 100);
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .btn {
      width: 295px;
      height: 45px;
      line-height: 45px;
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 1);
      color: rgba(255, 255, 255, 100);
      font-size: 15px;
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>