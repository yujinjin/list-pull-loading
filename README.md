## 前言
list-pull-loading是一个基于VUE实现的下拉刷新，上拉加载的组件，支持图片懒加载，数据缓存（返回列表页记住当前位置）。主使用IScroll（iscroll-probe）来实现，提供了项目中数据列表经常会用到的下拉提示信息、上拉提示信息、图片懒加载、回到顶部，其提示信息UI、内容可灵活配置，可使用提供的默认样式也可以自定义也可以隐藏。

列表初始化时也做了优化，对于没有列表数据时显示没有数据的提示信息（可自定义），对于首次加载的数据没有超过一屏时会自动加载下一页的数据，但最多只会自动加载2次（可配置）。



## 示例
demo使用了vue2+vuex3+vue-router3，对于图片懒加载使用的是vue-lazyload第三方插件。

[示例一](https://yujinjin.github.io/list-pull-loading)

![image](https://note.youdao.com/yws/public/resource/8cea9a8eae140b99ef9a0843d5a96d81/xmlnote/040A526107FE42D28DC0C671084467A0/3908)

说明：普通示例

[示例二](https://yujinjin.github.io/list-pull-loading)

![image](https://note.youdao.com/yws/public/resource/8cea9a8eae140b99ef9a0843d5a96d81/xmlnote/4AAE2CB68982409A95EBEE1F9476CA3C/3915)

说明：多个tap分类数据列表

[示例三](https://yujinjin.github.io/list-pull-loading)

![image](https://note.youdao.com/yws/public/resource/8cea9a8eae140b99ef9a0843d5a96d81/xmlnote/105DA40582E24A91B11BF663F9173F0F/3918)

说明：数据列表中有图片而且图片还使用了懒加载的方式。

[示例四](https://yujinjin.github.io/list-pull-loading)

![image](https://note.youdao.com/yws/public/resource/8cea9a8eae140b99ef9a0843d5a96d81/xmlnote/6749738410B64D9696EA2A6563BCA338/3923)

说明：数据列表中的链接跳转到其它页面，再返回时自动加载到上一次看到的状态位置。

## 运行项目
clone项目到本地，进入项目文件夹，安装依赖

```javascript
git clone https://github.com/yujinjin/list-pull-loading.git
cd list-pull-loading
npm install
```
运行demo，会自动打开浏览器地址运行
```javascript
npm run demo
```
编译打包项目
```javascript
npm run compile
```

## NPM
```javascript
npm install list-pull-loading
```
## 依赖
- VUE
- IScroll(iscroll-probe)
## CDN
https://apps.bdimg.com/libs/list-pull-loading/1.0.0/list-pull-loading.js

https://apps.bdimg.com/libs/list-pull-loading/1.0.0/list-pull-loading.css
```html
<script src="https://apps.bdimg.com/libs/list-pull-loading/1.0.0/list-pull-loading.js"></script>
<link href="https://apps.bdimg.com/libs/list-pull-loading/1.0.0/list-pull-loading.css" rel="stylesheet">
<script>
  Vue.use(ListPullLoading)
  ...
</script>
```
## 使用
作为插件
```javascript
import Vue from 'vue'
import ListPullLoading from 'list-pull-loading'
import 'list-pull-loading/dist/list-pull-loading.css'

// VUE use
Vue.use(ListPullLoading);
// or with options
Vue.use(ListPullLoading, {
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
		scrollbars: false,
		preventDefault: true
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
});
```
作为组件
```javascript
import Vue from 'vue'
import {listPullLoading} from 'list-pull-loading'
import "list-pull-loading/dist/list-pull-loading.css"

new Vue({
    // ...
    components: {
        "list-pull-loading": listPullLoading
    }
})
```
view层举例
```html
<list-pull-loading :options="options" ref="listPullLoading">
	<template slot="list">
		<ul>
			<li v-for="(dataItem,dataIndex) in dataList" :key="dataItem.id">
				<a>
					...
				</a>
			</li>
		</ul>
	</template>
</list-pull-loading>
```
注意
1. 由于组件使用了IScrol（iscroll-probe）来实现如果项目中是通过webpack来引入IScrol包一定要在webpack.config里配置IScrol的alias，具体如下：
```javascript
...
    resolve: {
        alias: {
            iscroll: 'iscroll/build/iscroll-probe'
        }
    }
...
```
2. 部分老androd机可能会有卡顿现象，建议加入以下css属性样式来提升硬件加速
```css
* {
    -webkit-overflow-scrolling: touch;
}
```
3. 发现在chrome浏览器中模拟webapp运行时鼠标滑动很不流畅，原因是新谷歌浏览滚动条的阻止默认事件会失效,所以得所有滚动区域都要加上touch-action:none 来解决。
```css
{
    ...
    touch-action: none;
    ...
}
```
4. 由于list-pull-loading组件的滚动不是body上滚动而是在内部盒子里滚动，所以在定义内部的盒子高度，特别是页面内局部滚动。

![image](https://note.youdao.com/yws/public/resource/8cea9a8eae140b99ef9a0843d5a96d81/xmlnote/16E8C8F333944E5C9C65A572EA0A29A6/4167)

## 配置选项

名称 | 描述 | 默认值 | 可选项
---|---|---|---
`isShowToTop` | 是否显示去顶部图标，默认显示 | `true` | `Boolean`
`initMaxTimes` | 初始化列表数据时，如果当前有足够的列表数据但查询的数据不足以覆盖到当前容器的底部会自动进行下一页数据加载，最多自动加载3次（包含初次）。<br><br>比如：数据初始化时每次只查询出5条数据，但实际当前的容器盒子需要13条数据才会覆盖到底部，这个时候组件会自动判断如果没有覆盖到底部会自动加载下一页。| `3` | `Number`
`noDataText` | 没有列表数据时的文案展示 | `没有找到相关的内容哦~` | `String`
`api` | 当前数据列表API函数，函数的返回值必须是Promise类型，必须配置。 | `null` | `Function`
`auto` | 是否自动查询，默认初始化会自动加载API数据 | `true` | `Boolean`
`imgResize` | 是否自动查询图片自适应，默认为false。最好不要设置为true，因为比较消耗资源。<br><br>原因是：true的情况下是应用于列表数据里有懒加载的图片但没有指定图片大小导致iScroll计算高度不准确需要的等图片加载完之后再重新计算高度。<br><br>当前都是通过监控图片的onload事件来刷新的，这样真的不爽但也没找到其他好的解决方案，所以最好是列表中有图片加载时就预先把高度预算好 | `true` | `Boolean`
`iScrollOptions` | iscroll的配置选项。<br><br>其中probeType的配置选项为3，否则拖动太快就监控不到。 | `{probeType: 3, mouseWheel: false, disableMouse: true, scrollbars: false, preventDefault: true, startY: 0}` | 具体可自行查询iscroll的[API](http://iscrolljs.com/)
`down` | 下拉刷新配置选项。<br><br>offset：列表下拉滚动的偏移px数量(number类型),即可触发下拉刷新的回调<br><br> initText：初始化文案，这个是在当前下来滚动未超过指定的值时显示文案 <br><br>notReleaseText:释放滚动加载时当前下拉高度还未回弹时的文案<br><br>loadingText:数据正在加载时的文案<br><br>state:当前加载时的状态(number类型)。0:初始化状态 1：未释放滚动加载时 2：正在加载时<br><br>isShowLastTimeText:是否显示最后更新时间提示| `down: {offset: 50, initText: "下拉刷新", notReleaseText: "松开刷新", loadingText: "正在加载更多", state: 0, isShowLastTimeText: true}` | `Object`
`up` | 上拉加载配置选项。<br><br>offset：列表上拉加载滚动的偏移px数量(number类型),即可触发加载数据的回调<br><br>initText：初始化文案，当上拉高度未超过指定的高度时<br><br>notReleaseText:未释放滚动加载时的文案，当前上拉高度超过指定的高度时且还未释放滚动时。<br><br>loadingText: 上拉API正在加载时的文案<br><br>noMoreText:没有数据时的文案<br><br>state:0:初始化状态 1：未释放滚动加载时 2：正在加载时 3: 没有更多数据了| `up: {offset: 50, initText: "上拉加载更多", notReleaseText: "松开加载更多", loadingText: "正在加载更多", noMoreText: "没有更多数据了...", state: 0}` | `Object`
`parameters` | API数据参数，默认只有maxResultCount:每次分页数据加载多少条，skipCount:每次查询数据的开始索引2个参数 | `{maxResultCount: 20, skipCount: 0}` | `Object`

## API
###### 1. refresh
刷新数据列表，有时根据实际的业务需要，需手动刷新列表数据。

```javascript
this.$refs['listPullLoading'].refresh();//listPullLoading是组件注册引用名称
```
###### 2. initIScrollCacheData
初始化列表的缓存数据，主要用于列表数据的缓存

```javascript
this.$refs['listPullLoading'].initIScrollCacheData(y=0, upState=0);//y 当前滚动条的y轴位置，upState 当前下拉列表的状态
```
###### 3. destroy
组件销毁

```javascript
this.$refs['listPullLoading'].destroy();//listPullLoading是组件注册引用名称
```

## 最后
- 如果喜欢一定要 star哈!!!（谢谢!!）

- 如果有意见和问题 请在 lssues提出，我会在线解答。
