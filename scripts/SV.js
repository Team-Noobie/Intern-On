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
    internon.controller('sv_intern_list_controller',function(password,urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
                
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

        $scope.addReportModal = function(id){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'add_report_modal.html',
                controller: function(id,urls,$localStorage,$scope,$http,$uibModalInstance){
                    $scope.formdata = {
                        sv_id: $localStorage.id,
                    }
                    $scope.save = function(){
                        $http.post(urls.API_HOST + '/sv_report/'+id, $scope.formdata).then(function (response){
                            // $state.go('user_company.company_ads');   
                        });
                    };
                },
                size: 'sm',
                resolve: {
                    id: function(){
                        return id;
                    }
                    }
                });

                modalInstance.result.then(function (id) {
                    return 1;
                });
        };
        $scope.viewReport = function(report){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'view_report_modal.html',
                controller: function(report,urls,$localStorage,$scope,$http,$uibModalInstance){
                    $scope.report = report
                },
                size: 'sm',
                resolve: {
                    report: function(){
                        return report;
                    }
                }
            });

                modalInstance.result.then(function (report) {
                    return 1;
                });
        }
        
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

        $scope.gradeModal = function(student){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'interns_grade_modal.html',
                controller: function($localStorage,student,$scope,$http,$uibModalInstance){
                    $scope.student = student;
                },
                size: 'md',
                resolve: {
                        student : function(){
                            return student;
                        }
                    }
                });

                modalInstance.result.then(function (id) {
                    return 1;
                });
        };
    });
})();