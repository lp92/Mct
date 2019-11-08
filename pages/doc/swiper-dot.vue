<template>
	<view class="content">
		<view class="uni-swiper__warp">
			<swiper class="swiper-box" @change="change">
				<swiper-item v-for="(item, index) in info" :key="index">
					<view class="swiper-item">
						<text class="txt">{{item.content}}</text>
					</view>
				</swiper-item>
			</swiper>
			<view :style="{'bottom':dots.bottom + 'px'}" class="uni-swiper__dots-box">
				<view v-for="(item,index) in info" :style="{
		'width': dots.width + 'px','height':dots.height +'px' ,'background-color':index !== current?dots.backgroundColor:dots.selectedBackgroundColor,'border':index !==current ? dots.border:dots.selectedBorder}"
				 :key="index" class="uni-swiper__dots-item" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: [{
						content: '内容 A'
					},
					{
						content: '内容 B'
					},
					{
						content: '内容 C'
					}
				],
				current: 0,
				dots: {
					width: 8,
					height: 8,
					bottom: 10,
					color: '#fff',
					backgroundColor: 'rgba(255, 90, 95,0.3)',
					border: '1px rgba(255, 90, 95,0.3) solid',
					selectedBackgroundColor: 'rgba(255, 90, 95,0.9)',
					selectedBorder: '1px rgba(255, 90, 95,0.9) solid'
				}
			}
		},
		methods: {
			change(e) {
				this.current = e.detail.current
			},
		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #efeff4
	}

	view {
		font-size: 28upx;
		line-height: inherit
	}




	.swiper-box {
		height: 400upx;
	}

	.swiper-item {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		background: #eee;
		color: #fff;
	}

	.txt {
		width: 100%;
		height: 100%;
		justify-content: center;
		text-align: center;
		align-content: center;
		color: #09BB07;
		line-height: 400upx;
	}

	.uni-swiper__warp {
		position: relative;
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
	}

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
</style>
