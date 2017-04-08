(function () {
    var internon = angular.module('internon');
    internon.controller('company_controller', function (password, urls, $http, ngToast, FileUploader, $auth, $state, $scope, $localStorage, $uibModal) {
        $scope.logout = function () {
            $auth.logout();
            $localStorage.$reset();
            $state.go('index');
        };



        var uploader = $scope.uploader = new FileUploader({
            url: urls.API_HOST + '/upload_pic',
            formData: [{
                id: $localStorage.id,
            }],
            headers: {
                'Authorization': 'Bearer: ' + $auth.getToken()
            }
        });

        uploader.onCompleteAll = function (fileItem) {
            $http({ method: 'GET', url: urls.API_HOST + '/company_profile/' + $localStorage.id }).then(function (response) {
                $scope.company = {};
                uploader.clearQueue();
                $scope.company = response.data;
                $scope.logo = 'http://localhost/Intern-On-DB/storage/app/pictures/' + $localStorage.id + "/" + response.data.company_logo;
                $state.go('user_company.company_profile');
            });
        };

        uploader.onWhenAddingFileFailed = function (item, filter, options) {
            ngToast.create({
                className: 'warning',
                content: 'Invalid File Format',
                animation: 'fade'
            });
        };


        uploader.filters.push({
            name: 'imageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|'.indexOf(type) !== -1;
            }
        });


        $scope.init = function () {
            $http({ method: 'GET', url: urls.API_HOST + '/company_profile/' + $localStorage.id }).then(function (response) {
                $localStorage.symbol = response.data.company_symbol;
                $scope.company = response.data;
                $scope.logo = 'http://localhost/Intern-On-DB/storage/app/pictures/' + $localStorage.id + "/" + response.data.company_logo;
                $state.go('user_company.company_profile');
            });
        };
        $scope.edit_info = function (data, type) {
            var template;
            if (type == 1)
                template = 'edit_profile.html'
            if (type == 2)
                template = 'edit_overview.html'
            if (type == 3)
                template = 'edit_snapshot.html'
            if (type == 4)
                template = 'edit_wju.html'
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: template,
                controller: function (data, type, $scope, urls, $localStorage, $http, $uibModalInstance) {
                    $scope.company = data;
                    $scope.save = function () {
                        $http.post(urls.API_HOST + '/edit_company_profile/' + $localStorage.id, $scope.company).then(function (response) {
                            ngToast.create({
                                className: 'success',
                                content: 'Profile Updated',
                                animation: 'fade'
                                // console.log($scope.formdata);
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
                $http({ method: 'GET', url: urls.API_HOST + '/company_profile/' + $localStorage.id }).then(function (response) {
                    $scope.company = {};
                    $scope.company = response.data;
                });
            }, function () {
                $http({ method: 'GET', url: urls.API_HOST + '/company_profile/' + $localStorage.id }).then(function (response) {
                    $scope.company = {};
                    $scope.company = response.data;
                });
            });
        };
        $scope.editPassword = function () {
            password.open_edit_modal();
        }
    });
    internon.controller('company_accounts_controller', function (password, ngToast, urls, $http, $auth, $state, $scope, $localStorage, $uibModal) {
        $scope.reset = function (id) {
            password.open_reset_modal(id);
        }
        $http({ method: 'GET', url: urls.API_HOST + '/hr_list/' + $localStorage.id }).then(function (response) {
            $scope.hr = response.data;
        });

        $http({ method: 'GET', url: urls.API_HOST + '/sv_list/' + $localStorage.id }).then(function (response) {
            $scope.sv = response.data;
        });
        $scope.openAddEmployeeModal = function (type) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'company_add_employee_modal.html',
                controller: function (type, $localStorage, $scope, $http, $uibModalInstance, $state, $filter) {
                    $scope.type = type;
                    $scope.dept_id = {
                        'department_id': { 'name': '', 'value': '', 'strict': false },
                    };
                    $scope.choices_department = [
                    ]
                    $scope.symbol = $localStorage.symbol;
                    $http({ method: 'GET', url: urls.API_HOST + '/department_list/' + $localStorage.id }).then(function (response) {
                        $scope.departments = response.data;
                        for (var i = 0; i < response.data.length; i++) {
                            $scope.choices_department.push({ 'name': response.data[i].department_name, 'value': response.data[i].id, 'strict': true });
                        }
                    });
                    $scope.formdata = {
                        department: {}
                    };
                    $scope.add = function () {
                        if (type == 'hr') {
                            $scope.formdata.hr_username = $localStorage.symbol + "_" + $scope.formdata.hr_username;
                            $http.post(urls.API_HOST + '/create_hr/' + $localStorage.id, $scope.formdata).then(function (response) {
                                $uibModalInstance.close("HR");
                            });
                        }
                        if (type == 'sv') {
                            $scope.formdata.department_id = $scope.dept_id.department_id.value;
                            $scope.formdata.sv_username = $localStorage.symbol + "_" + $scope.formdata.sv_username;

                            if ($scope.formdata.department_id != '')
                                $http.post(urls.API_HOST + '/create_sv/' + $localStorage.id, $scope.formdata).then(function (response) {
                                    $uibModalInstance.close("SV");
                                });
                        }
                    }
                },
                size: 'sm',
                resolve: {
                    type: function () {
                        return type;
                    }
                }
            });

            modalInstance.result.then(function (data) {
                if (data == "HR") {
                    $http({ method: 'GET', url: urls.API_HOST + '/hr_list/' + $localStorage.id }).then(function (response) {
                        $scope.hr = {};
                        $scope.hr = response.data;
                    });
                }
                if (data == "SV") {
                    $http({ method: 'GET', url: urls.API_HOST + '/sv_list/' + $localStorage.id }).then(function (response) {
                        $scope.sv = {};
                        $scope.sv = response.data;
                    });
                }
            });
        };

        $scope.delete_account = function (id, account) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'confirm_modal.html',
                controller: function (id, account, $scope, $http, $uibModalInstance) {
                    $scope.yes = function () {
                        $http.post(urls.API_HOST + '/delete_account/' + id, { account_type: account }).then(function (response) {
                            $uibModalInstance.close(account);
                        });
                    };
                    $scope.no = function () {
                        $uibModalInstance.dismiss();
                    };
                },
                size: 'sm',
                resolve: {
                    id: function () {
                        return id;
                    },
                    account: function () {
                        return account;
                    }
                },

            });

            modalInstance.result.then(function (type) {
                $http({ method: 'GET', url: urls.API_HOST + '/hr_list/' + $localStorage.id }).then(function (response) {
                    $scope.hr = {};
                    $scope.hr = response.data;
                });

                $http({ method: 'GET', url: urls.API_HOST + '/sv_list/' + $localStorage.id }).then(function (response) {
                    $scope.sv = {};
                    $scope.sv = response.data;
                });
            });
        };

    });
    internon.controller('company_departments_controller', function (urls, $http, $auth, $state, $scope, $localStorage, $uibModal) {
        $http({ method: 'GET', url: urls.API_HOST + '/department_list/' + $localStorage.id }).then(function (response) {
            $scope.departments = response.data;
        });
        $scope.openAddDeptModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'company_add_department_modal.html',
                controller: function ($scope, $http, $uibModalInstance) {
                    $scope.add = function () {
                        $http.post(urls.API_HOST + '/create_department/' + $localStorage.id, $scope.formdata).then(function (response) {
                            $uibModalInstance.close();
                        });
                    }
                },
                size: 'sm',
                resolve: {
                }
            });

            modalInstance.result.then(function () {
                $http({ method: 'GET', url: urls.API_HOST + '/department_list/' + $localStorage.id }).then(function (response) {
                    $scope.departments = {};
                    $scope.departments = response.data;
                });
            });
        };
        $scope.viewEmployeesModal = function (employees) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'company_view_employee_modal.html',
                controller: function (employees, $scope, $http, $uibModalInstance) {
                    $scope.employees = employees;
                },
                size: 'sm',
                resolve: {
                    employees: function () {
                        return employees;
                    }
                }
            });

            modalInstance.result.then(function () {
                return 1;
            });
        };
    });
    internon.controller('advertisement_list_controller', function (urls, $http, $auth, $state, $scope, $localStorage, $uibModal) {
        $scope.choice = {
            'option': { 'name': '', 'value': '' },
        };

        $scope.choices = [
            { 'name': 'Date - Latest', 'value': '-created_at' },
            { 'name': 'Date - Oldest', 'value': 'created_at' },
            { 'name': 'Title - Ascending', 'value': 'ads_title' },
            { 'name': 'Title - Descending', 'value': '-ads_title' },
        ];

        $http({ method: 'GET', url: urls.API_HOST + '/company_advertisement_list/' + $localStorage.id }).then(function (response) {
            $scope.ads = response.data;
        });

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
        $scope.strict = function () {
            if ($scope.search != "") {
                return true;
            } else {
                return false;
            }

        }
        $scope.toggle = function (id, data) {
            $http.post(urls.API_HOST + '/toggle_ads_visibility/' + id, { toggle: data }).then(function (response) {
                $http({ method: 'GET', url: urls.API_HOST + '/company_advertisement_list/' + $localStorage.id }).then(function (response) {
                    $scope.ads = {};
                    $scope.ads = response.data;
                });
            });
        }


    });
    internon.controller('create_advertisement_controller', function (urls, $http, $auth, $state, $scope, $localStorage, $uibModal) {
        $scope.formdata = {
            id: $localStorage.id,
        };

        CKEDITOR.replace('editor1', {
            height: 300,
            width: 800,
        });


        $scope.options = {
            language: 'en',
            allowedContent: true,
            entities: false
        };

        // Called when the editor is completely ready.
        $scope.onReady = function () {
            // ...
        };


        $scope.save = function () {
            $http.post(urls.API_HOST + '/create_advertisement', $scope.formdata).then(function (response) {
                $state.go('user_company.company_ads');
            });
        };
        $scope.cancel = function () {
            $state.go('user_company.company_ads');
        };

    });
    internon.controller('company_view_advertisement_controller', function (id, urls, $http, $auth, $state, $rootScope, $scope, $localStorage, $uibModal) {
        $http({ method: 'GET', url: urls.API_HOST + '/company_view_advertisement/' + id }).then(function (response) {
            $scope.formdata = response.data;
        });
    });
    internon.controller('application_controller', function (urls, $stateParams, $http, $auth, $state, $rootScope, $scope, $localStorage, $uibModal) {
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
        $http({ method: 'GET', url: urls.API_HOST + '/company_advertisement_list/' + $localStorage.id }).then(function (response) {
            // console.log(response);
            for (var i = 0; i < response.data.length; i++) {
                $scope.choices_advertisement.push({ 'name': response.data[i].ads_title, 'value': response.data[i].ads_title, 'strict': true });
            }
        });
        $http({ method: 'GET', url: urls.API_HOST + '/company_application_list/' + $localStorage.id }).then(function (response) {
            $scope.applications = response.data;
        });

        $scope.accept = function ($id) {
            $http({ method: 'GET', url: urls.API_HOST + '/hire_applicant/' + $id }).then(function (response) {
            });
        };

        $scope.reject = function ($id) {
            $http({ method: 'GET', url: urls.API_HOST + '/reject_application/' + $id }).then(function (response) {
            });
        };
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
                templateUrl: 'company_sched_student_modal.html',
                controller: 'sched_modal_Controller',
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
        };
        $scope.advertisementModal = function (ads) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'advertisement_modal.html',
                controller: function (ads, $scope) {
                    $scope.ads = ads;
                },
                size: 'md',
                resolve: {
                    ads: function () {
                        return ads;
                    }
                }
            });

            modalInstance.result.then(function (ads) {
                return 1;
            });
        };
        $scope.profileModal = function (student) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'student_profile_modal.html',
                controller: function (student, $scope) {
                    $scope.student = student;
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
                    console.log(remarks);
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
                return 1;
            });
        };

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

    });
    // internon.controller('sched_modal_Controller',function(id,urls,$stateParams,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal,$uibModalInstance){
    //     $scope.today = function() {
    //         $scope.dt = new Date();
    //     };
    //     $scope.today();
    //     $scope.mytime = new Date();
    //     $scope.hstep = 1;
    //     $scope.mstep = 1;

    //     $scope.set = function(){
    //         $scope.date = ($scope.dt.getYear()+1900)+"-"+($scope.dt.getMonth()+1)+"-"+$scope.dt.getDate();
    //         $scope.time = $scope.mytime.getHours()+":"+$scope.mytime.getMinutes();            
    //         console.log($scope.date + " "+$scope.time);
    //         $http.post(urls.API_HOST + '/set_interview/'+id,{reason:$scope.reason,interview_date:$scope.date,interview_time:$scope.time}).then(function (response){
    //             $uibModalInstance.close();
    //             $state.go('user_company.company_list_application', {application_id: id,type: $stateParams.type} );            
    //         });
    //     };
    // });
    // internon.controller('company_schedule_controller',function(urls,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal){ 
    //     $http({method: 'GET', url: urls.API_HOST + '/get_schedules/'+$localStorage.id}).then(function(response){
    //     });

    //     $scope.remarks;

    //     $scope.remarksModal = function(id){
    //         var modalInstance = $uibModal.open({
    //             animation: true,
    //             templateUrl: 'company_sched_remarks_modal.html',
    //             controller: function(id,$http,$scope){
    //                 $scope.save = function(){
    //                     $http.post(urls.API_HOST + '/interview_result/'+id , {remarks: $scope.remarks}).then(function (response){
    //                         // $scope.applications = response.data;
    //                     });
    //                 }
    //             },
    //             size: 'sm',
    //             resolve: {
    //                     id: function () {
    //                         return id;
    //                     }
    //                 }
    //             });

    //             modalInstance.result.then(function (id) {
    //                 return 1;
    //             });
    //     };

    // });
    internon.controller('company_interns_controller', function (Utilities, urls, $http, $auth, $state, $rootScope, $scope, $localStorage, $uibModal) {
        $http({ method: 'GET', url: urls.API_HOST + '/intern_list/' + $localStorage.id }).then(function (response) {
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

        $http({ method: 'GET', url: urls.API_HOST + '/department_list/' + $localStorage.id }).then(function (response) {
            $scope.departments = response.data;
            for (var i = 0; i < response.data.length; i++) {
                $scope.choices_department.push({ 'name': response.data[i].department_name, 'value': response.data[i].department_name, 'strict': true });
            }
        });

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

        $scope.viewTimecardModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'intern_timecard_modal.html',
                controller: function ($scope, $http, $uibModalInstance) {

                },
                size: 'sm',
                resolve: {
                }
            });

            modalInstance.result.then(function () {
                return 1;
            });
        };
    });
    // internon.controller('result_modal_Controller',function(id,type,urls,$stateParams,$http,$auth,$state,$rootScope,$scope,$localStorage,$uibModal,$uibModalInstance){
    //     // get department
    //     $scope.type = type;
    //     $scope.id = id;

    //     $scope.dept_id = {
    //         'department_id': {'name': '','value':'','strict':false},
    //     };
    //     $scope.choices_department = [
    //     ]
    //     $http({method: 'GET', url: urls.API_HOST + '/department_list/'+$localStorage.id}).then(function(response){
    //         $scope.departments = response.data;
    //         for (var i = 0; i < response.data.length; i++) {
    //             $scope.choices_department.push({'name':response.data[i].department_name,'value':response.data[i].id,'strict':true});
    //         }
    //     });

    //     $scope.hire = function(){
    //         // console.log($scope.dept_id.department_id.value);
    //         $http.post(urls.API_HOST + '/hire_applicant/'+$scope.id, {department_id:$scope.dept_id.department_id.value}).then(function (response){
    //             $uibModalInstance.close;
    //         });  
    //     }
    // });

})();
