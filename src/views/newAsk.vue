<template>
  <div class="newAsk">
    <div class="header">
      <div @click="$router.go(-1)"><img src="@/assets/wgoback.png" /></div>
      <div><img src="../assets/headerLogo.png" /></div>
    </div>
    <div style="color: white; margin-bottom: 10px; font-size: 16px">TO:</div>

    <div>
      <input
        v-model="paramas.nickName"
        class="inputItem"
        placeholder="输入好友的名字/昵称"
      />

      <div class="content">
        <textarea v-model="paramas.content" placeholder="输入内容..." />
      </div>

      <input
        v-model="paramas.phone"
        class="inputItem"
        placeholder="输入好友的手机号码"
      />

      <div class="commit_btn white_btn" @click="isDialog = 'commit'">
        匿 名 发 送
      </div>

      <div class="tips">
        Tips：尊重好友，礼貌留言，恶意留言有可能被封禁账号哦
      </div>
    </div>

    <!-- 支付弹窗 -->
    <div class="dialog paydialog" v-show="isDialog === 'pay'">
      <div class="paycontent">
        <div>- 请支付 -</div>
        <div>2.00<span>元</span></div>
        <div @click="commit()">支付</div>
        <div>服务费及通讯费</div>
        <div @click.stop="isDialog = ''">X</div>
      </div>
    </div>

    <!-- 确认发送弹窗 -->
    <div class="dialog" v-show="isDialog === 'commit'">
      <div class="dialog_content">
        <div>是否确定发送</div>
        <div>
          <div @click="isDialog = ''">修改</div>
          <div @click="formData()">发送</div>
        </div>
        <div>Tips：好友可通过访客记录知道您曾访问此信箱，有被猜中的概率哦</div>
      </div>
    </div>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import { getConfig, createPay, sendMessage } from "@/api/api";
