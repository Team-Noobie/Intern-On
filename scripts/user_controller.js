(function (){
	var internon = angular.module('internon');
    internon.controller('user_controller',function(Ads,Account,urls,$http,$auth,$state,$rootScope,$scope,$localStorage){
            
        $http({method: 'GET', url: urls.API_HOST + '/auth'}).then(function(response) {
        //   $rootScope.user_id= response.data.user.id;
          $localStorage.id = response.data.user.id;
            if(response.data.user.type == "student")
                $state.go('user_student');
            if(response.data.user.type == "company")
                $state.go('user_company');
        });
        
    });


    internon.controller('user_students_controller',function(Ads,Account,urls,$http,$auth,$state,$scope,$localStorage,$uibModal){

        $scope.logout = function(){
            $auth.logout();
            $localStorage.$reset();
            $state.go('index');
        };

        $scope.init = function () {
            $http({method: 'GET', url: urls.API_HOST + '/auth'}).then(function(response) {
                $state.go('user_student.student_profile');
                $http({method: 'GET', url: urls.API_HOST + '/register/'+response.data.user.id}).then(function(response) {
                    $scope.name = response.data[0].student_name;
                });
            });
        };
        if($state.current.name == "user_student.student_search"){
            $scope.ads;
            Ads.query().$promise.then(function (response) {
                $scope.ads = response;


                $scope.totalItems = $scope.ads.length;
                $scope.currentPage = 1;
                $scope.itemsPerPage = 10;

                $scope.$watch("currentPage", function(){
                    setPagingData($scope.currentPage);
                });

                function setPagingData(currentPage){
                    var pageData = $scope.ads.slice(
                        (currentPage-1) * $scope.itemsPerPage,
                        currentPage * $scope.itemsPerPage	
                    );
                    $scope.aAds = pageData;
                }
            });
        };


        $scope.openAdModal = function(id){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ad.html',
                controller: 'ad_controller',
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

    internon.controller('user_company_controller',function(Ads,Account,urls,$http,$auth,$state,$scope,$localStorage,$uibModal){

        $scope.logout = function(){
            $auth.logout();
            $localStorage.$reset();
            $state.go('index');
        };
        $scope.id;

        $scope.init = function () {
            $http({method: 'GET', url: urls.API_HOST + '/auth'}).then(function(response) {
                $scope.id = response.data.user.id;
                $http({method: 'GET', url: urls.API_HOST + '/register/'+response.data.user.id}).then(function(response) {
                   $scope.name = response.data[0].company_name;
                   $state.go('user_company.company_ads');
                });
            });
        };

        $scope.formdata={ 
            id:$scope.id,
            type:'save',
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
             Ads.save($scope.formdata).$promise.then(function (response){
			});
            $state.go('user_company.company_ads');
        };
        
         $scope.cancel = function () {
            $state.go('user_company.company_ads');  
        };

        if($state.current.name == 'user_company.company_ads'){
            $scope.choice = {
                'option': {'name': '','value':''},
            };
            
                
            $scope.choices = [
                {'name': 'Date','value':'created_at'},
                {'name': 'Title','value':'ads_title'},
            ];


            $scope.data={
                id:$localStorage.id,
                type:'show'
            };
            Ads.save($scope.data).$promise.then(function (response) {
                $scope.ads = response;
                // console.log(response);
            }).catch(function(e){
                console.log(e)
            });
        };


        $scope.openAdModal = function(id){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'company_ad.html',
                controller: 'ad_controller',
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
})();