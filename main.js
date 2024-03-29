import Vue from 'vue'
import App from './App'
import request from './common/j-request/request.js'
var baseUrl = 'http://rap2api.taobao.org/app/mock/234567/w/'
// // #ifdef H5
// baseUrl = '/wnl/'
// // #endif
request.setConfig({
    baseUrl: baseUrl,
    debug: true,
	contentType:'json',
	encoding:'utf-8',
	//skipInterceptorResponse:true,//是否跳过过滤器
	//business:"data"//接口响应的业务数据对象字段名，默认为data，如果返回整个业务对象，则需要设置为undefined
})
// 请求拦截
request.interceptor.request = (config => {
    // 给data添加全局请求参数uid
    if (!config.data.uid) {
        config.data.uid = 100
    }
    // 给header添加全局请求参数token
    if (!config.header.token) {
        config.header.token = 'my_token'
    }
    // 添加一个自定义的参数，默认异常请求都弹出一个toast提示
    if (config.toastError === undefined) {
        config.toastError = true
    }
    return config;
})
// 全局的业务拦截
request.interceptor.response = ((res, config) => {
    if (res.code === 0) {
        res.success = true;
    } else if (res.code === 1001) {
        // token失效，需要重新登录
        uni.navigateTo({
            url: '/pages/loign/login'
        })
    }
    return res;
})
// 全局的错误异常处理
request.interceptor.fail = ((res, config) => {
    let ret = res;
    let msg = ''
    if (res.statusCode === 200) { // 业务错误
        msg = res.data.msg
        ret = res.data
    } else if (res.statusCode > 0) { // HTTP错误
        msg = '服务器异常[' + res.statusCode + ']'
    } else { // 其它错误
        msg = res.errMsg
    }
    if (config.toastError) {
        uni.showToast({
            title: msg,
            duration: 2000,
            icon: 'none'
        })
    }
    return ret;
})

Vue.prototype.$request = request

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
