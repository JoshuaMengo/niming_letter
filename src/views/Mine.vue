<template>
  <div class="mine_container">
    <div class="header">
      <div>
        <img v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" />
      </div>
      <div>{{ userInfo.nickName || "未授权用户" }}</div>
      <div>UID：{{ userInfo.uid || "-" }}</div>
      <div class="goback" @click="$router.push('/home')">
        <img src="@/assets/v2_qm1nix.png" />
        首页
      </div>
    </div>

    <div class="content">
      <div>
        <div class="tabbar_item" @click="enterHome(1)">
          <div>{{ userInfo.receive_num || 0 }}</div>
          <div>我收到的</div>
        </div>

        <div class="tabbar_item" @click="enterHome(2)">
          <div>{{ userInfo.send_num || 0 }}</div>
          <div>我发出的</div>
        </div>

        <div class="tabbar_item" @click="$router.push('/Record')">
          <!-- @click="islock ? (isDialog = 'pay') : $router.push('/record')" -->

          <div>
            <img
              style="width: 43px; height: 28px"
              src="@/assets/v2_ql0ir0.png"
            />{{ userInfo.visit_num || 0 }}
          </div>
          <div>来访记录</div>
        </div>
      </div>

      <div>
        <div class="list_item" @click="isDialog = 'tips'">
          <div>
            <img src="@/assets/v2_qiwr6k.png" />开启消息通知
            <!-- <div>
              <wx-open-launch-weapp
                id="launch-btn"
                username="gh_87cd299fd07b"
                path="pages/web_view/web_view.html?url=https://mp.weixin.qq.com/s/JII8GbuujOewsLyQtb2XFA"
              >
                <script type="text/wxtag-template">
                  <style>
                   .btn {
                      border:0;
                      font-size: 14px;
                      padding:0;
                      background:#f4f5f5;
                      color:#2c3e50;
                   }

                  </style>
                  <button class="btn"> 开启消息通知</button>
                </script>
              </wx-open-launch-weapp>
            </div> -->
          </div>

          <div>></div>
        </div>

        <div class="list_item" @click="$router.push('/howAsk')">
          <div><img src="@/assets/v2_qmk5nn.png" /> 给好友写信</div>

          <div>></div>
        </div>

        <div class="list_item" @click="$router.push('/recyclesBin')">
          <div><img src="@/assets/v2_qiwqyb.png" /> 回收站</div>

          <div>></div>
        </div>

        <div class="list_item" @click="$router.push('/shield')">
          <div><img src="@/assets/v2_qk9210b.png" /> 屏蔽列表</div>
          <div>></div>
        </div>

        <!-- <div class="list_item">
          <div><img src="@/assets/v2_qmibtx.png" /> 常见问题</div>
          <div>></div>
        </div> -->

        <div class="list_item">
          <div>
            <img class="weappImg" src="@/assets/v2_qmibtx.png" />
            <div>
              <wx-open-launch-weapp
                id="launch-btn"
                username="gh_1eeeae8628d0"
                path="pages/webview/webview?id=1"
              >
                <script type="text/wxtag-template">
                  <style>
                    .weappContant {
                      display:flex;
                      justify-content:space-between;
                      align-items:center;
                      height:60px;
                      font-size: 14px;
                      width:305px;
                    }
                    .btn {
                      border:0;
                      font-size: 14px;
                      padding:0;
                      background:#f4f5f5;
                      color:#2c3e50;
                      height:60px;
                      line-height:60px;
                      flex:1;
                    }
                  </style>
                  <div class="weappContant">
                    <div class="btn"> 常见问题</div>
                    <div>></div>
                  </div>
                </script>
              </wx-open-launch-weapp>
            </div>
          </div>
          <div style="font-size: 14px;position:absolute;right:0;top:50%;transform:translateX(-50%)">></div>
        </div>

        <!-- <div class="list_item">
          <div style="height: 100%; width: 100%">
            <wx-open-launch-weapp
              id="launch-btn"
              username="gh_87cd299fd07b"
              path="pages/web_view/web_view.html?url=https://mp.weixin.qq.com/s/hHqzplRjPYERUmzFyzzGVw"
            >
              <script type="text/wxtag-template">
                <style>
                 .weappContant{
                    display: flex;
                    justify-content: space-between;
                    height:60px;
                    
                    align-items: center;
                    font-size: 14px;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                 }
                 .weappImg{
                    height: 20px;
                    width: 20px;
                    margin-right: 10px;
                 }
                </style>
                <div class="weappContant">
                  <div>常见问题</div>
                  <div>></div>
                </div>
              </script>
            </wx-open-launch-weapp>
          </div>
          <img class="weappImg" src="@/assets/v2_qmibtx.png" /> 
        </div> -->

        <a href="http://nim.lodidc.cn/friendtest/">
          <div class="list_item">
            <div><img src="@/assets/v2_qmiijp.png" /> 默契挑战</div>
            <div>></div>
          </div>
        </a>

        <div
          class="list_item"
          v-if="is_admin"
          @click="$router.push('/FeedbackRecord')"
        >
          <div><img src="@/assets/v2_qk9210b.png" /> 管理员入口</div>
          <div>></div>
        </div>
      </div>
    </div>

    <div
      class="dialog"
      v-show="isDialog === 'pay' && userInfo.is_lock === true"
      @click="isDialog = ''"
    >
      <div class="content" @click.stop="">
        <div>访客记录</div>
        <div class="operation_container">
          <div @click="pay({ fee: 200, body: once })">
            <div><img src="@/assets/v2_qkccl0.png" />偷看一次</div>
            <div>￥<span>2</span></div>
          </div>
          <div @click="pay({ fee: 1500, body: 'vip' })">
            <div><img src="@/assets/v2_qkccl8.png" />永久解锁</div>
            <div>￥<span>15</span><del>￥30</del></div>
          </div>
        </div>
        <div>
          Tips：访客记录中包含留言好友&仅访问未留言好友的来访记录，不一一对应留言内容。
        </div>
        <div @click="$router.push('/feedback')">已完成支付？</div>
      </div>
    </div>

    <div class="codeDialog" v-show="isDialog === 'tips'" @click="isDialog = ''">
      <div class="successContent" @click.stop="">
        <div>
          <img
            style="height: 155px; width: 155px"
            src="@/assets/20210125162144.png"
          />
        </div>
        <div style="font-size: 12px">
          长按关注，回复“开启提醒”<br />
          若已关注，则无需重复操作
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import wx from "weixin-js-sdk";
import {
  updateDetail,
  getUser,
  getConfig,
  createPay,
  updateUnlockStatus,
  judgeAdmin,
} from "@/api/api";
export default {
  data() {
    return {
      lists: [
        {
          isbtn: true,
          label: "开启消息通知",
          link: "",
          imgurl: require("@/assets/v2_qiwr6k.png"),
        },
        {
          isbtn: false,
          label: "回收站",
          link: "/recyclesBin",
          imgurl: require("@/assets/v2_qiwqyb.png"),
        },
        {
          isbtn: false,
          label: "屏蔽列表",
          link: "/shield",
          imgurl: require("@/assets/v2_qk9210b.png"),
        },
      ],
      userInfo: {},
      islock: false,
      session: "",
      launchWeapp: "",
      isDialog: "",
      is_admin: false,
    };
  },

  created() {
    //获取jssdk配置
    let that = this;
    // let url = encodeURIComponent(window.location.href);
    that.session = localStorage.getItem("session");
    let data = {
      wechaturl: window.location.href,
      session: that.session,
    };
    getConfig(data).then((res) => {
      (that.appId = res.data.appId),
        wx.config({
          debug: false,
          appId: res.data.appId,
          timestamp: res.data.timestamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: ["chooseWXPay"],
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
    this.getUser();
    this.getAdminStatus();
  },

  // mounted() {
  //   let wxJs = document.createElement("script");
  //   wxJs.src = "http://res2.wx.qq.com/open/js/jweixin-1.6.0.js";
  //   document.head.appendChild(wxJs);
  //   wxJs.onload = function () {};
  // },

  // async created() {
  //   console.log(localStorage.getItem("userInfo"));

  //   var url = encodeURIComponent(window.location.href);
  //   var getCodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${"wx590ea386b2de4eb8"}&redirect_uri=${"http%3a%2f%2fanonymous.lodidc.cn%2findex.html"}&response_type=code&scope=snsapi_base&state=1#wechat_redirect`;

  //   var getCodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx590ea386b2de4eb8&redirect_uri=http%3a%2f%2fanonymous.lodidc.cn%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
  //   window.location.href = getCodeUrl;

  //   let session = localStorage.getItem("session");

  //   updateDetail({
  //     code: "051pkk000778KK1fhp000g9sPl3pkk0P",
  //   });
  // },

  methods: {
    async getAdminStatus() {
      const res = await judgeAdmin(localStorage.getItem("session"));
      console.log(res);
      this.is_admin = res.data.is_admin;
    },

    handleErrorFn(e) {
      console.log("fail", e.detail);
    },

    handleLaunchFn(e) {
      console.log("success");
    },

    enterHome(index) {
      this.$router.push({
        path: "/home",
        query: {
          index: index,
        },
      });
    },

    enterPage(link) {
      // if (page.link === "") {
      //   this.isDialog = "codeDialog";
      //   return;
      // }
      this.$router.push(link);
    },

    //获取用户信息
    getUser() {
      let session = localStorage.getItem("session");
      getUser(session).then((res) => {
        if (res.err_code === 0) {
          console.log(res);
          localStorage.setItem("userInfo", JSON.stringify(res.data));
          this.userInfo = res.data;
          this.islock = res.data.is_lock;
        }
      });
    },

    //生成支付订单，调起微信支付
    async pay(data) {
      let that = this;
      let parama = {
        session: localStorage.getItem("session"),
        total_fee: data.fee,
        body: data.body,
      };
      const result = await createPay(parama);

      if (result) {
        let wxpay = new Promise((resolve, reject) => {
          wx.chooseWXPay({
            appId: result.data.appId,
            timestamp: result.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: result.data.nonceStr, // 支付签名随机串，不长于 32 位
            package: result.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: result.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: result.data.paySign, // 支付签名
            success: function (res) {
              resolve("支付成功");
              // 支付成功后的回调函数
            },
          });
        });

        //重新请求get，刷新用户is_blok的状态
        wxpay.then(async () => {
          await updateUnlockStatus({
            trade_no: result.data.trade_no,
            flag: data.body,
            session: localStorage.getItem("session"),
          });
          that.showDialog = false;
          that.getUser();
          this.$Dialog
            .alert({
              title: "",
              message: "支付成功",
            })
            .then(() => {
              // on close
            });
        });
      }
      // createPay(parama).then((result) => {
      //   console.log(result)
      //   wx.chooseWXPay({
      //     appId: result.data.appId,
      //     timestamp: result.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      //     nonceStr: result.data.nonceStr, // 支付签名随机串，不长于 32 位
      //     package: result.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
      //     signType: result.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      //     paySign: result.data.paySign, // 支付签名
      //     success:  function (res) {
      //       // 支付成功后的回调函数

      //       //支付成功后更新权限，
      //       updateUnlockStatus({
      //         trade_no: result.data.trade_no,
      //         flag: data.body,
      //         session: localStorage.getItem("session"),
      //       });
      //       // 更新成功，重新请求get，刷新用户is_blok的状态
      //       if (res) {
      //         that.getUser();
      //       }
      //     },
      //   });
      // });
    },
  },
};
</script>

<style lang="less" scoped>
.mine_container {
  .header {
    background: url("../assets/headerBg.jpg");
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    position: relative;
    & > div:nth-child(1) {
      height: 59px;
      width: 59px;
      border-radius: 100px;
      border: 3px solid rgba(255, 255, 255, 100);
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    & > div:nth-child(2) {
      color: rgba(255, 255, 255, 100);
      font-size: 18px;
      margin: 10px 0 5px;
    }
    & > div:nth-child(3) {
      color: rgba(255, 255, 255);
      opacity: 0.6;
      font-size: 12px;
    }
    .goback {
      position: absolute;
      left: 15px;
      top: 20px;
      display: flex;
      align-items: center;
      img {
        height: 16px;
        width: 16px;
        margin-right: 5px;
      }
    }
  }
  & > .content {
    padding: 30px 20px;
    border-radius: 20px 20px 0px 0px;
    background-color: #f4f5f5;
    transform: translateY(-20px);
    & > div:nth-child(1) {
      display: flex;
      justify-content: space-around;
      padding-bottom: 25px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    .tabbar_item {
      text-align: center;
      & > div:nth-child(1) {
        color: rgba(16, 16, 16, 100);
        font-size: 20px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      & > :nth-child(2) {
        color: rgba(0, 0, 0, 0.35);
        font-size: 13px;
      }
    }
    & > div:nth-child(2) {
      a {
        color: #2c3e50;
      }
      .list_item {
        display: flex;
        justify-content: space-between;
        height: 60px;
        align-items: center;
        font-size: 14px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        position:relative;
        & > div:nth-child(1) {
          display: flex;
          align-items: center;
          & > div {
            height: 60px;
            flex: 1;
          }
          img {
            height: 20px;
            width: 20px;
            margin-right: 10px;
          }
        }
      }
    }
  }
  .dialog {
    background: rgba(0, 0, 0, 0.65);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 35px;

    & > .content {
      background: white;
      border-radius: 10px;
      width: 100%;
      padding: 25px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      & > div:nth-child(1) {
        color: rgba(16, 16, 16, 100);
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 30px;
      }
      & > div:last-child {
        color: rgba(76, 134, 234, 100);
        font-size: 13px;
        margin-top: 20px;
      }
      & > .operation_container {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 25px;
        color: white;
        & > div {
          width: 115px;
          height: 115px;
          line-height: 32px;
          border-radius: 8px;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          & > div:nth-child(1) {
            display: flex;
            align-items: center;
            img {
              width: 18px;
              height: 18px;
              margin-right: 3px;
            }
          }
          span {
            font-weight: bold;
            font-size: 20px;
          }
          del {
            opacity: 0.6;
          }
        }

        & > div:nth-child(2) {
          background-color: rgba(16, 16, 16, 100);
        }
      }
    }
  }
  & > .codeDialog {
    background: rgba(0, 0, 0, 0.65);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 35px;
    img {
      width: 230px;
      height: 230px;
    }
    & > .successContent {
      background: none;
      color: white;
      & > div:nth-child(2) {
        margin-top: 10px;
        font-size: 14px;
        text-align: center;
        line-height: 20px;
      }
    }
  }
}
</style>