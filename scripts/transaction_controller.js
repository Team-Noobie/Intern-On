(function (){
	var internon = angular.module('internon');
    internon.controller('ad_controller',function(id,Ads,Application,urls,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){
        // console.log(id);

        $scope.ad;
        $scope.formdata1 ={
            ad_id:id,
            student_id: $localStorage.id,

        };
        $scope.formdata ={

        };

        Ads.get({id:id}).$promise.then(function (response) {
            $scope.formdata1.company_id = response.company_id;
            $scope.ad = response;
            $scope.formdata = response;
        });
        
        $scope.init = function(){
            $http.post(urls.API_HOST + '/checkApplication', $scope.formdata1).then(function (response){
                $scope.hasApplied = response.data;
            });
        }

        $scope.apply = function () {
            Application.save($scope.formdata1).$promise.then(function (response){
                $uibModalInstance.close();
            });
        };



    });

     internon.controller('application_controller',function(Ads,Application,urls,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){
        if($state.current.name == 'user_company.company_application'){
            $http({method: 'GET', url: urls.API_HOST + '/company_ads/'+$localStorage.id}).then(function(response){
                    $scope.ads = response.data;
                    // console.log(response.data);
            });

            $scope.changeState = function($id){
                $state.go('user_company.company_list_application', {ads_id: $id} );
            }
        }

        if($state.current.name == 'user_student.student_application'){
                $http({method: 'GET', url: urls.API_HOST + '/student_show_applications/'+$localStorage.id}).then(function(response){
                    $scope.applications = response.data;
                    // console.log(response.data)
            });
        };
    });    
     internon.controller('ads_application_controller',function(Ads,Application,urls,$stateParams,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){
        $http({method: 'GET', url: urls.API_HOST + '/company_show_applicants/'+$stateParams.ads_id}).then(function(response){
                    $scope.applications = response.data;
        });

        $scope.changeState = function($id){
            $state.go('user_company.company_student_application', {application_id: $id} );            
        };
        
    });

    internon.controller('student_application_controller',function(Ads,Application,urls,$stateParams,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){      
            Application.get({id:$stateParams.application_id}).$promise.then(function (response){    
                $scope.application  = response;          
            });

            $scope.backState = function($id){
                $state.go('user_company.company_list_application', {ads_id: $id} );                
            }
    });

})();
