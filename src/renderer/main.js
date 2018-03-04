import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

import VueI18n from 'vue-i18n'

Vue.use(iView);
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh-CN',    // 语言标识
  messages: {
    'zh-CN': require('./lang/zh'),   // 中文语言包
    'en-US': require('./lang/en')    // 英文语言包
  }
})

// require static files here
require('./assets/katex.min.css')
require('./assets/prism.css')
require('./assets/prism.js')

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  i18n,
  router,
  template: '<App/>'
}).$mount('#app')
