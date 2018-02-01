app.controller('timingCtrl', ['$scope', '$timeout', 'globalFn', 'httpService','$modal','$state','toaster', function($scope, $timeout, globalFn, httpService,$modal,$state,toaster) {
	
	
	
	//   data
	$scope.data = {
		//  form
		form:{
			//  标题
			title:'',
			//  chekd
			device:[],
			//  区域名称
			name:''
		},
		//
		items:[]
	}
	
	
	/**
	 * 添加
	 */
	$scope.add = function(){
		//   打开添加弹窗
		var modalInstance = $modal.open({
			templateUrl: 'tpl/timing/modal-new.html',
			controller: 'modalTimingNewCtrl',
			windowClass:'m-modal-main',
			//size: size,
			resolve: {
				items: function() {
					return {};
				},
				deps: ['$ocLazyLoad',
                  function( $ocLazyLoad ){
                    return $ocLazyLoad.load(['js/controllers/timing/modal.js']);
                }]
			}
		});

		modalInstance.result.then(function(title) {
			if(title.length > 0){
				$scope.data.form.title = title;
				$state.go('app.timing.add', {title:title});
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	
	
	//   取列表
	var list = function(){
		//
		httpService.ajaxPost(httpService.API.href + '/userset/timing/list',{
			mcode: $scope.app.user_info.mcode,
			name: $scope.data.form.name
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					$scope.data.items = res.data.data.stimes;
				}else{
					$scope.data.items = [];
				}
			});
	}
	
	
	//   删除
	$scope.timingDel = function(item){
		if(confirm('确定要删除吗？') == false){
			return false;
		}
		//
		httpService.ajaxPost(httpService.API.href + '/userset/timing/del',{
			tid: item.id
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					//
					toaster.pop('success','成功', '删除成功');
					list();
				}else{
					//
					toaster.pop('warning','失败', '删除失败');
				}
			});
	}
	

	/**
	 * run
	 */
	var run = function() {
		//   
		list();
	}
	run();


}]);


/**
 * 定时 - 添加
 */
app.controller('timingAddCtrl', ['$scope', '$timeout', 'globalFn', 'httpService','$modal','$stateParams','$state','toaster', function($scope, $timeout, globalFn, httpService,$modal,$stateParams,$state,toaster) {
	
	
	//   data
	$scope.data = {
		//
		device_items:[],
		//  form
		form:{
			//  标题
			title: $stateParams.title,
			//  chekd
			device:[],
			'start': '',
			'end': ''
		}
	}
	
	
	//  选中
	$scope.device_checked = function(item){
		item.checked = !item.checked;
		$scope.data.form.device = [];
		for(var i in $scope.data.device_items){
			if($scope.data.device_items[i].checked){
				$scope.data.form.device.push($scope.data.device_items[i]);
			}
		}
	}
	//  全选
	var device_checked_all_bol = false;
	$scope.device_checked_all = function(){
		$scope.data.form.device = [];
		if(device_checked_all_bol){
			device_checked_all_bol = false;
			for(var i in $scope.data.device_items){
				$scope.data.device_items[i].checked = true;
				$scope.data.form.device.push($scope.data.device_items[i]);
			}
		}else{
			device_checked_all_bol = true;
			for(var i in $scope.data.device_items){
				$scope.data.device_items[i].checked = false;
			}
		}
	}
	
	
	//   轨迹-得到所有人员信息
	var getList = function(){
		//
		httpService.ajaxPost(httpService.API.href + '/user/all',{
			mcode: $scope.app.user_info.mcode
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					$scope.data.device_items = res.data.data.users;
				}else{
					$scope.data.device_items = [];
				}
			});
	}
	
	
	//   添加
	var add = function(){
		//  选中用户
		var temp_userids = [];
		for(var i in $scope.data.form.device){
			temp_userids.push($scope.data.form.device[i].id);
		}
		//
		httpService.ajaxPost(httpService.API.href + '/userset/timing/add',{
			mcode: $scope.app.user_info.mcode,
			name: $scope.data.form.title,
			uids: temp_userids.length > 0 ? temp_userids.join(',') : '',
			stime: $scope.data.form.start,
			etime: $scope.data.form.end
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					//
					toaster.pop('success','成功', '新建成功');
					$scope.data.form.title = '';
					$state.go('app.timing',{},{reload:true});
				}else{
					//
					toaster.pop('warning','失败', '新建失败');
				}
			});
	}
	
	
	
	
	
	/**
	 * 提交
	 */
	$scope.send = function(){
		add();
	}
		

	/**
	 * run
	 */
	var run = function() {
		//   
		getList();
	}
	run();


}]);


