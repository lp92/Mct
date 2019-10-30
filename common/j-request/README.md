#####################################################网络访问
|参数            |类型(默认值)                | 必填    |  说明 |
| -------------- |:--------------------:|:----------:|:-----------:|
| debug          |boolean(false)        |否          | 是否开启debug模式，在此模式下，所有的请求都会打印请求参数，响应对象或错误信息
| baseUrl        |String('')            |否          | 接口请求基地址
| contentType    |String('json')        |否          | 请求类型可选值为`json`、`form`、`file`、`text`、`html`
| encoding       |String('utf-8')       |否          | 请求编码，默认为utf-8
| business       |String('data')        |否          | 接口响应的业务数据对象字段名，默认为data，如果返回整个业务对象，则需要设置为undefined
| skipInterceptorResponse        |Boolean(false)     |否          | 是否跳过响应过滤器，如需跳过，请置true
| slashAbsoluteUrl               |Boolean(false)     |否          | 是否视以/开头的url为绝对地址，默认为false，此设置仅当初步判断url为非绝对地址时有效
| loadingTip                     |string(undefined)  |否          | 是否在请求前显示文字为参数值的loading提示，如果是，会在请求结束后自动关闭loading提示
| loadingDuration                |Number(500)        |否          | 设置loadingTip时的最小loading显示时间

示例

``` js
import request from './request.js'
console.log(request);
var baseUrl = 'http://api.ieclipse.cn/wnl/'
// #ifdef H5
baseUrl = '/wnl/'
// #endif
request.setConfig({
    baseUrl: baseUrl,
    debug: true
})

// 把request作为全局对象，这样小程序也可以用了
Vue.prototype.$request = request
```

### 拦截器配置

#### 请求拦截

可以给请求添加一些全局参数及自定义的配置

```js
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

```

#### 响应拦截

当http请求成功（响应码为200）后的响应拦截，可以根据状态码统一判断业务请求是否成功，如果成功，请设置一个success=true的标志位

```js
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

```

#### 错误处理

当http请求失败或业务请求失败的处理，

```js

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


```

### 使用

#### 使用Callback

``` js
        example1(full) {
            var that = this;
            this.$request.get({
                url: 'lunar',
                business: full ? null : 'data',
                success: res => {
                    console.log('success');
                    that.json = JSON.stringify(res);
                },
                fail: res => {
                    console.log('failure');
                    that.json = JSON.stringify(res);
                }
            });
        }
```
### 使用Promise

``` js
        example2() {
            var that = this;
            this.$request
                .post({
                    url: 'solar',
                    loadingTip: '接口请求中...'
                })
                .then(
                    res => {
                        console.log('success');
                        that.json = JSON.stringify(res);
                    },
                    res => {
                        console.log('failure');
                        that.json = JSON.stringify(res);
                    }
                );
        },

```
### 文件上传

如果参数中没有formData，那么会将data作为formData，对于返回的接口数据，会尝试做一次JSON.parse转为json对象。

```js
        pickerImg() {
            var that = this;
            uni.chooseImage({
                count: 1,
                success: function(res) {
                    console.log(res);
                    var path = res.tempFilePaths[0];
                    that.upload(path);
                }
            });
        },
        upload(path) {
            var that = this;
            var tokenUrl = 'http://api.ieclipse.cn/smartqq/upload/token';
            // #ifdef H5
            tokenUrl = '/smartqq/upload/token';
            // #endif
            that.$request
                .get({
                    url: tokenUrl,
                    slashAbsoluteUrl: true
                })
                .then(res => {
                    that.json = JSON.stringify(res);
                    var uploadTask = that.$request
                        .upload({
                            url: 'http://upload.qiniu.com',
                            filePath: path,
                            name: 'file',
                            business: null,
                            skipInterceptorResponse: true,
                            data: {
                                token: res.token
                            },
                            progress: (res2, task) => {
                                let p = '上传进度: ' + res2.totalBytesSent + '/' + res2.totalBytesExpectedToSend + ' (' + res2.progress + '%)';
                                this.json = p;
                                console.log(p);
                                // 测试条件，取消上传任务。
                                if (res2.progress > 50) {
                                    //uploadTask.abort();
                                }
                            }
                        })
                        .then(res2 => {
                            console.log(res2);
                            that.logo = res.domain + '/' + res2.key;
                            console.log(that.logo);
                        })
                        .catch(res2 => {
                            console.log(res2);
                        });
                });
        }
```
#####################################################权限
- ios'location'位置权限'camera'摄像头权限'photoLibrary'相册权限'record'麦克风权限push推送权限contact通讯录权限calendar日历权限memo备忘录权限
- android
'android.permission.ACCESS_FINE_LOCATION'位置权限
'android.permission.ACCESS_COARSE_LOCATION'模糊位置权限(蓝牙\ble依赖)
'android.permission.CAMERA'摄像头权限
'android.permission.READ_EXTERNAL_STORAGE'外部存储(含相册)读取权限
'android.permission.WRITE_EXTERNAL_STORAGE'外部存储(含相册)写入权限
'android.permission.RECORD_AUDIO'麦克风权限
'android.permission.READ_CONTACTS'通讯录读取权限
'android.permission.WRITE_CONTACTS'通讯录写入权限
'android.permission.READ_CALENDAR'日历读取权限
'android.permission.WRITE_CALENDAR'日历写入权限
'android.permission.READ_SMS'短信读取权限
'android.permission.SEND_SMS'短信发送权限
'android.permission.RECEIVE_SMS'接收新短信权限
'android.permission.READ_PHONE_STATE'获取手机识别码等信息的权限
'android.permission.CALL_PHONE'拨打电话权限
'android.permission.READ_CALL_LOG'获取通话记录权限 
'android.permission.INTERNET'网络