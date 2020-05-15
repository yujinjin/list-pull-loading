<template>
	<div class="demo2">
		<div class="type-tabs" ref="scrollbars">
			<div class="scroll-tabs">
				<a class="tab-item" :key="typeItem.id" @click.stop.prevent="gotoMaterialsListHandle(typeItem.id, index)" v-for="(typeItem, index) in typeList" :class="{active: index===currentTypeIndex}">
					<span>{{typeItem.name}}</span>
				</a>
			</div>
		</div>
		<div class="slider-group">
			<div class="slider-item active">
				<div class="scroll-wrapper">
					<list-pull-loading :options="options" ref="listPullLoading">
						<template v-slot:list>
							<ul class="media-list">
								<li v-for="dataItem in materialsList" :key="dataItem.id" class="media-list-box">
									<a>
										<img :src="dataItem.imgUrl">
										<div class="item-media-body">
											<span class="item-title">{{dataItem.title}}</span>
											<p class="item-text">
												<span class="author">{{dataItem.healthManagerName||dataItem.creatorName}}</span>
												<span>{{dataItem.enabledTime | dateFormat}}</span>
											</p>
										</div>
									</a>
								</li>
							</ul>
						</template>
					</list-pull-loading>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import IScroll from "iscroll";
	
	export default {
		data() {
			return {
				typeList: [], // 当前分类列表
				currentTypeIndex: 0, // 当前选择分类列表的索引
				typeScroll: null, // 当前分类列表的scroll实例
				materialsList: [],
				options: {
					auto: false, 
					parameters: {categoryId: null}, 
					api: this.queryMaterials
				} // 上拉下拉列表组件选项配置
			}
		},
		beforeRouteUpdate(to, from, next){
			this.options.parameters.categoryId = this.categoryId = to.query.categoryId;
			next();
			this.$nextTick(() => {
				this.$refs['listPullLoading'].refresh();
			});
			this.scrollToTypeElement();
		},
		created(){
			this.init();
		},
		filters: {
			dateFormat(data){
				if(!data){
					return "";
				}
				let date = new Date(data), fmt = "yyyy-MM-dd hh:mm";
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
			}
		},
		methods: {
			init(){
				this.queryTypes().then(()=>{
					this.initScroll();
					if(this.$route.query.categoryId) {
						this.options.parameters.categoryId = this.$route.query.categoryId;
						this.scrollToTypeElement();
					} else {
						this.options.parameters.categoryId = this.typeList[0].id;
					}
					this.options.auto = true;
				});
			},
			initScroll(){
				this.$nextTick(()=>{
					let aItemElements = this.$refs["scrollbars"].querySelectorAll("a.tab-item");
					let width = 0;
					for(let i = 0; i < aItemElements.length; i ++) {
						width += aItemElements[i].offsetWidth;
					}
					this.$refs["scrollbars"].querySelector(".scroll-tabs").style.width = width + "px";
					this.typeScroll = new IScroll(this.$refs["scrollbars"], {
						scrollX: true,
						scrollY: false
					});
				});
			},
			// 滚动到分类
			scrollToTypeElement(){
				if(!this.typeScroll || !this.options.parameters.categoryId) {
					return;
				}
				let el = this.$refs["scrollbars"].querySelectorAll("a.tab-item")[this.typeList.findIndex(item => item.id == this.options.parameters.categoryId)];
				this.typeScroll.scrollToElement(el, 100, -100, 0);
			},
			queryTypes(){
				var _this = this;
				return new Promise((resolve, reject) => {
					setTimeout(function(){
						_this.typeList = require("./data/list2.json").result;
						resolve(_this.typeList);
					}, 100);
				});
			},
			queryMaterials(parameters, isLoadingMore){
				var _this = this;
				return new Promise((resolve, reject) => {
					setTimeout(function(){
						let result = require("./data/list3.json").result, materialsList = [];
						result.items.forEach((item) => {
							if(item.typeId === parameters.categoryId){
								item.imgUrl = require("./imgs/" + materialsList.length%20 + ".jpg");
								materialsList.push(item);
							}
						});
						let end = (materialsList.length > parameters.skipCount + parameters.maxResultCount) ? parameters.skipCount + parameters.maxResultCount:materialsList.length;
						if(isLoadingMore) {
							_this.materialsList.push(...materialsList.slice(parameters.skipCount, end));
						} else {
							_this.materialsList = materialsList.slice(parameters.skipCount, end);
						}
						resolve(end - parameters.skipCount);
					}, 300);
				});
			},
			gotoMaterialsListHandle(categoryId, currentTypeIndex){
				if(this.categoryId === categoryId){
					return;
				}
				this.currentTypeIndex = currentTypeIndex;
				this.$router.replace({name: 'demo2', query: {categoryId: categoryId}});
			}
		}
	}
