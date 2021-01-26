<template>
  <div class="setPhone">
    <div class="header">
      <img
        style="height: 30px; margin: 20px 0 0 20px; width: 100px"
        src="@/assets/headerLogo.png"
      />
    </div>
    <div class="content">
      <img src="@/assets/v2_qmihq9.png" />
      <div class="text">绑定手机号</div>
      <div class="phone">
        <input v-model="phone" placeholder="请输入收到短信的手机号" />
      </div>
      <div class="code" v-show="!isSend">
        <input placeholder="输入图中数字" v-model="codeValue" />
      </div>

      <div class="phoneCode" v-show="isSend">
        <input placeholder="请输入验证码" v-model="phoneCode" />
        <div v-show="!sendAgain">{{ downNum }}s可重发</div>
        <div class="sendAgain" v-show="sendAgain" @click="send_again()">
          重发
        </div>
      </div>

      <div @click="changeCode()">
        <Sidentify
          v-show="identifyCode != null && !isSend"
          :identifyCode="identifyCode"
          @makedCode="getMakedCode"
        />
      </div>

      <div class="btn" @click="isSend ? bindPhone() : checkCode()">
        {{ !isSend ? "获取验证码" : "绑定" }}
      </div>
      <div class="tips">一个ID只能绑定一个手机号哦，绑定后不能修改</div>
    </div>
  </div>
</template>

<script>
import Sidentify from "@/components/sidentify.vue";
import { createSnsCode, login, updatePhone } from "@/api/api";
import { checkPhone } from "@/utils/index";
import { getUrlCode } from "@/utils/index.js";

export default {
  components: {
    Sidentify,
  },
  data() {
    return {
      codeValue: "", //用户输入的验证码
      phone: "",
      isGetCode: false,
      // 验证码初始值
      identifyCode: "1234",
      // 验证码的随机取值范围
      identifyCodes: "1234567890",
      phoneCode: "",
      isSend: false,
      downNum: 15,
      sendAgain: false,
      phoneCode: "",
    };
  },

  async mounted() {
    //localstorage中也没有session 首次进入
    this.uid = getUrlCode().id;
    let code = getUrlCode().code;
    // if (code) return;
    if (
      !localStorage.getItem("session") ||
      localStorage.getItem("session") === undefined
    ) {
      if (code) {
        //已经通过非静默授权重定向过来
        login(code).then((result) => {
          //设置uid和session到localstorage并用返回到的session继续请求
          localStorage.setItem("session", result.data.session);
          localStorage.setItem("uid", result.data.uid);
          // this.getDataDetail(this.$route.query.qid, result.data.session);
          // this.readLetter(result.data.session, result.data.uid);
        });
        return; //return掉 不再走授权
      }
      //非静默授权
      var url = encodeURIComponent(window.location.href);
      var getCodeUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9dedc2998c430f2e&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
      window.location.href = getCodeUrl;
    } else {
      // 已经有session,用localstorage的session来请求 别的业务逻辑
    }
    // let data = this.$md5(this.passWord)
    // 刷新页面就生成随机验证码
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },
  methods: {
    //绑定手机号码
    bindPhone() {
      updatePhone({
        code: this.phoneCode,
        phone: this.phone,
        session: localStorage.getItem("session"),
      }).then((res) => {
        this.$Notify({ type: "success", message: "绑定成功" });
        setTimeout(() => {
          this.$router.push("/Home");
        }, 1000);
      });
    },

    send_again() {
      //重发验证码
      this.isSend = true;
      this.send();
      let inteval = setInterval(() => {
        if (this.downNum === 0) {
          clearInterval(inteval);
          this.sendAgain = true;
        } else {
          this.downNum = this.downNum - 1;
        }
      }, 1000);
    },

    checkCode() {
      if (checkPhone(this.phone) === false) return;
      console.log(this.identifyCode, this.codeValue, "-=-=");
      if (this.identifyCode == this.codeValue) {
        //调用发送验证码
        this.isSend = true;
        this.send();
        let inteval = setInterval(() => {
          if (this.downNum === 0) {
            clearInterval(inteval);
            this.sendAgain = true;
          } else {
            this.downNum = this.downNum - 1;
          }
        }, 1000);
      }
    },

    //发送验证码
    send() {
      //验证手机号码格式
      if (checkPhone(this.phone) === false) {
      } else {
        createSnsCode({
          session: localStorage.getItem("session"),
          phone: this.phone,
        }).then((res) => {
          if (res.err_code === 0) {
            this.$Notify({ type: "success", message: "验证码已发送" });
          }
        });
      }
    },

    getMakedCode(code) {
      this.identifyCodea = code;
      console.log("getMakedCode:", this.identifyCode);
    },

    changeCode() {
      this.$nextTick(() => {
        this.identifyCode = "";
        this.makeCode(this.identifyCodes, 4);
      });
    },
    // 生成一个随机整数  randomNum(0, 10) 0 到 10 的随机整数， 包含 0 和 10
    randomNum(min, max) {
      max = max + 1;
      return Math.floor(Math.random() * (max - min) + min);
    },
    // 随机生成验证码字符串
    makeCode(data, len) {
      for (let i = 0; i < len; i++) {
        this.identifyCode += data[this.randomNum(0, data.length - 1)];
      }
    },
  },
};
</script>

<style lang="less" scoped>
.setPhone {
  height: 100vh;
  background: black;
  display: flex;
  flex-direction: column;
  .header {
    height: 90px;
  }
  .content {
    border-radius: 20px 20px 0px 0px;
    flex: 1;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      height: 25px;
      width: 25px;
      margin: 38px 0 10px;
    }
    .text {
      color: rgba(16, 16, 16, 100);
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 55px;
    }
    input {
      border-radius: 6px;
      border: 1px solid rgba(16, 16, 16, 0.1);
      height: 50px;
      line-height: 50px;
      color: rgba(16, 16, 16, 0.5);
    }
    .phone {
      margin-bottom: 15px;
      & > input {
        width: 225px;
        padding: 0 20px;
      }
    }
    .code {
      width: 265px;
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      & > input {
        width: 225px;
        padding: 0 20px;
      }
      & > div {
        flex: 1;
        text-align: center;
        color: rgba(0, 0, 0, 1);
        font-size: 13px;
        font-weight: bold;
      }
    }
    .phoneCode {
      width: 265px;
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      & > input {
        width: 140px;
        padding: 0 20px;
        margin-right: 5px;
      }
      & > div {
        flex: 1;
        text-align: center;
        color: rgba(0, 0, 0, 1);
        font-size: 13px;
        font-weight: bold;
      }
      & > .sendAgain {
        flex: 1;
        background: black;
        color: white;
        line-height: 50px;
        height: 50px;
        border-radius: 6px;
        font-size: 14px;
        text-align: center;
      }
    }

    .btn {
      margin-top: 105px;
      width: 265px;
      height: 46px;
      line-height: 46px;
      border-radius: 50px;
      background-color: rgba(0, 0, 0, 1);
      color: rgba(255, 255, 255, 1);
      font-size: 15px;
      text-align: center;
    }
    .tips {
      margin-top: 10px;
      color: rgba(16, 16, 16, 0.35);
      font-size: 12px;
    }
  }
}
</style>