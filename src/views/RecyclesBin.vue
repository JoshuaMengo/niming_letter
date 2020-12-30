<template>
  <div class="recyclesBin">
    <div class="header">
      <div @click="$router.go(-1)"><img src="../assets/wgoback.png" /></div>
      <div>
        <!-- <img src="../assets/v2_qiwqyb.png"/> -->
        回收站
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
            {{ item.content }}
          </div>
          <div @click="recover(item.lid)">还原</div>
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
import { queryDelete,recoverLetter} from "@/api/api";
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

    recover(lid){
      let that = this
      recoverLetter(
        {session:localStorage.getItem('session'),lid:lid}
      ).then(async res=>{
        await that.getDelList();
        that.$Notify({ type: "success", message: "还原成功" });
      })
    },

    async getDelList() {
      let session = localStorage.getItem("session");
      const res = await queryDelete({
        page_index: this.pageIndex,
        session: session,
      });
      this.list = res.data.list;
    },

    async onLoad() {
      this.pageIndex += 1;
      const res = await queryDelete({
        page_index: this.pageIndex,
        session: localStorage.getItem("session")
      });
      this.loading = false
      if (res.data.list.length > 0) {
        this.list = this.list.push(res.data.list);
      } else {
        this.finished = true;
      }
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
  & .content {
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