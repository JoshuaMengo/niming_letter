<template>
  <div class="poster">
    <div class="goback" @click="$router.go(-1)">
      {{ gobacktext }}
    </div>

    <div class="content" ref="imageWrapper" v-show="!dialogTableVisible">
      <img src="../assets/v2_qiyjex.png" />
      <div class="nickName">{{ userInfo.nickName }}</div>
      <div class="avatar">
        <img :src="userInfo.avatarUrl" crossOrigin="anonymous" />
      </div>
      <div id="qrcode_box" ref="code" class="code"></div>
    </div>

    <div class="content" v-show="dialogTableVisible">
      <img :src="downImg" />
    </div>
    <div class="tips">长 按 保 存 海 报 并 分 享 到 朋 友 圈</div>

    <div class="loading" @click.stop="" v-show="isloading">
      <van-loading size="30" />
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import html2canvas from "html2canvas";
import { getUser } from "@/api/api";
export default {
  data() {
    return {
      downImg: "",
      dialogTableVisible: false,
      userInfo: {},
      gobacktext: "<返回",
      isloading:true
    };
  },

  async mounted() {
    await this.getUserInfo();
    await this.Qrcode();
    await this.download();
  },

  methods: {
    async getUserInfo() {
      const res = await getUser(localStorage.getItem("session"));
      this.userInfo = res.data;
    },

    Qrcode() {
      let w = String(
        parseInt(window.getComputedStyle(this.$refs.code).width)
      ).replace("px", "");
      let h = String(
        parseInt(window.getComputedStyle(this.$refs.code).height)
      ).replace("px", "");

      let qrcode = new QRCode("qrcode_box", {
        width: w, //二维码的宽度
        height: h, //二维码的高度
        text:
          "http://anonymous.lodidc.cn/niming_letter?id=" + this.userInfo.uid, // 二维码地址
        colorDark: "#000", //二维码颜色
        colorLight: "#fff", //二维码背景颜色
        size: "includes",
      });
    },

    toImage() {
      const opts = {
        useCORS: true,
        taintTest: true, // 在渲染前测试图片
        timeout: 500, // 加载延时
        backgroundColor: red,
        scrollY: 0,
        width: htmlDom.clientWidth, //dom 原始宽度
        height: htmlDom.clientHeight,
      };

      html2canvas(this.$refs.imageWrapper, opts, { allowTaint: true }).then(
        (canvas) => {
          let dataURL = canvas.toDataURL("image/png");
          this.downImg = dataURL;
          if (this.downImg !== "") {
            this.dialogTableVisible = true;
          }
        }
      );
    },

    download() {
      var that = this;
      window.pageYOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setTimeout(function () {
        html2canvas(that.$refs.imageWrapper, {
          backgroundColor: null,
          scrollY: 0,
          useCORS: true,
          taintTest: true, // 在渲染前测试图片
        }).then((canvas) => {
          let dataURL = canvas.toDataURL("image/png");
          that.downImg = dataURL;
          that.dialogTableVisible = true;
          that.isloading = false
        });
      }, 500);
    },
  },
};
</script>

<style lang="less" scoped>
.poster {
  padding: 0 20px 20px;
  // position:fixed;
  // top:0;
  // right:0;
  // left:0;
  // bottom:0;
  .loading {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.65);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .create_porster {
    margin: 20px auto;
    color: black;
    background: white;
    width: 80% !important;
    height: 40px;
    line-height: 40px;
    border-radius: 5px;
    text-align: center;
  }
  .goback {
    display: inline-block;
    width: 60px;
    height: 30px;
    background: black;
    color: white;
    margin: 15px 0;
    border-radius: 50px;
    text-align: center;
    line-height: 30px;
  }
  & > .content {
    position: relative;
    height: 497px !important;
    & > img {
      width: 100%;
    }
    & > .avatar {
      position: absolute;
      border-radius: 50%;
      height: 58px;
      width: 58px;
      top: 23px;
      left: 30px;
      overflow: hidden;
      // z-index:999!important;
      & > img {
        height: 100%;
        width: 100%;
      }
    }
    & > .nickName {
      position: absolute;
      color: white;
      font-size: 15px;
      left: 30px;
      top: 100px;
    }
    & > .code {
      height: 70px !important;
      width: 70px !important;
      position: absolute;
      left: 50%;
      top: 75.2%;
      transform: translateX(-50%);
    }
  }
  .tips {
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
  }
  & > .dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: rgba(244, 245, 245, 100);
    text-align: center;
    font-size: 14px;
    img {
      width: 300px;
      margin-bottom: 20px;
    }
    // & > div {
    //   position: absolute;
    //   left: 0;
    //   right: 0;
    //   top: 0;
    //   bottom: 0;
    //   height: 100%;
    //   width: 100%;
    // }
    // & > img {
    //   position: absolute;
    //   left: 50%;
    //   top: 50%;
    //   transform: translate(-50%, -50%);
    //   width: 80%;
    // }
  }
}
</style>