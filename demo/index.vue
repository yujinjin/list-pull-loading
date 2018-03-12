<template>
	<div class="index">
		<ul class="list-panel">
			<li>
				<router-link :to="{name: 'demo1'}">
					<img src="./imgs/demo1.jpeg">
					<div class="text-describe">
						demo1:普通的数据列表，列表占整个页面内容。
					</div>
				</router-link>
			</li>
			<li>
				<router-link :to="{name: 'demo2'}">
					<img src="./imgs/demo2.jpeg"/>
					<div class="text-describe">
						demo2:带tab分类的数据列表
					</div>
				</router-link>
			</li>
			<li>
				<router-link :to="{name: 'demo3'}">
					<img src="./imgs/demo3.jpeg"/>
					<div class="text-describe">
						demo3:带图片懒加载数据列表，目前demo的图片懒加载使用的是vue-azyload插件。
					</div>
				</router-link>
			</li>
			<li>
				<router-link :to="{name: 'demo4'}">
					<img src="./imgs/demo4.jpeg"/>
					<div class="text-describe">
						demo4:算是数据缓存的解决方案吧，主要是解决用户点击列表的链接跳转出该页面再返回时还原到上次点击列表中的位置，这样增加用户体验方便用户操作。
					</div>
				</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
	
</script>

<style lang="less" scoped="true">
	.index {
		.list-panel {
			li {
				padding: 0;
			    background: #fff;
			    margin-bottom: 10px;
			    color: #333;
			    
			    a {
			    	position: relative;
				    display: block;
				    overflow: hidden;
				    margin: 0;
				    padding: inherit;
				    
				    img {
				    	max-width: 100%;
					    border: 0;
					    vertical-align: middle;
					    display: block;
					    height: calc(~'100vw / 750 * 400');
					    max-height: calc(~'540px / 750 * 400');
					    width: 100%;
				    }
				    
				    .text-describe {
				    	padding: 10px;
    					line-height: 1.8em;
					    font-weight: normal;
					    font-size: 12px;
					    color: #666;
					    max-width: 100%;
					    white-space: normal;
					    text-overflow: ellipsis;
					    overflow: hidden;
					    display: -webkit-box;
					    -webkit-line-clamp: 3;
					    -webkit-box-orient: vertical;
				    }
			    }
			}
		}
	}
</style>