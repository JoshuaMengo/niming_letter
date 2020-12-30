import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'lib-flexible/flexible'
import store from './store'

import { Dialog,ImagePreview,Uploader,Notify,PullRefresh,List } from 'vant';


Vue.config.productionTip = false
import VueCanvasPoster from 'vue-canvas-poster'

// 注册组件库
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(VueCanvasPoster)
Vue.use(Uploader);

// Vue.use(QRCode);
Vue.config.ignoredElements = ['wx-open-launch-weapp']
Vue.prototype.$Dialog = Dialog
Vue.prototype.$Notify = Notify
Vue.prototype.$ImagePreview = ImagePreview


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

