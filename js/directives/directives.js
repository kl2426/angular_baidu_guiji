'use strict';

/**
 * 
 */
angular.module('app')
	.directive('myTable', ['httpService','$compile','$timeout', function(httpService,$compile,$timeout) {
		return {
			restrict: 'E, A, C',
			link: function(scope, element, attrs, controller) {
				//   默认参数
				var options = scope.table_options;
				if('tableOptions' in attrs){
					options = eval('(' + attrs.tableOptions + ')');
				}
				//   语言
				var language = {  
	                'emptyTable': '没有数据',  
	                'loadingRecords': '加载中...',  
	                'processing': '查询中...',  
	                'search': '检索:',  
	                'lengthMenu': '每页 _MENU_ 条',  
	                'zeroRecords': '没有数据',  
	                'paginate': {  
	                    'first':      '第一页',  
	                    'last':       '最后一页',  
	                    'next':       '下一页',  
	                    'previous':   '上一页'  
	                },  
	                'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',  
	                'infoEmpty': '没有数据',  
	                'infoFiltered': '(过滤总件数 _MAX_ 条)'  
	            }
				if(!('language' in options)){
					options.language = language;
				}
				
				//  dom定位
				if(!('dom' in options)){
					options.dom = '<"dataTable_top"<"table-form">><"row"<""t>><"row"<"col-sm-4 col-xs-12"l><"col-sm-2 text-center col-xs-12"i><"col-sm-6 col-xs-12"p>>';
				}
				
				var myTableFn = function(){
					/*Javascript代码片段*/
					scope.myTable = element.DataTable({
						"processing": true,
						"serverSide": true,
						ajax: function(d, callback, settings) {
							console.log(scope.table_options);
							debugger
							console.log(d);
							if('form' in options){
								if('search_page' in options.form){
									options.form.page = +options.form.search_page + 1;
									options.form.search_page = undefined;
								}else{
									options.form.page = +d.start + 1;
								}
								options.form.pageSize = d.length;
							}else{
								options.form = d;
							}
							console.log('form................',options.form)
							httpService.ajaxPost(httpService.API.origin + options.url, options.form)
							.then(function(res) {
								console.log('dataaaaaaaaaaaa',res);
								if(res.status == 200) {
									var temp_data = {
										//   获取请求次数
										//"draw":d.draw,
										//   总启记录数
										"recordsTotal": res.data.total,
										//   过滤后的记录数
										"recordsFiltered": res.data.total,
										//   数据
										"data": res.data.rows
									}
									callback(temp_data);
								}
							});
						},
						//每页显示三条数据
						pageLength: options.pageLength,
						columns: options.columns,
						columnDefs:options.columnDefs,
						language:options.language,
						dom:options.dom,
						//   完成事件
						drawCallback: function( settings ) {
					        element.parents('.table-responsive').find(".form").appendTo($(settings.nTableWrapper).find(".table-form"));
							scope.myTable.columns.adjust();
							//  scope.myTable.page(options.form.page - 1).draw( false );
							//   刷新 angular 标签
							$compile($(settings.nTable).find('tbody')[0])(scope);
					    }
					});
				}
				
				
				myTableFn();	

			}
		};
		
		
		
		
		
		
		
		
		
		
//		/**
//	 * table
//	 */
//	$scope.table_options = {
//		form:{
//			fucecode:"",
//			fuceismenu:"",
//			fucename:"",
//			fuceparentcode:"0",
//			ownerType:0,
//			//page:1,
//			//pageSize:10,
//			sortname:"a.FUCECREATETIME",
//			sortorder:"desc"
//		},
//		url: '/Rest/function/findFunctionList',
//		pageLength: 1,
//		bAutoWidth:false,
//		columns: [
//			{
//				className: "td-checkbox",
//				orderable: false,
//				render: function(data, type, row, meta) {
//	                var content = '<label class="i-checks">'
//	                    content += '    <input type="checkbox"><i></i>'
//                		content += '</label>';
//					return content;
//				}
//			},
//			{
//				orderable: false,
//				"data": "fucecode"
//			},
//			{
//				orderable: false,
//				"data": "fucename"
//			},
//			{
//				orderable: false,
//				"data": "fucelevel"
//			},
//			{
//				orderable: false,
//				"data": "fuceresource"
//			},
//			{
//				orderable: false,
//				"data": "fuceindex"
//			},
//			{
//				orderable: false,
//				"data": "fuceparentcode"
//			},
//			{
//				orderable: false,
//				"data": "fuceismenu"
//			}
//			,
//			{
//				orderable: false,
//				"data": null,
//			}
//		],
//		//   操作
//		columnDefs:[
//			{
//				//  列
//				targets:8,
//				data:null,
//				width:80,
//				render:function(data, type, row, meta){
//					console.log(data)
//					var content = '<div class="btn-group" dropdown>'+
//					            '<button type="button" class="btn btn-xs btn-info" ng-click="table_operate(' + "'edit'" + ')">修改</button>'+
//					            '<button type="button" class="btn btn-xs btn-info dropdown-toggle" dropdown-toggle>'+
//					            '  <span class="caret"></span>'+
//					            '  <span class="sr-only">修改</span>'+
//					            '</button>'+
//					            '<ul class="dropdown-menu" role="menu">'+
//					            '  <li><a ng-click="table_operate(' + "'son'" + ')">管理子权限</a></li>'+
//					            '  <li><a ng-click="table_operate(' + "'del'" + ')">删除</a></li>'+
//					            '</ul>'+
//					        	'</div>';
//					return content;
//				}
//			}
//		]
//		//dom:'<"row dataTable_top"<"col-sm-12 table-form">><"row"<""t>>'
//	}
	
	
	
	
	
	
	
	}]);
	





