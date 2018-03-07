import listPullLoading from './list-pull-loading.vue';

var install = function(Vue, options){
	if (options) {
		listLoading.props.globalOptions.default = function(){
			return options;
		}
	}
	Vue.component("list-pull-loading", listPullLoading);
}

export { install, listPullLoading };
export default { install, listPullLoading };
