<template>
	<div class="view">
		<header class="navbar" v-show="isShowHeader">
            <a class="icon-left" @click.stop.prevent="goBack">
            	<i class="back"></i><span class="left-text">返回</span>
            </a>
            <div class="center">{{$store.state.navbarTitle}}</div>
            <a class="right-bar-text"></a>
	    </header>
		<router-view class="page" :class="{'content': isShowHeader}"></router-view>
	</div>
</template>
<script>
export default {
    data: function() {
        return {};
    },
    computed: {
    	isShowHeader(){
    		return this.$route.name != "index";
    	}
    },
    methods: {
    	goBack(){
    		this.$store.dispatch("updateDirection", "backing");
			if(window.history.length > 1) {
				this.$router.go(-1);
			} else {
				this.$router.push({"name":"index"});
			}
    	}
    }
}
</script>
<style lang="less">
	.view {
		margin: 0 auto;
	    width: 100%;
	    min-width: 320px;
	    max-width: 540px;
	    display: flex;
	    position: relative;
	    
	    /******** 图片懒加载样式 start *******/
		@-webkit-keyframes imgLazyFadeIn {
		    from {
		        opacity: 0;
		    }
		    to {
		        opacity: 1;
		    }
		}
		@keyframes imgLazyFadeIn {
		    from {
		        opacity: 0;
		    }
		    to {
		        opacity: 1;
		    }
		}
		
		img[lazy=loading] {
			background: #f1f1f1;
		}
		
		img[lazy=loaded], img[lazy=error] {
		    -webkit-animation-duration: 1s;
		    animation-duration: 1s;
		    -webkit-animation-fill-mode: both;
		    animation-fill-mode: both;
		    -webkit-animation-name: imgLazyFadeIn;
		    animation-name: imgLazyFadeIn;
		}
		/******** 图片懒加载样式 end *******/
		
		header {
			background: rgb(255, 255, 255);
			width: 100vw;
    		z-index: 999;
    		top: 0;
    		position: fixed;
		    right: 0;
		    left: 0;
		    height: 44px;
		    padding-right: 10px;
		    padding-left: 10px;
		    border-bottom: 0;
		    border-bottom: 1px solid #e6e4e4;
		    backface-visibility: hidden;
		    display: flex;
		    justify-content:space-between;
		    
		    .icon-left {
    			text-align: center;
    			width: 50px;
    			
		    	i.back {
		    		width: 12px;
				    height: 44px;
				    display: inline-block;
				    vertical-align: middle;
				    background-size: 100% auto;
				    background-position: center;
				    background-repeat: no-repeat;
				    font-style: normal;
				    position: relative;
		    		background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D'12'%20height%3D'20'%20viewBox%3D'0%200%2012%2020'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Cpath%20d%3D'M.18261596%209.4221638c.0352203-.05148305.07573462-.10050698.1215468-.14631917L9.1425872.4374202c.5830904-.58309038%201.52656832-.5849888%202.11643872.00488163.5857864.58578644.591222%201.53009836.0048816%202.11643873L3.82594417%209.9967039l7.43188553%207.4318855c.5830904.5830904.5849888%201.5265683-.0048817%202.1164387-.5857864.5857865-1.5300983.591222-2.11643868.0048816L.2980849%2010.7114853c-.3526746-.3526746-.3939974-.89699-.11546894-1.2893215z'%20fill%3D'%23007aff'%20fill-rule%3D'evenodd'%2F%3E%3C%2Fsvg%3E");
		    	}
		    	
		    	.left-text {
		    		margin-left: 5px;
		    		line-height: 44px;
		    		color: #007aff;
		    		font-size: 15px;
		    		display: inline-block;
		    	}
		    }
		    
		    .center {
		    	text-align: center;
		    	line-height: 44px;
		    	font-size: 17px;
		    	color: #000;
		    	text-overflow: ellipsis;
		    }
		    
		    .right-bar-text {
		    	width: 50px;
		    }
		}
		
		.page {
			padding-top: 0px;
    		margin-top: 0px;
    		height: auto;
    		min-height: 100vh;
    		width: 100%;
    		
    		&.content {
    			margin-top: 44px;
    			min-height: calc(~'100vh - 44px');
    		}
		}
	}
</style>