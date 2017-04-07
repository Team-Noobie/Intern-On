(function () {
    var internon = angular.module('internon');
    internon.controller('hr_controller', function (password, urls, $http, $auth, $state, $scope, $localStorage, $uibModal) {
        $scope.logout = function () {
            $auth.logout();
            $localStorage.$reset();
            $state.go('index');
        };

        $scope.init = function () {
            $http({ method: 'GET', url: urls.API_HOST + '/hr_profile/' + $localStorage.id }).then(function (response) {
                $scope.hr = response.data;
                $localStorage.company_id = response.data.company_id;
                $state.go('user_company_HR.hr_profile');
            });
        };
        

        $scope.editPassword = function (id) {
            password.open_edit_modal();
        };

          $scope.myCompany = function (hr) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'my_company.html',
                controller: function (hr,$scope) {
                    $scope.hr = hr;
                },
                size: 'lg',
                resolve: {
                    hr: function () {
                        return hr;
                    }
                }
            });
        };


        $scope.edit_info = function (data, type) {
            var template;
            if (type == 1)
                template = 'edit_profile.html'
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: template,
                controller: function (ngToast, data, type, $scope, urls, $localStorage, $http, $uibModalInstance) {
                    $scope.hr = data;
                    $scope.save = function () {
                        $http.post(urls.API_HOST + '/edit_hr_profile/' + $localStorage.id, $scope.hr).then(function (response) {
                            ngToast.create({
                                className: 'success',
                                content: 'Profile Updated',
                                animation: 'fade'
                            });
                            $uibModalInstance.close();
                        });
                    }
                    $scope.close = function () {
                        $uibModalInstance.dismiss();
                    };
                },
                size: 'md',
                resolve: {
                    data: function () {
                        return data;
                    },
                    type: function () {
                        return type;
                    }
                }
            });


            modalInstance.result.then(function (id) {
                $http({ method: 'GET', url: urls.API_HOST + '/hr_profile/' + $localStorage.id }).then(function (response) {
                    $scope.hr = {};
                    $scope.hr = response.data;
                });
            }, function () {
                $http({ method: 'GET', url: urls.API_HOST + '/hr_profile/' + $localStorage.id }).then(function (response) {
                    $scope.hr = {};
                    $scope.hr = response.data;
                });
            });
        };
    });
    internon.controller('hr_application_controller', function (urls, $stateParams, $http, $auth, $state, $rootScope, $scope, $localStorage, $uibModal) {
        $scope.choice_status = {
            'option': { 'name': '', 'value': '' },
        };

        $scope.choices_status = [
            { 'name': 'All Applicants', 'value': '' },
            { 'name': 'Pending Applicants', 'value': 'Pending' },
            { 'name': 'Rejected Applicants', 'value': 'Failed' },
        ];

        $scope.choice_advertisement = {
            'option': { 'name': '', 'value': '', 'strict': false },
        };
        $scope.choices_advertisement = [
            { 'name': 'All', 'value': '' },
        ]
        $http({ method: 'GET', url: urls.API_HOST + '/company_advertisement_list/' + $localStorage.company_id }).then(function (response) {
            // console.log(response);
            for (var i = 0; i < response.data.length; i++) {
                $scope.choices_advertisement.push({ 'name': response.data[i].ads_title, 'value': response.data[i].ads_title, 'strict': true });
            }
        });
        $http({ method: 'GET', url: urls.API_HOST + '/company_application_list/' + $localStorage.company_id }).then(function (response) {
            $scope.applications = response.data;
        });

        // $scope.accept = function($id){
        //     $http({method: 'GET', url: urls.API_HOST + '/hire_applicant/'+$id}).then(function(response){
        //     });
        // };

        // $scope.reject = function($id){
        //     $http({method: 'GET', url: urls.API_HOST + '/reject_application/'+$id}).then(function(response){
        //     });
        // };
        // $scope.test = function(){
        //     console.log($scope.strict);
        // }

        if ($scope.choice_advertisement.option.name == 'All') {
            $scope.strict = false;
        } else {
            $scope.strict = true;
        }

        $scope.schedModal = function (id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'hr_sched_student_modal.html',
                controller: 'sched_modal_Controller',
                size: 'md',
                resolve: {
                    id: function () {
                        return id;
                    }
                }
            });

            modalInstance.result.then(function (id) {
                $http({ method: 'GET', url: urls.API_HOST + '/company_application_list/' + $localStorage.company_id }).then(function (response) {
                    $scope.applications = {};
                    $scope.applications = response.data;
                });
            });
        };

        // $scope.advertisementModal = function(ads){
        //     var modalInstance = $uibModal.open({
        //         animation: true,
        //         templateUrl: 'advertisement_modal.html',
        //         controller: function(ads,$scope){
        //             $scope.ads = ads;
        //         },
        //         size: 'md',
        //         resolve: {
        //                 ads: function () {
        //                     return ads;
        //                 }
        //             }
        //         });

        //         modalInstance.result.then(function (ads) {
        //             return 1;
        //         });
        // };

        $scope.openAdModal = function (id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'company_ad_modal.html',
                controller: 'company_view_advertisement_controller',
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

        $scope.profileModal = function (student) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'student_profile_modal.html',
                controller: function (urls, student, $scope) {
                    $scope.student = student;
                    $scope.file = 'http://localhost/Intern-On-DB/storage/app/resume/' + $scope.student.user_ID + "/" + $scope.student.resume;
                    $scope.logo = 'http://localhost/Intern-On-DB/storage/app/pictures/' + student.user_ID + "/" + student.student_pic;
                },
                size: 'lg',
                resolve: {
                    student: function () {
                        return student;
                    }
                }
            });

            modalInstance.result.then(function (student) {
                return 1;
            });
        };
        $scope.remarksModal = function (remarks) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'remarks_modal.html',
                controller: function (remarks, $scope) {
                    $scope.remarks = remarks;
                    // console.log(remarks);
                },
                size: 'md',
                resolve: {
                    remarks: function () {
                        return remarks;
                    }
                }
            });

            modalInstance.result.then(function (remarks) {
                return 1;
            });
        };
        $scope.resultModal = function (type, id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'result_modal.html',
                controller: 'result_modal_Controller',
                size: 'md',
                resolve: {
                    id: function () {
                        return id;
                    },
                    type: function () {
                        return type;
                    }
                }
            });

            modalInstance.result.then(function (id) {
                $http({ method: 'GET', url: urls.API_HOST + '/company_application_list/' + $localStorage.company_id }).then(function (response) {
                    $scope.applications = {};
                    $scope.applications = response.data;
                });
            });
        };


    });
    internon.controller('hr_schedule_controller', function (urls, $http, $auth, $state, $rootScope, $scope, $localStorage, $uibModal) {
        $http({ method: 'GET', url: urls.API_HOST + '/get_schedules/' + $localStorage.company_id }).then(function (response) {
            $scope.schedules = response.data;
        });

        $scope.remarks;

        $scope.remarksModal = function (id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'hr_sched_remarks_modal.html',
                controller: function (id, $http, $scope, $uibModalInstance) {
                    $scope.save = function () {
                        $http.post(urls.API_HOST + '/interview_result/' + id, { remarks: $scope.remarks, hr_id: $localStorage.id }).then(function (response) {
                            // $scope.applications = response.data;
                            $uibModalInstance.close();
                        });
                    }
                },
                size: 'sm',
                resolve: {
                    id: function () {
                        return id;
                    }
                }
            });

            modalInstance.result.then(function (id) {
                $http({ method: 'GET', url: urls.API_HOST + '/get_schedules/' + $localStorage.company_id }).then(function (response) {
                    $scope.schedules = {};
                    $scope.schedules = response.data;
                });
            });
        };

    });
    internon.controller('hr_interns_controller', function (Utilities, urls, $http, $auth, $state, $rootScope, $scope, $localStorage, $uibModal) {

        $http({ method: 'GET', url: urls.API_HOST + '/intern_list/' + $localStorage.company_id }).then(function (response) {
            $scope.interns = response.data;
            for (var i = 0; i < response.data.length; i++) {
                $scope.interns[i].rendered_hours = Utilities.convert($scope.interns[i].rendered_hours);
                // console.log(Utilities.convert(response.data[i].rendered_hours));
                for (var x = 0; x < $scope.interns[i].timecard.length; x++) {
                    $scope.interns[i].timecard[x].hours_render = Utilities.convert($scope.interns[i].timecard[x].hours_render);
                }
            }
        });


        $scope.dept_id = {
            'department_id': { 'name': '', 'value': '', 'strict': false },
        };
        $scope.choices_department = [
            { 'name': 'All Department', 'value': '', 'strict': false }
        ]

        $scope.choice_status = {
            'option': { 'name': '', 'value': '' },
        };

        $scope.choices_status = [
            { 'name': 'All Applicants', 'value': '' },
            { 'name': 'Active', 'value': 'Active' },
            { 'name': 'Done', 'value': 'Done' },
        ];

        $http({ method: 'GET', url: urls.API_HOST + '/department_list/' + $localStorage.company_id }).then(function (response) {
            $scope.departments = response.data;
            for (var i = 0; i < response.data.length; i++) {
                $scope.choices_department.push({ 'name': response.data[i].department_name, 'value': response.data[i].department_name, 'strict': true });
            }
        });


        $scope.viewTimecardModal = function (id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'intern_timecard_modal.html',
                controller: function (id, $scope, $http, $uibModalInstance, $localStorage) {
                    $scope.today = function () {
                        $scope.dt = new Date();
                    };
                    $scope.today();

                    $scope.inMytime = new Date();
                    $scope.outMytime = new Date();

                    $scope.inHstep = 1;
                    $scope.inMstep = 1;

                    $scope.outHstep = 1;
                    $scope.outMstep = 1;




                    $scope.save = function () {

                        $scope.date = ($scope.dt.getYear() + 1900) + "-" + ($scope.dt.getMonth() + 1) + "-" + $scope.dt.getDate();
                        $scope.Intime = $scope.inMytime.getHours() + ":" + $scope.inMytime.getMinutes();
                        $scope.Outtime = $scope.outMytime.getHours() + ":" + $scope.outMytime.getMinutes();
                        $scope.time = ($scope.outMytime - $scope.inMytime);

                        if ($scope.inMytime.getHours() <= 12 && $scope.outMytime.getHours() >= 13) {
                            $scope.diff = Math.floor(($scope.time / (1000 * 60 * 60)) - 1) + ":" + (Math.floor($scope.time / (1000 * 60)) % 60) + ":" + (Math.floor($scope.time / 1000) % 60);
                        } else {
                            $scope.diff = Math.floor($scope.time / (1000 * 60 * 60)) + ":" + (Math.floor($scope.time / (1000 * 60)) % 60) + ":" + (Math.floor($scope.time / 1000) % 60);
                        }

                        var hms = $scope.diff;   // your input string
                        var a = hms.split(':'); // split it at the colons

                        // minutes are worth 60 seconds. Hours are worth 60 minutes.
                        var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

                        // console.log(seconds);

                        $scope.formdata = {
                            company_intern_id: id,
                            hr_id: $localStorage.id,
                            date: ($scope.dt.getYear() + 1900) + "-" + ($scope.dt.getMonth() + 1) + "-" + $scope.dt.getDate(),
                            time_in: $scope.inMytime.getHours() + ":" + $scope.inMytime.getMinutes(),
                            time_out: $scope.outMytime.getHours() + ":" + $scope.outMytime.getMinutes(),
                            hours_render: seconds,
                        }



                        $http.post(urls.API_HOST + '/update_timecard', $scope.formdata).then(function (response) {
                            $uibModalInstance.close();
                        });
                    };

                },
                size: 'sm',
                resolve: {
                    id: function () {
                        return id;
                    }
                }
            });

            modalInstance.result.then(function () {
                $http({ method: 'GET', url: urls.API_HOST + '/intern_list/' + $localStorage.company_id }).then(function (response) {
                    $scope.interns = response.data;
                    for (var i = 0; i < response.data.length; i++) {
                        $scope.interns[i].rendered_hours = Utilities.convert($scope.interns[i].rendered_hours);
                        // console.log(Utilities.convert(response.data[i].rendered_hours));
                        for (var x = 0; x < $scope.interns[i].timecard.length; x++) {
                            $scope.interns[i].timecard[x].hours_render = Utilities.convert($scope.interns[i].timecard[x].hours_render);
                        }
                    }
                });
            });
        };

        $scope.viewRendered = function (timecard, total) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'view_rendered.html',
                controller: function (Utilities, timecard, total, $scope, $uibModalInstance) {
                    $scope.timecards = timecard;
                    $scope.total = total;
                },
                size: 'lg',
                resolve: {
                    timecard: function () {
                        return timecard;
                    },
                    total: function () {
                        return total;
                    }
                }
            });
        };
    });
    internon.controller('sched_modal_Controller', function (id, urls, $stateParams, $http, $auth, $state, $rootScope, $scope, $localStorage, $uibModal, $uibModalInstance) {
        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.mytime = new Date();
        $scope.hstep = 1;
        $scope.mstep = 1;

        $scope.set = function () {
            $scope.date = ($scope.dt.getYear() + 1900) + "-" + ($scope.dt.getMonth() + 1) + "-" + $scope.dt.getDate();
            $scope.time = $scope.mytime.getHours() + ":" + $scope.mytime.getMinutes();
            // console.log($scope.date + " "+$scope.time);
            $http.post(urls.API_HOST + '/set_interview/' + id, { reason: $scope.reason, interview_date: $scope.date, interview_time: $scope.time }).then(function (response) {
                $uibModalInstance.close();
            });
        };
    });
    internon.controller('result_modal_Controller', function (ngToast,id, type, urls, $stateParams, $http, $auth, $state, $rootScope, $scope, $localStorage, $uibModal, $uibModalInstance) {
        // get department
        $scope.type = type;
        $scope.id = id;

        $scope.dept_id = {
            'department_id': { 'name': '', 'value': '', 'strict': false },
        };
        $scope.choices_department = [
        ]
        $http({ method: 'GET', url: urls.API_HOST + '/department_list/' + $localStorage.company_id }).then(function (response) {
            $scope.departments = response.data;
            for (var i = 0; i < response.data.length; i++) {
                $scope.choices_department.push({ 'name': response.data[i].department_name, 'value': response.data[i].id, 'strict': true });
            }
        });
        $scope.formdata = {};
        $scope.hire = function () {
            // console.log($scope.dept_id.department_id.value);
            $scope.formdata.department_id = $scope.dept_id.department_id.value;
            $http.post(urls.API_HOST + '/hire_applicant/' + $scope.id, $scope.formdata).then(function (response) {
                ngToast.create({
                                className: 'success',
                                content: 'Student Hired',
                                animation: 'fade'
                            });
                $uibModalInstance.close();
            });
        };

        $scope.reject = function () {
            // console.log("reject");
            $http.post(urls.API_HOST + '/reject_application/' + $scope.id, $scope.formdata).then(function (response) {
                $uibModalInstance.close();
            });
        };

    });

    internon.controller('company_view_advertisement_controller', function (id, urls, $http, $auth, $state, $rootScope, $scope, $localStorage, $uibModal) {
        $http({ method: 'GET', url: urls.API_HOST + '/company_view_advertisement/' + id }).then(function (response) {
            $scope.formdata = response.data;
        });
    });
})();