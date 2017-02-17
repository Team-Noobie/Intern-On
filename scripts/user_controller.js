(function (){
	var internon = angular.module('internon');
    internon.controller('user_controller',function(Student_User,urls,$http,$auth,$state,$scope,$localStorage){

        $http({method: 'GET', url: urls.API_HOST + '/auth'}).then(function(response) {
          console.log(response);
        });

        // Register.save($scope.formdata).$promise.then(function (response) {
        //         $uibModalInstance.close();
        // });

        $scope.logout = function(){
            $auth.logout();
            $localStorage.$reset();
            $state.go('index');
        };
    });
})();