/**
 * 弹窗拖动
 */
angular.module('app').directive('modalMove', ['$timeout','$document', function($timeout,$document) {
    function link(scope, element, attr) {
    	//   延迟生成dom
    	var timer = $timeout(function(){
    		//
    		var dialog = element.parents(".modal-dialog");
    		var dialogHeight = dialog.height();
    		var wHeight = jQuery(window).height();
    		var wWidth = jQuery(window).width();
    		var header = dialog.find(".g-modal-header");
    		//   弹窗居中
    		if(dialogHeight < wHeight){
    			dialog.css("margin-top",(wHeight - dialogHeight) / 2);
    		}
    		//
    		var startX = 0, startY = 0, x = 0, y = 0;
            //
            header.css({
                position: 'relative',
                cursor: 'move'
            });
			//
            header.on('mousedown', function(event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;
                //   不超过屏幕
                if(event.pageY > 0 && event.pageX > 0 && event.pageX < wWidth && event.pageY < wHeight){
                	dialog.css({
	                top: y + 'px',
	                left:  x + 'px'
	                });
                }
            }

            function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }


    	},50);
    };
    return {
        restrict: 'A',
        link: link
    };
}]);




/**
 * 百度地图加载
 */
angular.module('app').directive('baiduMap', ['$timeout','$document','$window', function($timeout,$document,$window) {
    function link(scope, element, attr) {
    	var e = $(element[0]);
    	e.height(window.innerHeight - 55);
    	if(scope.baiduMapFn){
    		scope.baiduMapFn(element);
    	}
    	//   地图自适应大小
//  	var w = angular.element($window);
//		w.bind('resize', function(){
//			e.height(window.innerHeight - 55);
//		})
    };
    return {
        restrict: 'A',
        link: link
    };
}]);


/**
 * 腾讯视频
 */
