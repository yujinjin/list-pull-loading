<template>
	<!--:class="{'disabled-iscroll': isLoading}"-->
	<div class="list-pull-loading">
		<div class="loading-mask" v-show="isLoading" @touch.stop.prevent></div>
		<slot name="goTop">
			<transition name="fade">
			<div class="go-top" @click.stop.prevent="gotoTop" v-if="isShowToTop && isCanToTop">
				<img src="./imgs/top.png"/>
			</div>
			</transition>
		</slot>
		<div class="list-pull-loading-box" ref="scroller">
			<div class="list-pull-loading-scroller">
				<!-- 下拉刷新显示 -->
				<slot name="down">
					<!-- 这里要用过渡动画3种状态 -->
					<div class="pull-down-tips" v-show="down != false" :class="{'loading': down.state !== 0, 'down-margin': myScroll === null}">
						<div class="tips-content">
							<div class="unload" v-show="down.state === 0 || down.state === 1">
								<p class="arrow" :class="{'arrow-normal': down.state === 0, 'arrow-rotate': down.state === 1}"></p>
								<p class="tips-text">{{down.state === 1 ? down.notReleaseText : down.initText}}</p>
							</div>
							<div class="onload" v-show="down.state === 2">
								<p class="progress">
									<svg viewBox="0 0 64 64">
										<g stroke-width="4" stroke-linecap="round">
											<line y1="17" y2="29" transform="translate(32,32) rotate(180)">
												<animate attributeName="stroke-opacity" dur="750ms" values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(210)">
												<animate attributeName="stroke-opacity" dur="750ms" values="0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(240)">
												<animate attributeName="stroke-opacity" dur="750ms" values=".1;0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(270)">
												<animate attributeName="stroke-opacity" dur="750ms" values=".15;.1;0;1;.85;.7;.65;.55;.45;.35;.25;.15" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(300)">
												<animate attributeName="stroke-opacity" dur="750ms" values=".25;.15;.1;0;1;.85;.7;.65;.55;.45;.35;.25" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(330)">
												<animate attributeName="stroke-opacity" dur="750ms" values=".35;.25;.15;.1;0;1;.85;.7;.65;.55;.45;.35" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(0)">
												<animate attributeName="stroke-opacity" dur="750ms" values=".45;.35;.25;.15;.1;0;1;.85;.7;.65;.55;.45" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(30)">
												<animate attributeName="stroke-opacity" dur="750ms" values=".55;.45;.35;.25;.15;.1;0;1;.85;.7;.65;.55" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(60)">
												<animate attributeName="stroke-opacity" dur="750ms" values=".65;.55;.45;.35;.25;.15;.1;0;1;.85;.7;.65" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(90)">
												<animate attributeName="stroke-opacity" dur="750ms" values=".7;.65;.55;.45;.35;.25;.15;.1;0;1;.85;.7" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(120)">
												<animate attributeName="stroke-opacity" dur="750ms" values=".85;.7;.65;.55;.45;.35;.25;.15;.1;0;1;.85" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(150)">
												<animate attributeName="stroke-opacity" dur="750ms" values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1" repeatCount="indefinite"></animate>
											</line>
										</g>
									</svg>
								</p>
								<p class="tips-text">{{down.loadingText}}</p>
							</div>
							<div class="last-time-text tips-text" v-if="down.isShowLastTimeText">
								最后更新时间：<em>{{timeDifferenceText}}</em>
							</div>
						</div>
					</div>
				</slot>
				<!-- 数据列表 -->
				<slot name="list" v-if="hasData"></slot>
				<slot name="nodata" v-else>
					<div class="no-data">
						<img src="./imgs/no-collection.png" />
	                	<div class="mt20">{{noDataText}}</div>
                	</div>
				</slot>
				<!-- 上拉加载显示 -->
				<slot name="up" v-if="hasData">
					<!-- 这里要用过渡动画3种状态 -->
					<div class="pull-up-tips" v-show="up != false">
						<div class="tips-content">
							<div class="unload" v-show="up.state === 0 || up.state === 1">
								<p class="arrow" :class="{'arrow-normal': up.state === 0, 'arrow-rotate': up.state === 1}"></p>
								<p class="tips-text">{{up.state === 1 ? up.notReleaseText : up.initText}}</p>
							</div>
							<div class="onload" v-show="up.state === 2">
								<p class="progress">
									<svg viewBox="0 0 64 64">
										<g stroke-width="4" stroke-linecap="round">
											<line y1="17" y2="29" transform="translate(32,32) rotate(180)">
												<animate attributeName="stroke-opacity" dur="750ms" values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(210)">
												<animate attributeName="stroke-opacity" dur="750ms" values="0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(240)">
												<animate attributeName="stroke-opacity" dur="750ms" values=".1;0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(270)">
												<animate attributeName="stroke-opacity" dur="750ms" values=".15;.1;0;1;.85;.7;.65;.55;.45;.35;.25;.15" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(300)">
												<animate attributeName="stroke-opacity" dur="750ms" values=".25;.15;.1;0;1;.85;.7;.65;.55;.45;.35;.25" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(330)">
												<animate attributeName="stroke-opacity" dur="750ms" values=".35;.25;.15;.1;0;1;.85;.7;.65;.55;.45;.35" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(0)">
												<animate attributeName="stroke-opacity" dur="750ms" values=".45;.35;.25;.15;.1;0;1;.85;.7;.65;.55;.45" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(30)">
												<animate attributeName="stroke-opacity" dur="750ms" values=".55;.45;.35;.25;.15;.1;0;1;.85;.7;.65;.55" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(60)">
												<animate attributeName="stroke-opacity" dur="750ms" values=".65;.55;.45;.35;.25;.15;.1;0;1;.85;.7;.65" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(90)">
												<animate attributeName="stroke-opacity" dur="750ms" values=".7;.65;.55;.45;.35;.25;.15;.1;0;1;.85;.7" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(120)">
												<animate attributeName="stroke-opacity" dur="750ms" values=".85;.7;.65;.55;.45;.35;.25;.15;.1;0;1;.85" repeatCount="indefinite"></animate>
											</line>
											<line y1="17" y2="29" transform="translate(32,32) rotate(150)">
												<animate attributeName="stroke-opacity" dur="750ms" values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1" repeatCount="indefinite"></animate>
											</line>
										</g>
									</svg>
								</p>
								<p class="tips-text">{{up.loadingText}}</p>
							</div>
							<div class="no-more" v-show="up.state === 3">
								<p class="icon"></p>
								<p class="tips-text">{{up.noMoreText}}</p>
							</div>
						</div>
					</div>
				</slot>
			</div>
		</div>
	</div>
