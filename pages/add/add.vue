<template>
	<view class="c">
		<view class="swiper_t"> <text class="tab-item-title" :class="tabIndex==index ? 'tab-item-title-active' : ''" v-for="(tab,index) in tabBars"
			 :key="tab.id" :id="tab.id" :data-current="index" @click="ontabtap">{{tab.name}}</text>
		</view>
		<view class="uni-padding-wrap">
					<form @submit="formSubmit" @reset="formReset" ref="form">
						<view>
							<view id="x12" class="uni-title">金额</view>
							<view class="uni-list">
								<view class="uni-list-cell">
									<input class="uni-input" name="tjine" type="digit" placeholder="请填写金额" />
								</view>
							</view>
						</view>

						<view class="swiper-box">
							<swiper :current="tabIndex" :duration="300" @change="ontabchange">
								<swiper-item class="swiper-item" v-for="(tab,index) in tabBars2" :key="index">
									<uni-grid :column="4" :hor="36" :ver="-21" :show-border="false" :square="true" :highlight="false">
										<uni-grid-item type="error" v-for="(xx,xindex) in tab.gridlist" :key="xindex">
											<image class="imagex" :src="xx.url" mode="aspectFill" @tap="changexx" :id="'u'+index+xindex" :data-xid1="index"
											 :data-xid2="xindex"></image>
											<text class="textx">{{xx.text}}</text>
										</uni-grid-item>
									</uni-grid>
								</swiper-item>
							</swiper>
							<view v-if="current != 0" :style="{'bottom':dots.bottom + 'px'}" class="uni-swiper__dots-box">
								<view v-for="(item,index) in tabBars3" :style="{
				'width': dots.width + 'px','height':dots.height +'px' ,'background-color':index !== (current-1)?dots.backgroundColor:dots.selectedBackgroundColor,'border':index !==(current-1) ? dots.border:dots.selectedBorder}"
								 :key="index" class="uni-swiper__dots-item" />
							</view>
							<image class="good_box" :animation="animationData" v-if="hide_good_box" :style="'left:'+bus_x+'px;top:'+bus_y+'px'" src="../../static/logo.png"></image>
						</view>



						<view>
							<view class="uni-title" @tap="opendata">时间</view>
							<view class="uni-list">
								<view class="uni-list-cell">
									<input class="uni-input" v-model="times" name="ttime" @tap="opendata" placeholder="请选择时间" disabled="false" />
								</view>
							</view>
						</view>
						<view v-if="tabIndex==1">
							<view class="uni-title">支付方式</view>
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
	import uniGrid from '@/components/uni-grid/uni-grid.vue'
	import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue'
	export default {
		components: {
			uniCalendar,
			uniGrid,
			uniGridItem
		},
		data() {
			return {
				//移动动画start
				animationData: '',
				hide_good_box: false,
				bus_x: 0,
				bus_y: 0,
				finger: {},
				busPos: {},
				linePos: [],
				timer: null,
				ydimg: '',
				// 动画end
				//swiper
				tabBars: [{
						name: '支出',
						id: 'zhichu',
					},
					{
						name: '收入',
						id: 'shouru',
					}
				],
				tabBars2: [{
						name: '支出',
						id: 'shouru',
						gridlist: [{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-1.png',
								text: '1'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-2.png',
								text: '2'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/gird-3.png',
								text: '3'
							}
						]
					}, {
						name: '收入1',
						id: 'shouru',
						gridlist: [{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-1.png',
								text: '1'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-2.png',
								text: '2'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/gird-3.png',
								text: '3'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-6.png',
								text: '4'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-7.png',
								text: '5'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-8.png',
								text: '6'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-9.png',
								text: '7'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-4.png',
								text: '8'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-5.png',
								text: '9'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-9.png',
								text: '10'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-4.png',
								text: '11'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-5.png',
								text: '12'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-5.png',
								text: '13'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-9.png',
								text: '14'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-4.png',
								text: '15'
							}
						]
					}, {
						name: '收入2',
						id: 'shouru',
						gridlist: [{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-1.png',
								text: '16'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-2.png',
								text: '17'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/gird-3.png',
								text: '18'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-6.png',
								text: '19'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-7.png',
								text: '20'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-8.png',
								text: '21'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-9.png',
								text: '22'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-4.png',
								text: '23'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-5.png',
								text: '24'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-9.png',
								text: '25'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-4.png',
								text: '26'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-5.png',
								text: '27'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-5.png',
								text: '28'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-9.png',
								text: '29'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-4.png',
								text: '30'
							}
						]
					},
					{
						name: '收入3',
						id: 'shouru',
						gridlist: [{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-1.png',
								text: '31'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-2.png',
								text: '32'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/gird-3.png',
								text: '33'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-6.png',
								text: '34'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-7.png',
								text: '35'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-8.png',
								text: '36'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-9.png',
								text: '37'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-4.png',
								text: '38'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-5.png',
								text: '39'
							},
							{
								url: 'https://img-cdn-qiniu.dcloud.net.cn/uni-ui/grid-9.png',
								text: '40'
							}
						]
					}
				],
				tabBars3: [{
						name: '收入1',
						id: 'shouru'
					}, {
						name: '收入2',
						id: 'shouru'
					},
					{
						name: '收入3',
						id: 'shouru'
					}
				],
				zftype: 0,
				tabIndex: 0,
				//end
				//form
				times:'',
				//---form
				//grid
				dots: {
					width: 8,
					height: 8,
					bottom: 10,
					color: '#fff',
					backgroundColor: 'rgba(255, 90, 95,0.3)',
					border: '1px rgba(255, 90, 95,0.3) solid',
					selectedBackgroundColor: 'rgba(255, 90, 95,0.9)',
					selectedBorder: '1px rgba(255, 90, 95,0.9) solid'
				},
				current: 0,
				//---grid
			}
		},
		onLoad() {
			
				// ---获取类别按钮位置
				const that = this;
				that.busPos['x'] = 10; 
				//  #ifdef H5
				that.busPos['y'] =  56;
				//  #endif  
			
				//  #ifdef MP-WEIXIN  
				wx.getSystemInfo({
					success: function(res) {
						hh = res.windowHeight;
						that.busPos['y'] = hh - 56;
					}
				})
				//  #endif  
				// #ifdef APP-PLUS
				// uni.getSystemInfo({
				// 	success: function(res) {
				// 		// console.log("res:" + JSON.stringify(res))
				// 		hh = res.windowHeight;
				// 		that.busPos['y'] = hh - 56;
				// 	}
				// })
				const query = uni.createSelectorQuery().in(this);
				query.select('#x12').boundingClientRect(data => {
					that.busPos['x'] = data.left;
					that.busPos['y'] = data.top;
							
				}).exec();
				// #endif
				// that.busPos['x'] = 50;
				// that.busPos['y'] = 120;
				
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
			//swiper start
			ontabtap(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				this.zftype = index;
				this.switchTab(index);
			},
			ontabchange(e) {
				let index = e.target.current || e.detail.current;
				this.switchTab(index);
			},
			switchTab(index) {
				if (index == 0) {
					this.tabIndex = 0;
					this.current = 0
				} else {
					this.tabIndex = 1;
					this.current = index
				}
			},
			//swiper end
			//grid
			gridtap(e) {
				let {
					index
				} = e.detail
				console.log(index)
			},
			//grid end
			// ---移动start
			changexx(obj) {

					
					const e = obj;
					if (this.timer) { // 清除一下动画
						clearInterval(this.timer);
					}
					this.finger = {};
					const query = uni.createSelectorQuery().in(this);
					query.select('#' + e.target.id).boundingClientRect(data => {
						console.log("---d:"+JSON.stringify(data))
						console.log("---e:"+JSON.stringify(e))
						this.finger['x'] = data.left;
						this.finger['y'] = data.top;
						
						console.log("---0x:"+this.busPos['x'])
						console.log("---0y:"+this.busPos['y'])
						console.log("---1x:"+this.finger['x'])
						console.log("---1y:"+this.finger['y'])
						
						this.linePos = this.drawLine(this.busPos['x'], this.busPos['y'], this.finger['x'], this.finger['y'], 20);
						
						this.hide_good_box = true
						this.bus_x = this.finger['x'];
						this.bus_y = this.finger['y'];
					var cx=	this.finger['x']-this.busPos['x'];
					var cy=	this.finger['y']-this.busPos['y'];
					console.log("--cx:"+cx)
					console.log("--cy:"+cy)
						this.startani(-cx,-cy)
							
						// this.startAnimation(e);
								
					}).exec();
					
					


				
			},
			startAnimation: function(e) {
				var index = 0;
				var that = this;
				this.ydimg=that.tabBars2[e.target.dataset.xid1].gridlist[e.target.dataset.xid2].url;
				console.log("---x:"+JSON.stringify(this.ydimg))
				var bezier_points = that.linePos['bezier_points'];
				console.log("---x:"+JSON.stringify(bezier_points))
				that.hide_good_box = true
				that.bus_x = that.finger['x'];
				that.bus_y = that.finger['y'];
				var len = bezier_points.length;
				console.log("---x:"+len)
				index = len;
				that.timer = setInterval(function() {
					index--;
					that.bus_x = bezier_points[index]['x'];
					that.bus_y = bezier_points[index]['y'];
					if (index < 1) {
						clearInterval(that.timer);
						that.hide_good_box = false;
					}
				}, 25);
			},
			drawLine:function(x1, y1, x2, y2, aint){
					var ret = [];
					try {
						var i;
						var r = Math.floor(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));
						var theta = Math.atan((x2 - x1) / (y2 - y1));
						if (((y2 - y1) < 0 && (x2 - x1) > 0) || ((y2 - y1) < 0 && (x2 - x1) < 0))
							theta = Math.PI + theta;
						var dx = Math.sin(theta); //alert(dx) 
						var dy = Math.cos(theta);
						var retx = [];
						var z = r / aint; //190/30=6.1
						for (i = 0; i < r; i) {
							retx = {
								x: x1 + i * dx,
								y: y1 + i * dy
							};
							ret.push(retx);
							i = i + z;
						}
				
					} catch (err) {
						console.log("错误：" + err.message)
					}
					return {
						'bezier_points': ret
					};
			},
			// ---移动end
			//ani
			startani(x1,y1){
				var animationDataxx = uni.createAnimation();
				animationDataxx.translate(x1, y1).step()
				this.animationData=animationDataxx.export()		
			}
		}
	}
