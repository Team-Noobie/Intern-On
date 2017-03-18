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


        if($state.current.name == 'user_company.company_application'){
            $http({method: 'GET', url: urls.API_HOST + '/advertisement_application_list/'+$localStorage.id}).then(function(response){
                    $scope.ads = response.data;
            });
        };
    });
    internon.controller('create_advertisement_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
        $scope.formdata={ 
            id:$localStorage.id,
            ad_requirements:["",],
            ad_responsibilities:["",],
            ad_contacts:["",],
        };


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
})();