</template>
<script>
	import IScroll from "iscroll";
	
	export default {
    	data() {
    		return {
    			isLoading: false, // API是否正在加载
    			hasData: true, // 当前列表是否有数据
    			downElHeight: 0, // 下拉元素的高度
    			upElHeight: 0, // 上拉提示元素的高度
    			scrollerMinHeight: 0, //当前容器最小高度
    			directionY: 0, // -1:up 上, 1: down下
    			startPullTime: 0, // 开始下拉的时间
    			endPullTime: 0, // 结束下拉的时间
    			lastQueryTime: 0, // 最后一次查询的时间
    			isCanToTop: false, // 根据当前滚动位置判断是否能调到顶部
    			isShowToTop: true, // 是否显示去顶部图标
    			initMaxTimes: 3, // 初始化数据不够一屏最大查询次数
    			noDataText: "没有找到相关的内容哦~", // 没有列表数据时的内容展示
    			myScroll: null, // 当前iScroll实例
    			api: null, // 当前数据列表API查询接口
    			auto: true, // 是否自动查询
    			// 图片自适应，默认为false。最好不要设置为true，因为比较消耗资源。
    			// 原因是：true的情况下是应用于列表数据里有懒加载的图片但没有指定图片大小导致iScroll计算高度不准确需要的等图片加载完之后再重新计算高度。
				// 目前都是通过监控图片的onload事件来刷新的这样真的不爽但也没找到其他好的解决方案，所以最好是列表中有图片加载时就预先把高度写死
    			imgResize: false, 
    			iScrollOptions: {
    				probeType: 3, //必须指定为3，否则拖动太快就监控不到
    				mouseWheel: false,
    				disableMouse: true,
//  				disableTouch: true,
//  				disablePointer: true,
    				scrollbars: false,
    				preventDefault: true,
//  				bounce: tru, //是否启用弹力动画效果，关掉可以加速
//  				bounceTime: 0,
    				startY: 0
    			}, //IScroll选项
    			down: {
    				offset: 50, //列表下拉滚动大于50px,即可触发下拉刷新的回调
    				initText: "下拉刷新", //初始化文案，这个是在当前下来滚动未超过指定的值时显示文案
    				notReleaseText: "松开刷新", // 释放滚动加载时当前下拉高度还未回弹时的文案
    				loadingText: "正在加载更多", // 正在加载时的文案
    				state: 0, //当前加载时的状态。0:初始化状态 1：未释放滚动加载时 2：正在加载时
    				isShowLastTimeText: true // 是否显示最后更新时间提示 
    			}, // 下拉刷新
    			up: {
    				offset: 50, //列表上拉滚动大于50px,即可触发上拉加载的回调
    				initText: "上拉加载更多", //初始化文案，当前上拉高度未超过指定的高度时
    				notReleaseText: "松开加载更多", // 未释放滚动加载时的文案，当前上拉高度超过指定的高度时且还未释放滚动
    				loadingText: "正在加载更多", // 正在加载时的文案
    				noMoreText: "没有更多数据了...", // 没有数据时的文案
    				state: 0, //当前加载时的状态。0:初始化状态 1：未释放滚动加载时 2：正在加载时 3: 没有更多数据了
    			}, // 上拉加载
    			parameters: {
    				maxResultCount: 20, //每次分页数据加载多少条
					skipCount: 0 //每次数据偏移
    			} // 数据查询参数
    		};
    	},
    	props: {
    		options: Object, //配置选项
    		globalOptions: {
    			type: Object,
    			required: false,
    			default: () => ({})
    		} // 全局默认配置选项
    	},
    	watch: {
    		options: {
    			handler: function (newVal, oldVal) {
    				if(newVal.parameters) {
    					Object.assign(this.parameters, newVal.parameters);
    				}
    				if(newVal.auto === true && this.auto != true) {
    					this.auto = true;
    					this.updateUpState(2);
    					this.isLoading = true;
    					this.query(2).then(()=>{
    						if(this.up.state != 3) this.updateUpState(0);
		        			this.initMaxScroller(this.initMaxTimes - 1);
		        		});
    				}
    			},
    			deep: true
    		}
    	},
    	computed: {
    		timeDifferenceText(){
    			if(!this.lastQueryTime) {
    				return "正在查询，请稍后!";
    			}
    			if(!this.startPullTime) {
    				this.startPullTime = new Date().getTime();
    			}
    			let timeDifference = (this.startPullTime - this.lastQueryTime) / 1000;
    			if(timeDifference < 60) {
    				return "刚刚之前";
    			} else if(timeDifference < 3600) {
    				return parseInt(timeDifference/60, 10) + "分钟前"
    			} else if(timeDifference < 60 * 60 * 24) {
    				return parseInt(timeDifference/3600, 10) + "小时前"
    			} else if(timeDifference < 60 * 60 * 24 * 7) {
    				return parseInt(timeDifference/(60 * 60 * 24), 10) + "天前"
    			} else {
    				return this.dateFormat(new Date(this.lastQueryTime), "yyyy年MM月dd日 hh:mm:ss");
    			}
    		}
    	},
    	mounted() {
        	return this.initData();
    	},
    	methods: {
    		dateFormat(date, fmt="yyyy-MM-dd"){
    			if(!date || !date instanceof Date) {
					return "";
				}
				var o = {
					"M+": date.getMonth() + 1, // 月份
					"d+": date.getDate(), // 日
					"h+": date.getHours(), // 小时
					"m+": date.getMinutes(), // 分
					"s+": date.getSeconds(), // 秒
					"q+": Math.floor((date.getMonth() + 3) / 3), // 季度
					"S": date.getMilliseconds() // 毫秒
				};
				if(/(y+)/.test(fmt))
					fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
				for(var k in o)
					if(new RegExp("(" + k + ")").test(fmt))
						fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
				return fmt;
    		},
	        //初始化
	        initData() {
	        	const _options =  Object.assign(this.globalOptions, this.options);
	        	if(!_options.api) {
	        		throw "错误的API";
	        	}
	        	this.api = _options.api;
	        	if(typeof(_options.auto) === "boolean") {
	        		this.auto = _options.auto;
	        	}
	        	if(typeof(_options.initMaxTimes) === "number") {
	        		this.initMaxTimes = _options.initMaxTimes;
	        	}
	        	if(typeof(_options.isShowToTop) === "boolean") {
	        		this.isShowToTop = _options.isShowToTop;
	        	}
	        	if(_options.noDataText) {
	        		this.noDataText = _options.noDataText;
	        	}
	        	if(typeof(_options.imgResize) === "boolean") {
	        		this.imgResize = _options.imgResize;
	        	}
	        	if(_options.down === false) {
	        		this.down = false;
	        	} else if(typeof(_options.down)=="object") {
	        		Object.assign(this.down, _options.down);
	        	}
	        	if(_options.up === false) {
	        		this.up = false;
	        	} else if(typeof(_options.up)=="object") {
	        		Object.assign(this.up, _options.up);
	        	}
	        	if(_options.iScrollOptions) {
	        		Object.assign(this.iScrollOptions, _options.iScrollOptions);
	        	}
	        	if(_options.parameters) {
	        		Object.assign(this.parameters, _options.parameters);
	        	}
	        	this.$nextTick(()=>{
	        		this.downElHeight = this.$refs["scroller"].querySelector(".pull-down-tips") ? this.$refs["scroller"].querySelector(".pull-down-tips").offsetHeight : 0;
		        	this.upElHeight = this.$refs["scroller"].querySelector(".pull-up-tips") ? this.$refs["scroller"].querySelector(".pull-up-tips").offsetHeight : 0;
		        	this.iScrollOptions.startY = -this.downElHeight;
		        	// 最小高度要加1，防止数据少一屏时IScroller无法滑动问题
		        	this.scrollerMinHeight = this.$refs["scroller"].offsetHeight - (this.iScrollOptions.startY < 0 ? this.iScrollOptions.startY : -1);
		        	this.$refs["scroller"].querySelector(".list-pull-loading-scroller").style.minHeight = this.scrollerMinHeight + "px";
		        	if(this.auto && this.isLoading != true) {
		        		// 必须要判断当前的数据是否正在加载，如果正在加载就不做查询。存在这种情况的原因是父级在mounted生命周期里对于parameters重新赋值，导致watch options变化重新加载，这样就造成刷新2遍了。
		        		// 初始化时首先判断一下有没有数据或者数据多不多（多不多的标准是第一次加载数据时有没有超过一屏）
		        		this.updateUpState(2);
		        		this.isLoading = true;
		        		this.query(0).then(()=>{
		        			if(this.up.state != 3) this.updateUpState(0);
		        			this.isLoading = false;
		        			this.initMaxScroller(this.initMaxTimes - 1);
		        		});
		        	}
	        	});
	        	
	        },
	        // 初始化iScroll组件
	        initIScroll(){
	        	let _this = this, _scrollerMinHeight = this.$refs["scroller"].offsetHeight - (this.iScrollOptions.startY < 0 ? this.iScrollOptions.startY : -1);
	        	if(_scrollerMinHeight > this.scrollerMinHeight) {
	        		// 初始化时再检查一下容器的高度，因为andriod的键盘弹起时会导致高度计算错误，所以这里重新计算一下
	        		this.scrollerMinHeight = _scrollerMinHeight;
	        		this.$refs["scroller"].querySelector(".list-pull-loading-scroller").style.minHeight = this.scrollerMinHeight + "px";
	        	}
	        	//设置子元素的最低高度，这样，该区域在内容少的时候，也可以执行下拉刷新
	        	this.myScroll = new IScroll(this.$refs["scroller"], this.iScrollOptions);
	        	this.myScroll.on('scrollStart', function () {
					_this.startPullTime =  new Date().getTime();
				});
				//滚动时的事件
				this.myScroll.on("scroll",function(){
					// scroll事件，可以用来控制上拉和下拉之后显示的模块中，
					// 样式和内容展示的部分的改变。
					let y = this.y, maxY = this.maxScrollY - y;
					if(_this.down && !_this.isLoading && y + _this.downElHeight >= _this.down.offset){
						// 下拉
						_this.updateDownState(1);
					} else if(_this.down && _this.down.state != 2 && y <= 0 && y + _this.downElHeight < _this.down.offset && y + _this.downElHeight > 0){
						// 下拉复位
						_this.updateDownState(0);
					} else if(_this.up && !_this.isLoading && _this.up.state != 3 && maxY >= _this.up.offset - _this.upElHeight){
						// 上拉
						_this.updateUpState(1);
					} else if(_this.up && _this.up.state != 3 && maxY < _this.up.offset - _this.upElHeight && maxY >= 0){
						// 上拉复位
						_this.updateUpState(0);
					}
				});
				this.myScroll.on("scrollEnd",function(){
					// directionY -1:向下 0:未变 1:向上
					// 下拉结束事件
					_this.endPullTime = new Date().getTime();
					// 当前滚动到一定高度之后显示滚动到顶部图标
					if(_this.isShowToTop) {
						_this.isCanToTop = (-this.y >= _this.scrollerMinHeight * 0.5);
					}
					if(_this.endPullTime - _this.startPullTime < 0) {
						// 解决连续下拉拖动会多次调用resizeIScrollPosition方法导致下拉元素回位位置不正确问题
						return;
					} else if( _this.endPullTime - _this.startPullTime < 200) {
						// 拖动时间少于200ms就不做处理，不然容易防止卡屏
						if(this.y > -_this.downElHeight){
							_this.resizeIScrollPosition();
						} else if(this.maxScrollY <= this.y && (this.maxScrollY + _this.upElHeight) > this.y && this.maxScrollY < -this.downElHeight - this.upElHeight) {
							_this.resizeIScrollPosition(this.maxScrollY + _this.upElHeight);
						}
	                    return;
	                }
					//当下拉，使得边界超出时，如果手指从屏幕移开，则会触发该事件
					if(_this.down.state == 1) {
						// 下拉的高度大于指定高度时，上拉刷新数据
						_this.downRefreshEvent();
					} else if(_this.up.state == 1) {
						_this.upLoaddingEvent();
					} else if(this.y > -_this.downElHeight){
						// 下拉复位
						_this.resizeIScrollPosition();
					} else if(this.maxScrollY <= this.y && (this.maxScrollY + _this.upElHeight) > this.y && this.maxScrollY < -_this.downElHeight - _this.upElHeight) {
						// 上拉复位
						_this.resizeIScrollPosition(this.maxScrollY + _this.upElHeight);
					}
				});
				return this.$nextTick().then(()=>{
					return this.myScrollRefresh();
				});
	        },
	        // 初始化当前滚动加载的数据高度，是针对于当前的数据加载没有超过一屏时继续加载数据
	        initMaxScroller(maxTimes){
	        	// 如果当前加载的次数大于0 且数据还可以再加载且当前的数据没有超过一屏
	        	if(maxTimes >= 0 && this.up && this.up.state !== 3 && this.myScroll.maxScrollY >= -this.downElHeight - this.upElHeight) {
	        		this.updateUpState(2);
	        		this.isLoading = true;
    				return this.query(1).then(()=>{
    					this.isLoading = false;
        				this.updateUpState(0);
    					return this.initMaxScroller(maxTimes - 1);
    				});
    			} else {
    				return Promise.resolve();
    			}
	        },
	        /**
	         * 初始化IScroll缓存数据
	         * @param {Number} y 当前滚动条的距离
	         * @param {Number} upState 当前下拉的状态
	         */
	        initIScrollCacheData(y=0, upState=0){
	        	let _this = this;
	        	let scrollTo = function(scrollY){
	        		if(scrollY > -_this.downElHeight) {
		        		scrollY = -_this.downElHeight;
		        	} else if (scrollY < _this.myScroll.maxScrollY + _this.upElHeight && _this.myScroll.maxScrollY < -_this.downElHeight - _this.upElHeight) {
		                // 最大滚动高度
		                scrollY = _this.myScroll.maxScrollY + _this.upElHeight;
		            }
					_this.myScroll.scrollTo(0, scrollY);
					return scrollY;
	        	}
	        	this.updateUpState(upState);
	        	this.$nextTick(()=>{
        			this.restartIScroll().then(()=>{
        				if(scrollTo(y) != y && this.imgResize) {
        					//由于图片懒加载问题，特别是当前列表特别多而且位置很偏下，这样就会让没有展示的图片高度导致图片计算出来的高度不准，目前没有找到好的解决方案，暂时就这样解决。
        					this.myScrollRefresh().then(()=>{
								scrollTo(y);
							});
        				}
					});
	        	});
	        },
	        restartIScroll(){
	        	if(!this.myScroll) {
	        		return this.initIScroll();
	        	} else {
	        		return this.myScrollRefresh();
	        	}
	        },
	        // myScroll刷新
	        myScrollRefresh(){
	        	let _this = this;
	        	return new Promise((resolve, reject) => {
	        		if(_this.myScroll) {
		        		_this.myScroll.refresh();
		        	}
	        		if(this.imgResize && this.$refs["scroller"]) {
		        		let _this = this, _timer_id = -1, _resolve_timer_id = -1, _el_length = this.$refs["scroller"].querySelectorAll("img[lazy='loading']").length;
		        		if(_el_length === 0) {
		        			// 没有懒加载的图片
		        			resolve();
		        			return;
		        		}
		        		_resolve_timer_id = setTimeout(function(){
		        			// 图片懒加载超时1秒
		        			_resolve_timer_id = -1;
		        			resolve();
		        		}, 500);
		        		Array.from(this.$refs["scroller"].querySelectorAll("img[lazy='loading']")).forEach((imgEl, index) => {
		        			imgEl.onload = function(){
		        				// 如果当前加载的是默认加载动画图片就不做处理
		        				if(this.getAttribute("lazy") === "loading") return;
		        				--_el_length;
		        				// 为了减少资源消耗，做个定时器延时200毫秒处理iScroll重新刷新
		        				if(_timer_id != -1) return;
		        				_timer_id = setTimeout(function(){
		        					if(_this.myScroll) _this.myScroll.refresh();
		        					_timer_id = -1;
		        					if(_el_length <= 0 && _resolve_timer_id != -1) {
		        						clearTimeout(_resolve_timer_id);
		        						_resolve_timer_id = -1;
	        							resolve();
		        					}
		        				}, 200);
		        			}
		        		});
		        	} else {
		        		resolve();
		        	}
	        	});
	        },
	        // 复位IScroll位置
	        resizeIScrollPosition(y){
	        	if(!this.myScroll) return;
	            if (!y) {
	                y = -this.downElHeight;
	            } else if (y < this.myScroll.maxScrollY + this.upElHeight) {
	                // 最大滚动高度
	                y = this.myScroll.maxScrollY + this.upElHeight;
	            }
	            // 滚动跳转会触发scrollEnd时间，所以重新初始化开始时间，延迟300ms
	            // 还发现一个诡异的地方就是andriod在做搜索查询时键盘弹起会延迟300ms，导致循环调用downRefreshEvent方法，所以这里直接设置1000ms
	            this.startPullTime =  new Date().getTime() + 1000;
	            this.myScroll.scrollTo(0, y, 300, IScroll.utils.ease.quadratic);
	        },
	        // API查询 type: 0-初始化,1-上拉加载,2-下拉刷新
	        query(type){
	        	if(type === 1) {
	        		this.parameters.skipCount += this.parameters.maxResultCount;
	        	} else if(type === 2 || type === 0) {
	        		this.lastQueryTime = new Date().getTime();
	        		this.parameters.skipCount = 0;
	        	}
	        	return this.api(this.parameters, type === 1).then((listLength)=>{
	        		this.hasData = !(type != 1 && listLength === 0);
	        		if(listLength < this.parameters.maxResultCount) this.updateUpState(3);
        			return this.$nextTick();
        		}).then(()=>{
    				if(type === 0) {
    					return this.initIScroll();
    				} else if(type === 1) {
    					return this.myScrollRefresh();
    				} else if(type === 2) {
    					return this.restartIScroll();
    				}
        		});
	        },
	        /**
	         * 刷新数据列表，用于供外部调用,
	         * @param {Boolean} isLoadData 是否需要重新加载数据
	         * TODO: 还未实现
	         */ 
	        refresh(isLoadData = true){
	        	let _scrollerMinHeight = this.$refs["scroller"].offsetHeight - (this.iScrollOptions.startY < 0 ? this.iScrollOptions.startY : -1);
	        	if(_scrollerMinHeight > this.scrollerMinHeight) {
	        		// 初始化时再检查一下容器的高度，因为andriod的键盘弹起时会导致高度计算错误，所以这里重新计算一下
	        		this.scrollerMinHeight = _scrollerMinHeight;
	        		this.$refs["scroller"].querySelector(".list-pull-loading-scroller").style.minHeight = this.scrollerMinHeight + "px";
	        	}
	        	if(isLoadData === false) {
	        		if(this.myScroll) this.myScroll.refresh();
	        		return;
	        	}
	        	if(this.isLoading) {
	        		// 正在加载中
	        		return Promise.resolve(false);
	        	}
	        	return this.$nextTick().then(()=>{
	        		return this.downRefreshEvent();
	        	}).then(()=>{
	        		if(this.myScroll.y != -this.downElHeight) {
	        			this.myScroll.scrollTo(0, -this.downElHeight, 0, IScroll.utils.ease.quadratic);
	        		}
	        		this.isCanToTop = false;
	        	});
	        },
	        // 下拉刷新
	        downRefreshEvent(){
	        	this.$emit('down', this.myScroll);
	        	this.updateUpState(0);
	        	this.updateDownState(2);
	        	if(this.isLoading) {
	        		// 正在加载中
	        		return;
	        	}
				this.isLoading = true;
	        	return this.query(2).then(()=>{
	        		if(this.myScroll.y > -this.downElHeight){
	        			this.resizeIScrollPosition();
	        		}
        			this.isLoading = false;
        			this.updateDownState(0);
        			this.initMaxScroller(this.initMaxTimes - 1);
	        	});
	        },
	        // 上拉加载
	        upLoaddingEvent() {
	        	this.$emit('up', this.myScroll);
	        	this.updateUpState(2);
	        	if(this.isLoading) {
	        		// 正在加载中
	        		return;
	        	}
				this.isLoading = true;
				let _myScrollY = this.myScroll.maxScrollY;
	        	this.query(1).then(()=>{
        			this.isLoading = false;
        			if(this.up.state != 3) {
        				this.updateUpState(0);
        			} 
        			if(this.myScroll.maxScrollY > _myScrollY) {
        				this.resizeIScrollPosition(this.myScroll.maxScrollY + this.upElHeight);
        			}
	        	});
	        },
	        // 修改下拉刷新状态
	        updateDownState(state){
	        	if(this.down && this.down.state != state) {
					this.$set(this.down, "state", state);
				}
	        	if(this.directionY != 1) {
	        		this.directionY = 1;
	        	}
	        },
	        // 修改上拉加载状态
	        updateUpState(state){
	        	if(this.up && this.up.state != state) {
					this.$set(this.up, "state", state);
				}
	        	if(this.directionY != -1) {
	        		this.directionY = -1;
	        	}
	        },
	        // 返回到顶部
	        gotoTop() {
	        	if(this.isLoading) {
	        		// 正在加载中
	        		mui.toast("正在加载数据，请稍后操作!");
	        		return;
	        	}
	        	this.$nextTick(()=>{
	        		this.resizeIScrollPosition();
	        	});
	        },
	        // 当正在加载时让屏幕不准滑动
	        touchEvent(e) {
	        	if(this.isLoading) {
	        		e.preventDefault();
	        		e.stopPropagation();
	        	}
	        },
	        // 销毁
	        destroy(){
	        	if(this.myScroll) this.myScroll.destroy();
	        }
	    },
	    destroyed(){
	    	if(this.myScroll) this.myScroll.destroy();
	    }
    }
