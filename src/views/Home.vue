<template>
  <div class="home">
    <div class="header">
      <div>
        <img :src="require('../assets/headerLogo.png')" />
      </div>
      <div class="avatar" @click="enterMine()">
        <div>我的</div>
        <div>
          <img
            :src="
              userInfo ? (userInfo.avatarUrl ? userInfo.avatarUrl : '') : ''
            "
          />
        </div>
      </div>
    </div>

    <div class="content">
      <div class="title">
        <div>信箱</div>
        <div class="tabbar">
          <div
            v-for="(item, index) in tabbarList ? tabbarList : []"
            :key="index"
            :class="
              $store.state.activeTabbarIndex == item.value ? 'active' : ''
            "
            @click="changeTabbar(item.value)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>

      <div class="guide" v-show="isFirst">
        <div><img src="@/assets/v2_qnlep2.gif" /></div>
        <div>
          <div>如果没有顾虑，Ta会对你说什么呢？</div>
          <div>点击生成海报，分享到朋友圈坐等来信↓</div>
        </div>
        <div @click="closeGuide()">X</div>
      </div>

      <div class="invitation_btn" @click="$router.push('/poster')">
        <img src="../assets/v2_qk8z4j.png" />
        邀请好友来信
      </div>

      <div v-show="dataList.length > 0">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
          <div
            class="list_item"
            v-for="(item, index) in dataList"
            :key="index"
            @click="enterDetail(item.lid)"
          >
            <div>
              {{ item.content }}
            </div>
            <div>
              <div>{{ item.create_time }}</div>
              <div>
                <span style="color: rgba(0, 0, 0); opacity: 0.5">
                  {{ item.has_read ? "已读" : "未读" }} &nbsp;</span
                >
                <span
                  style="color: #eb838d"
                  v-if="item.have_reply && !item.has_read_reply && $store.state.activeTabbarIndex === 2"
                  >新回复</span
                >
              </div>
            </div>

            <div
              v-if="!item.has_read && $store.state.activeTabbarIndex === 1"
              class="round"
            ></div>
          </div>
        </van-list>
      </div>
      <div v-show="dataList.length <= 0" class="noContent">
        <img
          src="../assets/v2_qk8ywm.png"
          style="height: 135px; width: 135px"
        />
        <div>未收到来信</div>
      </div>
    </div>

    <div class="loading" v-show="$store.state.showLoading">
      <div>
        <img src="@/assets/v2_qkypb6.gif" />
        <div>加载中...</div>
      </div>
      <div>
        <img src="@/assets/v2_qkypfr.png" />
      </div>
    </div>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";

import { queryReceive, querySend, login, getConfig, getUser } from "@/api/api";

