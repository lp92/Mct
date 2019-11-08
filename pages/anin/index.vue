<template>
	<view>
		<view>
			<text id="x12">设置</text>
		</view>
		<view class="category-list">
			<scroll-view scroll-y="true" class="right">
				<view class="category">
					<view class="list">
						<view class="box">
							<!-- 商品列表 -->
							<view @tap="touchOnGoods">点1击</view>
						</view>
					</view>
					<image class="good_box111" @tap="touchOnGoods" src="../../static/logo.png"></image>
				</view>
			</scroll-view>
			<view @tap="touchOnGoods" v-if="hide_good_box">点1击3</view>
		</view>
		<image class="good_box" v-if="hide_good_box" :style="'left:'+bus_x+'px;top:'+bus_y+'px'" src="../../static/logo.png"></image>
		<!-- <view class="good_box" v-if="!hide_good_box" :style="'left:'+bus_x+'px;top:'+bus_y+'px'"></view> -->
	</view>
	</view>
</template>
<script>
	function drawLine(x1, y1, x2, y2, aint) {
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
	}
	export default {
		data() {
			return {
				//start
				hide_good_box: false,
				bus_x: 0,
				bus_y: 0,
				finger: {},
				busPos: {},
				linePos: [],
				timer: null,
				// 购物车小球动画end
			}
		},
		methods: {

			specCallback() {
				return;
			},
			discard() {

			},
			// popup end
			// 加入购物车start
			touchOnGoods(obj) {
				const e = obj;
				console.log("--"+JSON.stringify(obj))
				if (this.timer) { // 清除一下动画
					clearInterval(this.timer);
				}
				this.finger = {};
				// var topPoint = {};
				this.finger['x'] = e.target.x; //点击的位置
				this.finger['y'] = e.target.y;
				// if (this.finger['y'] < this.busPos['y']) {
				// 	topPoint['y'] = this.finger['y'] - 150;
				// } else {
				// 	topPoint['y'] = this.busPos['y'] - 150;
				// }
				// topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2;

				// if (this.finger['x'] > this.busPos['x']) {
				// 	topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];
				// } else { //
				// 	topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];
				// }
				// var linePosxx = bezier([this.busPos, topPoint, this.finger], 30);
				// console.log("--daxiao:"+JSON.stringify(linePosxx))
				this.linePos = drawLine(this.busPos['x'], this.busPos['y'], this.finger['x'], this.finger['y'], 20);
				console.log("--daxiao:" + this.linePos.length)
				this.startAnimation(e);
			},
			startAnimation: function(e) {
				var index = 0;
				var	that = this;
				var	bezier_points = that.linePos['bezier_points'];
				that.hide_good_box = true
				that.bus_x = that.finger['x'];
				that.bus_y = that.finger['y'];
				var len = bezier_points.length;
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
		},
		watch: {

		},
		onLoad() {
			let hh = 0;
			const that = this;
			that.busPos['x'] = 45; //购物车的位置
			//  #ifdef H5
			hh = document.body.clientHeight;
			that.busPos['y'] = hh - 56;
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
			uni.getSystemInfo({
				success: function(res) {
					// console.log("res:" + JSON.stringify(res))
					hh = res.windowHeight;
					that.busPos['y'] = hh - 56;
				}
			})
			// #endif
			that.busPos['x'] = 50;
			that.busPos['y'] = 120;
			const query = uni.createSelectorQuery().in(this);
			query.select('#x12').boundingClientRect(data => {
				that.busPos['x'] = data.left;
				that.busPos['y'] = data.top;

			}).exec();
		}

	}
</script>
<style lang="scss">
	@keyframes showPopup {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	@keyframes hidePopup {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0;
		}
	}

	@keyframes showLayer {
		0% {
			transform: translateY(0);
		}

		100% {
			transform: translateY(-100%);
		}
	}

	@keyframes hideLayer {
		0% {
			transform: translateY(-100%);
		}

		100% {
			transform: translateY(0);
		}
	}

	.m-store-banner {
		min-height: 270upx;
		position: relative;
		padding-top: 20upx;
		background: #eee;
		// background:url("../../static/img/storebanner.png");
		background-size: 100% 200upx;
		background-repeat: no-repeat;

		.m-content {
			width: 690upx;
			position: relative;
			bottom: 10upx;
			left: 30upx;
			right: 30upx;
			margin-top: 30upx;
			background: #fff;
			border-radius: 15upx;
			box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
			z-index: 100;

			.m-message {
				padding: 20upx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: flex-end;

				.m-img {
					flex: 0 0 135upx;
					height: 135upx;
					// background:url("../../static/img/storebanner.png");
				}

				.m-body {
					flex: 1;
					// padding: 20upx;
					padding-left: 10upx;
					padding-bottom: 0;

					.m-title {
						font-size: 32upx;
						color: #333333
					}

					.m-text {
						font-size: 20upx;
						color: #999999;
						line-height: 38upx;
						margin-top: 10upx;
					}

					.m-time {
						font-size: 20upx;
						color: #999999;
						margin-top: 10upx;
					}
				}

				.m-phone {
					flex: 0 0 40upx;
					text-align: right
				}
			}
		}
	}

	.popup {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 300;
		display: none;

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 21;
			background-color: rgba(0, 0, 0, 0.6);
		}

		.layer {
			position: fixed;
			z-index: 22;
			bottom: -70%;
			width: 100%;
			padding: 0;
			height: 70%;
			border-radius: 20upx 20upx 0 0;
			background-color: #fff;
			display: flex;
			flex-wrap: wrap;
			align-content: space-between;

			// 购物车
			.m-shopcar-box {
				width: 100%;

				// padding: 30upx 0;
				.m-header {
					padding: 30upx 30upx;
					display: flex;
					flex-direction: row;
					justify-content: space-between;

					.m-line {
						display: flex;
						color: #333333;
						font-size: 30upx;

						.m-light {
							color: #333333;
							font-size: 22upx;
							padding-left: 10upx;
						}
					}

					.m-clear-car {
						color: #333333;
						font-size: 22upx;
					}
				}

				.m-shopcar-item {
					margin-left: 30upx;
					margin-right: 30upx;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					border-top: 1px solid #eee;
					padding: 20upx;

					&:last-of-type {
						border-bottom: 1px solid #eee;
					}

					.m-title {
						color: #4c4c4c;
						font-size: 26upx;
					}

					.m-price {
						color: #ff582b;
						font-size: 26upx;
					}

					.m-controne {
						// flex: 
					}
				}
			}

			.btn {
				width: 100%;
				height: 100upx;

				.button {
					width: 100%;
					height: 80upx;
					border-radius: 40upx;
					color: #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #f47952;
					font-size: 28upx;
				}
			}
		}

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			display: block;

			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		&.service {
			.row {
				margin: 30upx 0;

				.title {
					font-size: 30upx;
					margin: 10upx 0;
				}

				.description {
					font-size: 28upx;
					color: #999;
				}
			}
		}

		&.spec {
			.title {
				font-size: 30upx;
				margin: 30upx 0;
			}

			.sp {
				display: flex;

				view {
					font-size: 28upx;
					padding: 5upx 20upx;
					border-radius: 8upx;
					margin: 0 30upx 20upx 0;
					background-color: #f6f6f6;

					&.on {
						padding: 3upx 18upx;
						border: solid 1upx #f47925;
					}
				}
			}

			.length {
				margin-top: 30upx;
				border-top: solid 1upx #aaa;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-top: 20upx;

				.text {
					font-size: 30upx;
				}

				.number {
					display: flex;
					justify-content: center;
					align-items: center;

					.input {
						width: 80upx;
						height: 60upx;
						margin: 0 10upx;
						background-color: #f3f3f3;
						display: flex;
						justify-content: center;
						align-items: center;
						text-align: center;

						input {
							width: 80upx;
							height: 60upx;
							display: flex;
							justify-content: center;
							align-items: center;
							text-align: center;
							font-size: 26upx;
						}
					}

					.sub,
					.add {
						width: 60upx;
						height: 60upx;
						background-color: #f3f3f3;
						border-radius: 5upx;

						.icon {
							font-size: 30upx;
							width: 60upx;
							height: 60upx;
							display: flex;
							justify-content: center;
							align-items: center;

						}
					}
				}
			}

		}
	}

	// 商品列表样式
	.category-list {
		width: 100%;
		background-color: #fff;
		display: flex;
		padding-bottom: 99upx;

		.left,
		.right {
			background: #fff;
			position: absolute;
			top: 289upx;
			/*  #ifdef  APP-PLUS  */
			top: calc(100upx + var(--status-bar-height));
			/*  #endif  */
			bottom: 0upx;
		}

		.left {
			width: 24%;
			left: 0upx;
			background-color: #f6f3f3;

			.row {
				width: 100%;
				height: 90upx;
				display: flex;
				align-items: center;

				.text {
					width: 100%;
					position: relative;
					font-size: 28upx;
					display: flex;
					justify-content: center;
					color: #999999;

					.block {
						position: absolute;
						width: 0upx;
						left: 0;
					}
				}

				&.on {
					height: 100upx;
					background-color: #fff;

					.text {
						font-size: 30upx;

						// font-weight: 600;
						// color: #2d2d2d;
						.block {
							width: 10upx;
							height: 80%;
							top: 10%;
							// background-color: #f06c7a;
						}
					}
				}
			}
		}

		.right {
			width: 76%;
			left: 24%;

			.category {
				// 				width: 94%;
				padding: 20upx 30upx;

				.list {
					margin-top: 40upx;
					width: 100%;
					display: flex;
					flex-wrap: wrap;

					.box {
						width: 100%;
					}
				}
			}
		}
	}

	/*抛物线小球*/
	.good_box {
		width: 30px;
		height: 30px;
		position: fixed;
		overflow: hidden;
		left: 50%;
		top: 50%;
		z-index: +99;
	}
	
	.good_box111 {
		width: 30px;
		height: 30px;
	}
</style>
