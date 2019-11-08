<template>
	<view class="c">
		<view class="swiper_t"> <text class="tab-item-title" :class="tabIndex==index ? 'tab-item-title-active' : ''" v-for="(tab,index) in tabBars"
			 :key="tab.id" :id="tab.id" :data-current="index" @click="ontabtap">{{tab.name}}</text>
		</view>
		<view class="line-h"></view>
		<view style="display:flex;margin-left: 20rpx;margin-top: 20rpx;align-items: center;justify-content: flex-start;line-height: 26rpx;">
			<image id="x12" class="imagex" mode="aspectFill" :src="ydimg2"></image>
			<text class="textx" style="margin-left: 20rpx;" >类别</text>
		</view>
		<view class="swiper-box">
			<swiper :current="tabIndex" :duration="300" @change="ontabchange">
				<swiper-item class="swiper-item" v-for="(tab,index) in tabBars2" :key="index">
					<uni-grid :column="5" :show-border="false" :highlight="false">
						<uni-grid-item type="error" v-for="(xx,xindex) in tab.gridlist" :key="xindex">
							<image class="imagex" :src="xx.url" mode="aspectFill" :id="'u'+index+xindex" @tap="changexx" :data-xid1="index"
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
			<image class="good_box" v-if="hide_good_box" :style="'left:'+bus_x+'px;top:'+bus_y+'px'" :src="ydimg"></image>
		</view>
		<text>分类1</text>
		<view v-if="tabIndex==1"><text>成1员</text></view>
	</view>
</template>
<script>
	import uniGrid from '@/components/uni-grid/uni-grid.vue'
	import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue'
	import xutils from '@/common/utils.js'

	export default {
		components: {
			uniGrid,
			uniGridItem
		},
		data() {
			return {
				//移动动画start
				map: null,
				hide_good_box: false,
				bus_x: 0,
				bus_y: 0,
				finger: {},
				busPos: {},
				linePos: [],
				timer: null,
				ydimg: '',
				ydimg2: '',
				// 动画end
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

				tabIndex: 0,
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
				current: 0
			}
		},
		onLoad() {
			// ---获取类别按钮位置
			const that = this;
			that.busPos['x'] = 10;
			that.busPos['y'] = 63;
			// #ifdef APP-PLUS
			const query = uni.createSelectorQuery().in(this);
			query.select('#x12').boundingClientRect(data => {
				console.log("---:" + JSON.stringify(data))
				that.busPos['x'] = data.left;
				that.busPos['y'] = data.top;
			}).exec();
			// #endif
		
		},
		mounted() {
			//  #ifdef H5
			setTimeout(function() {
				uni.createSelectorQuery()
					.in(this)
					.select('#x12')
					.boundingClientRect()
					.exec(ret => {
						console.log("---ret:" + JSON.stringify(ret))
				
					})
			}, 10);
			//  #endif  
		},
		methods: {
			ontabtap(e) {
				let index = e.target.dataset.current || e.currentTarget.dataset.current;
				if (index == 0) {
					this.tabIndex = 0;
					this.current = 0
				} else {
					this.tabIndex = 1;
					this.current = index
				}
				// this.switchTab(index);
			},
			ontabchange(e) {
				let index = e.target.current || e.detail.current;
				if (index == 0) {
					this.tabIndex = 0;
					this.current = 0
				} else {
					this.tabIndex = 1;
					this.current = index
				}
				// this.switchTab(index);
			},
			// ---移动start
			changexx(obj) {
				if (this.map == null) {
					this.map = new xutils.HashMap();
				}
				const z = this.map.get(obj.target.id);
				if (this.timer) { // 清除一下动画
					clearInterval(this.timer);
				}
				if (z == null) {
					this.finger = {};
					const query = uni.createSelectorQuery().in(this);
					query.select('#' + obj.target.id).boundingClientRect(data => {
						// console.log("---d:"+JSON.stringify(data))
						// console.log("---e:"+JSON.stringify(obj))
						this.finger['x'] = data.left;
						this.finger['y'] = data.top;
						this.linePos = this.drawLine(this.busPos['x'], this.busPos['y'], this.finger['x'], this.finger['y'], 20);
						this.startAnimation(obj);
						this.map.put(obj.target.id, {
							x: data.left,
							y: data.top,
							linePos: this.linePos
						});
					}).exec();
				} else {
					this.finger['x'] = z.x;
					this.finger['y'] = z.y;
					this.linePos = z.linePos;
					this.startAnimation(obj);
				}
			},
			startAnimation: function(e) {
				var index = 0;
				this.ydimg = this.tabBars2[e.target.dataset.xid1].gridlist[e.target.dataset.xid2].url;
				// console.log("---x:" + JSON.stringify(this.linePos))
				var bezier_points = this.linePos.bezier_points;
				if (bezier_points == null) {
					return
				}
				// console.log("---x:"+JSON.stringify(bezier_points))
				this.hide_good_box = true
				this.bus_x = this.finger['x'];
				this.bus_y = this.finger['y'];
				var len = bezier_points.length;
				// console.log("---x:" + len)
				index = len;
				var that = this;
				that.timer = setInterval(function() {
					index--;
					that.bus_x = bezier_points[index].x;
					that.bus_y = bezier_points[index].y;
					if (index < 1) {
						that.ydimg2 = that.ydimg;
						clearInterval(that.timer);
						that.hide_good_box = false;
					}
				}, 25);
			},
			drawLine(x1, y1, x2, y2, aint) {
				var ret = [];
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
					// console.log("---i:" + i)
					retx = {
						x: x1 + i * dx,
						y: y1 + i * dy
					};
					ret.push(retx);
					i = i + z;
				}
				return {
					'bezier_points': ret
				};
			}
			//end
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

	.line-h {
		height: 1rpx;
		background-color: #cccccc;
	}

	.swiper-box {
		width: 100%;
		height: 490rpx;
		position: relative;
	}

	.swiper-box swiper {
		height: 470rpx;
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
		width: 60rpx;
		height: 60rpx
	}

	.textx {
		font-size: 26rpx;
		text-align: center;
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
