(function (){
	var internon = angular.module('internon');
    internon.controller('ad_controller',function(id,Ads,Application,urls,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){
        // console.log($rootScope.user_id);
        $scope.ad;
        Ads.get({id:id}).$promise.then(function (response) {
           $scope.ad = response[0];
        //    console.log(response[0]);
        });

        $scope.formdata ={
            ad_id:id,
            student_id: $localStorage.id,
            user:'student',
            type:'apply'
        };

        $scope.apply = function () {
            Application.save($scope.formdata).$promise.then(function (response){
                $uibModalInstance.close();
            });
            
            // console.log($scope.formdata);
        };
    });

     internon.controller('application_controller',function(Ads,Application,urls,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){
        if($state.current.name == 'user_company.company_application'){
            $scope.formdata ={
                user:'company',
                type: 'show_applications',
                id:$localStorage.id
            };

            Application.save($scope.formdata).$promise.then(function (response){
                $scope.applications = response;
            });

            $scope.data={
                id:$localStorage.id,
                type:'show'
            };
            Ads.save($scope.data).$promise.then(function (response) {
                $scope.ads = response;
            }).catch(function(e){
                console.log(e)
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
            $scope.formdata ={
                user:'student',
                type: 'show_applications',
                id:$localStorage.id
            };

            Application.save($scope.formdata).$promise.then(function (response){
                $scope.applications = response;
            });
        };
    });    
     internon.controller('ads_application_controller',function(id,Ads,Application,urls,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){
         
        Application.get({id:id}).$promise.then(function (response) {
           $scope.application = response;
        });

    });
})();
