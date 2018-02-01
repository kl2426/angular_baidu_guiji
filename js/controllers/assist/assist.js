//   协助
app.controller('assistCtrl', ['$scope', '$timeout', 'globalFn', 'httpService','$modal','$state','toaster', function($scope, $timeout, globalFn, httpService,$modal,$state,toaster) {
	
	
	//   百度地图配置
	$scope.baiduMapFn = function(e){
		console.log(e)
		var map = new BMap.Map("allmap");
		window.map = map;
		var point = new BMap.Point(116.404, 39.915);
	
		map.addControl(new BMap.NavigationControl());               // 添加平移缩放控件
		map.addControl(new BMap.ScaleControl());                    // 添加比例尺控件
		map.addControl(new BMap.OverviewMapControl());              //添加缩略地图控件
		map.enableScrollWheelZoom();                            //启用滚轮放大缩小
		// map.addControl(new BMap.MapTypeControl());          //添加地图类型控件
		map.disable3DBuilding();
		map.centerAndZoom(point, 14); 
		map.setMapStyle({style:'midnight'});
		
		//创建小狐狸
		var pt = new BMap.Point(116.417, 39.909);
		//  图标大小
		var icon_size = new BMap.Size(36,36);
		var myIcon = new BMap.Icon("img/user-001.png", icon_size, {imageSize: icon_size});
		var myIcon2 = new BMap.Icon("img/user-001.png", icon_size, {imageSize: icon_size});
		var marker2 = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
		map.addOverlay(marker2); 
		

	}
	
	//   data
	$scope.data = {
		//
		device_items:[],
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
			controller: 'modalAssistNewCtrl',
			windowClass:'m-modal-main',
			//size: size,
			resolve: {
				items: function() {
					return {};
				},
				deps: ['$ocLazyLoad',
                  function( $ocLazyLoad ){
                    return $ocLazyLoad.load(['js/controllers/assist/modal.js']);
                }]
			}
		});

		modalInstance.result.then(function(title) {
			if(title.length > 0){
				$state.go('app.assist.add', {title:title});
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	//   取列表
	var list = function(){
		//
		httpService.ajaxPost(httpService.API.href + '/user/rlation/list',{
			mcode: $scope.app.user_info.mcode,
			name: $scope.data.form.name
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					$scope.data.items = res.data.data.relations;
				}else{
					$scope.data.items = [];
				}
			});
	}
	
	
	
	//   删除
	$scope.assistDel = function(item){
		if(confirm('确定要删除吗？') == false){
			return false;
		}
		//
		httpService.ajaxPost(httpService.API.href + '/user/rlation/del',{
			rid: item.id
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
	
	//   edit
	$scope.item = null;
	$scope.edit = function(item){
		$scope.item = item;
		$state.go('app.assist.add', {operate:'edit'});
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
app.controller('assistAddCtrl', ['$scope', '$timeout', 'globalFn', 'httpService','$modal','$stateParams','$state','toaster', function($scope, $timeout, globalFn, httpService,$modal,$stateParams,$state,toaster) {
	
	
	//   data
	$scope.data = {
		//
		device_items:[],
		//  form
		form:{
			//  状态
			operate: $stateParams.operate,
			//  标题
			title: $stateParams.title,
			//  chekd
			device:[],
			'start': '',
			'end': ''
		},
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
		//   选中办案人员
		var temp_bol = true;
		for(var i in $scope.data.device_items){
			if($scope.data.device_items[i].checked_banan){
				temp_bol = false;
				break;
			}
		}
		if(temp_bol){
			$scope.data.device_items[0].checked_banan = true;
		}
		//  选中协助人员
		for(var i in $scope.data.device_items){
			if($scope.data.device_items[i].checked_banan){
				$scope.data.device_items[i].checked_xiezhu = false;
			}else{
				$scope.data.device_items[i].checked_xiezhu = true;
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
	
	
	//   banan xiezhu
	$scope.banAn = function(str, item, bol){
		if(str == 'banan'){
			if(bol){
				for(var i in $scope.data.device_items){
					$scope.data.device_items[i].checked_banan = false;
				}
				item.checked_banan = true;
			}else{
				item.checked_banan = false;
			}
			
		}
		if(str == 'xiezhu'){
			if(bol && item.checked_banan == false){
				item.checked_xiezhu = true;
			}else{
				item.checked_xiezhu = false;
			}
		}
		if(!item.checked_banan && !item.checked_xiezhu){
			item.checked = false;
		}else{
			item.checked = true;
		}
	}
	
	
	
	//   添加
	var add = function(){
		// 
		//  选中用户
		var temp_userids = [];
		for(var i in $scope.data.device_items){
			if($scope.data.device_items[i].checked_xiezhu){
				temp_userids.push($scope.data.device_items[i].id);
			}
		}
		var userid = '';
		for(var i in $scope.data.device_items){
			if($scope.data.device_items[i].checked_banan){
				userid = $scope.data.device_items[i].id;
			}
		}
		
		if($scope.data.form.title.length < 1){
			toaster.pop('warning','失败', '名称不能为空');
			return false;
		}
		if(userid.length < 1){
			toaster.pop('warning','失败', '办案人员不能为空');
			return false;
		}
		
		//
		httpService.ajaxPost(httpService.API.href + '/user/rlation/add',{
			mcode: $scope.app.user_info.mcode,
			userid: userid,
			name: $scope.data.form.title,
			uids: temp_userids.length > 0 ? temp_userids.join(',') : ''
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					//
					toaster.pop('success','成功', '新建成功');
					$state.go('app.assist',{},{reload:true});
				}else{
					//
					toaster.pop('warning','失败', '新建失败');
				}
			});
	}
	
	
	
	//   添加
	var edit = function(){
		// 
		//  选中用户
		var temp_userids = [];
		for(var i in $scope.data.device_items){
			if($scope.data.device_items[i].checked_xiezhu){
				temp_userids.push($scope.data.device_items[i].id);
			}
		}
		var userid = '';
		for(var i in $scope.data.device_items){
			if($scope.data.device_items[i].checked_banan){
				userid = $scope.data.device_items[i].id;
			}
		}
		
		if($scope.data.form.title.length < 1){
			toaster.pop('warning','失败', '名称不能为空');
			return false;
		}
		if(userid.length < 1){
			toaster.pop('warning','失败', '办案人员不能为空');
			return false;
		}
		
		//
		httpService.ajaxPost(httpService.API.href + '/user/rlation/edit',{
			id: $scope.app.user_info.mcode,
			name: $scope.data.form.title,
			uids: temp_userids.length > 0 ? temp_userids.join(',') : ''
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					//
					toaster.pop('success','成功', '修改成功');
					$state.go('app.assist',{},{reload:true});
				}else{
					//
					toaster.pop('warning','失败', '修改失败');
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
		if($scope.data.form.operate && $scope.data.form.operate == 'edit'){
			$scope.data.form.title = $scope.item.name;
		}
	}
	run();


}]);


