(function (){
	var internon = angular.module('internon');
    internon.controller('coordinator_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
        $scope.logout = function(){
            $auth.logout();
            $localStorage.$reset();
            $state.go('index');
        };

        $scope.init = function () {
			$http({method: 'GET', url: urls.API_HOST + '/coordinator_profile/'+$localStorage.id}).then(function(response){
				$scope.coordinator = response.data;
				$state.go('user_coordinator.coordinator_profile');
			});
		};
    });
 
   
})();
