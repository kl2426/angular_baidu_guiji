//   视频播放控制器
app.controller('modalLocusPlayCtrl', ['$scope', '$timeout', 'globalFn', 'httpService','$modal','items','$modalInstance','toaster', function($scope, $timeout, globalFn, httpService,$modal,items,$modalInstance,toaster) {
	
	$scope.items = items;
	
	
	//   data
	$scope.data = {
		//
		user_item: null,
		//   单点轮询时的轨迹 坐标用户数组
		long_lat:[],
		//
		device_items:[],
		//  user
		user_items:[],
		//  video
		video_items:[],
		//  form
		form:{
			//  标题
			title:'',
			//  chekd
			device:[],
			'start': '',
			'end': '',
			//  发送消息
			'msg':''
		},
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
		console.log(overlays);
		//
		$scope.status = 'list';
	}
	
	
	//   轨迹-得到所有人员信息
	var getList = function(){
		//
		httpService.ajaxPost(httpService.API.href + '/user/all',{
			mcode: $scope.items.scope.app.user_info.mcode
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					$scope.data.device_items = res.data.data.users;
					//  当前用户
					for(var i in $scope.data.device_items){
						if($scope.data.device_items[i].id == $scope.items.item.userid){
							$scope.data.user_item = $scope.data.device_items[i];
							break;
						}
					}
				}else{
					$scope.data.device_items = [];
				}
			});
	}
	
	
	//   视频转发
	$scope.transfer = function(){
		//  选中用户
		var temp_userids = [];
		for(var i in $scope.data.form.device){
			temp_userids.push($scope.data.form.device[i].id);
		}
		if(temp_userids.length < 1){
			toaster.pop('warning','失败', '用户必选');
			return false;
		}
		//
		httpService.ajaxPost(httpService.API.href + '/user/transfer',{
			eid: $scope.items.item.id,
			userids: temp_userids.length > 0 ? temp_userids.join(',') : ''
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					//
					toaster.pop('success','成功', '视频转发成功');
				}else{
					//
					toaster.pop('warning','失败', '视频转发失败');
				}
			});
	}
	
	
	//   摄像头操作 order 指令内容 1：远程启动摄像头 2：切换摄像头 3： 关闭摄像头
	$scope.sendorder = function(item, order){
		var temp_msg = '';
		switch(order){
			case '1':
				temp_msg = '远程启动摄像头';
			break;
			case '2':
				temp_msg = '切换摄像头';
			break;
			case '3':
				temp_msg = '关闭摄像头';
			break;
		}
		//
		httpService.ajaxPost(httpService.API.href + '/user/sendorder',{
			userid: item.userid,
			order: order
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					//
					toaster.pop('success','成功', temp_msg + '成功');
				}else{
					//
					toaster.pop('warning','失败', temp_msg + '失败');
				}
			});
	}
	
	// 
	$scope.hasHover = false;
	//  hover
	$scope.hoverStart = function(){
		$scope.hasHover = true;
	}
	
	$scope.hoverEnd = function(){
		$scope.hasHover = false;
	}
	
	
	
	
	//  close
	$scope.cancel = function() {
		$modalInstance.close(false);
	};
	
	$scope.ok = function(){
		$modalInstance.close(true);
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





