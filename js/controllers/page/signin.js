'use strict';

var showAlert = function(str){
	alert('c++调js成功' + str);
}

/* Controllers */
// signin controller
app.controller('SigninFormController', ['$scope', 'httpService', '$state','opCookie','Md5', function($scope, httpService, $state,opCookie,Md5) {
	//   清空cookie
	opCookie.clearCookie('access_token');
	opCookie.clearCookie('refresh_token');
	opCookie.clearCookie('user_info');
	
	$scope.user = {};
	var user_info = {user:'admin',pwd:'admin'};
	var temp_info = {'mcode':'000001'};
	$scope.authError = null;
	$scope.logining = true;
	$scope.login = function() {
		$scope.authError = null;
		$scope.logining = false;
		
		if($scope.user.pwd == user_info.pwd && $scope.user.user == user_info.user){
			opCookie.setCookie('access_token', JSON.stringify($scope.user), 24*60*60);
			opCookie.setCookie('user_info', JSON.stringify(temp_info), 24*60*60);
			$scope.app.user_info = temp_info;
			$state.go('app.locus');
		}else{
			$scope.authError = '用户名密码错误';
			$scope.logining = true;
			$scope.app.user_info = null;
		}
		
		return false;
		
		
		// Try to login
		httpService.ajaxPost(httpService.API.origin + '/oauth/token', undefined, 10000, {
				username: $scope.user.user,
				password: Md5.hex_md5($scope.user.password),
				grant_type: 'password'
			})
			.then(function(data) {
				alert(JSON.stringify(data));
				alert(JSON.stringify(data.status));
				alert(JSON.stringify(data.data));
				$scope.logining = true;
				if(data.status == 200){
					opCookie.setCookie('access_token',data.data.access_token,24*60*60);
					//  opCookie.setCookie('expires_in',data.data.expires_in,30);
					//  opCookie.setCookie('jti',data.data.jti,30);
					opCookie.setCookie('refresh_token',data.data.refresh_token,4*60*60);
					//  opCookie.setCookie('scope',data.data.scope,30);
					//  opCookie.setCookie('token_type',data.data.token_type,30);
					$scope.getNav();
					$scope.getUserInfo();
					$state.go('app.index');
				}else{
					alert('错误');
					$scope.authError = 'Email or Password not right';
				}
			}, function(x) {
				console.log(x)
				$scope.authError = 'Server Error';
			});
	};
	
	
	
	
}]);