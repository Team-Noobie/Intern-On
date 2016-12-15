(function (){
	var internon = angular.module('internon');
    internon.controller('user_controller',function(urls,$http,$auth,$state,$scope,$localStorage){

        $http({method: 'GET', url: urls.API_HOST + '/auth'}).then(function(response) {
          $scope.user = response.user;
        });



        $scope.logout = function(){
            $auth.logout();
            $localStorage.$reset();
            $state.go('index');
        };
    });
})();