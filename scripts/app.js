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


    internon.run(['$rootScope','$state', '$stateParams','$localStorage',function($rootScope,$state, $stateParams,$localStorage) {

    }]);

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
        ]

        states.forEach(function(state) {
            $stateProvider.state(state);
        });
    });

    internon.controller('index_controller',function($state,$scope,User,$localStorage,$auth){
        $scope.login = function() {

            var credentials = {
                email: $scope.email,
                password: $scope.password
            }

            // Use Satellizer's $auth service to login
            $auth.login(credentials).then(function(data) {
                // If login is successful, redirect to the users state
                // $state.go('users', {});
                console.log($auth.isAuthenticated());
            });
        }

	});


    internon.factory('User', ['urls', '$resource', function (urls, $resource) {
        return $resource(urls.API_HOST + '/user/:id', {
            id: '@id'
        });
    }
    ]);
})();