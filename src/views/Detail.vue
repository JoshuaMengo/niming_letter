<template>
  <div class="detail_container" @click="showBox = false">
    <div class="header">
      <div @click="$router.go(-1)"><img src="../assets/goback.png" /></div>
      <div>
        <img @click.stop="showBox = !showBox" src="../assets/v2_qkapiz.png" />
        <div v-if="showBox">
          <div class="box">
            <li
              v-if="is_receive"
              @click.stop="(dialogValue = 'del'), (showBox = false)"
            >
              删除
            </li>
            <li @click.stop="(dialogValue = 'block'), (showBox = false)">
              屏蔽该用户
            </li>
            <li @click.stop="$router.push('/report')">举报</li>
          </div>
          <div class="triangle"></div>
        </div>
      </div>
    </div>

    <div v-if="letterData.content">
      <div class="contentbox">
        <div>
          <div>{{ letterData.user.nickName }} 收</div>
          <div>{{ letterData.has_read ? "已读" : "未读" }}</div>
          <div>
            {{ letterData.content }}
          </div>
          <div>{{ is_receive ? "匿名好友" : "匿名发送" }}</div>
          <div>{{ letterData.create_time }}</div>
        </div>
      </div>

      <div class="replay" v-if="letterData.have_reply">
        <div>
          <div v-if="!is_receive">
            <img :src="letterData.user.avatarUrl" />
          </div>
          <div>
            {{
              !is_receive
                ? letterData.user.nickName + "回复:"
                : letterData.have_reply
                ? "已回复"
                : ""
            }}
          </div>
        </div>
        <div>{{ letterData.reply }}</div>
      </div>
      <div v-else>
        <div v-if="is_receive">
          <div class="replay" v-if="is_receive && !letterData.has_reply">
            <div>
              <textarea v-model="letterContent" placeholder="输入回复内容..." />
            </div>
          </div>
          <div>{{ letterData.reply }}</div>
        </div>
        <div v-else class="noReply">
          <div>
            <img :src="letterData.user.avatarUrl" />
          </div>
          <div>{{ letterData.user.nickName }} 未回复</div>
        </div>
      </div>

      <div
        v-if="is_receive && !letterData.has_reply"
        @click="dialogValue = 'replay'"
        class="commit_btn"
      >
        回复
      </div>

      <div
        v-if="!is_receive && letterData.have_reply"
        class="again"
        @click="$router.push({ path: '/', query: { id: letterData.to_uid } })"
      >
        再写一封
      </div>
    </div>

    <div v-if="is_receive" class="tips">Tips：每封来信只能回复一次</div>

    <div class="blockDialog dialog" v-show="dialogValue === 'block'">
      <div class="dialog_bg"></div>
      <div class="content">
        <div>
          <div>是否屏蔽当前用户</div>
          <div>屏蔽后对方将无法给您留言</div>
        </div>
        <div>
          <div @click="dialogValue = false">取消</div>
          <div @click="block()">确定</div>
        </div>
      </div>
    </div>

    <div class="delDialog dialog" v-show="dialogValue === 'del'">
      <div class="dialog_bg"></div>
      <div class="content">
        <div>是否删除这封来信</div>
        <div>
          <div @click="dialogValue = false">取消</div>
          <div @click="deleteL()">确定</div>
        </div>
      </div>
    </div>

    <div class="isblockDialog dialog" v-show="dialogValue === 'isblock'">
      <div class="dialog_bg"></div>
      <div class="content">
        <div>
          <span>已屏蔽用户</span>
          <span>可进入“我的-屏蔽列表”查看</span>
        </div>
        <div>3s后 返回首页</div>
      </div>
    </div>

    <div class="replayDialog dialog" v-show="dialogValue === 'replay'">
      <div class="dialog_bg"></div>
      <div class="content">
        <div>
          <div>每封来信只能回复一次</div>
          <div>是否确定发送</div>
        </div>
        <div>
          <div @click="dialogValue = false">取消</div>
          <div @click="replyletter()">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  readLetter,
  getLetter,
  replyletter,
  blockUser,
  deleteLetter,
} from "@/api/api";
export default {
  name: "detail",
  data() {
    return {
      goBackText: "< 返回",
      letterData: {},
      lid: "",
      letterContent: "",
      showBox: false,
      dialogValue: "",
      is_receive: "",
    };
  },
  async mounted() {
    this.lid = this.$router.currentRoute.query.lid;
    this.is_receive =
      this.$router.currentRoute.query.is_receive == 1 ? true : false;
    this.session = localStorage.getItem("session");
    this.getLetter();
  },
  async created() {},
  methods: {
    async rLetter() {
      const res = await readLetter({
        session: this.session,
        lid: this.lid,
        is_receive: this.is_receive,
      });
      console.log(res);
    },

    async getLetter() {
      const res = await getLetter({
        session: this.session,
        lid: this.lid,
        is_receive:
          this.$router.currentRoute.query.is_receive == 1 ? true : false,
      });
      if (!res.data.has_read && this.is_receive) {
        this.rLetter();
      }else if(!res.data.has_read_reply && !this.is_receive){
        this.rLetter();
      }

      this.letterData = res.data;
    },

    // 删除来信
    deleteL() {
      let data = {
        session: this.session,
        lid: this.lid,
      };
      deleteLetter(data).then((res) => {
        this.$Notify({ type: "success", message: "删除成功" });
        this.$router.push("/home");
      });
    },

    //回复信息
    async replyletter() {
      let that = this;
      if (that.letterContent + "" === "") {
        that.$Notify({ type: "warning", message: "请输入回复内容" });
      } else {
        replyletter({
          session: this.session,
          lid: that.lid,
          content: that.letterContent,
          from_uid: that.letterData.from_uid,
        }).then((res) => {
          that.dialogValue = "";
          that.$Notify({ type: "success", message: "回复成功" });
          that.rLetter();
          that.getLetter();
        });
      }
    },

    //屏蔽用户
    block() {
      let that = this;
      blockUser({
        lid: that.letterData.lid,
        block_uid: that.letterData.from_uid,
        session: localStorage.getItem("session"),
      }).then((res) => {
        if (res.err_code === 0) {
          that.dialogValue = "isblock";
          setTimeout(() => {
            that.$router.push("/home");
          }, 3000);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.detail_container {
  & > .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    & > div:nth-child(1) {
      width: 60px;
      height: 30px;
      & > img {
        width: 100%;
        height: 100%;
      }
    }
    & > div:nth-child(2) {
      height: 22px;
      width: 22px;
      position: relative;
      img {
        height: 100%;
        width: 100%;
      }
      .box {
        bottom: -10px;
        right: -11px;
        transform: translateY(100%);
        position: absolute;
        background: #404040;
        padding: 5px 10px;
        color: rgba(244, 244, 244, 100);
        font-size: 13px;
        width: 75px;
        border-radius: 8px;
        li {
          list-style: none;
          text-align: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(94, 94, 94, 100);
        }
        li:last-child {
          border: 0;
        }
      }

      .triangle {
        position: absolute;
        bottom: -10px;
        right: 0;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #404040;
      }
    }
  }

  & .contentbox {
    margin: 0 20px;
    & > div:nth-child(1) {
      padding: 30px 20px 25px;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 15px;
      background: white;

      font-size: 16px;
      & > div:nth-child(1) {
        font-weight: bold;
        margin-bottom: 5px;
      }
      & > div:nth-child(2) {
        margin-bottom: 25px;
        font-size: 12px;
        color: #101010;
        opacity: 0.35;
      }
      & > div:nth-child(3) {
        letter-spacing: 2px;
        margin-bottom: 30px;
      }
      & > div:nth-child(4) {
        text-align: right;
      }
      & > div:nth-child(5) {
        text-align: right;
        font-size: 15px;
        margin-top: 10px;
        opacity: 0.8;
      }
    }
  }

  & .noReply > {
    margin: 0 20px;
    display: flex;
    height: 55px;
    border-radius: 50px;
    background-color: rgba(16, 16, 16, 100);
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 14px;
    & > div:nth-child(1) {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  & .tips {
    color: rgba(0, 0, 0, 0.35);
    font-size: 13px;
    text-align: center;
    margin-top: 20px;
  }

  & .commit_btn {
    height: 44px;
    line-height: 44px;
    border-radius: 6px;
    background-color: rgba(16, 16, 16, 100);
    color: rgba(255, 255, 255, 100);
    font-size: 15px;
    margin: 20px 20px 0;
    text-align: center;
  }
  & .replay {
    border-radius: 10px;
    padding: 20px 20px 25px;
    margin: 0 20px;
    background: white;
    font-size: 15px;

    & > div:nth-child(1) {
      display: flex;
      align-items: center;
      font-weight: bold;
      margin-bottom: 20px;
    }
    img {
      width: 25px;
      height: 25px;
      margin-right: 10px;
    }
    textarea {
      height: 75px !important;
      width: 100% !important;
      border: 0 !important;
    }
  }
  & .again {
    margin: 15px 20px 0;
    height: 44px;
    line-height: 44px;
    border-radius: 6px;
    background-color: rgba(16, 16, 16, 100);
    color: rgba(255, 255, 255, 100);
    font-size: 14px;
    text-align: center;
  }

  & .replayDialog {
    & > .content {
      & > div:nth-child(1) {
        font-size: 14px;
        & > div:nth-child(2) {
          font-weight: bolder;
          margin-top: 10px;
        }
      }
      & > div:nth-child(2) {
        display: flex;
        & > div:nth-child(1) {
          background-color: rgba(221, 221, 221, 100);
          color: rgba(16, 16, 16, 100);
        }
        div {
          width: 95px;
          height: 40px;
          line-height: 40px;
          background-color: rgba(16, 16, 16, 100);
          color: rgba(255, 255, 255, 100);
          font-size: 14px;
          border-radius: 5px;
          margin: 0 5px;
        }
      }
    }
  }

  & .delDialog {
    & > .content {
      & > div:nth-child(1) {
        color: rgba(16, 16, 16, 100);
        font-size: 16px;
        font-weight: bolder;
      }
      & > div:nth-child(2) {
        display: flex;
        div {
          width: 95px;
          height: 40px;
          line-height: 40px;
          background-color: rgba(16, 16, 16, 100);
          color: rgba(255, 255, 255, 100);
          font-size: 14px;
          border-radius: 5px;
          margin: 0 5px;
        }
        & > div:nth-child(1) {
          background-color: rgba(221, 221, 221, 100);
          color: rgba(16, 16, 16, 100);
        }
      }
    }
  }

  & .blockDialog {
    & > .content {
      & > div:nth-child(1) {
        font-size: 14px;
        & > div:nth-child(1) {
          font-weight: bolder;
          margin-bottom: 10px;
        }
      }
      & > div:nth-child(2) {
        display: flex;
        & > div:nth-child(1) {
          background-color: rgba(221, 221, 221, 100);
          color: rgba(16, 16, 16, 100);
        }
        div {
          width: 95px;
          height: 40px;
          line-height: 40px;
          background-color: rgba(16, 16, 16, 100);
          color: rgba(255, 255, 255, 100);
          font-size: 14px;
          border-radius: 5px;
          margin: 0 5px;
        }
      }
    }
  }

  & .isblockDialog {
    & > .content {
      & > div:nth-child(1) {
        span {
          display: block;
        }
        & > span:nth-child(1) {
          color: rgba(16, 16, 16, 100);
          font-size: 16px;
          margin-bottom: 20px;
          font-weight: bolder;
        }
        & > span:nth-child(2) {
          color: rgba(16, 16, 16, 50);
          font-size: 13px;
          opacity: 0.5;
        }
      }
      & > div:nth-child(2) {
        width: 145px;
        height: 40px;
        line-height: 40px;
        border-radius: 5px;
        background-color: rgba(16, 16, 16, 100);
        color: rgba(255, 255, 255, 100);
        font-size: 14px;
      }
    }
  }

  & > .dialog {
    position: fixed !important;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: 0 !important;
    & > .dialog_bg {
      background: black !important;
      height: 100%;
      width: 100%;
      opacity: 0.6 !important;
    }
    & > .content {
      margin: 0 !important;
      z-index: 999 !important;
      background: white;
      opacity: 1 !important;
      width: 285px;
      height: 220px;
      border-radius: 8px;
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>