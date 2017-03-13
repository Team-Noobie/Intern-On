(function (){
	var internon = angular.module('internon');
    internon.controller('ad_controller',function(id,Ads,Application,urls,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){
        // console.log(id);

        $scope.ad;
        Ads.get({id:id}).$promise.then(function (response) {
           $scope.ad = response;
        });

        $scope.formdata ={
            ad_id:id,
            student_id: $localStorage.id,
        };

        $scope.apply = function () {
            Application.save($scope.formdata).$promise.then(function (response){
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

            $scope.openApModal = function(id){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'applicants_modal.html',
                    controller: 'ads_application_controller',
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

        if($state.current.name == 'user_student.student_application'){
                $http({method: 'GET', url: urls.API_HOST + '/student_show_applications/'+$localStorage.id}).then(function(response){
                    $scope.applications = response.data;
                    // console.log(response.data)
            });
        };
    });    
     internon.controller('ads_application_controller',function(id,Ads,Application,urls,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){
        // console.log(id);
        $http({method: 'GET', url: urls.API_HOST + '/company_show_applicants/'+id}).then(function(response){
                    $scope.applications = response.data;
                    // console.log(response);
        });
    });
})();
