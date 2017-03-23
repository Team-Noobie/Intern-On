(function (){
	var internon = angular.module('internon');
    internon.controller('administrator_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
        $scope.logout = function(){
            $auth.logout();
            $localStorage.$reset();
            $state.go('index');
        };

        $scope.init = function () {
			
				$state.go('user_administrator.administrator_module');
			
		};

          $scope.newCompanyAccount = function(id){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'create_company_accounts.html',
                    controller: 'create_company_account_controller',
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


                $http({method: 'GET', url: urls.API_HOST + '/company_accounts_list'}).then(function(response){
                    $scope.company = response.data;
                });

    });

     internon.controller('create_company_account_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
       
        $scope.create_account = function () {
            $http.post(urls.API_HOST + '/create_company_account', $scope.formdata).then(function (response){
                $state.go('user_administrator.administrator_module');   
            });

        };



    });

        

})();
