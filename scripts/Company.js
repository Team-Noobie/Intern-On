(function (){
	var internon = angular.module('internon');
    internon.controller('company_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
        $scope.logout = function(){
            $auth.logout();
            $localStorage.$reset();
            $state.go('index');
        };

        $scope.init = function () {
			$http({method: 'GET', url: urls.API_HOST + '/company_profile/'+$localStorage.id}).then(function(response){
				$scope.company = response.data;
				$state.go('user_company.company_profile');
			});
		};
    });
    internon.controller('advertisement_list_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){

        if($state.current.name == 'user_company.company_ads'){
            $scope.choice = {
                'option': {'name': '','value':''},
            };
            
            $scope.choices = [
                {'name': 'Date - Latest','value':'-created_at'},
                {'name': 'Date - Oldest','value':'created_at'},
                {'name': 'Title - Ascending','value':'ads_title'},
                {'name': 'Title - Descending','value':'-ads_title'},
            ];

            $http({method: 'GET', url: urls.API_HOST + '/company_advertisement_list/'+$localStorage.id}).then(function(response){
                $scope.ads = response.data;
            });

             $scope.openAdModal = function(id){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'company_ad_modal.html',
                    controller: 'company_view_advertisement_controller',
                    size: 'lg',
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
        }

        if($state.current.name == 'user_company.company_application'){

            $scope.choice = {
                'option': {'name': '','value':''},
            };
            
            $scope.choices = [
                {'name': 'New Applicants','value':'New'},
                {'name': 'Pending Applicants','value':'Pending'},
                {'name': 'On-Process Applicants','value':'On-Process'},
            ];


            $http({method: 'GET', url: urls.API_HOST + '/advertisement_application_list/'+$localStorage.id}).then(function(response){
                    $scope.ads = response.data;
            });

            $scope.changeState = function($id){
                $state.go('user_company.company_list_application', {ads_id: $id,type:$scope.choice.option.value} );
            }
        };
    });
    internon.controller('create_advertisement_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
        $scope.formdata={ 
            id:$localStorage.id,
        };
      
        CKEDITOR.replace( 'editor1', {
            height:300,
            width:800,
		} );

        $scope.options = {
            language: 'en',
            allowedContent: true,
            entities: false
        };

        // Called when the editor is completely ready.
        $scope.onReady = function () {
            // ...
        };
      
                            
        $scope.save = function () {
            $http.post(urls.API_HOST + '/create_advertisement', $scope.formdata).then(function (response){
                $state.go('user_company.company_ads');   
			});
        };
        $scope.cancel = function () {
            $state.go('user_company.company_ads');  
        };
    });
    internon.controller('company_view_advertisement_controller',function(id,urls,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){
		$http({method: 'GET', url: urls.API_HOST + '/company_view_advertisement/'+id}).then(function(response){
			$scope.formdata = response.data;
		});
	});
    internon.controller('application_controller',function(urls,$stateParams,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){
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
                templateUrl: 'company_sched_student_modal.html',
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

        $http({method: 'GET', url: urls.API_HOST + '/company_advertisement_list/'+$localStorage.id}).then(function(response){
            for (var i = 0; i < response.data.length; i++) {
                $scope.choices_advertisement.push({'name':response.data[i].ads_title,'value':response.data[i].ads_title,'strict':true});
            }
        });

        $http({method: 'GET', url: urls.API_HOST + '/company_application_list/'+$localStorage.id}).then(function(response){
            $scope.applications = response.data;
        });

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
    internon.controller('company_schedule_controller',function(urls,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){ 
        $http({method: 'GET', url: urls.API_HOST + '/get_schedules/'+$localStorage.id}).then(function(response){
			$scope.schedules = response.data;
		});


        

        $scope.remarksModal = function(id){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'company_sched_remarks_modal.html',
                controller: 'remarks_modal_Controller',
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
    internon.controller('remarks_modal_Controller',function(id,urls,$stateParams,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal,$uibModalInstance){
       $scope.save = function(){
            $http.post(urls.API_HOST + '/interview_result/'+id , {remarks: $scope.remarks}).then(function (response){
                // $scope.applications = response.data;
            });
        }
    });
    internon.controller('company_interns_controller',function(urls,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){
        $http({method: 'GET', url: urls.API_HOST + '/intern_list/'+$localStorage.id}).then(function(response){
			$scope.schedules = response.data;
		});
    });
})();
