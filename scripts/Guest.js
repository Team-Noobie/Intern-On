(function (){
	var internon = angular.module('internon');
    internon.controller('guest_controller',function(urls,$http,$auth,$state,$scope,$localStorage,$uibModal){
        $scope.init = function () {
				$state.go('user_guest.search_internship');
		};

         $scope.openModal = function(){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'Login.html',
                controller: 'login_modal_controller',
                size: 'sm',
                resolve: {}});

                modalInstance.result.then(function () {
					return 1;
				});
        };
        $scope.search = function() {
            $state.go('user_guest');
        };
});  
// internon.controller('search_advertisement_controller',function(urls,$http,$state,$scope,$localStorage,$uibModal){
// 		$scope.ads = {};
// 		$http({method: 'GET', url: urls.API_HOST + '/search_advertisement/'+$localStorage.id}).then(function(response){
// 			$scope.ads = response.data;
// 			$scope.totalItems = $scope.ads.length;
// 			$scope.currentPage = 1;
// 			$scope.itemsPerPage = 10;

// 			$scope.$watch("currentPage", function(){
// 				setPagingData($scope.currentPage);
// 			});

// 			function setPagingData(currentPage){
// 				var pageData = $scope.ads.slice(
// 					(currentPage-1) * $scope.itemsPerPage,
// 					currentPage * $scope.itemsPerPage	
// 				);
// 				$scope.aAds = pageData;
// 			}
// 		});

// 		$scope.openAdModal = function(id){
// 			var modalInstance = $uibModal.open({
// 				animation: true,
// 				templateUrl: 'ad.html',
// 				controller: 'student_view_advertisement_controller',
// 				size: 'lg',
// 				resolve: {
// 						id: function () {
// 							return id;
// 						}
// 					}
// 				});

// 				modalInstance.result.then(function (id) {
// 					$http({method: 'GET', url: urls.API_HOST + '/search_advertisement/'+$localStorage.id}).then(function(response){
// 						$scope.ads = {};
// 						$scope.ads = response.data;
// 						$scope.totalItems = $scope.ads.length;
// 						$scope.currentPage = 1;
// 						$scope.itemsPerPage = 10;

// 						$scope.$watch("currentPage", function(){
// 							setPagingData($scope.currentPage);
// 						});

// 						function setPagingData(currentPage){
// 							var pageData = $scope.ads.slice(
// 								(currentPage-1) * $scope.itemsPerPage,
// 								currentPage * $scope.itemsPerPage	
// 							);
// 							$scope.aAds = pageData;
// 						}
// 					});
// 				});
// 		};
// 	});
     internon.controller('login_modal_controller',function(urls,ngToast,$http,$state,$scope,$localStorage,$auth,$uibModal,$uibModalInstance){
        $scope.close = function () {
            $uibModalInstance.close();
        };

        $scope.login = function() {
            var credentials = {
                username: $scope.username,
                password: $scope.password
            }
            // Use Satellizer's $auth service to login
            $auth.login(credentials).then(function(data) {
                
                $http({method: 'GET', url: urls.API_HOST + '/auth'}).then(function(response) {
                    $localStorage.id = response.data.user.id;
                        if(response.data.user.type == "student")
                            $state.go('user_student');

                        if(response.data.user.type == "company")
                            $state.go('user_company');

                        if(response.data.user.type == "coordinator")
                            $state.go('user_coordinator');

                        if(response.data.user.type == "administrator")
                            $state.go('user_administrator'); 

                        if(response.data.user.type == "hr")
                            $state.go('user_company_HR'); 

                        if(response.data.user.type == "sv")
                            $state.go('user_company_SV');   

                            
                });
                $uibModalInstance.close();
            }).catch(function(error){
                
                ngToast.create({
                className: 'warning',
                content: 'Invalid Username or Password',
                animation: 'fade' 
                });

            });
        }
    });
})();
