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

     internon.controller('coordinator_section_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
        $scope.newSection = function(id){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'create_student_section.html',
                    controller: 'create_student_section_controller',
                    size: 'md',
                    resolve: {
                            id: function () {
                                return id;
                            }
                        }
                    });

                    modalInstance.result.then(function (id) {
                        return 1;
                    });
            };
    });

    internon.controller('create_student_section_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
       
        $scope.create_section = function () {
            $http.post(urls.API_HOST + '/create_student_section', $scope.formdata).then(function (response){
                $state.go('user_coordinator.coordinator_section');   
            });

        };

    });
   
})();
