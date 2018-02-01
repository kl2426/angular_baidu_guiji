app.controller('modalSiteNewCtrl', ['$scope', '$timeout', 'globalFn', 'httpService','$modal','items','$modalInstance','toaster', function($scope, $timeout, globalFn, httpService,$modal,items,$modalInstance,toaster) {
	
	$scope.items = items;
	
	//   data
	$scope.data = {
		//  form
		form:{
			//   设备
			mcode:'000001',
			//   昵称
			nick:'',
			//   手机
			mobile:''
		}
	}
	
	
	//   添加
	var add = function(){
		//
		httpService.ajaxPost(httpService.API.href + '/user/add',{
			mcode: $scope.data.form.mcode,
			name: $scope.data.form.nick,
			number: $scope.data.form.mobile
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					//
					toaster.pop('success','成功', '添加成功');
					$modalInstance.close(true);
				}else{
					//
					toaster.pop('warning','失败', '添加失败');
				}
			});
	}
	
	
	
	//   编辑
	var edit = function(){
		//
		httpService.ajaxPost(httpService.API.href + '/user/edit',{
			userid: $scope.data.form.id,
			name: $scope.data.form.nick,
			number: $scope.data.form.mobile
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					//
					toaster.pop('success','成功', '修改成功');
					$modalInstance.close(true);
				}else{
					//
					toaster.pop('warning','失败', '修改失败');
				}
			});
	}
	
	
	
	//  close
	$scope.cancel = function() {
		$modalInstance.close(false);
	};
	
	$scope.ok = function(){
		if($scope.data.form.mcode.length < 1){
			toaster.pop('warning','失败', '设备不能为空');
			return false;
		}
		if($scope.data.form.nick.length < 1){
			toaster.pop('warning','失败', '昵称不能为空');
			return false;
		}
		if($scope.data.form.mobile.length < 1){
			toaster.pop('warning','失败', '手机不能为空');
			return false;
		}
		if($scope.items.operate == 'edit'){
			edit();
		}else{
			add();
		}
	}

	/**
	 * run
	 */
	var run = function() {
		//   
		if($scope.items.operate == 'edit'){
			$scope.data.form = angular.extend({},$scope.data.form, $scope.items.item);
		}
	}
	run();


}]);



app.controller('modalSiteWaterCtrl', ['$scope', '$timeout', 'globalFn', 'httpService','$modal','items','$modalInstance', function($scope, $timeout, globalFn, httpService,$modal,items,$modalInstance) {
	
	$scope.items = items;
	
	//  名称 
	$scope.file = '';
	
	//  close
	$scope.cancel = function() {
		$modalInstance.close('');
	};
	
	$scope.ok = function(){
		if($scope.title.length < 1){
			return false;
		}
		$modalInstance.close($scope.title);
	}

	/**
	 * run
	 */
	var run = function() {
		//   
	}
	run();


}]);