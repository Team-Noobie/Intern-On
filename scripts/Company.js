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
				$scope.name = response.data.company_name;
				$state.go('user_company.company_ads');
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
                {'name': 'On-Process Applicants','value':'Process'},
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
            ad_requirements:["",],
            ad_responsibilities:["",],
            ad_contacts:["",],
        };
      
        CKEDITOR.replace( 'editor1', {
            height: 150
        } );
        CKEDITOR.replace( 'editor2', {
            height: 150
        } );
                            
        $scope.addReq = function() {
                $scope.formdata.ad_requirements.push("");
        }
        $scope.addRes = function() {
                $scope.formdata.ad_responsibilities.push("");
        }
        $scope.addCon = function() {
                $scope.formdata.ad_contacts.push("");
        }

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
    internon.controller('list_applicants_controller',function(urls,$stateParams,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){
        $http.post(urls.API_HOST + '/advertisement_applicant_list/'+$stateParams.ads_id , {type: $stateParams.type}).then(function (response){
            $scope.applications = response.data;
        });
    
        $scope.changeState = function($id){
            $state.go('user_company.company_student_application', {application_id: $id,type: $stateParams.type} );            
        };
    });
    internon.controller('View_Application_Controller',function(urls,$stateParams,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){
        $http({method: 'GET', url: urls.API_HOST + '/view_application/'+$stateParams.application_id}).then(function(response){
                $scope.application = response.data;
                $scope.file = '../Intern-On-DB/storage/app/resume/'+response.data.student_id+'/'+response.data.student.resume;
        });
        // $scope.file = urls.API_HOST;
        // console.log('localhost/Intern-On-DB/storage/resume/'+$scope.application);
        
        
        $scope.backState = function($id){
            $state.go('user_company.company_list_application', {ads_id: $id,type: $stateParams.type} );                
        }

        $scope.openAdModal = function(id){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'company_sched_student_modal.html',
                    controller: 'company_view_advertisement_controller',
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

})();