angular.module('app').directive('tengxunVideo', ['$timeout','$document','$window', function($timeout,$document,$window) {
    function link(scope, element, attr) {
    	var e = $(element[0]);
    	//  加入ID
    	if(attr.id && attr.id.length > 0){
    		e.attr('id',attr.id);
    	}
    	
    	
		
//		function getParams(name) {
//          var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
//          var r = window.location.search.substr(1).match(reg);
//          if (r != null) {
//              return decodeURIComponent(r[2]);
//          }
//          return null;
//      }
//
//      function getPathParams() {
//          var path = location.pathname.split('/');
//          if (path[1] == 'vod-player') {
//              return {
//                  'path': location.origin + path.slice(0, 4).join('/'),
//                  'appid': path[2],
//                  'fileid': path[3]
//              }
//          } else {
//              return null;
//          }
//      }
//
//      var rtmp = getParams('rtmp'),
//          flv = getParams('flv'),
//          m3u8 = getParams('m3u8'),
//          mp4 = getParams('mp4'),
//          live = (getParams('live') == 'true' ? true : false),
//          coverpic = getParams('coverpic'),
//          width = getParams('width'),
//          height = getParams('height'),
//          volume = getParams('volume'),
//          flash = (getParams('flash') == 'true' || !getParams('flash') ? true : false),
//          h5_flv = (getParams('h5_flv') == 'true' ? true : false),
//          autoplay = (getParams('autoplay') == 'true' ? true : false),
//          flashUrl = (function () {
//              var params = getPathParams();
//              if (params) {
//                  return params.path + '/player/release/QCPlayer.swf';
//              }
//              return '//imgcache.qq.com/open/qcloud/video/player/release/QCPlayer.swf'
//          })(),
//          log = getParams('log');
//      /**
//       * 视频类型播放优先级
//       * mobile ：m3u8>mp4
//       * PC ：RTMP>flv>m3u8>mp4
//       */
//      var options = {
//          rtmp: rtmp,
//          flv: flv,
//          m3u8: m3u8,
//          mp4: attr.videourl || 'http://5103.liveplay.myqcloud.com/live/5103_00000117701346381.m3u8?bizid=5103&txSecret=8d897257dc7803bb3d629b936dc05bb4&txTime=5A5A0482&record=mp4',
//          autoplay: true || autoplay,
//          live: live,
//          width: width || '600',
//          height: height || '450',
//          volume: volume || 0.5,
//          flash: flash,
//          flashUrl: flashUrl,
//          h5_flv: h5_flv,
//          systemFullscreen: true,
////            controls: 'system',
//          wording: {
//              2032: '请求视频失败，请检查网络',
//              2048: '请求m3u8文件失败，可能是网络错误或者跨域问题'
//          },
//          listener: function (msg) {
//              if (!log) {
//                  return;
//              }
//              if (msg.type != 'timeupdate') {
//                  console.log(msg);
//              }
//          }
//      };
//      window.tcplayer = new TcPlayer(attr.id, options);


		var option = {
		"live_url" : attr.liveflv,
		"live_url2" : attr.livem3u8,
		"width" : attr.width ? attr.width : 600,
		"height" : attr.height ? attr.height : 450
		};
		
		if(!window.player){
			window.player = [];
		}
		window.player.push(new qcVideo.Player(attr.id, option));
        
    };
    return {
        restrict: 'A',
        link: link
    };
}]);


/**
 * lay 时间日期选择器
 */
angular.module('app').directive('layDate', ['$timeout','$document', function($timeout,$document) {
    function link(scope, element, attr) {
    	//
    	var setScope = function(val){
    		var data_str = attr.scope;
	    	data_str = attr.scope ? attr.scope.split('.') : [];
	    	if(data_str.length == 1){
	    		scope[data_str[0]] = val;
	    	}else if(data_str.length == 2){
	    		scope[data_str[0]][data_str[1]] = val;
	    	}else if(data_str.length == 3){
	    		scope[data_str[0]][data_str[1]][data_str[2]] = val;
	    	}
    	}
    	//
    	var laytype = attr.laytype;
    	//  时间选择器
		laydate.render({
		  elem: element[0],
		  type: laytype ? laytype : 'date',
		  done:function(value, date, endDate){
		  	scope.$apply(function(){
		  		setScope(value);
		  	});
		  }
		});
    };
    return {
        restrict: 'A',
        link: link
    };
}]);