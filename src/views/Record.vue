<template>
  <div class="record_container">
    <div class="header">
      <div @click="$router.go(-1)"><img src="../assets/wgoback.png" /></div>
      <div>访客记录</div>
      <div>包含仅访问未留言的好友</div>
    </div>
    <div class="recordList" v-if="list">
      <div class="record_iem" v-for="(item,index) in list" :key="index">
        <div><img :src="item.avatarUrl"/></div>
        <div>周星星</div>
      </div>
    </div>
  </div>
</template>

<script>
import {queryVisitor} from '@/api/api'
export default {
  name:'record',
  data(){
    return{
      list:[]
    }
  },
  async created(){
    await this.getList()
  },
  methods:{

    async getList(){
      let session = localStorage.getItem('session')
      const res = await queryVisitor({session:session,page_index:0})
      console.log(res)
      this.list = res.data
    }
  }
};
</script>

<style lang="less" scoped>
body,html{
    background:white!important;
}
.record_container {
  & > .header {
    background: url("../assets/headerBg.jpg");
    height: 90px;
    width: 100%;
    padding: 20px;
    color: white;
    & > div:nth-child(1) {
      width: 60px;
      height: 24px;
      margin-bottom: 20px;
      & > img {
        width: 100%;
        height: 100%;
      }
    }
    & > div:nth-child(2) {
      font-size: 20px;
      font-weight: bold;
    }
    & > div:nth-child(3) {
      opacity: 0.6;
      font-size: 12px;
    }
  }
  & > .recordList {
    padding: 0 20px;
    & > .record_iem {
      height: 70px;
      display: flex;
      align-items: center;
      color: rgba(16, 16, 16, 100);
      border-bottom: 1px solid #f1f1f1;
      font-size: 15px;
      & > div:first-child {
        height: 40px;
        width: 40px;
        border-radius: 50%;
        background: black;
        margin-right: 10px;
        img{
          height:100%;
          width:100%;
        }
      }
    }
  }
}
</style>