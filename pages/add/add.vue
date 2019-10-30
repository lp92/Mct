<template>
	<view>
		<view class="uni-padding-wrap">
			<form @submit="formSubmit" @reset="formReset" ref="form">
				<view>
					<view class="uni-title">金额</view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<input class="uni-input" name="tjine" type="digit" placeholder="请填写金额" />
						</view>
					</view>
				</view>
				<view>
					<view class="uni-title">类别</view>
					<radio-group class="uni-flex" name="ttype">
						<label>
							<radio value="类别1" />类别1</label>
						<label>
							<radio value="类别2" />类别2</label>
						<label>
							<radio value="类别3" />类别3</label>
					</radio-group>
				</view>
				<view>
					<view class="uni-title" @tap="opendata">时间</view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<input class="uni-input" v-model="times" name="ttime" @tap="opendata" placeholder="请选择时间" disabled="false" />
						</view>
					</view>
				</view>
				<view>
					<view class="uni-title">方式</view>
					<radio-group class="uni-flex" name="tleibie">
						<label>
							<radio value="方式1" />方式1</label>
						<label>
							<radio value="方式2" />方式2</label>
						<label>
							<radio value="方式3" />方式3</label>
					</radio-group>
				</view>
				<view>
					<view class="uni-title">备注</view>
					<view class="uni-textarea">
						<textarea placeholder="请输入备注" name="tyjl" /></view>
				</view>
				<view class="uni-btn-v uni-common-mt">
					<button class="btn-submit" formType="submit" type="primary">保存</button>
					<button type="default" formType="reset">重置</button>
				</view>
			</form>
		</view>
		<uni-calendar ref="calendar" :insert="false" :lunar="false" @confirm="confirm"></uni-calendar>
	</view>
</template>
<!-- 时间选择器  date当前日期（2019-06-27 ），lunar,显示农历，disableBefore禁用今天之前，startDate日期选择范围开始，range范围选择，insert
 true弹窗，false插入模式，，selected打点[{date: '2019-06-27', info: '签到', data: { custom: '自定义信息', name: '自定义消息头',xxx:xxx... }}]-->
<script>
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	//来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
	var graceChecker = require("../../common/graceChecker.js");
	export default {
		components: {
			uniCalendar
		},
		data() {
			return {
				times:''
			}
		},
		methods: {
			formSubmit: function(e) {
				var rule = [{
						name: "tjine",
						checkType: "reg",
						checkRule: "^(([1-9]\\d*)|([0-9]\\d*\\.\\d?[1-9]{1}))$",
						errorMsg: "请填写金额"
					},
					{
						name: "ttype",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请选择类别"
					},
					{
						name: "ttime",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请选择时间"
					}
				];
				//进行表单检查
				var formData = e.detail.value;
				var checkRes = graceChecker.check(formData, rule);
				if (checkRes) {
				console.log("----表单验证通过");
					this.httpx(formData);
					
				} else {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				}
			},
			formReset: function(e) {
			},
			confirm:function(e){
				this.times=e.fulldate;
			},
			//网络请求start
			async httpx(fe) { //成功请求（Promise)
				request.setConfig({
					contentType: 'json',
					encoding: 'utf-8',
					skipInterceptorResponse: true, //是否跳过过滤器
					business: null //接口响应的业务数据对象字段名，默认为data，如果返回整个业务对象，则需要设置为undefined
				});
				var that = this;
				var res = await request
					.post({
						url: 'getlist',
						 data: {
						        page: that.xpage
						 }
					})
					.then(
						res => {							
							if (res.code == 1) {
								uni.showToast({
									title: res.msg,
									icon: 'none'
								});
							} else {
								if(that.xpage==1){
									this.xlist=[];
								}
								let list = res.data;
								if (Object.keys(list).length != 0) {
									// for (let i = 1; i <= Object.keys(list).length; i++) {
									// 	let item = Object.assign({}, newsData);
									// 	item.id = this.newGuid();
									// 	list.push(item);
									// }
									that.xlist = that.xlist.concat(list);
									console.log("-2:--"+Object.keys(that.xlist).length)
								}
							}
							that.xpage+=1;
							console.log("---page:"+that.xpage)
							that.enrefresh();
						},
						res => {
							console.log('failure：' + JSON.stringify(res));
							that.enrefresh();
						}
					);
			},
			//网络请求end
			
		}
	}
</script>

<style>

</style>
