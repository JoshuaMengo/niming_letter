<template>
  <div class="edit_container">
    <div class="header">
      <div>TO {{ nickName }}:</div>
      <div><img src="../assets/headerLogo.png" /></div>
    </div>

    <div v-if="!isBlock">
      <div class="content">
        <textarea v-model="letterContent" placeholder="输入内容..." />
      </div>

      <div class="commit_btn white_btn" @click="isDialog = 'commit'">匿 名 发 送</div>
      <div class="commit_btn" @click="$router.push('/home')">
        我的信箱
      </div>

      <div class="tips">
        Tips：尊重好友，礼貌留言，恶意留言有可能被封禁账号哦
      </div>
    </div>

    <div v-else class="isBlock">
      <img src="../assets/v2_qk8z00.png" />
      <div>抱歉，您已被对方屏蔽，无法留言</div>
    </div>

    <div class="dialog" v-show="isDialog === 'commit'">
      <div class="dialog_content">
        <div>是否确定发送</div>
        <div>
          <div @click="isDialog = ''">修改</div>
          <div @click="commit()">发送</div>
        </div>
        <div>Tips：好友可通过访客记录知道您曾访问此信箱，有被猜中的概率哦</div>
      </div>
    </div>

    <div class="dialog successDialog" @click="isDialog=''" v-show="isDialog ==='success'">
        <img @click.stop="" src="@/assets/20210125162144.png" style="height:135px;width:135px;margin-bottom:10px" />
        <div style="font-size:12px">长按关注，开启回复提醒</div>
    </div>

    <div class="footer_text">
      <div>
        <img src="@/assets/v2_qlbug1.png" />
        更多好玩
      </div>

      <div>
        <a href="http://nim.lodidc.cn/friendtest"><span>朋友默契测试</span></a>
        <a href="http://newyear.lodidc.cn/newyear"><span>朋友圈红包</span></a>
        <a href="http://anonymous.taodaibuy.com/niming_question"><span>匿名提问箱</span></a>
      </div>
    </div>
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
import { sendLetter, login, judgeBlock, getOther, getConfig, registerVisitor } from "@/api/api";
export default {
  data() {
    return {
      letterContent: "",
      isBlock: false,
      uid: "",
      isSuccess: false,
      isDialog: "",
      nickName: "",
    };
  },

  async mounted() {
    //localstorage中也没有session 首次进入
    this.uid = this.getUrlCode().id;
    let code = this.getUrlCode().code;
    let isnew = this.getUrlCode().isnew;
    // if (code) return;
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
          localStorage.setItem('first_login',result.data.first_login)

          // this.getDataDetail(this.$route.query.qid, result.data.session);
          // this.readLetter(result.data.session, result.data.uid);
          this.getBlock(result.data.session);
          this.get_Order(result.data.session);
          this.getWxConfig(result.data.session);
          this.visitor(result.data.session);

        });
        return; //return掉 不再走授权
      }
      //非静默授权
      var url = encodeURIComponent(window.location.href);
      var getCodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9dedc2998c430f2e&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      window.location.href = getCodeUrl;
    } else {
      // 已经有session,用localstorage的session来请求 别的业务逻辑
      this.getBlock(localStorage.getItem("session"));
      this.get_Order(localStorage.getItem("session"));
      this.getWxConfig(localStorage.getItem("session"));
      this.visitor(localStorage.getItem("session"));

    }
  },

  created() {
    // emoji 后端测试用的
    // var url = encodeURIComponent(window.location.href);
    // var getCodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${"wx590ea386b2de4eb8"}&redirect_uri=${"http%3a%2f%2fanonymous.lodidc.cn%2findex.html"}&response_type=code&scope=snsapi_base&state=1#wechat_redirect`;
    // window.location.href = getCodeUrl;
  },

  methods: {
    async visitor(session){
      let data = {
        visitor_uid:this.uid,
        session:session
      }
      await registerVisitor(data)
    },

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

    getBlock(session) {
      let that = this;
      let data = {
        session: session,
        uid: that.getUrlCode().id,
      };
      judgeBlock(data).then((res) => {
        if (res.err_code === 1001) {
          that.getBlock();
        }
        that.isBlock = res.data.is_block;
      });
    },

    get_Order(session) {
      let that = this;
      getOther({
        session: session,
        uid: that.getUrlCode().id,
      }).then((res) => {
        if (res.err_code === 1001) {
          that.get_Order();
        }
        that.nickName = res.data.nickName;
      });
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

    commit() {
      if (this.letterContent + "" == "") {
        this.$Notify({ type: "warning", message: "请输入内容" });
      } else {
        let data = {
          content: this.letterContent,
          uid: this.getUrlCode().id,
          session: localStorage.getItem("session"),
        };
        sendLetter(data).then((res) => {
          if (res.err_code === 0) {
            this.isDialog = "success";
            this.letterContent = ''
            this.$Notify({ type: 'success', message: '发送成功' });
          }
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.edit_container {
  overflow-y: auto;
  background: url("../assets/headerBg.jpg");
  padding: 0 25px 25px;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  & > .footer_text {
    padding: 15px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.5);
    img {
      width: 16px;
      height: 16px;
      margin-right: 3px;
    }
    & > div:nth-child(1) {
      margin-right: 25px;
    }
    & > div:nth-child(2) {
      flex: 1;
      display: flex;
      justify-content: space-between;
      color: #4c78d5;
    }
  }
  & > .header {
    display: flex;
    height: 77px;
    justify-content: space-between;
    align-items: center;
    & > div:first-child {
      color: rgba(255, 255, 255, 100);
      font-size: 16px;
    }
    img {
      width: 100px;
      height: 30px;
    }
  }
  .content {
    height: 390px;
    background: white;
    border-radius: 8px;
    padding: 20px;
    & > textarea {
      border: 0;
      height: 100%;
      width: 100%;
      color: black;
      font-size:15px;
    }
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
  .white_btn {
    background: white;
    color: black;
  }
  .tips {
    color: rgba(255, 255, 255);
    font-size: 12px;
    text-align: center;
    opacity: 0.5;
    margin-top: 25px;
  }
  .isBlock {
    width: 225px;
    height: 225px;
    margin: 110px auto;
    text-align: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
  & > .successDialog {
    display: flex;
    flex-direction: column;
    align-items: center;
    & > .tipsBtn {
      display: flex;
      flex-direction: column;
      align-items: center;
      & > .text {
        margin-bottom: 50px;
      }
    }
    //   & > img {
    //     position: absolute;
    //     left: 15px;
    //     height: 50%;
    //     transform: translateY(-50%);
    //   }
    //   &> .text{
    //     position:absolute;
    //     right:15px;
    //     height:50%;
    //     transform: translateY(-50%);

    //   }
    // }
    & > .weapp {
      display: flex;
    }
    & > div:nth-child(1) {
      font-size: 13px;
      img {
        height: 65px;
        width: 65px;
        margin-bottom: 8px;
      }
    }
    & > div:nth-child(2) {
      margin-bottom: 50px;
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