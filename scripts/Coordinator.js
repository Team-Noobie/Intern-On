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

            $scope.enrollStudent = function(id){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'enroll_student.html',
                    controller: 'enroll_student_controller',
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




           $http({method: 'GET', url: urls.API_HOST + '/section_list'}).then(function(response){
                    $scope.section = response.data;
                });
                     
    });

    internon.controller('enroll_student_controller',function(id,urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
       $scope.formdata = {
           coordinator_id: $localStorage.id,
           section_id: id,
       }

        $scope.enrollStudent = function () {
            $http.post(urls.API_HOST + '/enroll_student', $scope.formdata).then(function (response){
                $state.go('user_coordinator.coordinator_section');   
            });
 
        };

    });

     internon.controller('create_student_section_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
       
        $scope.createSection = function () {
            $http.post(urls.API_HOST + '/create_student_section', $scope.formdata).then(function (response){
                $state.go('user_coordinator.coordinator_section');   
            });

        };

    });
   
})();
