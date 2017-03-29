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
    internon.controller('sv_intern_list_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
        $scope.choice_status = {
                'option': {'name': '','value':''},
        };

        $scope.choices_status = [
            {'name': 'All Applicants','value':''},            
            {'name': 'Active','value':'Active'},
            {'name': 'Done','value':'Done'},
        ];

        $http({method: 'GET', url: urls.API_HOST + '/sv_profile/'+$localStorage.id}).then(function(response){
            $http({method: 'GET', url: urls.API_HOST + '/sv_intern_list/'+response.data.department_id}).then(function(response){
                $scope.interns = response.data;
            });
        });
    });
    internon.controller('sv_grade_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
        $scope.choice_status = {
                'option': {'name': '','value':''},
        };

        $scope.choices_status = [
            {'name': 'All Applicants','value':''},            
            {'name': 'Active','value':'Active'},
            {'name': 'Done','value':'Done'},
        ];

        $http({method: 'GET', url: urls.API_HOST + '/sv_profile/'+$localStorage.id}).then(function(response){
            $http({method: 'GET', url: urls.API_HOST + '/sv_intern_list/'+response.data.department_id}).then(function(response){
                $scope.interns = response.data;
            });
        });
    });
})();