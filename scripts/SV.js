(function (){
	var internon = angular.module('internon');
    internon.controller('sv_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
        $scope.logout = function(){
            $auth.logout();
            $localStorage.$reset();
            $state.go('index');
        };

        $scope.init = function () {
			$http({method: 'GET', url: urls.API_HOST + '/sv_profile/'+$localStorage.id}).then(function(response){
				$scope.sv = response.data;
				$state.go('user_company_SV.sv_interns');
			});
		};
    });
})();