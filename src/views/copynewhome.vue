<template>
  <div class="home" @click.stop="showDialog = true">
    <div class="header">
      <div>
        <img :src="require('../assets/headerLogo.png')" />
      </div>
      <div class="avatar">
        <div>我的</div>
        <!-- <div>
          <img :src="userInfo ? userInfo.avatarUrl ? userInfo.avatarUrl :'' : ''" />
        </div> -->
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
            
          >
            {{ item.label }}
          </div>
        </div>
      </div>

      <div class="invitation_btn" >
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
                  v-if="item.have_reply && !item.has_read_reply"
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

    <!-- <div class="loading" v-show="$store.state.showLoading">
      <div>
        <img src="@/assets/v2_qkypb6.gif" />
        <div>加载中...</div>
      </div>
      <div>
        <img src="@/assets/v2_qkypfr.png" />
      </div>
    </div> -->

    <div class="dialog" @click.stop="showDialog = false" v-show="showDialog">
      <div class="content" @click.stop="">
        <div>请在微信中打开</div>
        <div class="item">
          <div class="title">方式一 <br />保存下方二维码，扫码进入</div>
          <img src="@/assets/20210122181246.png" />
        </div>
        <div class="item">
          <div class="title">方式二 <br />复制下方链接，在微信中打开</div>
          <div class="link">
            <span ref="copyContainer"
              >http://anonymous.taodaibuy.com/niming_letter/setphone</span
            >
          </div>
          <div
            @click="onCopy"
            style="color: #3e7dff; font-size: 14px; text-align: center"
          >
            一键复制
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryReceive, querySend, login, getUser } from "@/api/api";

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
      showDialog: false,
    };
  },
  beforeMount() {},

  // async mounted() {
  //   //获取路由中的id
  //   // this.uid = this.$router.query.id
  //   let code = this.getUrlCode().code;
  //   if (
  //     !localStorage.getItem("session") ||
  //     localStorage.getItem("session") === undefined
  //   ) {
  //     if (code) {
  //       //已经通过非静默授权重定向过来
  //       login(code).then((result) => {
  //         //设置uid和session到localstorage并用返回到的session继续请求
  //         localStorage.setItem("session", result.data.session);
  //         localStorage.setItem("uid", result.data.uid);
  //         if (this.$store.state.showLoading) {
  //           setTimeout(() => {
  //             this.$store.commit("changeShowLoading");
  //           }, 1000);
  //           this.getUserInfo(result.data.session);
  //         }

  //         if (this.$route.query.index) {
  //           this.$route.query.index == 1
  //             ? this.getReceivedList(result.data.session)
  //             : this.getSendList(result.data.session);
  //         } else {
  //           this.$store.state.activeTabbarIndex == 1
  //             ? this.getReceivedList(result.data.session)
  //             : this.getSendList(result.data.session);
  //         }
  //       });
  //       return; //return掉 不再走授权
  //     }
  //     //非静默授权
  //     var url = encodeURIComponent(window.location.href);
  //     var getCodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9dedc2998c430f2e&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
  //     window.location.href = getCodeUrl;
  //   } else {
  //     // 别的业务逻辑
  //     if (this.$store.state.showLoading) {
  //       setTimeout(() => {
  //         this.$store.commit("changeShowLoading");
  //       }, 1000);
  //       this.getUserInfo(localStorage.getItem('session'));
  //     }

  //     if (this.$route.query.index) {
  //       this.$route.query.index == 1
  //         ? this.getReceivedList(localStorage.getItem('session'))
  //         : this.getSendList(localStorage.getItem('session'));
  //     } else {
  //       this.$store.state.activeTabbarIndex == 1
  //         ? this.getReceivedList(localStorage.getItem('session'))
  //         : this.getSendList(localStorage.getItem('session'));
  //     }
  //   }
  //   if (this.$route.query.index) {
  //     console.log(this.$route.query.index, "-----");
  //     this.$store.commit("changeTabbarIndex", this.$route.query.index);
  //   }
  // },

  async created() {},

  methods: {
    onCopy() {
      let container = this.$refs.copyContainer;
      this.$copyText(
        "http://anonymous.taodaibuy.com/niming_letter/setphone",
        container
      );
      this.$Notify({ type: "success", message: "复制成功" });
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

  .dialog {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
    font-size: 15px;
    z-index: 999;
    & > .code {
      height: 175px;
      width: 175px;
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 15px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .content {
      color: black;
      background: white;
      width: 305px;
      padding-bottom: 20px;
      border-radius: 10px;
      & > div:nth-child(1) {
        font-size: 15px;
        font-weight: bold;
        height: 66px;
        line-height: 66px;
        text-align: center;
        border-bottom: 1px solid rgba(244, 245, 245, 100);
      }
      & > .item {
        margin-top: 20px;
        line-height: 22px;
        & .title {
          font-size: 14px;
          margin-bottom: 15px;
          text-align: center;
        }
        & .link {
          padding: 10px;
          width: 235px;
          background: #f4f5f5;
          word-break: break-all;
          color: #3e7dff;
          border-radius: 5px;
          margin: 0 auto 5px;
          overflow: hidden;
          font-size: 12px;
        }
        & img {
          display: block;
          margin: 0 auto;
          height: 105px;
          width: 105px;
        }
      }
    }
  }
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
  & > .content {
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