import { checkPhone } from "@/utils/index";
export default {
  data() {
    return {
      isDialog: "",
     
      paramas: {
        nickName: "",
        phone: "",
        content: "",
        session: localStorage.getItem("session"),
      },
    };
  },

  created() {
    this.getWxConfig();
  },

  methods: {
    //获取微信config配置
    getWxConfig() {
      let that = this;
      // let url = encodeURIComponent(window.location.href);
      let data = {
        wechaturl: window.location.href,
        session: localStorage.getItem("session"),
      };
      getConfig(data).then((res) => {
        (that.appId = res.data.appId),
          wx.config({
            debug: false,
            appId: res.data.appId,
            timestamp: res.data.timestamp,
            nonceStr: res.data.nonceStr,
            signature: res.data.signature,
            jsApiList: [
              "chooseWXPay",
              "updateTimelineShareData",
              "hideMenuItems",
            ],
            openTagList: ["wx-open-launch-weapp"],
          });
        wx.ready(function () {
          console.log("成功隐藏");
          wx.hideMenuItems({
            menuList: ["menuItem:share:appMessage", "menuItem:share:timeline"], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
          });
          // wx.updateTimelineShareData({
          //   title: "分享", // 分享标题
          //   link:
          //     "http://anonymous.lodidc.cn/niming_question/QuestionBox?id=" +
          //     localStorage.getItem("uid"), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          //   imgUrl:
          //     "http://anonymous.lodidc.cn/question_static/data/image/moren.jpg", // 分享图标
          //   success: function () {
          //     console.log("设置成功");
          //     // 设置成功
          //   },
          // });
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中
        });
        wx.error(function (res) {
          console.log(res);
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名
        });
      });
    },

    //验证数据必填
    formData() {
      let form = [
        { label: "name", name: "好友的名字/昵称" },
        { label: "letterContent", name: "内容" },
        { label: "phone", name: "好友的手机号码" },
      ];
      for (let i = 0; i < form.length; i++) {
        if (this.paramas[form[i].label] + "" === "") {
          this.$Notify({ type: "warning", message: "请输入" + form[i].name });
          return;
        }
      }
      //验证手机号码格式
      if (checkPhone(this.paramas.phone) === false) return;
      this.isDialog = "pay";
    },

    //支付后发送
    async commit() {
      let that = this;
      let parama = {
        session: localStorage.getItem("session"),
        total_fee: 200,
        body: "send",
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

        wxpay.then(async () => {
          //支付成功发送，初始化数据
          sendMessage(that.paramas).then((res) => {
            if (res.err_code === 0) {
              that.letterContent = "";
              that.name = "";
              that.phone = "";
              that.isDialog = ''
              that.$Dialog
              .alert({
                title: "",
                message: "发送成功",
              })
              .then(() => {
                // on close
                that.$router.push('/home')
              });
            }
          });
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.newAsk {
  background: url("../assets/headerBg.jpg");
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 0 20px 25px;
  overflow-y: auto;
  color: white;

  .tips {
    color: rgba(255, 255, 255);
    font-size: 12px;
    text-align: center;
    opacity: 0.5;
    margin-top: 25px;
  }
  .content {
    height: 390px;
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin: 10px 0;

    & > textarea {
      border: 0;
      height: 100%;
      width: 100%;
      color: black;
      font-size: 15px;
    }
  }
  .inputItem {
    width: 295px;
    height: 50px;
    line-height: 20px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    color: rgba(16, 16, 16, 35);
    font-size: 15px;
    padding: 0 20px;
  }
  .commit_btn {
    height: 42px;
    line-height: 42px;
    text-align: center;
    background-color: rgba(44, 44, 44, 100);
    border-radius: 4px;
    margin-top: 15px;
    font-weight: bold;
  }
  & > .header {
    display: flex;
    justify-content: space-between;
    padding: 20px 0 10px;
    & > div:first-child {
      color: rgba(255, 255, 255, 100);
      font-size: 16px;
      img {
        height: 24px;
        width: 60px;
      }
    }
    img {
      width: 100px;
      height: 30px;
    }
  }
  & > .paydialog {
    & > .paycontent {
      background: white;
      padding: 25px 0 20px;
      width: 275px;
      border-radius: 10px;
      color: black;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      & > div:nth-child(1) {
        color: rgba(16, 16, 16, 50);
        font-size: 14px;
        margin-bottom: 40px;
      }
      & > div:nth-child(2) {
        color: rgba(16, 16, 16, 100);
        font-size: 30px;
        display: flex;
        align-items: center;
        margin-bottom: 40px;
        span {
          color: rgba(16, 16, 16, 100);
          font-size: 14px;
          margin-left: 5px;
        }
      }
      & > div:nth-child(3) {
        width: 195px;
        height: 45px;
        line-height: 45px;
        border-radius: 150px;
        background-color: rgba(63, 198, 98, 100);
        color: rgba(255, 255, 255, 100);
        font-size: 15px;
        text-align: center;
        margin-bottom: 10px;
      }
      & > div:nth-child(4) {
        color: rgba(16, 16, 16, 0.35);
        font-size: 12px;
      }

      & > div:nth-child(5) {
        position: absolute;
        right: 8px;
        top: 8px;
      }
    }
  }
  & > .dialog {
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

    & > .dialog_content {
      color: black;
      background: white;
      padding: 40px 30px 20px;
      width: 205px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      & > div:nth-child(1) {
        font-weight: bold;
        font-size: 16px;
      }
      & > div:nth-child(2) {
        display: flex;
        margin-top: 40px;
        & > div {
          width: 95px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-radius: 5px;
          background-color: rgba(221, 221, 221, 100);
          margin: 0 5px;
        }
        & > div:nth-child(2) {
          background-color: rgba(16, 16, 16, 100);
          color: rgba(255, 255, 255, 100);
        }
      }
      & > div:nth-child(3) {
        margin: 14px 0;
        color: rgba(16, 16, 16);
        font-size: 12px;
        opacity: 0.4;
      }
    }
  }
}
</style>