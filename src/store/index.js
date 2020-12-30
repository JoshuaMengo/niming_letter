import Vue from 'vue'
import Vuex from 'vuex'

//挂载Vuex
Vue.use(Vuex)

//创建VueX对象
const store = new Vuex.Store({
    state:{
        //存放的键值对就是所要管理的状态
        name:'helloVueX',
        showLoading:true,
        activeTabbarIndex:1,
        uid:''
    },
    mutations:{
        //es6语法，等同edit:funcion(){...}
        changeShowLoading(state){
            state.showLoading = false
        },
        changeTabbarIndex(state,index){
            state.activeTabbarIndex = index
        },
        setId(state,id){
            state.uid = id
        }
    }
})

export default store