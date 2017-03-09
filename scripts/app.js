(function () {
    'use strict';
    var internon = angular.module('internon', [
        'ngResource',
        'ui.router',
        'ui.bootstrap',
        'ngStorage',
        'satellizer',
        'angular-toArrayFilter',
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
            name: 'getUser',
            url: '/index',
            templateUrl:  '',
            controller:'user_controller'
            },

            // Company routes
            {
            name: 'user_company',
            url: '/user-company',
            templateUrl:  'partials/user_company.html',
            controller:'user_company_controller'
            },
            {
            name: 'user_company.company_ads',
            url: '',
            templateUrl:  'company_ads.html',
            controller:'user_company_controller'
            },
            {
            name: 'user_company.company_create_ads',
            url: '',
            templateUrl:  'company_create_ads.html',
            controller:'user_company_controller'
            },
            {
            name: 'user_company.company_application',
            url: '',
            templateUrl:  'company_application.html',
            controller:'application_controller'
            },
            {
            name: 'user_company.company_interns',
            url: '',
            templateUrl:  'company_interns.html',
            controller:'application_controller'
            },
            
            // Student routes
            {
            name: 'user_student',
            url: '/user',
            templateUrl:  'partials/user_student.html',
            controller:'user_students_controller'
            },
            {
            name: 'user_student.student_search',
            url: '',
            templateUrl:  'searchinternship.html',
            controller:'user_students_controller'
            },
            {
            name: 'user_student.student_profile',
            url: '',
            templateUrl:  'studentprofile.html',
            controller:'user_students_controller'
            },
            {
            name: 'user_student.student_application',
            url: '',
            templateUrl:  'studentapplication.html',
            controller:'application_controller'
            },
            {
            name: 'user_student.student_schedule',
            url: '',
            templateUrl:  'studentschedule.html',
            controller:'user_students_controller'
            },
            {
            name: 'user_student.student_setting',
            url: '',
            templateUrl:  'studentsetting.html',
            controller:'user_students_controller'
            },
            {
            name: 'user_student.student_message',
            url: '',
            templateUrl:  'studentmessage.html',
            controller:'user_students_controller'
            }
            
        ]

        states.forEach(function(state) {
            $stateProvider.state(state);
        });
    });


    internon.controller('index_controller',function(Account,$http,$state,$scope,$localStorage,$auth,$uibModal){
        $scope.openModal = function(type){
            var type;
            var template="";

            if(type==1)
                template="Login.html";
            else if(type==2)
                template="Register.html";
             else if(type==3)
                template="CompanyLogin.html";

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


	});

    internon.controller('index_modal_controller',function(Account,$http,$state,$scope,$localStorage,$auth,$uibModal,$uibModalInstance){

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
                $state.go('getUser')
                $uibModalInstance.close();
                
            }).catch(function(error){

            });
        }

    });


    internon.factory('Account', ['urls', '$resource', function (urls, $resource) {
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

    internon.factory('Ads', ['urls', '$resource', function (urls, $resource) {
        return $resource(urls.API_HOST + '/ads/:id',{
            update:{
                method:'PUT',
            },
            save:{
                method:'POST',
                isArray: true,
            }
        });
    }
    ]);

    internon.factory('Application', ['urls', '$resource', function (urls, $resource) {
        return $resource(urls.API_HOST + '/application/:id',{
            update:{
                method:'PUT',
            },
            save:{
                method:'POST',               
            }
        });
    }
    ]);

})();