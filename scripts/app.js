(function () {
    'use strict';
    var internon = angular.module('internon', [
        'ngResource',
        'ui.router',
        'ui.bootstrap',
        'ngStorage',
        'satellizer',
        'angular-toArrayFilter',
        'ckeditor',
        'angularFileUpload',
        'ngSanitize'
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
            url: '/company',
            templateUrl:  'partials/user_company.html',
            controller:'company_controller'
            },
            {
            name: 'user_company.company_profile',
            url: '',
            templateUrl:  'company_profile.html',
            controller:'company_controller'
            },
            {
            name: 'user_company.company_ads',
            url: '',
            templateUrl:  'company_ads.html',
            controller:'advertisement_list_controller'
            },
            {
            name: 'user_company.company_create_ads',
            url: '',
            templateUrl:  'company_create_ads.html',
            controller:'create_advertisement_controller'
            },
            {
            name: 'user_company.company_application',
            url: '',
            templateUrl:  'company_application.html',
            controller:'advertisement_list_controller'
            },
            // for application
            {
            name: 'user_company.company_list_application',
            url: '',
            templateUrl:  'company_list_application.html',
            controller:'list_applicants_controller',
            params : { ads_id: null, type: null },
            },
            {
            name: 'user_company.company_student_application',
            url: '',
            templateUrl:  'company_student_application.html',
            controller:'View_Application_Controller',
            params : { application_id: null, type: null},            
            },
            {
            name: 'user_company.company_schedule',
            url: '',
            templateUrl:  'company_schedules.html',
            controller:'company_schedule_controller'
            },
            // 
            {
            name: 'user_company.company_interns',
            url: '',
            templateUrl:  'company_interns.html',
            controller:'company_interns_controller'
            },
            
            
            // Student routes
            {
            name: 'user_student',
            url: '/student',
            templateUrl:  'partials/user_student.html',
            controller:'students_controller'
            },
            {
            name: 'user_student.student_profile',
            url: '',
            templateUrl:  'studentprofile.html',
            controller:'student_profile_controller',
            params : { student: null},                        
            },
            {
            name: 'user_student.student_search',
            url: '',
            templateUrl:  'searchinternship.html',
            controller:'search_advertisement_controller'
            },
            {
            name: 'user_student.student_application',
            url: '',
            templateUrl:  'studentapplication.html',
            controller:'student_view_application_controller'
            },

            //Coordinator routes
            {
            name: 'user_coordinator',
            url: '/coordinator',
            templateUrl:  'partials/user_coordinator.html',
            controller:'coordinator_controller'
            },

            {
            name: 'user_coordinator.coordinator_profile',
            url: '',
            templateUrl:  'coordinator_profile.html',
            controller:'coordinator_controller'
            },
            {
            name: 'user_coordinator.coordinator_section',
            url: '',
            templateUrl:  'coordinator_section.html',
            controller:'user_coordinator_controller'
            },
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
                controller: 'login_modal_controller',
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

    internon.controller('login_modal_controller',function(Account,$http,$state,$scope,$localStorage,$auth,$uibModal,$uibModalInstance){

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
                $state.go('getUser')
                $uibModalInstance.close();
            }).catch(function(error){

            });
        }

    });

    internon.controller('user_controller',function(Ads,Account,urls,$http,$auth,$state,$rootScope,$scope,$localStorage){
            
        $http({method: 'GET', url: urls.API_HOST + '/auth'}).then(function(response) {
          $localStorage.id = response.data.user.id;
            if(response.data.user.type == "student")
                $state.go('user_student');
            if(response.data.user.type == "company")
                $state.go('user_company');
            if(response.data.user.type == "coordinator")
                $state.go('user_coordinator');
        });
    });


    internon.factory('Account', ['urls', '$resource', function (urls, $resource) {
        return $resource(urls.API_HOST + '/user/:id', {
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
            },
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