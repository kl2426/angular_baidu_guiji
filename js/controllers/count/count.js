//   统计
app.controller('countCtrl', ['$scope', '$timeout', 'globalFn', 'httpService','$modal','$filter','toaster', function($scope, $timeout, globalFn, httpService,$modal,$filter,toaster) {
	
	
	
	//   data
	$scope.data = {
		//
		device_items:[],
		//  form
		form:{
			//  标题
			userid:'',
			//  chekd
			device:[],
			'start': $filter('date')(new Date(), 'yyyy-MM-dd') + ' 00:00:00',
			'end': $filter('date')(new Date(), 'yyyy-MM-dd') + ' 23:59:59',
			type:2
		},
		//
		items:[],
		count_x: [],
		count_y: []
	}
	
	
    $scope.d = [ [1,6.5],[2,6.5],[3,7],[4,8],[5,7.5],[6,7],[7,6.8],[8,7],[9,7.2],[10,7],[11,6.8],[12,7] ];
	
	
	//  选中
	$scope.device_checked = function(item){
		for(var i in $scope.data.device_items){
			$scope.data.device_items[i].checked = false;
		}
		item.checked = !item.checked;
		if(item.checked){
			$scope.data.form.device = [item];
		}else{
			$scope.data.form.device = [];
		}
	}
	//  全选
	var device_checked_all_bol = false;
	$scope.device_checked_all = function(){
		return false;
		//
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
		statistics();
	}
	
	//
	$scope.$watch('data.form.start',function(newValue,oldValue, scope){
		if(newValue != oldValue){
			statistics();
		}
	});
	
	//
	$scope.$watch('data.form.end',function(newValue,oldValue, scope){
		if(newValue != oldValue){
			statistics();
		}
	});
	
	//
	$scope.$watch('data.form.type',function(newValue,oldValue, scope){
		if(newValue != oldValue){
			statistics();
		}
	});
	
	//   轨迹-得到所有人员信息
	var getList = function(){
		//
		httpService.ajaxPost(httpService.API.href + '/user/all',{
			mcode: $scope.app.user_info.mcode
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					$scope.data.device_items = res.data.data.users;
					if($scope.data.device_items && $scope.data.device_items.length > 0){
						$scope.data.device_items[0].checked = true;
						$scope.data.form.device = [$scope.data.device_items[0]];
					}
					statistics();
				}else{
					$scope.data.device_items = [];
				}
			});
	}
	
	
	//   
	var statistics = function(){
		if($scope.data.form.device.length < 1){
			toaster.pop('warning','失败', '设备必选');
			return false;
		}
		//
		httpService.ajaxPost(httpService.API.href + '/history/statistics',{
			userid: $scope.data.form.device ? $scope.data.form.device[0].id : '',
			stime: $scope.data.form.start,
			etime: $scope.data.form.end,
			type: $scope.data.form.type
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					$scope.data.items = res.data.data.datas;
					$scope.data.count_x = [];
					$scope.data.count_y = [];
					$timeout(function(){
						for(var i in $scope.data.items){
							$scope.data.count_x.push([+i + 1,$scope.data.items[i].sdate]);
							$scope.data.count_y.push([+i + 1,$scope.data.items[i].num]);
						}
					},100);
				}else{
					$scope.data.items = [];
				}
			});
	}
	
	

	/**
	 * run
	 */
	var run = function() {
		//  
		getList();
		//
	}
	run();


}]);