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
        var server = "localhost:8000";
        return {
            SERVER_IP: server,
            API_HOST: 'http://' + server + '/api/internon'
            // FILE_HOST: 'http://' + server + '/caitlyn/api/files',
            // WEBSOCKET_HOST: 'ws://'+ server +':9060',
            // UPLOADED_IMAGES_URL: 'http://' + server + '/Amechania/public/images',
            // ACCEPT: 'application/prs.tchn.v1+json'
            //, UTIL_HOST: 'http://'+window.location.host+'/us'  //Utility server
        };
    })());


    internon.run(function($auth,$http,$rootScope,$state, $stateParams,$localStorage) {
        $http.defaults.headers.common.Authorization = 'Bearer: ' + $auth.getToken();
    });

    internon.config(function(urls,$httpProvider,$stateProvider,$urlRouterProvider,$authProvider) {
        $authProvider.loginUrl = urls.API_HOST + '/auth';
        $urlRouterProvider.otherwise('index');

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


    internon.controller('index_controller',function(User,$state,$scope,$localStorage,$auth){
        $scope.login = function() {

            var credentials = {
                email: $scope.email,
                password: $scope.password
            }

            // Use Satellizer's $auth service to login
            $auth.login(credentials).then(function(data) {
                // If login is successful, redirect to the users state
                // User.get().$promise.then(function (response) {
                //     $localStorage.user = {
                //         id:response.user.id,
                //     };
                //     $state.go('user');
                // });
                $state.go('user');
            }).catch(function(error){

            });
        }

	});

    internon.factory('User', ['urls', '$resource', function (urls, $resource) {
        return $resource(urls.API_HOST + '/auth/me/:id', {
            id: '@id'
        });
    }
    ]);

})();