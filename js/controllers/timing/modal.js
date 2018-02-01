app.controller('modalTimingNewCtrl', ['$scope', '$timeout', 'globalFn', 'httpService','$modal','items','$modalInstance', function($scope, $timeout, globalFn, httpService,$modal,items,$modalInstance) {
	
	$scope.items = items;
	
	//  名称 
	$scope.title = '';
	
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