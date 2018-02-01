//   历史
app.controller('historyCtrl', ['$scope', '$timeout', 'globalFn', 'httpService','$modal','$window','toaster', function($scope, $timeout, globalFn, httpService,$modal,$window,toaster) {
	
	//   百度地图配置
	//  map
	var map = null;
	//   百度地图配置
	$scope.baiduMapFn = function(element){
		var e = $(element[0]);
		//   地图自适应大小
    	var w = angular.element($window);
		w.bind('resize', function(){
			e.height(window.innerHeight - 55);
		})
		
		
		map = new BMap.Map("allmap");
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
//		var pt = new BMap.Point(116.417, 39.909);
//		//  图标大小
//		var icon_size = new BMap.Size(36,36);
//		var myIcon = new BMap.Icon("img/user-001.png", icon_size, {imageSize: icon_size});
//		var myIcon2 = new BMap.Icon("img/user-001.png", icon_size, {imageSize: icon_size});
//		var marker2 = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
//		map.addOverlay(marker2); 
//		
//		$scope.$apply();
	    
	}
	
	//  状态  list 列表    map 地图
	$scope.status = 'map';
	
	//   data
	$scope.data = {
		//
		video_items:[],
		//
		device_items:[],
		//  form
		form:{
			//  标题
			title:'',
			//  chekd
			device:[],
			'start': '',
			'end': ''
		},
		//
		items:[]
	}
	
	
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
	
	
	/**
	 * 创建人员图标
	 * @param {Object} lng
	 * @param {Object} lat
	 * @param {Object} icon_type 小图标类型： 1 小黄人不带摄像头   2 小黄人带摄像头  3 小红人不带摄像头  4 小红人带摄像头  5 小绿人不带摄像头  6 小绿人带摄像头  
	 * @param {Object} item  用户坐标item
	 * @return marker
	 */
	var newUserIconFn = function(lng, lat, icon_type, item){
		//  图标大小
		var icon_size = new BMap.Size(36,36);
		//创建坐标
		var pt = new BMap.Point(lng, lat);
		//
		var icon_name = 'img/usericon/user-001.png';
		switch(icon_type){
			case '1':
				icon_name = 'img/usericon/user-002.png';
			break;
			case '2':
				icon_name = 'img/usericon/user-001.png';
			break;
			case '3':
				icon_name = 'img/usericon/user-004.png';
			break;
			case '4':
				icon_name = 'img/usericon/user-003.png';
			break;
			case '5':
				icon_name = 'img/usericon/user-006.png';
			break;
			case '6':
				icon_name = 'img/usericon/user-005.png';
			break;
		}
		//
		var myIcon = new BMap.Icon(icon_name, icon_size, {imageSize: icon_size});
		var marker = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
		//  
		var item_user = {nick:'',mobile:''};
		for(var i in $scope.data.device_items){
			if($scope.data.device_items[i].id == item.userid){
				item_user = $scope.data.device_items[i];
				break;
			}
		}
		var title = '';
		if(item_user.mobile && item_user.mobile.length > 0){
			title = item_user.mobile;
		}
		if(item_user.nick && item_user.nick.length > 0){
			title = item_user.nick;
		}
		marker.setTitle(title);
		//   添加ID
		marker.locus_user_id = item_user.id;
		//
		return marker;
	}
	
	
	var newLineFn = function(items){
		//
		var temp_items = [];
		for(var i in items){
			var temp_p = new BMap.Point(items[i].longitude, items[i].latitude);
			temp_items.push(temp_p);
		}
		//
		//   第一个头像
		var mk = newUserIconFn(items[0].longitude, items[0].latitude, '1', items[0]);
		map.addOverlay(mk);
		//   最后一个头像
		var mk = newUserIconFn(items[items.length - 1].longitude, items[items.length - 1].latitude, '1', items[items.length - 1]);
		map.addOverlay(mk);
		//
		map.centerAndZoom(new BMap.Point(items[items.length - 1].longitude, items[items.length - 1].latitude), 12);
		//   添加线
		var polyline = new BMap.Polyline(temp_items, {
			enableEditing: false,//是否启用线编辑，默认为false
			enableClicking: true,//是否响应点击事件，默认为true
			icons:[],
			strokeWeight:'2',//折线的宽度，以像素为单位
			strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
			strokeColor: '#ffa45b' //折线颜色
		});
		map.addOverlay(polyline);
	}
	
	
	
	//  确定 完成
	$scope.select_checked_ok = function(){
		//   提交数据
		//console.log(overlays);
		//
		//$scope.status = 'list';
		
		videos();
		
	}
	
	
	//   区域选择
	$scope.quyu_click = function(){
		$scope.quyu_active = !$scope.quyu_active;
		if($scope.quyu_active){
			quyu[0].click();
		}else{
			tuodong[0].click();
			clearAll();
		}
	}
	
	
	//   切换地图
	$scope.select_status = function(){
		if($scope.status == 'list'){
			$scope.status = 'map';
		}else{
			$scope.status = 'list';
		}
	}
	
	
	
	/**
	 * 添加
	 */
	$scope.add = function(){
		//   打开添加弹窗
		var modalInstance = $modal.open({
			templateUrl: 'tpl/area/modal-new.html',
			controller: 'modalAreaNewCtrl',
			windowClass:'m-modal-main',
			//size: size,
			resolve: {
				items: function() {
					return {};
				},
				deps: ['$ocLazyLoad',
                  function( $ocLazyLoad ){
                    return $ocLazyLoad.load(['js/controllers/area/modal.js']);
                }]
			}
		});

		modalInstance.result.then(function(title) {
			if(title.length > 0){
				//  有标题
				$scope.data.form.title = title;
				//  地图选择区域 状态
				$scope.status = 'map';
			}
			//$scope.selected = selectedItem;
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	//
	$scope.$watch('data.form.start',function(newValue,oldValue, scope){
		if(newValue.length > 0){
			videos();
		}
	});
	
	//
	$scope.$watch('data.form.end',function(newValue,oldValue, scope){
		if(newValue.length > 0){
			videos();
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
				}else{
					$scope.data.device_items = [];
				}
			});
	}
	
	
	//   得到视频历史及轨迹信息
	var videos = function(){
		if($scope.data.form.device.length < 1){
			toaster.pop('warning','失败', '设备必选');
			return false;
		}
		//
		httpService.ajaxPost(httpService.API.href + '/history/videos',{
			userid: $scope.data.form.device[0].id,
			stime: $scope.data.form.start,
			etime: $scope.data.form.end,
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					$scope.data.items = res.data.data.locations;
					$scope.data.video_items = res.data.data.videos;
					//
					for(var i in $scope.data.video_items){
						for(var b in $scope.data.items){
							if($scope.data.video_items[i].userid == $scope.data.items[b].userid){
								$scope.data.items[b].has_video = true;
								break;
							}
						}
					}
					//  划线
					newLineFn($scope.data.items);
				}else{
					$scope.data.items = [];
				}
			});
	}
	
	
	
	//   实时视频播放
	$scope.video_play = function(item){
		
//		item = {
//      "id": "00a52e11fdb14f1fa2c64b1a39bbfe99",
//      "userid": "116a8466be394ef084626189114a326d",
//      "esign": "00000117701346381",
//      "createTime": "2018-01-13 14:31:42",
//      "endTime": null,
//      "longitude": 116.666108,
//      "latitude": 39.921534,
//      "status": 1,
//      "pushUrl": "rtmp://5103.livepush.myqcloud.com/live/5103_00000117701346381?bizid=5103&txSecret=73a08e89a106fe3bffecae12b3552edd&txTime=5A56CD14&record=mp4",
//      "rtmpLiveplay": "rtmp://5103.liveplay.myqcloud.com/live/5103_00000117701346381?bizid=5103&txSecret=73a08e89a106fe3bffecae12b3552edd&txTime=5A56CD14&record=mp4",
//      "flvLiveplay": "http://5103.liveplay.myqcloud.com/live/5103_00000117701346381.flv?bizid=5103&txSecret=73a08e89a106fe3bffecae12b3552edd&txTime=5A56CD14&record=mp4",
//      "hlsLiveplay": "http://5103.liveplay.myqcloud.com/live/5103_00000117701346381.m3u8?bizid=5103&txSecret=73a08e89a106fe3bffecae12b3552edd&txTime=5A56CD14&record=mp4",
//      "type": 1
//    }
//		openVideo(item);
//		return false;
    
		//
		for(var i in $scope.data.video_items){
			if(item.id == $scope.data.video_items[i].userid){
				console.log()
				openVideo($scope.data.video_items[i]);
				break;
			}
		}
	}
	
	
	//   打开视频播放弹窗
	/**
	 * 添加
	 */
	var openVideo = function(item){
		//   打开添加弹窗
		var modalInstance = $modal.open({
			templateUrl: 'tpl/locus/modal-play.html',
			controller: 'modalLocusPlayCtrl',
			windowClass:'m-modal-main m-modal-video',
			//size: size,
			resolve: {
				items: function() {
					return {
						'item':item,
						'scope': $scope
					};
				},
				deps: ['$ocLazyLoad',
                    function( $ocLazyLoad ){
                      return $ocLazyLoad.load(['ui.select','toaster']).then(
                          function(){
                             return $ocLazyLoad.load(['js/controllers/locus/modal.js']);
                          }
                      );
                    }
                ]
			}
		});

		modalInstance.result.then(function(bol) {
			if(bol === false){
				//   关闭弹窗   关闭直播
				window.tcplayer && window.tcplayer.destroy();
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
		//
		videos();
	}
	run();


}]);