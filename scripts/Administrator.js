(function (){
	var internon = angular.module('internon');
    internon.controller('administrator_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
        $scope.logout = function(){
            $auth.logout();
            $localStorage.$reset();
            $state.go('index');
        };

        $scope.init = function () {
				$state.go('user_administrator.administrator_company');
		};
        $http({method: 'GET', url: urls.API_HOST + '/company_accounts_list'}).then(function(response){
            $scope.company = response.data;
        });

        $http({method: 'GET', url: urls.API_HOST + '/coordinator_accounts_list'}).then(function(response){
            $scope.coordinator = response.data;
        });
        

        $scope.newCompanyAccount = function(){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'create_company_accounts.html',
                    controller: 'create_company_account_controller',
                    size: 'md',
                    });

                    modalInstance.result.then(function () {
                        return 1;
                    });
            };

    
        $scope.newCoordinatorAccount = function(){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'create_coordinator_accounts.html',
                    controller: 'create_coordinator_account_controller',
                    size: 'md',
                    });

                    modalInstance.result.then(function () {
                        return 1;
                    });
            };        

            
	    $scope.openCompanyModal = function(id){
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'view_company.html',
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

         $scope.openCoordinatorModal = function(id){
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'view_coordinator.html',
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

        });

        
     internon.controller('create_company_account_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal,$uibModalInstance){
        $scope.create_company_account = function () {
            $http.post(urls.API_HOST + '/create_company_account', $scope.formdata).then(function (response){
                $uibModalInstance.close();
                $state.go('user_administrator.administrator_module');   
            });

        };
    });

     internon.controller('create_coordinator_account_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal,$uibModalInstance){
        $scope.create_coordinator_account = function () {
            $http.post(urls.API_HOST + '/create_coordinator_account', $scope.formdata).then(function (response){
                $uibModalInstance.close();
                $state.go('user_administrator.administrator_module');   
            });

        };
    });
   

})();