</script>

<style>
.c {
		background-color: #ffffff;
		height: 100%;
	}
	.swiper_t {
		width: 750rpx;
		height: 100rpx;
		flex-direction: row;
		justify-content: center;
		align-content: center;
		flex-wrap: nowrap;
		display: inline-flex;
	}
	
	.tab-item-title {
		color: #555;
		font-size: 30rpx;
		height: 100rpx;
		flex-wrap: nowrap;
		line-height: 100rpx;
		text-overflow: ellipsis;
		overflow: hidden;
		max-width: 200rpx;
		margin: 0rpx 20rpx;
	
	}
	
	.tab-item-title-active {
		color: #007AFF;
	}
	
	.swiper-box {
		width: 100%;
		height: 490rpx;
		position: relative;
	}

	.swiper-box swiper {
		height: 470rpx;
	}
	

	
	.image {
		width: 50upx;
		height: 50upx;
	}
	
	.text {
		font-size: 26upx;
		margin-top: 10upx;
	}
	
	/* dot */
	.uni-swiper__dots-box {
		position: absolute;
		bottom: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: box-sizing;
		width: 100%;
	}
	
	.uni-swiper__dots-item {
		flex-shrink: 0;
		width: 16rpx;
		border-radius: 50%;
		margin-left: 12rpx;
		background: rgba(0, 0, 0, .3);
		transition: all 0.2s linear;
	}
	
	.uni-swiper__dots-item:first-child {
		margin: 0;
	}
	
	.imagex {
		width: 50rpx;
		height: 50rpx
	}
	
	.textx {
		font-size: 26rpx;
		margin-top: 10rpx
	}
	
	/*小球*/
	.good_box {
		width: 50rpx;
		height: 50rpx;
		position: fixed;
		overflow: hidden;
		/* left: 50%; */
		/* top: 50%; */
		z-index: +99;
	}

	
</style>
