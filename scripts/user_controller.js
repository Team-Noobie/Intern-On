(function (){
	var internon = angular.module('internon');
    internon.controller('user_controller',function(User,$auth,$state,$scope,$localStorage){

        User.get().$promise.then(function (response) {
            $scope.user = response.user;
        });
        $scope.logout = function(){
            $auth.logout();
            $localStorage.$reset();
            $state.go('index');
        };
    });
})();