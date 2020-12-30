<template>
  <div class="recyclesBin">
    <div class="header">
      <div @click="$router.go(-1)"><img src="../assets/wgoback.png" /></div>
      <div>
        <!-- <img src="../assets/v2_qiwqyb.png"/> -->
        屏蔽列表
      </div>
    </div>

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      v-if="list.length > 0"
    >
      <div class="content">
        <div v-for="(item, index) in list" :key="index" class="list_item">
          <div>
            {{ item.letter.content }}
          </div>
          <div @click="blockUser(item.user)">还原</div>
        </div>
      </div>
    </van-list>

    <div v-else class="tips">
      <img style="height: 125px; width: 125px" src="../assets/v2_qkch4a.png" />
      <div>暂无内容</div>
    </div>
  </div>
</template>

<script>
import { queryBlacklist, blockUid } from "@/api/api";
export default {
  data() {
    return {
      list: [],
      isShow: true,
      finished: false,
      loading: false,
      pageIndex: 0,
    };
  },
  async created() {
    await this.getDelList();
  },
  methods: {
    async getDelList() {
      const res = await queryBlacklist({
        session: localStorage.getItem("session"),
        page_index: this.pageIndex,
      });
      this.list = res.data.list;
    },

    async onLoad() {
      this.pageIndex += 1;
      const res = await queryBlacklist({
        session: localStorage.getItem("session"),
        page_index: this.pageIndex,
      });
      if (res.data.list.length > 0) {
        this.list = this.list.push(res.data.list);
      } else {
        this.finished = true
      }
    },

    blockUser(data) {
      let that = this;
      let session = localStorage.getItem("session");
      this.$Dialog
        .confirm({
          title: "注意",
          message: "是否取消屏蔽该用户",
        })
        .then(() => {
          // on confirm
          blockUid({ id: data.uid, session: session }).then((res) => {
            console.log(res);
            if (res.err_code === 0) {
              this.$Notify({ type: "success", message: "已取消屏蔽该用户" });
              this.getDelList();
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style lang="less" scoped>
.recyclesBin {
  & > .header {
    height: 70px;
    background: url("../assets/headerBg.jpg");
    // position: relative;
    padding: 20px;
    & > div:nth-child(1) {
      margin-bottom: 20px;
      img {
        width: 60px;
        height: 24px;
      }
    }
    & > div:nth-child(2) {
      color: white;
      font-size: 20px;
    }
  }
  &  .content {
    // background: red;
    & > .list_item {
      padding: 20px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(244, 245, 245, 100);
      & > div:nth-child(1) {
        flex: 1;
        color: rgba(0, 0, 0, 0.35);
        font-size: 15px;
      }
      & > div:nth-child(2) {
        width: 40px;
        color: rgba(16, 16, 16, 100);
        font-size: 14px;
      }
    }
  }
  & > .tips {
    margin-top: 100px;
    display: flex;
    align-items: center;
    flex-direction: column;
    color: rgba(16, 16, 16, 35);
    font-size: 14px;
  }
}
</style>