</script>
<style lang="less">
	.list-pull-loading {
		width: 100%;
		height: 100%;
		overflow: hidden;
		flex: 1;
		display: flex;
		flex-direction: column;
		
		.loading-mask {
			height: 100%;
		    width: 100%;
		    position: absolute;
		    opacity: 0;
		    z-index: 99;
     		top: 0;
     		left: 0;
		}
		/** 滑动样式禁用 **/
		/*&.disabled-iscroll::before {
		    position: fixed;
		    top: 0;
		    left: 0;
		    z-index: 99;
		    width: 100%;
		    height: 100%;
		    content: '';
		}*/
		
		.list-pull-loading-box {
			position: relative;
			flex: 1;
			/*overflow: hidden;*/
			height: 100%;
			/* Prevent native touch events on Windows */
			-ms-touch-action: none;
			touch-action:none;
			
			.list-pull-loading-scroller {
				min-height: auto;
				/*height: 100%; 这里不能设置高度，因为iScroll设置100%无法获取到准确位置*/
				position: absolute;
				/* Prevent elements to be highlighted on tap */
				-webkit-tap-highlight-color: rgba(0,0,0,0);
				/* Put the scroller into the HW Compositing layer right from the start */
				-webkit-transform: translateZ(0);
				-moz-transform: translateZ(0);
				-ms-transform: translateZ(0);
				-o-transform: translateZ(0);
				transform: translateZ(0);
				-webkit-touch-callout: none;
				-webkit-user-select: none;
				-moz-user-select: none;
				-ms-user-select: none;
				user-select: none;
				-webkit-text-size-adjust: none;
				-moz-text-size-adjust: none;
				-ms-text-size-adjust: none;
				-o-text-size-adjust: none;
				text-size-adjust: none;
				width: 100%;
				
				.tips-text {
					display: inline-block;
				    font-size: 12px;
				    color: gray;
				    vertical-align: middle;
				}
				
				/*下拉刷新区域*/
				.pull-down-tips, .pull-up-tips {
					height: 60px;
					width: 100%;
					overflow: hidden;
					text-align: center;
					font-size: 12px;
					
					&.down-margin {
						margin-top: -60px;
					}
					
					&.loading {
						margin-top: 0px;
						position: relative;
					}
					
					.tips-content {
						left: 0;
						bottom: 0;
						width: 100%;
						min-height: 30px;
						padding: 5px;
						
						.unload {
							height: 30px;
							line-height: 30px;
							width: 100%;
							
							.arrow {
								display: inline-block;
								width: 20px;
								height: 20px;
								background-image: url(./imgs/arrow.png);
								background-size: contain;
								vertical-align: middle;
								-webkit-transition: all 300ms;
								transition: all 300ms;
								margin: 0px 0px 3px;
							}
							
							.arrow-normal {
								transform: rotate(0deg);
						        transform: -webkit-rotate(0deg);
						        transform: -moz-rotate(0deg);
						        transform: -o-rotate(0deg);
						        transform: -ms-rotate(0deg);
							}
							
							.arrow-rotate {
								transform: rotate(180deg);
						        transform: -webkit-rotate(180deg);
						        transform: -moz-rotate(180deg);
						        transform: -o-rotate(180deg);
						        transform: -ms-rotate(180deg);
							}
						}
						
						.onload {
							height: 30px;
							line-height: 30px;
							width: 100%;
							
							.progress {
								display: inline-block;
								width: 20px;
							    height: 20px;
							    border: none;
							    margin: auto;
							    background-size: contain;
							    margin-right: 8px;
						    	stroke: #AAAAAA;
						    	fill: #fff;
						    	svg {
						    		margin: 5px;
						    		display: block;
						    		position: relative;
						    		width: 100%;
						    		height: 100%;
						    	}
							}
						}
						
						.last-time-text {
							height: 20px;
							line-height: 20px;
						}
					}
				}
				
				.pull-up-tips {
					position: relative;
					.onload, .unload, .no-more {
						position: absolute;
						bottom: 5px;
					}
					
					
					.no-more {
						height: 30px;
						line-height: 30px;
					    width: 100%;
					    
					    .icon {
					    	display: inline-block;
							width: 60px;
							height: 30px;
							background-image: url(./imgs/no-more.png);
							background-size: 60px 30px;
							background-repeat: no-repeat;
							vertical-align: middle;
					    }
					}
				}
				
				.no-data {
					background: #f0eff4;
				    text-align: center;
				    position: absolute;
				    z-index: 99;
				    width: 100%;
				    height: 100%;
				    font-size: 15px;
				    padding-top: 60px;
				    top: 0;
				    
				    img {
				    	width: 120px;
				    	margin-top: 30%;
				    }
				}
			}
		}
		.go-top {
			position: absolute;
			z-index: 99;
		    bottom: 80px;
		    right: 10px;
		    width: 50px;
		    height: 55px;
		}
		
		.fade-enter-active {
		  animation: bounce-in .5s;
		}
		
		.fade-leave-active {
		  animation: bounce-in .5s reverse;
		}
		
		@keyframes bounce-in {
		  0% {
		    transform: scale(0);
		  }
		  50% {
		    transform: scale(1.5);
		  }
		  100% {
		    transform: scale(1);
		  }
		}
	}
</style>