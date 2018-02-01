//   设置
app.controller('siteCtrl', ['$scope', '$timeout', 'globalFn', 'httpService','$modal','toaster', function($scope, $timeout, globalFn, httpService,$modal,toaster) {
	
	
	
	//   data
	$scope.data = {
		//
		device_items:[
			{id:1,name:'99989898:91'},
			{id:1,name:'99989898:91'},
			{id:1,name:'99989898:91'},
			{id:1,name:'99989898:91'},
			{id:1,name:'99989898:91'},
			{id:1,name:'99989898:91'},
			{id:1,name:'99989898:91'},
		],
		//  form
		form:{
			//   设备
			mcode:'',
			//   昵称
			nick:'',
			//   手机
			mobile:''
		},
		//
		items:[]
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
	
	
	//  确定 完成
	$scope.select_checked_ok = function(){
		//   提交数据
		//console.log(overlays);
		//
		//$scope.status = 'list';
	}
	
	
	
	//   轨迹-得到所有人员信息
	var getList = function(){
		//
		httpService.ajaxPost(httpService.API.href + '/user/all',{
			mcode: $scope.app.user_info.mcode
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					$scope.data.items = res.data.data.users;
				}else{
					$scope.data.items = [];
				}
			});
	}
	
	
	//   删除
	$scope.siteDel = function(item){
		if(confirm('确定要删除吗？') == false){
			return false;
		}
		//
		httpService.ajaxPost(httpService.API.href + '/user/del',{
			userid:item.id
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					//
					toaster.pop('success','成功', '删除成功');
					getList();
				}else{
					//
					toaster.pop('warning','失败', '删除失败');
				}
			});
	}
	
	
	
	/**
	 * 添加
	 */
	$scope.add = function(operate, item){
		//   打开添加弹窗
		var modalInstance = $modal.open({
			templateUrl: 'tpl/site/modal-new.html',
			controller: 'modalSiteNewCtrl',
			windowClass:'m-modal-main',
			//size: size,
			resolve: {
				items: function() {
					return {
						'operate':operate,
						'item':item
					};
				},
				deps: ['$ocLazyLoad',
                    function( $ocLazyLoad ){
                      return $ocLazyLoad.load(['ui.select','toaster']).then(
                          function(){
                             return $ocLazyLoad.load(['js/controllers/site/modal.js']);
                          }
                      );
                    }
                ]
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol){
				getList();
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	/**
	 * 添加水印
	 */
	$scope.add_water = function(){
		//   打开添加弹窗
		var modalInstance = $modal.open({
			templateUrl: 'tpl/site/modal-water.html',
			controller: 'modalSiteWaterCtrl',
			windowClass:'m-modal-main',
			//size: size,
			resolve: {
				items: function() {
					return {};
				},
				deps: ['$ocLazyLoad',
                  function( $ocLazyLoad ){
                    return $ocLazyLoad.load(['js/controllers/site/modal.js']);
                }]
			}
		});

		modalInstance.result.then(function(title) {
			if(title.length > 0){
//				$state.go('app.timing.add', {title:title});
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
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