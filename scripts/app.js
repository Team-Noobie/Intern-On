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
        'ngSanitize',
        'ngCsvImport',
        'ngToast'
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

    internon.factory('var', function ($q, $injector) {
           return{
               ngToast : $injector.get('ngToast'),
           }
    });


    internon.run(function($auth,$http,$rootScope,$state,$stateParams,$localStorage) {
        $http.defaults.headers.common.Authorization = 'Bearer: ' + $auth.getToken();
        $rootScope.$on('$stateChangeStart', function($localStorage,$state,event, toState, toParams, fromState, fromParams){
        });
    });

    internon.config(function(urls,ngToastProvider,$httpProvider,$stateProvider,$urlRouterProvider,$authProvider,$qProvider) {
        
        $authProvider.loginUrl = urls.API_HOST + '/auth';
        $urlRouterProvider.otherwise('index');
        ngToastProvider.configure({
            animation: 'slide', // or 'fade',
            compileContent: true,
            combineDuplications: true,
        });
        // $qProvider.errorOnUnhandledRejections(false);
        $httpProvider.interceptors.push(function($q, $location, $localStorage, $injector) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $localStorage.token;
                    }
                    return config;
                },
                'responseError': function(response) {
                    /* 401, unauthorised:
                        - bad username / password
                        - token expired
                    403, forbidden - notAdmin
                    */ 
                    // if(response.status === 401 || response.status === 403) {
                    if(response.status === 401 || response.status === 400) {
                        console.log("app.js: httpInterceptor caught 40x:", response);
                        $injector.get('$state').go('index');
                    }
                    // Replace reponse with rejected promise to prevent rest of execution
                    return $q.reject(response);
                }
            };
        });
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
            // Administrator routes
            {
            name: 'user_administrator',
            url: '/administrator',
            templateUrl:  'partials/user_administrator.html',
            controller:'administrator_controller'
            },
            {
            name: 'user_administrator.administrator_company',
            url: '',
            templateUrl:  'administrator_company.html',
            controller:'administrator_controller'
            },
            {
            name: 'user_administrator.administrator_coordinator',
            url: '',
            templateUrl:  'administrator_coordinator.html',
            controller:'administrator_controller'
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
            name: 'user_company.company_accounts',
            url: '',
            templateUrl:  'company_accounts.html',
            controller:'company_accounts_controller'
            },
            {
            name: 'user_company.company_departments',
            url: '',
            templateUrl:  'company_department.html',
            controller:'company_departments_controller'
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
            name: 'user_company.company_list_application',
            url: '',
            templateUrl:  'company_list_application.html',
            controller:'application_controller'
            },
            {
            name: 'user_company.company_schedule',
            url: '',
            templateUrl:  'company_schedules.html',
            controller:'company_schedule_controller'
            },
            {
            name: 'user_company.company_interns',
            url: '',
            templateUrl:  'company_interns.html',
            controller:'company_interns_controller'
            },
            // HR 
            { 
            name: 'user_company_HR',
            url: '/hr',
            templateUrl:  'partials/user_company_HR.html',
            controller:'hr_controller'
            },
            {
            name: 'user_company_HR.hr_profile',
            url: '',
            templateUrl:  'hr_profile.html',
            controller:'hr_controller'
            },
            {
            name: 'user_company_HR.hr_list_application',
            url: '',
            templateUrl:  'hr_list_application.html',
            controller:'hr_application_controller'
            },
            {
            name: 'user_company_HR.hr_schedules',
            url: '',
            templateUrl:  'hr_schedules.html',
            controller:'hr_controller'
            },
            {
            name: 'user_company_HR.hr_interns',
            url: '',
            templateUrl:  'hr_interns.html',
            controller:'hr_controller'
            },
            // SV
            { 
            name: 'user_company_SV',
            url: '/sv',
            templateUrl:  'partials/user_company_SV.html',
            controller:'sv_controller'
            },
            {
            name: 'user_company_SV.sv_interns',
            url: '',
            templateUrl:  'sv_interns.html',
            controller:'sv_intern_list_controller'
            },
            {
            name: 'user_company_SV.interns_grade',
            url: '',
            templateUrl:  'interns_grade.html',
            controller:'sv_grade_controller'
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
            {
            name: 'user_student.student_schedule',
            url: '',
            templateUrl:  'student_schedule.html',
            controller:'student_sched_controller'
            },
            {
            name: 'user_student.student_grades',
            url: '',
            templateUrl:  'student_grades.html',
            controller:''
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
            controller:'coordinator_section_controller'
            },
            {
            name: 'user_coordinator.coordinator_files',
            url: '',
            templateUrl:  'coordinator_section.html',
            controller:'coordinator_section_controller'
            },        
        ]

        states.forEach(function(state) {
            $stateProvider.state(state);
        });

    });


    internon.controller('index_controller',function($http,$state,$scope,$localStorage,$auth,$uibModal){
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
	});

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
                ngToast.warning({
                  content: "Invalid Username or Password"
				}); 
            });
        }
    });


    internon.factory('password', function($http,$uibModal) {
        return{
            open_modal: function(id){
                var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'edit_password.html',
                    controller: function(password,$scope){
                        $scope.save = function(){
                            password.edit();
                        };
                    },
					size: 'md',
					resolve: {
							id: function () {
								return id;
							}
						}
					});

					modalInstance.result.then(function (id) {
						return 1;
					});
            },
            reset: function(){
                console.log('reset');
            },
            edit: function(formdata,id){
                console.log('edit');                
            }

        }
    });
    


})();