</script>

<style lang="less" scoped="true">
	.demo2 {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		
		.type-tabs {
			touch-action: none;
		    height: 45px;
		    background-color: #fff;
		    width: 100%;
		    text-align: center;
		    font-size: 15px;
    		font-weight: 400;
    		display: block;
    		overflow: hidden;
    		-ms-touch-action: none;
    		/*position: absolute;
    		left: 0;
    		right: 0;*/
    		
    		.scroll-tabs {
    			width: auto;
			    height: 40px;
			    float: left;
			    overflow-x: auto;
			    overflow-y: hidden;
			    /* Prevent elements to be highlighted on tap */
				-webkit-tap-highlight-color: rgba(0,0,0,0);
				/* Put the scroller into the HW Compositing layer right from the start */
				transform: translateZ(0);
				-webkit-touch-callout: none;
				user-select: none;
				text-size-adjust: none;
			    
			    a {
			    	border-bottom: 0;
			    	padding: 0 10px;
			    	display: inline-block;
    				width: auto;
    				line-height: 38px;
    				float: left;
    				touch-action:none;
    				
    				&:first-child {
						padding-left: 15px;
					}
					
					&:last-child {
						padding-right: 15px;
					}
    				
    				span {
    					color: #333;
					    font-size: 14px;
					    height: 45px;
					    line-height: 45px;
					    display: block;
					    position: relative;
    				}
    				
    				&.active span {
				    	color: #1aac19;
				    	
				    	&:after {
				    		width: 100%;
						    height: 2px;
						    background: #1aac19;
						    bottom: 0;
						    left: 0;
						    position: absolute;
						    content: "";
				    	}
				    }
			    }
    		}
		}
		
		.slider-group {
			position: relative;
    		height: 100%;
    		
    		.slider-item {
    			height: 100%;
    			border-top: 1px solid #e4e4e4;
    			display: none;
    			
    			&.active {
    				display: block;
    			}
    			
    			.scroll-wrapper {
    				height: 100%;
    				
    				.media-list {
    					margin: 10px 0;
    					background: #efeff4;
    					position: relative;
    					
    					.media-list-box {
    						background: #fff;
    						margin-bottom: 1px;
    						color: #333;
    						overflow: hidden;
    						padding: 5px;
    						
    						a {
    							position: relative;
							    display: block;
							    overflow: hidden;
							    padding: inherit;
							    white-space: nowrap;
							    text-overflow: ellipsis;
							    color: inherit;
							    
							    img {
							    	width: 75px;
								    max-width: 75px;
								    min-height: 75px;
								    height: 75px;
								    margin-left: 10px;
								    float: right;
							    }
							    
							    .item-media-body {
							    	overflow: hidden;
							    	
							    	.item-title {
							    		font-size: 15px;
									    color: #333;
									    line-height: 21px;
									    height: 42px;
									    font-weight: normal;
									    display: -webkit-box;
									    overflow: hidden;
									    white-space: normal !important;
									    -o-text-overflow: ellipsis;
									    text-overflow: ellipsis;
									    word-wrap: break-word;
									    -webkit-line-clamp: 2;
									    -webkit-box-orient: vertical;
							    	}
							    	
							    	.item-text {
							    		font-size: 12px;
									    color: #999;
									    margin: 5px 15px 5px 0;
									    text-align: left;
									    
							    		.author {
							    			margin-right: 15px;
							    		}
							    	}
							    }
    						}
    					}
    				}
    			}
    		}
		}
	}
</style>