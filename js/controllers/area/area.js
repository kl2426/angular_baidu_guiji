app.controller('areaCtrl', ['$scope', '$timeout', 'globalFn', 'httpService','$modal','$window','$interval','toaster', function($scope, $timeout, globalFn, httpService,$modal,$window,$interval,toaster) {
	
	
	//   百度地图选区 与 拖动 dom
	var tuodong = null;
	var quyu = null;
	var overlays = [];
	var clearAll = null;
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
		
//		//创建小狐狸
//		var pt = new BMap.Point(116.417, 39.909);
//		//  图标大小
//		var icon_size = new BMap.Size(36,36);
//		var myIcon = new BMap.Icon("img/user-001.png", icon_size, {imageSize: icon_size});
//		var myIcon2 = new BMap.Icon("img/user-001.png", icon_size, {imageSize: icon_size});
//		var marker2 = new BMap.Marker(pt,{icon:myIcon});  // 创建标注
//		map.addOverlay(marker2); 
		
		var overlaycomplete = function(e){
	        overlays.push(e.overlay);
	    };
	    var styleOptions = {
	        strokeColor:"#1d8ce0",    //边线颜色。
	        fillColor:"#1d8ce0",      //填充颜色。当参数为空时，圆形将没有填充效果。
	        strokeWeight: 1,       //边线的宽度，以像素为单位。
	        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
	        fillOpacity: 0.5,      //填充的透明度，取值范围0 - 1。
	        strokeStyle: 'solid' //边线的样式，solid或dashed。
	    }
	    //实例化鼠标绘制工具
	    var drawingManager = new BMapLib.DrawingManager(map, {
	        isOpen: false, //是否开启绘制模式
	        enableDrawingTool: true, //是否显示工具栏
	        drawingToolOptions: {
	            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
	            offset: new BMap.Size(5, 5), //偏离值
	        },
	        circleOptions: styleOptions, //圆的样式
	        polylineOptions: styleOptions, //线的样式
	        polygonOptions: styleOptions, //多边形的样式
	        rectangleOptions: styleOptions //矩形的样式
	    });  
		 //添加鼠标绘制工具监听事件，用于获取绘制结果
	    drawingManager.addEventListener('overlaycomplete', overlaycomplete);
	    clearAll = function() {
			for(var i = 0; i < overlays.length; i++){
	            map.removeOverlay(overlays[i]);
	        }
	        overlays.length = 0   
	    }
	    
	    //   取dom
	    tuodong = $(".BMapLib_Drawing_panel a").eq(0);
	    quyu = $(".BMapLib_Drawing_panel a").eq(5);
	    
	    $scope.$apply();
	    
	}
	
	//  状态  list 列表    map 地图
	$scope.status = 'list';
	
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
		// console.log(overlays);
		//
		// $scope.status = 'list';
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
	
	
	//  showlist
	$scope.show_list = function(){
		$scope.status = 'list';
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
	
	//   取列表
	var list = function(){
		//
		httpService.ajaxPost(httpService.API.href + '/userset/region/list',{
			mcode: $scope.app.user_info.mcode,
			name: $scope.data.form.name
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					$scope.data.items = res.data.data.regions;
				}else{
					$scope.data.items = [];
				}
			});
	}
	
	//   新建区域
	$scope.sendAdd = function(){
		// 
		if(overlays.length < 0){
			toaster.pop('warning','失败', '请选择区域');
			return false;
		}
		//  选中用户
		var temp_userids = [];
		for(var i in $scope.data.form.device){
			temp_userids.push($scope.data.form.device[i].id);
		}
		//
		httpService.ajaxPost(httpService.API.href + '/userset/region/add',{
			mcode: $scope.app.user_info.mcode,
			name: $scope.data.form.title,
			uids: temp_userids.length > 0 ? temp_userids.join(',') : '',
			longitude1: overlays[0].so[0].lng,
			latitude1: overlays[0].so[0].lat,
			longitude2:overlays[0].so[2].lng,
			latitude2:overlays[0].so[2].lat
		})
			.then(function(res) {
				if(res.status == 200 && res.data.code == 200) {
					//
					toaster.pop('success','成功', '新建成功');
					$scope.data.form.title = '';
					list();
					$scope.status = 'list';
				}else{
					//
					toaster.pop('warning','失败', '新建失败');
					$scope.status = 'list';
				}
			});
	}
	
	
	//   删除
	$scope.ridDel = function(rid){
		if(confirm('确定要删除吗？') == false){
			return false;
		}
		//
		httpService.ajaxPost(httpService.API.href + '/userset/region/del',{
			rid: rid,
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
		getList();
		list();
	}
	run();


}]);