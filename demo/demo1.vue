<template>
	<div class="demo1">
		<list-pull-loading :options="options" ref="listPullLoading">
			<template slot="list">
				<ul class="media-list">
					<li v-for="(dataItem,dataIndex) in dataList" :key="dataItem.id" class="media-list-box">
						<a class="item-content">
							<div class="item-media">
								<img :src="dataItem.userPic">
							</div>
							<div class="item-media-body">
								<div class="item-title">{{dataItem.name||'匿名'}}</div>
								<p class="item-subtitle">{{dataItem.introduction}}</p>
								<p class="item-text">
									粉丝：<span class="qty">{{dataItem.fansQty}}</span>
									文章：<span class="qty">{{dataItem.collegeArticleQty}}</span>
									视频：<span class="qty">{{dataItem.collegeCourseQty}}</span>
								</p>
							</div>
						</a>
					</li>
				</ul>
			</template>
		</list-pull-loading>
	</div>
</template>

<script>
//	import {listPullLoading} from '../dist/list-pull-loading'
//	import "../dist/list-pull-loading.css"
	
	export default {
		data() {
			return {
				dataList: [],
				allData: null,
				options: {
					auto: true,
					parameters: {typeId: null},
					down: {
						offset: 50
					},
					api: this.queryList
				}, // 上拉下拉列表组件选项配置
			}
		},
		created(){
			let result = require("./data/list1.json").result;
			for(let i = 0; i < result.items.length; i++){
				result.items[i].userPic = require("./imgs/" + i%20 + ".jpg");
			}
			this.allData = result;
		},
		methods: {
			
			/**
			 * 数据列表查询
			 * @param {Object} parameters 数据查询列表的参数
			 * @param {Boolean} isLoadingMore 是否是在加载更多数据
			 * @return {Promise} Promise
			 **/
			queryList(parameters, isLoadingMore){
				var _this = this;
				return new Promise((resolve, reject) => {
					setTimeout(function(){
						let end = (_this.allData.items.length > parameters.skipCount + parameters.maxResultCount) ? parameters.skipCount + parameters.maxResultCount:_this.allData.items.length;
						if(isLoadingMore) {
							_this.dataList.push(..._this.allData.items.slice(parameters.skipCount, end));
						} else {
							_this.dataList = _this.allData.items.slice(parameters.skipCount, end);
						}
						resolve(end - parameters.skipCount);
					}, 500);
				});
			}
		}
	}
</script>

<style lang="less" scoped="true">
	.demo1 {
		width: 100%;
		
		.media-list {
			position: relative;
    		background: #efeff4;
		    padding-left: 0;
		    list-style: none;
		    
		    .media-list-box {
		    	background: #fff;
    			margin-bottom: 1px;
    			color: #333;
    			display: block;
    			position: relative;
    			padding: 11px 15px;
    			
    			.item-content {
		    		position: relative;
				    display: block;
				    overflow: hidden;
				    margin: -11px -15px;
				    padding: inherit;
				    white-space: nowrap;
				    -o-text-overflow: ellipsis;
				    text-overflow: ellipsis;
				    color: inherit;
				    
				    .item-media {
				    	line-height: 55px;
					    max-width: 55px;
					    width: 55px;
					    height: 55px;
					    position: relative;
					    margin-right: 10px;
					    float: left;
					    
					    img {
					    	border-radius: 50%;
					    	width: 100%;
					    }
				    }
				    
				    .item-media-body {
				    	overflow: hidden;
				    	
				    	.item-title {
				    		font-size: 16px;
    						line-height: 26px;
				    	}
				    	
				    	.item-subtitle {
				    		line-height: 20px;
				    		color: #666;
    						font-size: 12px;
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
				    		color: #999;
				    		font-size: 12px;
						    line-height: 26px;
						    margin-bottom: 0;
						    
						    .qty {
						    	color: #666;
    							margin-right: 21px;
						    }
				    	}
				    }
		   		}
		    }
		}
	}
</style>