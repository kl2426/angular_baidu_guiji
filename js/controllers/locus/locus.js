app.controller('locusCtrl', ['$scope', '$timeout', 'globalFn', 'httpService','$modal','$window','$interval','toaster','$interval', function($scope, $timeout, globalFn, httpService,$modal,$window,$interval,toaster,$interval) {
	
	
	//  用于点击显示对应的头像用户ID
	$scope.show_user_id = '';
	//  icon 单点最后 line 轨迹
	$scope.status = 'icon';
	
	//   百度地图配置
	//  map
	var map = null;
	
	//
	$scope.baiduMapFn = function(element){
		var e = $(element[0]);
    	e.height(window.innerHeight);
		//   地图自适应大小
    	var w = angular.element($window);
		w.bind('resize', function(){
			e.height(window.innerHeight);
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
		
//		//创建坐标
//		var pt = new BMap.Point(116.417, 39.909);
//		//
//		var myIcon = new BMap.Icon("img/user-001.png", icon_size, {imageSize: icon_size});
//		var myIcon2 = new BMap.Icon("img/user-001.png", icon_size, {imageSize: icon_size});
//		var marker2 = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
//		
//		map.addOverlay(marker2); 
//		
//		marker2.setTitle('12131312');
//		marker2.addEventListener("click", function(m){
//			console.log(marker2.getTitle());
//		});
		
		

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
		for(var i in $scope.data.user_items){
			if($scope.data.user_items[i].id == item.userid){
				item_user = $scope.data.user_items[i];
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
	
	
	var newLineFn = function(items, long_lat_item){
		//
		var temp_items = [];
		for(var i in items){
			var temp_p = new BMap.Point(items[i].longitude, items[i].latitude);
			temp_items.push(temp_p);
		}
		//
		//   第一个头像
		var mk = newUserIconFn(items[0].longitude, items[0].latitude, '1', items[0]);
		//   添加事件
		mk.addEventListener("click", function(m){
			$scope.$apply(function(){
				$scope.show_user_id = mk.target.locus_user_id;
				for(var i in $scope.data.user_items){
					if($scope.data.user_items[i].id == $scope.show_user_id){
						$scope.data.user_items[i].checked = true;
					}else{
						$scope.data.user_items[i].checked = false;
					}
				}
			});
		});
		//map.addOverlay(mk);
		//
		// map.centerAndZoom(new BMap.Point(items[0].longitude, items[0].latitude), 15);
		//
		//   最后一个头像
//		var mk2 = newUserIconFn(items[items.length - 1].longitude, items[items.length - 1].latitude, '1', items[items.length - 1].userid);
//		//   添加事件
//		mk2.addEventListener("click", function(m){
//			$scope.$apply(function(){
//				$scope.show_user_id = mk2.getTitle();
//				for(var i in $scope.data.user_items){
//					if($scope.data.user_items[i].id == $scope.show_user_id){
//						$scope.data.user_items[i].checked = true;
//					}else{
//						$scope.data.user_items[i].checked = false;
//					}
//				}
//			});
//			console.log($scope.show_user_id)
//		});
//		map.addOverlay(mk2);
		//   线颜色
		var line_color_arr = [
			'#ffa45b',
			'#23b7e5',
			'#9d8935',
			'#27c24c',
			'#f05050',
			'#2c9dc0',
		];
		//   随机颜色    Math.floor(Math.random()*(m-n+1)+n);
		var line_color = Math.floor(Math.random() * ( 5 - 0 + 1 ) + 0 );
		if('line_color' in long_lat_item){
			//
		}else{
			long_lat_item.line_color = line_color_arr[line_color];
		}
		//
		//   添加线
		var polyline = new BMap.Polyline(temp_items, {
			enableEditing: false,//是否启用线编辑，默认为false
			enableClicking: true,//是否响应点击事件，默认为true
			icons:[],
			strokeWeight:'2',//折线的宽度，以像素为单位
			strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
			strokeColor: long_lat_item.line_color //折线颜色
		});
		map.addOverlay(polyline);
	}
	
	
	//   data
	$scope.data = {
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
		console.log($scope.app.user_info.mcode)
		//
		httpService.ajaxPost(httpService.API.href + '/user/all',{
			mcode: $scope.app.user_info.mcode
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					$scope.data.device_items = res.data.data.users;
					//  全选中
					for(var i in $scope.data.device_items){
						$scope.data.device_items[i].checked = true;
					}
				}else{
					$scope.data.device_items = [];
				}
			});
	}
	
//	//   轨迹-得到人员信息
//	var getInfo = function(){
//		console.log($scope.app.user_info.mcode)
//		//
//		httpService.ajaxPost(httpService.API.href + '/user/info',{
//			mcode: $scope.app.user_info.mcode,
//			stime:'2018-01-01 00:00:00'
//		})
//			.then(function(res) {
//				if(res.status == 200 && res.data.code == 200) {
//					var data = res.data.data.users;
//					$scope.data.user_items = data;
//					$scope.data.video_items = res.data.data.emergency;
//					//   user 加入是否打开了摄像头
//					for(var i in data){
//						for(var b in $scope.data.video_items){
//							if(data[i].id == $scope.data.video_items[b].userid){
//								data[i].video_isopen = true;
//							}else{
//								data[i].video_isopen = false;
//							}
//						}
//					}
//					//  生成开始坐标
//					for(var i in data){
//						//   单点
//						if($scope.status == 'icon'){
//							for(var i in data){
//								if(data[i].locations && data[i].locations.length > 0){
//									var mk3 = newUserIconFn(data[i].locations[0].longitude, data[i].locations[0].latitude, '1', data[i].locations[0].userid);
//									//   添加事件
//									mk3.addEventListener("click", function(m){
//										$scope.$apply(function(){
//											$scope.show_user_id = mk3.getTitle();
//											for(var i in $scope.data.user_items){
//												if($scope.data.user_items[i].id == $scope.show_user_id){
//													$scope.data.user_items[i].checked = true;
//												}else{
//													$scope.data.user_items[i].checked = false;
//												}
//											}
//										});
//										console.log($scope.show_user_id)
//									});
//									map.addOverlay(mk3);
//									map.centerAndZoom(new BMap.Point(data[i].locations[0].longitude, data[i].locations[0].latitude), 15);
//								}
//							}
//						}else if($scope.status == 'line'){
//							if(data[i].locations && data[i].locations.length > 0){
//								//
//								newLineFn(data[i].locations);
//							}
//						}
//					}
//				}else{
//					//
//				}
//			});
//	}
	
	//  单点返回 临时变量	
	var temp_res_data = [];
	//   单点
	var getInfoOne = function(){
		//
		httpService.ajaxPost(httpService.API.href + '/user/info',{
			mcode: $scope.app.user_info.mcode
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					var data = res.data.data.users;
					$scope.data.user_items = data;
					$scope.data.video_items = res.data.data.emergency;
					//   user 加入是否打开了摄像头
					for(var i in data){
						for(var b in $scope.data.video_items){
							if(data[i].id == $scope.data.video_items[b].userid){
								data[i].video_isopen = true;
							}else{
								data[i].video_isopen = false;
							}
						}
					}
					//  应该用上次 checked
					for(var i in temp_res_data){
						for(var b in data){
							if(temp_res_data[i].checked == true && temp_res_data[i].id == data[b].id){
								data[b].checked = true;
							}
							if(temp_res_data[i].locus_show_msg == true && temp_res_data[i].id == data[b].id){
								data[b].locus_show_msg = true;
							}
						}
					}
					temp_res_data = data;
					//  清除人像
					map.clearOverlays();
					//  显示人像
					for(var i in data){
						//  未选中不添加
						var temp_bol_dev = false;
						for(var dev in $scope.data.device_items){
							if($scope.data.device_items[dev].id == data[i].id && !$scope.data.device_items[dev].checked){
								temp_bol_dev = true;
								break;
							}
						}
						if(temp_bol_dev){
							//  未选中
							continue;
						}
						//
						if((data[i].locations && data[i].locations.length > 0) || ($scope.data.long_lat[i] && $scope.data.long_lat[i].locations.length > 0)){
							//  如果当前没有坐标 使用 历史坐标
							var temp_data_item = null;
							var temp_data_hasOnline = true;
							if(data[i].locations && data[i].locations.length > 0){
								temp_data_item = angular.copy(data[i]);
							}else{
								temp_data_item = angular.copy($scope.data.long_lat[i]);
								temp_data_item.locations.reverse();
								temp_data_hasOnline = false;
							}
							//  是否有视频选择显示什么样的头像
							var temp_icon = '1';
							if(data[i].video_isopen == true){
								temp_icon = '2';
							}else if(data[i].video_isopen == false || data[i].video_isopen == undefined){
								temp_icon = '1';
							}
							// 是否在线
							if(temp_data_hasOnline == false){
								temp_icon = '3';
							}
							//
							var mk3 = newUserIconFn(temp_data_item.locations[0].longitude, temp_data_item.locations[0].latitude, temp_icon, data[i].locations[0]);
							//   添加事件
							mk3.addEventListener("click", function(m){
								$scope.$apply(function(){
									$scope.show_user_id = m.target.locus_user_id;
									for(var i in data){
										if(data[i].id == $scope.show_user_id){
											if(data[i].video_isopen){
												$scope.video_play(data[i]);
											}else{
												data[i].checked = true;
											}
										}else{
											data[i].checked = false;
										}
									}
								});
							});
							map.addOverlay(mk3);
						}
					}
					//  百度地图移动中心点
					for(var i in data){
						//  $scope.data.long_lat.length < 1  定位中心点只执行一次
						if($scope.app.locus_open_mid && data && data.length > 0 && data[i].locations && data[i].locations.length > 0){
							$scope.app.locus_open_mid = false;
							map.centerAndZoom(new BMap.Point(data[i].locations[0].longitude, data[i].locations[0].latitude), 15);
							break;
						}
					}
					//  添加到轨迹记录
					if($scope.data.long_lat.length < 1){
						$scope.data.long_lat = data;
					}else{
						for(var i in data){
							if(!('locations' in $scope.data.long_lat[i])){
								$scope.data.long_lat[i].locations = [];
							}
							if(data[i].locations && data[i].locations.length > 0){
								//  有坐标 添加
								$scope.data.long_lat[i].locations.push(data[i].locations[0]);
							}
						}
					}
					console.log($scope.data.long_lat)
					//  显示轨迹
					if($scope.status == 'line'){
						for(var i in $scope.data.long_lat){
							//  未选中不添加
							var temp_bol_dev = false;
							for(var dev in $scope.data.device_items){
								if($scope.data.device_items[dev].id == data[i].id && !$scope.data.device_items[dev].checked){
									temp_bol_dev = true;
									break;
								}
							}
							if(temp_bol_dev){
								//  未选中
								continue;
							}
							if($scope.data.long_lat[i].locations.length > 0){
								newLineFn($scope.data.long_lat[i].locations, $scope.data.long_lat[i]);
							}
						}
					}
					
					$timeout(function(){
						$("#locus_msg").focus();
					},20);
					
					
				}else{
					//
				}
			});
	}
	
	
	$scope.show_icon_line = function(str){
		$scope.status = str;
		//
		getInfoOne();
	}
	
	
	//   发送消息
	$scope.sendmsg = function(userid, msg){
		//
		httpService.ajaxPost(httpService.API.href + '/user/sendmsg',{
			userid: userid,
			content: msg
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					//
					toaster.pop('success','成功', '发送成功');
					$scope.data.form.msg = '';
				}else{
					//
					toaster.pop('warning','失败', '发送失败');
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
				$scope.closeVideo();
			}
		}, function() {
			//console.log('Modal dismissed at: ' + new Date());
		});
	}
	
	
	
	//   视频转发
	$scope.transfer = function(user_item){
		//  选中用户
		var temp_userids = [];
		for(var i in $scope.data.form.device){
			temp_userids.push($scope.data.form.device[i].id);
		}
		//  用户查找视频
		var temp_video_userid = '';
		for(var i in $scope.data.video_items){
			if(user_item.id == $scope.data.video_items[i].userid){
				temp_video_userid = $scope.data.video_items[i].id;
				break;
			}
		}
		//
		httpService.ajaxPost(httpService.API.href + '/user/transfer',{
			eid: temp_video_userid,
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
	$scope.sendorder = function(user_item, order){
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
			userid: user_item.id,
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


	

	/**
	 * run
	 */
	$scope.app.locus_run = function() {
		//   
		getList();
		//
		//getInfo();
		$scope.app.locus_open_mid = true;
		//
		getInfoOne();
		
		//   单点时添加定时器 1000毫秒轮询一次
		$interval.cancel($scope.app.locus_timer);
		$scope.app.locus_timer = $interval(function(){
			getInfoOne();
		},5000);
	}
	$scope.app.locus_run();


}]);







app.controller('locusListCtrl', ['$scope', '$timeout', 'globalFn', 'httpService','$modal','$window','$interval','toaster','$interval', function($scope, $timeout, globalFn, httpService,$modal,$window,$interval,toaster,$interval) {
	
	$scope.items = $scope.data.video_items;
	
	//  加入手机号
	for(var i in $scope.data.device_items){
		for(var b in $scope.items){
			if($scope.items[b].userid == $scope.data.device_items[i].id){
				$scope.items[b].mobile = $scope.data.device_items[i].mobile;
				$scope.items[b].user_item = $scope.data.device_items[i];
			}
		}
	}
	
	
	//  hover
	$scope.hoverStart = function(item){
		item.hasHover = true;
	}
	
	$scope.hoverEnd = function(item){
		item.hasHover = false;
	}
	
	/**
	 * run
	 */
	var run = function() {
		//   
		
	}
	run();
}]);










