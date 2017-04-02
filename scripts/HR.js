(function (){
	var internon = angular.module('internon');
    internon.controller('hr_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
        $scope.logout = function(){
            $auth.logout();
            $localStorage.$reset();
            $state.go('index');
        };

        
        
        $scope.init = function () {
                $http({method: 'GET', url: urls.API_HOST + '/hr_profile/'+$localStorage.id}).then(function(response){
                    $scope.hr = response.data;
                    $localStorage.company_id = response.data.company_id;
                    $state.go('user_company_HR.hr_profile');
                });                 
		};
        
    });
    internon.controller('hr_application_controller',function(urls,$stateParams,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){
        $scope.choice_status = {
                'option': {'name': '','value':''},
        };

        $scope.choices_status = [
            {'name': 'All Applicants','value':''},            
            {'name': 'Pending Applicants','value':'Pending'},
            {'name': 'Rejected Applicants','value':'Failed'},
        ];
        
        $scope.choice_advertisement = {
                'option': {'name': '','value':'','strict':false},
        };
        $scope.choices_advertisement = [
            {'name':'All','value':''},
        ]
        $http({method: 'GET', url: urls.API_HOST + '/company_advertisement_list/'+$localStorage.company_id}).then(function(response){
            // console.log(response);
            for (var i = 0; i < response.data.length; i++) {
                $scope.choices_advertisement.push({'name':response.data[i].ads_title,'value':response.data[i].ads_title,'strict':true});
            }
        });
        $http({method: 'GET', url: urls.API_HOST + '/company_application_list/'+$localStorage.company_id}).then(function(response){
            $scope.applications = response.data;
        });
        
        $scope.accept = function($id){
            $http({method: 'GET', url: urls.API_HOST + '/hire_applicant/'+$id}).then(function(response){
            });
        };

        $scope.reject = function($id){
            $http({method: 'GET', url: urls.API_HOST + '/reject_application/'+$id}).then(function(response){
            });
        };
        // $scope.test = function(){
        //     console.log($scope.strict);
        // }

        if($scope.choice_advertisement.option.name == 'All'){
            $scope.strict = false;
        }else{
            $scope.strict = true;            
        }

        $scope.schedModal = function(id){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'hr_sched_student_modal.html',
                controller: 'sched_modal_Controller',
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
        $scope.advertisementModal = function(ads){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'advertisement_modal.html',
                controller: function(ads,$scope){
                    $scope.ads = ads;
                },
                size: 'md',
                resolve: {
                        ads: function () {
                            return ads;
                        }
                    }
                });

                modalInstance.result.then(function (ads) {
                    return 1;
                });
        };
        $scope.profileModal = function(student){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'student_profile_modal.html',
                controller: function(student,$scope){
                    $scope.student = student;
                },
                size: 'md',
                resolve: {
                        student: function () {
                            return student;
                        }
                    }
                });

                modalInstance.result.then(function (student) {
                    return 1;
                });
        };
        $scope.remarksModal = function(remarks){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'remarks_modal.html',
                controller: function(remarks,$scope){
                    $scope.remarks = remarks;
                    console.log(remarks);
                },
                size: 'md',
                resolve: {
                        remarks: function () {
                            return remarks;
                        }
                    }
                });

                modalInstance.result.then(function (remarks) {
                    return 1;
                });
        };  
        $scope.resultModal = function(type,id){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'result_modal.html',
                controller: 'result_modal_Controller',
                size: 'md',
                resolve: {
                        id: function () {
                            return id;
                        },
                        type:function(){
                            return type;
                        }
                    }
                });

                modalInstance.result.then(function (id) {
                    return 1;
                });
        };


    });
    internon.controller('hr_schedule_controller',function(urls,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){ 
        $http({method: 'GET', url: urls.API_HOST + '/get_schedules/'+$localStorage.company_id}).then(function(response){
            $scope.schedules = response.data;
        });
           
        $scope.remarks;

        $scope.remarksModal = function(id){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'hr_sched_remarks_modal.html',
                controller: function(id,$http,$scope){
                    $scope.save = function(){
                        $http.post(urls.API_HOST + '/interview_result/'+id , {remarks: $scope.remarks}).then(function (response){
                            // $scope.applications = response.data;
                        });
                    }
                },
                size: 'sm',
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
    internon.controller('hr_interns_controller',function(urls,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){
        $http({method: 'GET', url: urls.API_HOST + '/intern_list/'+$localStorage.company_id}).then(function(response){
            $scope.interns = response.data;
        });
        

        $scope.dept_id = {
            'department_id': {'name': '','value':'','strict':false},
        };
        $scope.choices_department = [
            {'name':'All Department','value':'','strict':false}
        ]

        $scope.choice_status = {
                'option': {'name': '','value':''},
        };

        $scope.choices_status = [
            {'name': 'All Applicants','value':''},            
            {'name': 'Active','value':'Active'},
            {'name': 'Done','value':'Done'},
        ];
        
        $http({method: 'GET', url: urls.API_HOST + '/department_list/'+$localStorage.company_id}).then(function(response){
            $scope.departments = response.data;
            for (var i = 0; i < response.data.length; i++) {
                $scope.choices_department.push({'name':response.data[i].department_name,'value':response.data[i].department_name,'strict':true});
            }
        });


        $scope.viewTimecardModal = function(){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'intern_timecard_modal.html',
                controller: function($scope,$http,$uibModalInstance){
                    
                },
                size: 'md',
                resolve: {
                    }
                });

                modalInstance.result.then(function () {
                    return 1;
                });
        };

         $scope.viewRendered = function(){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'view_rendered.html',
                    controller: "",
                    size: 'lg',
                    });
            };
    });
    internon.controller('sched_modal_Controller',function(id,urls,$stateParams,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal,$uibModalInstance){
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();
        $scope.mytime = new Date();
        $scope.hstep = 1;
        $scope.mstep = 1;
        
        $scope.set = function(){
            $scope.date = ($scope.dt.getYear()+1900)+"-"+($scope.dt.getMonth()+1)+"-"+$scope.dt.getDate();
            $scope.time = $scope.mytime.getHours()+":"+$scope.mytime.getMinutes();            
            console.log($scope.date + " "+$scope.time);
            $http.post(urls.API_HOST + '/set_interview/'+id,{reason:$scope.reason,interview_date:$scope.date,interview_time:$scope.time}).then(function (response){
                $uibModalInstance.close();
                $state.go('user_company.company_list_application', {application_id: id,type: $stateParams.type} );            
            });
        };
    });
    internon.controller('result_modal_Controller',function(id,type,urls,$stateParams,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal,$uibModalInstance){
        // get department
        $scope.type = type;
        $scope.id = id;

        $scope.dept_id = {
            'department_id': {'name': '','value':'','strict':false},
        };
        $scope.choices_department = [
        ]
        $http({method: 'GET', url: urls.API_HOST + '/department_list/'+$localStorage.company_id}).then(function(response){
            $scope.departments = response.data;
            for (var i = 0; i < response.data.length; i++) {
                $scope.choices_department.push({'name':response.data[i].department_name,'value':response.data[i].id,'strict':true});
            }
        });

        $scope.hire = function(){
            // console.log($scope.dept_id.department_id.value);
            $http.post(urls.API_HOST + '/hire_applicant/'+$scope.id, {department_id:$scope.dept_id.department_id.value}).then(function (response){
                $uibModalInstance.close;
            });  
        }
    });
})();