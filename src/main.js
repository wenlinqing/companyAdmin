import Vue from 'vue'
import App from './App'
import router from './router'

import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


Vue.use(ElementUI)
Vue.use(Vuex)

import YDUI from 'vue-ydui';
// import 'vue-ydui/dist/ydui.rem.css';
import 'vue-ydui/dist/ydui.px.css'; 
Vue.use(YDUI);


/*this.$dialog.toast({
  mes: err.msg,
  timeout: 1500,
  icon: 'error',
  callback: () => {
      this.$dialog.alert({mes: '给你一次重来的机会！'});
  }
});*/


Vue.filter('formatDate',function(time){
  return moment(time).format('YYYY-MM-DD HH:mm:ss')
})

import moment from 'moment'
window.moment=moment;



import VueQuillEditor  from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 
Vue.use(VueQuillEditor);


import 'font-awesome/css/font-awesome.min.css'

import api from '@/api/index'
Vue.prototype.$api=api


Vue.prototype.GLOBAL={
  host:window.location.protocol+'//'+window.location.hostname+':3000',
  upLoadHost:window.location.protocol+'//'+window.location.hostname+':3000'+'/api/uploads/',
  imgUrl:window.location.protocol+'//'+window.location.hostname+':3000'+'/public/upload/'
}



Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
