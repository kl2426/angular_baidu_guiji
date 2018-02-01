'use strict';

/* Controllers */

angular.module('app')
  .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window','opCookie','httpService','globalFn','$rootScope','$state','$interval',
    function(              $scope,   $translate,   $localStorage,   $window,opCookie,httpService, globalFn ,$rootScope,$state,$interval) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

      // config
      $scope.app = {
        name: '随助协同办案单元',
        version: '1.3.3',
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        },
        //   nav
        nav:[],
        //   userInfo
        user_info:{},
        //   轨迹轮询定时器
        locus_timer: null,
        //   是否显示中心点
        locus_open_mid: true,
        locus_run: null
      }

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = { isopen: false };
      $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }
      
      //   取nav
      $scope.getNav = function(){
      	//  if(opCookie.getCookie('access_token')){
      	if(1){
	      	//
					httpService.ajaxGet('json/nav.json')
					.then(function(res) {
						if(res.code == 0){
							$scope.app.nav = res.data;
						}else{
							$scope.app.nav = [];
						}
					}, function(x) {
						console.log(x)
						$scope.authError = 'Server Error';
					});
	      }
      }
      
      
      
      
      //   取用户信息
      $scope.getUserInfo = function(){
      	if(opCookie.getCookie('access_token')){
	      	//
					httpService.ajaxPost(httpService.API.origin + '/Rest/frmuser/getCurrLoginUser', undefined, 10000, {
						parentcode: '0'
					})
					.then(function(data) {
						console.log(data)
						if(data.status == 200){
							$scope.app.user_info = data.data;
							opCookie.setCookie('user_info',escape(JSON.stringify($scope.app.user_info)),24*60*60);
						}else{
							//$scope.authError = 'Email or Password not right';
						}
					});
	      }
      }
      
      
      //   关闭所有直播 
      $scope.closeVideo = function(){
      	if(window.player && window.player.length > 0){
      		for(var i in window.player){
      			window.player[i].stop();
      		}
      	}
      }
      
      
      /**
			 * 路由拦截
			 */
			$rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
				//   离开轨迹 关闭定时器
				if(toState.name != 'app.locus'){
					 $interval.cancel($scope.app.locus_timer);
				}
				//   离开
				if(fromState.name == 'app.locus.list' && toState.name != 'app.locus.list'){
					 $scope.closeVideo();
				}
				//   
				if(fromState.name == 'app.locus.list' && toState.name == 'app.locus'){
					 $scope.app.locus_open_mid = true;
					 if($scope.app.locus_run){
					 	$scope.app.locus_run();
					 }
				}
				//
				if(toState.name.includes('app.') && opCookie.getCookie('user_info').length < 1){
					event.preventDefault();// 取消默认跳转行为
					$state.go('access.signin',{},{reload:true});
				}
			});
      
      
      //   run
      var run = function(){
      	//   取nav菜单
      	$scope.getNav();
      	//   取用户信息
      	//$scope.getUserInfo();
      	if(opCookie.getCookie('user_info')){
      		$scope.app.user_info = JSON.parse(opCookie.getCookie('user_info'));
      	}
      }
      run();
      
      

  }]);