export default {
  name: "Home",
  components: {
    // HelloWorld
  },
  data() {
    return {
      imgSrc: require("../assets/v2_qk8ywm.png"),
      dataList: [],
      tabbarList: [
        { label: "我收到的", value: 1 },
        { label: "我发出的", value: 2 },
      ],
      // checkTabbar: 1,
      userInfo: {},
      listIndex: 0,
      loading: false,
      finished: false,
      isFirst: true,
    };
  },
  beforeMount() {},

  async mounted() {
    //获取路由中的id
    // this.uid = this.$router.query.id
    let code = this.getUrlCode().code;
    let isnew = this.getUrlCode().isnew;
    if (
      !localStorage.getItem("session") ||
      localStorage.getItem("session") === undefined
    ) {
      if (code) {
        //已经通过非静默授权重定向过来
        login({
          code: code,
          isNew: isnew ? true : false,
        }).then((result) => {
          //设置uid和session到localstorage并用返回到的session继续请求
          localStorage.setItem("session", result.data.session);
          localStorage.setItem("uid", result.data.uid);
          localStorage.setItem("first_login", result.data.first_login);
          if (this.$store.state.showLoading) {
            setTimeout(() => {
              this.$store.commit("changeShowLoading");
              this.isFirst =
                localStorage.getItem("first_login") === "true" ? true : false;
            }, 1000);
            this.getUserInfo(result.data.session);
            this.getWxConfig(result.data.session);
          }

          if (this.$route.query.index) {
            this.$route.query.index == 1
              ? this.getReceivedList(result.data.session)
              : this.getSendList(result.data.session);
          } else {
            this.$store.state.activeTabbarIndex == 1
              ? this.getReceivedList(result.data.session)
              : this.getSendList(result.data.session);
          }
        });
        return; //return掉 不再走授权
      }
      //非静默授权
      var url = encodeURIComponent(window.location.href);
      var getCodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9dedc2998c430f2e&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      window.location.href = getCodeUrl;
    } else {
      // 别的业务逻辑
      if (this.$store.state.showLoading) {
        setTimeout(() => {
          this.$store.commit("changeShowLoading");
          this.isFirst =
            localStorage.getItem("first_login") === "true" ? true : false;
        }, 1000);
      }
      this.getWxConfig(localStorage.getItem("session"));
      this.getUserInfo(localStorage.getItem("session"));

      if (this.$route.query.index) {
        this.$route.query.index == 1
          ? this.getReceivedList(localStorage.getItem("session"))
          : this.getSendList(localStorage.getItem("session"));
      } else {
        this.$store.state.activeTabbarIndex == 1
          ? this.getReceivedList(localStorage.getItem("session"))
          : this.getSendList(localStorage.getItem("session"));
      }
    }
    if (this.$route.query.index) {
      console.log(this.$route.query.index, "-----");
      this.$store.commit("changeTabbarIndex", this.$route.query.index);
    }
  },

  async created() {},

  methods: {
    getWxConfig(session) {
      let that = this;
      let data = {
        wechaturl: window.location.href,
        session: session,
      };
      getConfig(data).then((res) => {
        if (res.err_code === 1001) {
          that.getWxConfig();
        }
        (that.appId = res.data.appId),
          wx.config({
            debug: false,
            appId: res.data.appId,
            timestamp: res.data.timestamp,
            nonceStr: res.data.nonceStr,
            signature: res.data.signature,
            jsApiList: ["onMenuShareQZone"],
            openTagList: ["wx-open-launch-weapp"],
          });
        wx.ready(function () {
          console.log("成功");
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
        });
        wx.error(function (res) {
          console.log(res);
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名
        });
      });
    },

    closeGuide() {
      if (this.isFirst === true) {
        localStorage.setItem("first_login", false);
        this.isFirst = false;
      }
    },

    async getUserInfo(session) {
      const res = await getUser(session);
      this.userInfo = res.data;
    },

    async getReceivedList(session) {
      const res = await queryReceive({
        session: session,
        page_index: this.listIndex,
      });
      this.dataList = res.data.list;
    },

    async getSendList(session) {
      const res = await querySend({
        session: session,
        page_index: this.listIndex,
      });
      this.dataList = res.data.list;
    },

    getUrlCode() {
      // 截取url中的code方法
      var url = location.search;
      console.log(url);
      this.winUrl = url;
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
      }
      return theRequest;
    },

    async onLoad() {
      this.listIndex += 1;
      const res =
        this.$store.state.activeTabbarIndex == 1
          ? await queryReceive({
              session: localStorage.getItem("session"),
              page_index: this.listIndex,
            })
          : await querySend({
              session: localStorage.getItem("session"),
              page_index: this.listIndex,
            });
      this.loading = false;
      if (res.data.list.length <= 0) {
        this.finished = true;
      } else {
        this.dataList.push(...res.data.list);
      }
    },

    changeTabbar(index) {
      this.$store.commit("changeTabbarIndex", index);
      let session = localStorage.getItem("session");
      // this.checkTabbar = index;
      this.listIndex = 0;
      index == 1 ? this.getReceivedList(session) : this.getSendList(session);
    },
    enterDetail(lid) {
      this.$router.push({
        path: "/detail", //这个path就是你在router/index.js里边配置的路径
        query: {
          lid: lid,
          is_receive: this.$store.state.activeTabbarIndex,
        },
      });
    },
    enterMine() {
      this.$router.push({
        path: "/mine", //这个path就是你在router/index.js里边配置的路径
      });
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  flex: 1;
  background: #f4f5f5;
  .header {
    background: url("../assets/headerBg.jpg");
    height: 96px;
    padding: 50px 20px 0;
    display: flex;
    justify-content: space-between;
    color: white;
    font-size: 14px;
    & > div:first-child {
      height: 40px;
      line-height: 40px;
      & > img {
        margin-top: 5px;
        height: 30px;
        width: 100px;
      }
    }
    .avatar {
      display: flex;
      height: 40px;
      align-items: center;
      & > div:nth-child(2) {
        height: 38px;
        width: 38px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 100);
        margin-left: 8px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .content {
    border-radius: 20px 20px 0px 0px;
    background: #f4f5f5;
    transform: translatey(-20px);
    padding: 30px 20px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      & > div:first-child {
        color: rgba(16, 16, 16, 100);
        font-size: 20px;
        font-weight: bold;
      }
      .tabbar {
        display: flex;
        color: #c8c9c9;
        font-size: 14px;
        & > div {
          padding: 0 5px;
        }
        .active {
          font-weight: bold;
          color: #101010;
        }
      }
    }
    & > .guide {
      display: flex;
      align-items: center;
      margin-top: 30px;
      & > div:nth-child(1) {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 8px;
        & > img {
          height: 100%;
          width: 100%;
        }
      }
      & > div:nth-child(2) {
        flex: 1;
        & > div:nth-child(1) {
          color: rgba(16, 16, 16, 100);
          font-weight: bold;
          font-size: 15px;
        }
        & > div:nth-child(2) {
          color: rgba(16, 16, 16, 0.5);
          font-size: 13px;
        }
      }
      & > div:nth-child(3) {
        color: rgba(16, 16, 16, 0.35);
        font-size: 14px;
      }
    }
    .invitation_btn {
      font-size: 16px;
      font-weight: bold;
      background: black;
      color: white;
      margin-top: 25px;
      height: 85px;
      display: flex;
      justify-content: center;
      border-radius: 10px;
      align-items: center;
      margin-bottom: 15px;
      & > img {
        height: 22px;
        width: 22px;
        margin-right: 5px;
      }
    }
    .list_item {
      background: white;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 10px;
      position: relative;
      & > div:first-child {
        font-size: 15px;
        color: rgba(61, 61, 61, 100);
      }
      & > div:nth-child(2) {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
        font-size: 13px;
        color: rgba(16, 16, 16, 50);
      }
      .round {
        height: 12px;
        width: 12px;
        background: #de2d3e;
        border-radius: 50%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(25%, -25%);
      }
    }
  }
  .noContent {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
    font-size: 13px;
    color: #101010;
  }
  .loading {
    position: fixed;
    bottom: 0;
    top: 0;
    right: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    color: rgba(244, 245, 245, 0.5);
    font-size: 12px;
    & > div:nth-child(1) {
      flex: 1;
      background: black;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      img {
        width: 150px;
        height: 150px;
      }
    }
    & > div:nth-child(2) {
      height: 100px;
      background: white;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 100px;
        height: 30px;
      }
    }
  }
}
</style>