(function () {
    'use strict';
    var internon = angular.module('internon', [
        'ngResource',
        'ui.router',
        'ui.bootstrap',
        'ngStorage',
        'satellizer',
        ]);

    internon.constant('urls', (function () {
        // Serve the laravel
        var server = "Intern-On-DB/public";
        return {
            API_HOST: 'http://localhost/'+server+ '/api/internon'
            // FILE_HOST: 'http://' + server + '/caitlyn/api/files',
            // WEBSOCKET_HOST: 'ws://'+ server +':9060',
            // UPLOADED_IMAGES_URL: 'http://' + server + '/Amechania/public/images',
            // ACCEPT: 'application/prs.tchn.v1+json'
            //, UTIL_HOST: 'http://'+window.location.host+'/us'  //Utility server
        };
    })());


    internon.run(function($auth,$http,$rootScope,$state, $stateParams,$localStorage) {
        $http.defaults.headers.common.Authorization = 'Bearer: ' + $auth.getToken();

        $rootScope.$on('$stateChangeStart', function($state,event, toState, toParams, fromState, fromParams){
            // put here codes for security log in first :)
        });
    });

    internon.config(function(urls,$httpProvider,$stateProvider,$urlRouterProvider,$authProvider,$qProvider) {
        $authProvider.loginUrl = urls.API_HOST + '/auth';
        $urlRouterProvider.otherwise('index');
        // $qProvider.errorOnUnhandledRejections(false);
        var states = [
            {
            name: 'index',
            url: '/index',
            templateUrl:  'partials/index.html',
            controller:'index_controller'
            },
            {
            name: 'user',
            url: '/user',
            templateUrl:  'partials/user.html',
            controller:'user_controller'
            },
        ]

        states.forEach(function(state) {
            $stateProvider.state(state);
        });
    });


    internon.controller('index_controller',function(Register,$http,$state,$scope,$localStorage,$auth,$uibModal){
        $scope.openModal = function(type){
            var type;
            var template="";

            if(type==1)
                template="Login.html";
            else if(type==2)
                template="Register.html";

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: template,
                controller: 'index_modal_controller',
                size: 'sm',
                resolve: {
                        type: function () {
                            return type;
                        }
                    }
                });

                modalInstance.result.then(function (type) {
					return 1;
				});
        };

        $scope.goUser = function(){
            $state.go('user')
        };

	});

    internon.controller('index_modal_controller',function(Register,$http,$state,$scope,$localStorage,$auth,$uibModal,$uibModalInstance){

        $scope.close = function () {
            $uibModalInstance.close();
        };


        $scope.login = function() {
            var credentials = {
                email: $scope.email,
                password: $scope.password
            }

            // Use Satellizer's $auth service to login
            $auth.login(credentials).then(function(data) {
                $state.go('user');
                $uibModalInstance.close();
                
            }).catch(function(error){

            });
        }

        $scope.formdata = {
                type : 'student'
        }

        $scope.register = function(){
            
            Register.save($scope.formdata).$promise.then(function (response) {
                $uibModalInstance.close();
            });
        };

    });


    internon.factory('Register', ['urls', '$resource', function (urls, $resource) {
        return $resource(urls.API_HOST + '/register/:id', {
            id: '@id'
        },{
            update:{
                method:'PUT',
            },
            save:{
                method:'POST'
            }
        });
    }
    ]);

    internon.factory('Student_User', ['urls', '$resource', function (urls, $resource) {
        return $resource(urls.API_HOST + '/register/:id', {
            id: '@id'
        },{
            update:{
                method:'PUT',
            },
            save:{
                method:'POST'
            }
        });
    }
    ]);

})();